"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import {
  avaliarCancelamentoAula,
  validarSubmissaoSumario,
  TipoResponsavelCancelamento,
} from "@/regras/politica-cancelamento-reposicao";
import { EstadoAula } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface RespostaAcaoAula {
  sucesso: boolean;
  mensagem: string;
  aulaId?: string;
}

/**
 * Registo de presenças, sumário curricular e trabalhos de casa (TPC) pelo professor ou administração.
 */
export async function acaoRegistarSumarioEPresenca(dados: {
  aulaId: string;
  estado: EstadoAula;
  sumario?: string;
  trabalhosDeCasa?: string;
  observacoesPedagogicas?: string;
}): Promise<RespostaAcaoAula> {
  const sessao = await obterSessao();
  if (!sessao) {
    return { sucesso: false, mensagem: "Sessão expirada. Inicie sessão novamente." };
  }

  const aula = await baseDados.aula.findUnique({
    where: { id: dados.aulaId },
    include: {
      acompanhamento: {
        include: {
          professor: true,
        },
      },
    },
  });

  if (!aula) {
    return { sucesso: false, mensagem: "Aula não encontrada no sistema." };
  }

  // Validação de permissões: apenas o professor atribuído ou um administrador podem sumariar
  const eProfessorDaAula =
    sessao.funcao === "PROFESSOR" &&
    aula.acompanhamento.professor.utilizadorId === sessao.utilizadorId;
  const eAdmin = sessao.funcao === "ADMINISTRADOR";

  if (!eProfessorDaAula && !eAdmin) {
    return {
      sucesso: false,
      mensagem: "Não tem permissão para registar o sumário desta aula.",
    };
  }

  // MECANISMO 1: Bloqueio Temporal Estrito de Aulas Futuras
  // O professor não pode sumariar como "Realizada" antes do horário da aula
  const agora = new Date();
  const dataInicioAula = new Date(aula.dataHoraInicio);
  if (dados.estado === "Realizada" && dataInicioAula > agora) {
    const dataFormatada = new Intl.DateTimeFormat("pt-AO", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(dataInicioAula);
    return {
      sucesso: false,
      mensagem: `Bloqueio de segurança: Esta aula está agendada para ${dataFormatada}. Não é permitido registar sumário ou marcar como Realizada antes do horário de início da sessão.`,
    };
  }

  // Validação das regras pedagógicas
  const validacao = validarSubmissaoSumario({
    estado: dados.estado,
    sumario: dados.sumario,
    trabalhosDeCasa: dados.trabalhosDeCasa,
    observacoesPedagogicas: dados.observacoesPedagogicas,
  });

  if (!validacao.valido) {
    return { sucesso: false, mensagem: validacao.erro || "Dados inválidos." };
  }

  // Ajustes de preços e remuneração segundo o estado da sessão
  let precoCobradoKz = aula.precoCobradoKz;
  let remuneracaoPagaKz = aula.remuneracaoPagaKz;

  if (dados.estado === "Realizada") {
    precoCobradoKz = aula.acompanhamento.precoPorAulaKz;
    remuneracaoPagaKz = aula.acompanhamento.remuneracaoPorAulaKz;
  } else if (dados.estado === "Aluno_Ausente") {
    // Aluno faltou sem aviso tempestivo: aula cobrada e professor compensado
    precoCobradoKz = aula.acompanhamento.precoPorAulaKz;
    remuneracaoPagaKz = aula.acompanhamento.remuneracaoPorAulaKz;
  } else if (dados.estado === "Professor_Ausente") {
    // Falta do professor: sem custos para a família e sem remuneração
    precoCobradoKz = 0;
    remuneracaoPagaKz = 0;
  }

  const estadoAnterior = aula.estado;

  await baseDados.$transaction(async (tx) => {
    await tx.aula.update({
      where: { id: dados.aulaId },
      data: {
        estado: dados.estado,
        sumario: dados.sumario || null,
        trabalhosDeCasa: dados.trabalhosDeCasa || null,
        observacoesPedagogicas: dados.observacoesPedagogicas || null,
        precoCobradoKz,
        remuneracaoPagaKz,
        registadoEm: new Date(),
      },
    });

    // Se passou a Realizada pela primeira vez, incrementa o contador do professor
    if (dados.estado === "Realizada" && estadoAnterior !== "Realizada") {
      await tx.perfilProfessor.update({
        where: { id: aula.acompanhamento.professorId },
        data: {
          totalAulasDadas: { increment: 1 },
        },
      });
    }
  });

  revalidatePath("/portal-professor");
  revalidatePath("/portal-professor/aulas");
  revalidatePath(`/portal-professor/aulas/${dados.aulaId}`);
  revalidatePath("/portal-professor/agenda");
  revalidatePath("/portal-encarregado/acompanhamentos");
  revalidatePath(`/portal-encarregado/aulas/${dados.aulaId}`);
  revalidatePath("/administracao/aulas");

  return {
    sucesso: true,
    mensagem: "Registo pedagógico e de presenças guardado com sucesso!",
    aulaId: dados.aulaId,
  };
}

/**
 * Cancelamento de aula com aplicação estrita da política de aviso prévio de 24 horas.
 */
export async function acaoCancelarAula(dados: {
  aulaId: string;
  motivo: string;
  responsavel: TipoResponsavelCancelamento;
}): Promise<RespostaAcaoAula> {
  const sessao = await obterSessao();
  if (!sessao) {
    return { sucesso: false, mensagem: "Sessão expirada. Inicie sessão novamente." };
  }

  const aula = await baseDados.aula.findUnique({
    where: { id: dados.aulaId },
    include: {
      acompanhamento: {
        include: {
          encarregado: true,
          professor: true,
        },
      },
    },
  });

  if (!aula) {
    return { sucesso: false, mensagem: "Aula não encontrada no sistema." };
  }

  // Validação de permissões
  const eAdmin = sessao.funcao === "ADMINISTRADOR";
  const eEncarregado =
    sessao.funcao === "ENCARREGADO" &&
    aula.acompanhamento.encarregado.utilizadorId === sessao.utilizadorId;
  const eProfessor =
    sessao.funcao === "PROFESSOR" &&
    aula.acompanhamento.professor.utilizadorId === sessao.utilizadorId;

  if (dados.responsavel === "ENCARREGADO" && !eEncarregado && !eAdmin) {
    return { sucesso: false, mensagem: "Não tem permissão para cancelar esta aula." };
  }
  if (dados.responsavel === "PROFESSOR" && !eProfessor && !eAdmin) {
    return { sucesso: false, mensagem: "Não tem permissão para cancelar esta aula." };
  }

  // Aplicação da regra das 24 horas
  const avaliacao = avaliarCancelamentoAula(
    aula.dataHoraInicio,
    new Date(),
    dados.responsavel,
    aula.acompanhamento.precoPorAulaKz,
    aula.acompanhamento.remuneracaoPorAulaKz,
    dados.motivo
  );

  const novaNota = aula.observacoesPedagogicas
    ? `${aula.observacoesPedagogicas}\n[Cancelamento]: ${avaliacao.justificacaoAuditoria}`
    : `[Cancelamento]: ${avaliacao.justificacaoAuditoria}`;

  await baseDados.aula.update({
    where: { id: dados.aulaId },
    data: {
      estado: avaliacao.novoEstadoAula,
      precoCobradoKz: avaliacao.precoCobradoFamiliaKz,
      remuneracaoPagaKz: avaliacao.remuneracaoPagaProfessorKz,
      observacoesPedagogicas: novaNota,
      registadoEm: new Date(),
    },
  });

  revalidatePath("/portal-professor/aulas");
  revalidatePath(`/portal-professor/aulas/${dados.aulaId}`);
  revalidatePath("/portal-professor/agenda");
  revalidatePath("/portal-encarregado/acompanhamentos");
  revalidatePath(`/portal-encarregado/aulas/${dados.aulaId}`);
  revalidatePath("/administracao/aulas");

  return {
    sucesso: true,
    mensagem: avaliacao.requerReposicao
      ? `Aula cancelada com sucesso. Elegível para aula de reposição sem custos (${avaliacao.antecedenciaHoras}h de antecedência).`
      : `Aula cancelada tardiamente (${avaliacao.antecedenciaHoras}h < 24h). Conforme a política TM-Educa, a sessão foi contabilizada.`,
    aulaId: dados.aulaId,
  };
}

/**
 * Agendamento de uma sessão oficial de reposição vinculada à aula original cancelada.
 */
export async function acaoAgendarReposicao(dados: {
  aulaOriginalId: string;
  novaDataHoraInicio: string; // ISO String
  duracaoMinutos?: number;
  motivo: string;
}): Promise<RespostaAcaoAula> {
  const sessao = await obterSessao();
  if (!sessao) {
    return { sucesso: false, mensagem: "Sessão expirada. Inicie sessão novamente." };
  }

  const aulaOriginal = await baseDados.aula.findUnique({
    where: { id: dados.aulaOriginalId },
    include: {
      acompanhamento: {
        include: {
          encarregado: true,
          professor: true,
        },
      },
      aulaOriginalReposicao: true,
    },
  });

  if (!aulaOriginal) {
    return { sucesso: false, mensagem: "Aula de origem não encontrada." };
  }

  const eAdmin = sessao.funcao === "ADMINISTRADOR";
  const eProfessor =
    sessao.funcao === "PROFESSOR" &&
    aulaOriginal.acompanhamento.professor.utilizadorId === sessao.utilizadorId;
  const eEncarregado =
    sessao.funcao === "ENCARREGADO" &&
    aulaOriginal.acompanhamento.encarregado.utilizadorId === sessao.utilizadorId;

  if (!eAdmin && !eProfessor && !eEncarregado) {
    return {
      sucesso: false,
      mensagem: "Não tem permissão para agendar reposição para esta aula.",
    };
  }

  if (aulaOriginal.aulaOriginalReposicao) {
    return {
      sucesso: false,
      mensagem: "Esta aula já possui uma sessão de reposição agendada.",
    };
  }

  const inicio = new Date(dados.novaDataHoraInicio);
  const duracao = dados.duracaoMinutos || aulaOriginal.duracaoMinutos;
  const fim = new Date(inicio.getTime() + duracao * 60 * 1000);

  const novaAula = await baseDados.$transaction(async (tx) => {
    const criada = await tx.aula.create({
      data: {
        acompanhamentoId: aulaOriginal.acompanhamentoId,
        numeroSessao: aulaOriginal.numeroSessao,
        dataHoraInicio: inicio,
        dataHoraFim: fim,
        duracaoMinutos: duracao,
        modalidade: aulaOriginal.modalidade,
        estado: "Agendada",
        precoCobradoKz: 0, // Não há cobrança adicional por ser reposição oficial
        remuneracaoPagaKz: aulaOriginal.acompanhamento.remuneracaoPorAulaKz,
        observacoesPedagogicas: `Reposição oficial vinculada à aula de ${aulaOriginal.dataHoraInicio.toLocaleDateString("pt-PT")}. Motivo: ${dados.motivo}`,
      },
    });

    await tx.reposicaoAula.create({
      data: {
        aulaOriginalId: aulaOriginal.id,
        aulaReposicaoId: criada.id,
        motivo: dados.motivo,
        responsavelCancelamento: sessao.nomeCompleto,
      },
    });

    await tx.aula.update({
      where: { id: aulaOriginal.id },
      data: {
        estado: "Reagendada",
      },
    });

    return criada;
  });

  revalidatePath("/portal-professor/aulas");
  revalidatePath(`/portal-professor/aulas/${aulaOriginal.id}`);
  revalidatePath("/portal-professor/agenda");
  revalidatePath("/portal-encarregado/acompanhamentos");
  revalidatePath(`/portal-encarregado/aulas/${aulaOriginal.id}`);
  revalidatePath("/administracao/aulas");

  return {
    sucesso: true,
    mensagem: "Aula de reposição agendada e vinculada com sucesso à sessão original!",
    aulaId: novaAula.id,
  };
}

/**
 * Protocolo de substituição de professor no acompanhamento (Administração).
 */
export async function acaoSubstituirProfessorAcompanhamento(dados: {
  acompanhamentoId: string;
  novoProfessorId: string;
  motivo: string;
}): Promise<RespostaAcaoAula> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração central." };
  }

  const acompanhamento = await baseDados.acompanhamentoServico.findUnique({
    where: { id: dados.acompanhamentoId },
    include: { professor: { include: { utilizador: true } } },
  });

  if (!acompanhamento) {
    return { sucesso: false, mensagem: "Acompanhamento escolar não encontrado." };
  }

  const novoProf = await baseDados.perfilProfessor.findUnique({
    where: { id: dados.novoProfessorId },
    include: { utilizador: true },
  });

  if (!novoProf) {
    return { sucesso: false, mensagem: "Novo explicador selecionado não existe." };
  }

  await baseDados.$transaction(async (tx) => {
    // 1. Atualizar o professor titular do acompanhamento ativo
    await tx.acompanhamentoServico.update({
      where: { id: dados.acompanhamentoId },
      data: {
        professorId: dados.novoProfessorId,
      },
    });

    // 2. Registar nota de substituição nas aulas futuras ainda em estado 'Agendada'
    const agora = new Date();
    const aulasFuturas = await tx.aula.findMany({
      where: {
        acompanhamentoId: dados.acompanhamentoId,
        estado: "Agendada",
        dataHoraInicio: { gte: agora },
      },
    });

    for (const aula of aulasFuturas) {
      const nota = aula.observacoesPedagogicas
        ? `${aula.observacoesPedagogicas} | [Substituição]: Novo titular ${novoProf.utilizador.nomeCompleto}. Motivo: ${dados.motivo}`
        : `[Substituição]: Novo titular ${novoProf.utilizador.nomeCompleto}. Motivo: ${dados.motivo}`;

      await tx.aula.update({
        where: { id: aula.id },
        data: {
          observacoesPedagogicas: nota,
        },
      });
    }
  });

  revalidatePath("/administracao/acompanhamentos");
  revalidatePath(`/administracao/acompanhamentos/${dados.acompanhamentoId}`);
  revalidatePath("/administracao/aulas");
  revalidatePath("/portal-professor/agenda");
  revalidatePath("/portal-encarregado/acompanhamentos");

  return {
    sucesso: true,
    mensagem: `Professor titular substituído com sucesso por ${novoProf.utilizador.nomeCompleto}. O contrato da família e o histórico pedagógico mantêm-se intactos.`,
  };
}

/**
 * Permite ao encarregado de educação validar que uma aula foi efectivamente dada,
 * mesmo que o professor não tenha atualizado o sumário no próprio dia.
 */
export async function acaoConfirmarAulaRealizadaPeloPai(aulaId: string): Promise<{
  sucesso: boolean;
  mensagem: string;
}> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ENCARREGADO") {
    return { sucesso: false, mensagem: "Acesso restrito ao encarregado de educação." };
  }

  const aula = await baseDados.aula.findUnique({
    where: { id: aulaId },
    include: {
      acompanhamento: {
        include: { encarregado: true },
      },
    },
  });

  if (!aula) {
    return { sucesso: false, mensagem: "Aula não encontrada no sistema." };
  }

  if (aula.acompanhamento.encarregado.utilizadorId !== sessao.utilizadorId) {
    return { sucesso: false, mensagem: "Não tem permissão para validar esta aula." };
  }

  await baseDados.aula.update({
    where: { id: aulaId },
    data: {
      estado: "Realizada",
      remuneracaoPagaKz: aula.acompanhamento.remuneracaoPorAulaKz,
      observacoesPedagogicas: aula.observacoesPedagogicas
        ? `${aula.observacoesPedagogicas} | Confirmada como Realizada pelo Encarregado de Educação.`
        : "Confirmada como Realizada pelo Encarregado de Educação.",
    },
  });

  revalidatePath("/portal-encarregado/acompanhamentos");
  revalidatePath(`/portal-encarregado/acompanhamentos/${aula.acompanhamentoId}`);
  revalidatePath(`/portal-encarregado/aulas/${aulaId}`);
  revalidatePath("/administracao/aulas");
  revalidatePath("/portal-professor/agenda");

  return {
    sucesso: true,
    mensagem: "Aula validada e confirmada como realizada com sucesso!",
  };
}
