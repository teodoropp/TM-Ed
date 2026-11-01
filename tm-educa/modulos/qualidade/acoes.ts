"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import {
  calcularMediaAvaliacao,
  formatarNumeroOcorrencia,
  NotasDimensoesAvaliacao,
} from "@/regras/sistema-qualidade";
import { TipoOcorrencia, GravidadeOcorrencia, EstadoOcorrencia } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface RespostaAcaoQualidade {
  sucesso: boolean;
  mensagem: string;
  id?: string;
}

/**
 * Submissão de avaliação pedagógica de um professor por parte do pai.
 */
export async function acaoSubmeterAvaliacaoProfessor(dados: {
  acompanhamentoId: string;
  notas: NotasDimensoesAvaliacao;
  comentario?: string;
  visivelPublicamente?: boolean;
}): Promise<RespostaAcaoQualidade> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ENCARREGADO") {
    return { sucesso: false, mensagem: "Apenas pais podem submeter avaliações de explicadores." };
  }

  const encarregado = await baseDados.perfilEncarregado.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
  });

  if (!encarregado) {
    return { sucesso: false, mensagem: "Perfil de pai não encontrado." };
  }

  const acompanhamento = await baseDados.acompanhamentoServico.findUnique({
    where: { id: dados.acompanhamentoId },
    include: {
      contrato: true,
      professor: true,
    },
  });

  if (!acompanhamento || !acompanhamento.professorId) {
    return { sucesso: false, mensagem: "Acompanhamento ou explicador associado não encontrado." };
  }

  // Verificar se já existe avaliação deste encarregado para este acompanhamento
  const avaliacaoExistente = await baseDados.avaliacaoProfessor.findFirst({
    where: {
      acompanhamentoId: acompanhamento.id,
      encarregadoId: encarregado.id,
    },
  });

  if (avaliacaoExistente) {
    return { sucesso: false, mensagem: "Já submeteu uma avaliação pedagógica para este acompanhamento escolar." };
  }

  const notaMedia = calcularMediaAvaliacao(dados.notas);

  // Registar a avaliação
  const avaliacao = await baseDados.avaliacaoProfessor.create({
    data: {
      acompanhamentoId: acompanhamento.id,
      professorId: acompanhamento.professorId,
      encarregadoId: encarregado.id,
      alunoId: acompanhamento.alunoId,
      qualidadePedagogica: dados.notas.qualidadePedagogica,
      pontualidade: dados.notas.pontualidade,
      comunicacao: dados.notas.comunicacao,
      adaptacaoAluno: dados.notas.adaptacaoAluno,
      profissionalismo: dados.notas.profissionalismo,
      notaMedia,
      comentario: dados.comentario?.trim() || null,
      visivelPublicamente: dados.visivelPublicamente ?? true,
    },
  });

  // Recalcular a avaliação média global do explicador no seu PerfilProfessor
  const todasAvaliacoes = await baseDados.avaliacaoProfessor.findMany({
    where: { professorId: acompanhamento.professorId },
    select: { notaMedia: true },
  });

  const somaNotas = todasAvaliacoes.reduce((acc, a) => acc + a.notaMedia, 0);
  const novaAvaliacaoMedia = Math.round((somaNotas / todasAvaliacoes.length) * 10) / 10;

  await baseDados.perfilProfessor.update({
    where: { id: acompanhamento.professorId },
    data: {
      avaliacaoMedia: novaAvaliacaoMedia,
    },
  });

  revalidatePath("/portal-encarregado/avaliacoes");
  revalidatePath("/portal-professor/avaliacoes");
  revalidatePath("/administracao/avaliacoes");

  return {
    sucesso: true,
    mensagem: `Avaliação pedagógica submetida com sucesso! Média atribuída: ${notaMedia.toFixed(1)} / 5.0 estrelas.`,
    id: avaliacao.id,
  };
}

/**
 * Abertura de ocorrência disciplinar, pedagógica, financeira ou operacional.
 */
export async function acaoAbrirOcorrencia(dados: {
  tipo: TipoOcorrencia;
  gravidade: GravidadeOcorrencia;
  titulo: string;
  descricao: string;
  acompanhamentoId?: string;
  aulaId?: string;
}): Promise<RespostaAcaoQualidade> {
  const sessao = await obterSessao();
  if (!sessao) {
    return { sucesso: false, mensagem: "Sessão expirada. Por favor inicie sessão." };
  }

  if (!dados.titulo?.trim() || !dados.descricao?.trim()) {
    return { sucesso: false, mensagem: "Título e descrição pormenorizada são obrigatórios." };
  }

  const anoAtual = new Date().getFullYear();
  const totalOcorrencias = await baseDados.ocorrencia.count();
  const numeroOcorrencia = formatarNumeroOcorrencia(anoAtual, totalOcorrencias + 1);

  const novaOcorrencia = await baseDados.ocorrencia.create({
    data: {
      numeroOcorrencia,
      tipo: dados.tipo,
      gravidade: dados.gravidade,
      estado: "Aberta",
      titulo: dados.titulo.trim(),
      descricao: dados.descricao.trim(),
      autorId: sessao.utilizadorId,
      acompanhamentoId: dados.acompanhamentoId || null,
      aulaId: dados.aulaId || null,
    },
  });

  revalidatePath("/portal-encarregado/ocorrencias");
  revalidatePath("/portal-professor/ocorrencias");
  revalidatePath("/administracao/ocorrencias");

  return {
    sucesso: true,
    mensagem: `Ocorrência ${numeroOcorrencia} registada com sucesso no sistema.`,
    id: novaOcorrencia.id,
  };
}

/**
 * Atribuição de responsável administrativo para investigação da ocorrência (Administração).
 */
export async function acaoAtribuirResponsavelOcorrencia(dados: {
  ocorrenciaId: string;
  responsavelId: string;
}): Promise<RespostaAcaoQualidade> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração." };
  }

  const ocorrencia = await baseDados.ocorrencia.findUnique({
    where: { id: dados.ocorrenciaId },
  });

  if (!ocorrencia) {
    return { sucesso: false, mensagem: "Ocorrência não encontrada." };
  }

  await baseDados.ocorrencia.update({
    where: { id: dados.ocorrenciaId },
    data: {
      responsavelId: dados.responsavelId,
      estado: ocorrencia.estado === "Aberta" ? "EmInvestigacao" : ocorrencia.estado,
    },
  });

  revalidatePath("/administracao/ocorrencias");
  return { sucesso: true, mensagem: "Responsável atribuído com sucesso." };
}

/**
 * Resolução formal e encerramento de ocorrência com registo de parecer (Administração).
 */
export async function acaoResolverOcorrencia(dados: {
  ocorrenciaId: string;
  resolucao: string;
}): Promise<RespostaAcaoQualidade> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração central." };
  }

  if (!dados.resolucao?.trim()) {
    return { sucesso: false, mensagem: "O parecer de resolução é obrigatório." };
  }

  const ocorrencia = await baseDados.ocorrencia.findUnique({
    where: { id: dados.ocorrenciaId },
  });

  if (!ocorrencia) {
    return { sucesso: false, mensagem: "Ocorrência não encontrada." };
  }

  await baseDados.ocorrencia.update({
    where: { id: dados.ocorrenciaId },
    data: {
      estado: "Resolvida",
      resolucao: dados.resolucao.trim(),
      resolvidoEm: new Date(),
      responsavelId: ocorrencia.responsavelId || sessao.utilizadorId,
    },
  });

  revalidatePath("/administracao/ocorrencias");
  revalidatePath("/portal-encarregado/ocorrencias");
  revalidatePath("/portal-professor/ocorrencias");

  return { sucesso: true, mensagem: `Ocorrência ${ocorrencia.numeroOcorrencia} resolvida com sucesso.` };
}

/**
 * Cancelamento ou arquivamento de ocorrência (Administração).
 */
export async function acaoCancelarOcorrencia(dados: {
  ocorrenciaId: string;
  motivoCancelamento: string;
}): Promise<RespostaAcaoQualidade> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração central." };
  }

  const ocorrencia = await baseDados.ocorrencia.findUnique({
    where: { id: dados.ocorrenciaId },
  });

  if (!ocorrencia) {
    return { sucesso: false, mensagem: "Ocorrência não encontrada." };
  }

  await baseDados.ocorrencia.update({
    where: { id: dados.ocorrenciaId },
    data: {
      estado: "Cancelada",
      resolucao: `Cancelada: ${dados.motivoCancelamento.trim()}`,
    },
  });

  revalidatePath("/administracao/ocorrencias");
  return { sucesso: true, mensagem: `Ocorrência ${ocorrencia.numeroOcorrencia} cancelada.` };
}

/**
 * Receção de mensagem do formulário público de contacto ("Fale Connosco") na página inicial.
 * Regista o pedido de contacto na central de ocorrências/comunicações da administração.
 */
export async function acaoSubmeterContactoPublico(dados: {
  nome: string;
  telefone: string;
  email: string;
  anoEscolar: string;
  mensagem: string;
}): Promise<RespostaAcaoQualidade> {
  if (!dados.nome?.trim() || !dados.telefone?.trim() || !dados.mensagem?.trim()) {
    return {
      sucesso: false,
      mensagem: "Por favor, preencha o nome, telefone e a sua mensagem.",
    };
  }

  try {
    const sessao = await obterSessao();
    let autorId = sessao?.utilizadorId;

    if (!autorId) {
      const utilizadorPadrao =
        (await baseDados.utilizador.findFirst({
          where: { funcao: "ADMINISTRADOR" },
          select: { id: true },
        })) ||
        (await baseDados.utilizador.findFirst({
          select: { id: true },
        }));

      autorId = utilizadorPadrao?.id;
    }

    if (autorId) {
      const anoAtual = new Date().getFullYear();
      const totalOcorrencias = await baseDados.ocorrencia.count();
      const numeroOcorrencia = formatarNumeroOcorrencia(anoAtual, totalOcorrencias + 1);

      await baseDados.ocorrencia.create({
        data: {
          numeroOcorrencia,
          tipo: "Administrativo",
          gravidade: "Baixa",
          estado: "Aberta",
          titulo: `[Contacto Público] ${dados.nome.trim()} — ${dados.anoEscolar}`,
          descricao: `Pedido de contacto submetido no website público:\n• Nome: ${dados.nome.trim()}\n• Telefone/WhatsApp: ${dados.telefone.trim()}\n• E-mail: ${dados.email.trim()}\n• Ano de Escolaridade: ${dados.anoEscolar}\n• Mensagem: ${dados.mensagem.trim()}`,
          autorId,
        },
      });

      revalidatePath("/administracao/ocorrencias");
    }

    return {
      sucesso: true,
      mensagem:
        "Mensagem registada com sucesso! A coordenação pedagógica entrará em contacto brevemente.",
    };
  } catch (erro) {
    console.error("Erro ao registar contacto público:", erro);
    return {
      sucesso: false,
      mensagem: "Não foi possível registar a mensagem neste momento. Por favor contacte-nos via WhatsApp.",
    };
  }
}
