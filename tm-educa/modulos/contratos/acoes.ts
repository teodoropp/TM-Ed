"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import { obterRemuneracaoPorAnoEDuracao } from "@/modulos/precos/consultas";
import { projetarAulasAcompanhamento } from "@/regras/gerador-calendario";
import { formatarNumeroFatura } from "@/regras/calculo-financeiro";
import {
  EstadoPedido,
  EstadoContrato,
  EstadoAcompanhamento,
  TipoContrato,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface RespostaAcaoContrato {
  sucesso: boolean;
  mensagem: string;
  contratoId?: string;
  acompanhamentoId?: string;
}

/**
 * Formaliza o contrato de cliente e ativa o acompanhamento escolar gerando a agenda de aulas (Admin).
 */
export async function acaoAtivarAcompanhamentoEGerarContrato(
  pedidoId: string
): Promise<RespostaAcaoContrato> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração." };
  }

  const pedido = await baseDados.pedidoAcompanhamento.findUnique({
    where: { id: pedidoId },
    include: {
      aluno: true,
      encarregado: { include: { utilizador: true } },
      disciplina: true,
      professorAtribuido: true,
    },
  });

  if (!pedido) {
    return { sucesso: false, mensagem: "Pedido de acompanhamento não encontrado." };
  }

  if (!pedido.professorAtribuidoId || !pedido.professorAtribuido) {
    return {
      sucesso: false,
      mensagem: "O pedido precisa ter um explicador atribuído antes da ativação do contrato.",
    };
  }

  // Buscar remuneração congelada por aula
  const remunItem = await obterRemuneracaoPorAnoEDuracao(pedido.anoEscolarId, pedido.duracaoMinutos);
  const remuneracaoPorAulaKz = remunItem ? remunItem.remuneracaoPorAulaKz : Math.round(pedido.precoUnitarioKz * 0.7);

  const anoAtual = new Date().getFullYear();
  const sufixoAleatorio = Math.floor(1000 + Math.random() * 9000);
  const numeroContrato = `TM-CTR-${anoAtual}-${sufixoAleatorio}`;
  const codigoAcompanhamento = `TM-ACOMP-${anoAtual}-${sufixoAleatorio}`;

  // Projetar aulas das próximas 4 semanas
  const diasArray = pedido.diasSemana.split(",").map((d) => d.trim());
  const aulasProjetadas = projetarAulasAcompanhamento({
    dataInicio: new Date(),
    diasSemana: diasArray,
    horarioPreferencial: pedido.horarioPreferencial,
    duracaoMinutos: pedido.duracaoMinutos,
    modalidade: pedido.modalidade,
    precoPorAulaKz: pedido.precoUnitarioKz,
    remuneracaoPorAulaKz,
    numeroSemanas: 4,
  });

  try {
    const resultado = await baseDados.$transaction(async (tx) => {
      // 1. Verificar ou Criar Contrato Comercial
      let contrato = await tx.contrato.findFirst({
        where: { pedidoId: pedido.id },
      });

      if (!contrato) {
        contrato = await tx.contrato.create({
          data: {
            numeroContrato,
            tipo: TipoContrato.Cliente,
            utilizadorId: pedido.encarregado.utilizadorId,
            pedidoId: pedido.id,
            valorMensalKz: pedido.estimativaMensalKz,
            valorPorAulaKz: pedido.precoUnitarioKz,
            dataInicio: new Date(),
            estado: EstadoContrato.Activo,
          },
        });
      }

      // 2. Verificar se o Acompanhamento já foi criado aquando do aceite do professor
      const acompanhamentoExistente = await tx.acompanhamentoServico.findUnique({
        where: { pedidoId: pedido.id },
        include: { aulas: true },
      });

      let acompanhamento;
      let totalAulasGeradas = 0;

      if (acompanhamentoExistente) {
        acompanhamento = await tx.acompanhamentoServico.update({
          where: { id: acompanhamentoExistente.id },
          data: {
            contratoId: contrato.id,
            estado: EstadoAcompanhamento.Activo,
          },
        });
        totalAulasGeradas = acompanhamentoExistente.aulas.length;
      } else {
        acompanhamento = await tx.acompanhamentoServico.create({
          data: {
            codigo: codigoAcompanhamento,
            contratoId: contrato.id,
            pedidoId: pedido.id,
            alunoId: pedido.alunoId,
            encarregadoId: pedido.encarregadoId,
            professorId: pedido.professorAtribuidoId!,
            disciplinaId: pedido.disciplinaId,
            modalidade: pedido.modalidade,
            duracaoMinutos: pedido.duracaoMinutos,
            frequenciaSemanal: pedido.frequenciaSemanal,
            diasSemana: pedido.diasSemana,
            horarioPreferencial: pedido.horarioPreferencial,
            precoPorAulaKz: pedido.precoUnitarioKz,
            remuneracaoPorAulaKz,
            estimativaMensalKz: pedido.estimativaMensalKz,
            estado: EstadoAcompanhamento.Activo,
            dataInicio: new Date(),
            municipio: pedido.municipio,
            bairro: pedido.bairro,
            endereco: pedido.endereco,
          },
        });
      }

      // 3. Gerar Aulas no Calendário caso ainda não existam
      if (totalAulasGeradas === 0) {
        for (const aula of aulasProjetadas) {
          await tx.aula.create({
            data: {
              acompanhamentoId: acompanhamento.id,
              numeroSessao: aula.numeroSessao,
              dataHoraInicio: aula.dataHoraInicio,
              dataHoraFim: aula.dataHoraFim,
              duracaoMinutos: aula.duracaoMinutos,
              modalidade: aula.modalidade,
              estado: aula.estado,
              precoCobradoKz: aula.precoCobradoKz,
              remuneracaoPagaKz: aula.remuneracaoPagaKz,
            },
          });
        }
        totalAulasGeradas = aulasProjetadas.length;
      }

      // 4. Emitir 1.ª Cobrança/Fatura Mensal se ainda não existir para este contrato
      const cobrancaExistente = await tx.cobrancaCliente.findFirst({
        where: { contratoId: contrato.id },
      });

      if (!cobrancaExistente) {
        const totalCobrancas = await tx.cobrancaCliente.count();
        const numeroFatura = formatarNumeroFatura(anoAtual, totalCobrancas + 1);
        const mesAtual = new Intl.DateTimeFormat("pt-PT", {
          month: "long",
          year: "numeric",
        }).format(new Date());
        const mesReferencia = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);
        const dataVencimento = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await tx.cobrancaCliente.create({
          data: {
            numeroFatura,
            contratoId: contrato.id,
            encarregadoId: pedido.encarregadoId,
            mesReferencia,
            valorKz: pedido.estimativaMensalKz,
            estado: "Pendente",
            dataVencimento,
          },
        });
      }

      // 5. Atualizar Estado do Pedido para "Activo"
      await tx.pedidoAcompanhamento.update({
        where: { id: pedido.id },
        data: { estado: EstadoPedido.Activo },
      });

      // 6. Registar no Histórico de Auditoria
      await tx.historicoEstadoPedido.create({
        data: {
          pedidoId: pedido.id,
          estadoAnterior: pedido.estado,
          novoEstado: EstadoPedido.Activo,
          alteradoPorId: sessao.utilizadorId,
          motivo: `Contrato ${contrato.numeroContrato} formalizado, fatura mensal emitida e acompanhamento ${acompanhamento.codigo} ativo com ${totalAulasGeradas} aulas na agenda.`,
        },
      });

      return { contrato, acompanhamento, totalAulasGeradas };
    });

    revalidatePath(`/administracao/pedidos`);
    revalidatePath(`/administracao/pedidos/${pedidoId}`);
    revalidatePath(`/administracao/contratos`);
    revalidatePath(`/administracao/acompanhamentos`);
    revalidatePath(`/administracao/financeiro`);
    revalidatePath(`/portal-encarregado/acompanhamentos`);
    revalidatePath(`/portal-encarregado/pagamentos`);
    revalidatePath(`/portal-professor/agenda`);

    return {
      sucesso: true,
      mensagem: `Contrato ${resultado.contrato.numeroContrato} formalizado e serviço ativado com ${resultado.totalAulasGeradas} aulas na agenda!`,
      contratoId: resultado.contrato.id,
      acompanhamentoId: resultado.acompanhamento.id,
    };
  } catch (erro) {
    console.error("Erro ao ativar acompanhamento:", erro);
    return { sucesso: false, mensagem: "Erro ao gerar contrato e ativar serviço." };
  }
}

export interface DadosSubmeterContratoPai {
  contratoId?: string;
  biNumero: string;
  morada: string;
  contactoSecundario?: string;
  alunoNome: string;
  alunoClasseAno: string;
  alunoIdade?: string;
  biAnexoUrl: string; // Base64 data URL ou link do ficheiro
  declaracaoAceite: boolean;
}

/**
 * Submete a assinatura digital e o documento de identificação (BI) do Encarregado de Educação.
 */
export async function acaoSubmeterContratoPai(
  dados: DadosSubmeterContratoPai
): Promise<RespostaAcaoContrato> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ENCARREGADO") {
    return { sucesso: false, mensagem: "Apenas encarregados de educação podem assinar este contrato." };
  }

  if (!dados.declaracaoAceite) {
    return { sucesso: false, mensagem: "Deverá aceitar as 12 cláusulas do contrato para prosseguir." };
  }

  if (!dados.biNumero || dados.biNumero.trim().length < 6) {
    return { sucesso: false, mensagem: "Introduza um número de Bilhete de Identidade válido." };
  }

  if (!dados.biAnexoUrl) {
    return { sucesso: false, mensagem: "É obrigatório anexar a cópia (foto ou PDF) do seu Bilhete de Identidade." };
  }

  try {
    const utilizador = await baseDados.utilizador.findUnique({
      where: { id: sessao.utilizadorId },
      include: {
        perfilEncarregado: true,
        contratos: {
          where: { tipo: TipoContrato.Cliente },
          orderBy: { criadoEm: "desc" },
          take: 1,
        },
      },
    });

    if (!utilizador || !utilizador.perfilEncarregado) {
      return { sucesso: false, mensagem: "Perfil de encarregado não localizado." };
    }

    const agora = new Date();
    let contrato = utilizador.contratos[0];

    // Atualizar perfil com o NIF/BI e Morada
    await baseDados.perfilEncarregado.update({
      where: { id: utilizador.perfilEncarregado.id },
      data: {
        nif: dados.biNumero.trim().toUpperCase(),
        endereco: dados.morada.trim(),
      },
    });

    if (contrato) {
      contrato = await baseDados.contrato.update({
        where: { id: contrato.id },
        data: {
          biNumero: dados.biNumero.trim().toUpperCase(),
          biAnexoUrl: dados.biAnexoUrl,
          morada: dados.morada.trim(),
          alunoNome: dados.alunoNome.trim(),
          alunoClasseAno: dados.alunoClasseAno.trim(),
          alunoIdade: dados.alunoIdade?.trim() || null,
          assinadoPorUtilizador: true,
          dataAssinaturaUtilizador: agora,
          termosAceites: true,
        },
      });
    } else {
      // Criar novo contrato comercial
      const anoAtual = agora.getFullYear();
      const totalContratos = await baseDados.contrato.count();
      const numeroContrato = `TM-CTR-PAI-${anoAtual}-${String(totalContratos + 1).padStart(4, "0")}`;

      const prazoLimite = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

      contrato = await baseDados.contrato.create({
        data: {
          numeroContrato,
          tipo: TipoContrato.Cliente,
          utilizadorId: utilizador.id,
          valorMensalKz: 0,
          valorPorAulaKz: 0,
          dataInicio: agora,
          termosAceites: true,
          estado: EstadoContrato.Activo,
          biNumero: dados.biNumero.trim().toUpperCase(),
          biAnexoUrl: dados.biAnexoUrl,
          morada: dados.morada.trim(),
          alunoNome: dados.alunoNome.trim(),
          alunoClasseAno: dados.alunoClasseAno.trim(),
          alunoIdade: dados.alunoIdade?.trim() || null,
          assinadoPorUtilizador: true,
          dataAssinaturaUtilizador: agora,
          prazoLimiteAssinatura: prazoLimite,
          nomeAdminSignatario: "Teodoro Pedro",
          cargoAdminSignatario: "Diretor Geral Pedagógico",
        },
      });
    }

    revalidatePath("/portal-encarregado");
    revalidatePath("/portal-encarregado/contratos");
    revalidatePath("/portal-encarregado/documentos");
    revalidatePath("/administracao/contratos");

    return {
      sucesso: true,
      mensagem: "Contrato assinado e cópia do BI enviada com sucesso! Aguarda a contra-assinatura da TM-Educa.",
      contratoId: contrato.id,
    };
  } catch (erro) {
    console.error("Erro ao assinar contrato de encarregado:", erro);
    return { sucesso: false, mensagem: "Ocorreu um erro ao processar o contrato. Tente novamente." };
  }
}

export interface DadosHomologarAdmin {
  contratoId: string;
  nomeAdminSignatario: string;
  cargoAdminSignatario: string;
  biAdminAnexoUrl?: string;
}

/**
 * Homologa o contrato pela administração, aplicando a assinatura do diretor e anexando o BI institucional.
 */
export async function acaoHomologarContratoAdmin(
  dados: DadosHomologarAdmin
): Promise<RespostaAcaoContrato> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Apenas administradores podem homologar e contra-assinar contratos." };
  }

  try {
    const agora = new Date();

    const contrato = await baseDados.contrato.update({
      where: { id: dados.contratoId },
      data: {
        assinadoPorAdmin: true,
        dataAssinaturaAdmin: agora,
        nomeAdminSignatario: dados.nomeAdminSignatario || "Teodoro Pedro",
        cargoAdminSignatario: dados.cargoAdminSignatario || "Diretor Geral Pedagógico",
        biAdminAnexoUrl: dados.biAdminAnexoUrl || undefined,
        estado: EstadoContrato.Activo,
      },
    });

    revalidatePath("/administracao/contratos");
    revalidatePath("/portal-encarregado/contratos");
    revalidatePath("/portal-encarregado/documentos");

    return {
      sucesso: true,
      mensagem: `Contrato ${contrato.numeroContrato} homologado e contra-assinado com sucesso!`,
      contratoId: contrato.id,
    };
  } catch (erro) {
    console.error("Erro ao homologar contrato:", erro);
    return { sucesso: false, mensagem: "Não foi possível homologar o contrato." };
  }
}

export interface DadosEmitirContratoProfessor {
  professorUtilizadorId: string;
  valorPorAulaKz: number;
  disciplinasLecionadas?: string;
}

/**
 * A administração emite e disponibiliza formalmente o contrato a um explicador.
 */
export async function acaoEmitirContratoProfessor(
  dados: DadosEmitirContratoProfessor
): Promise<RespostaAcaoContrato> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Apenas administradores podem emitir contratos a professores." };
  }

  try {
    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const totalContratos = await baseDados.contrato.count();
    const numeroContrato = `TM-CTR-PROF-${anoAtual}-${String(totalContratos + 1).padStart(4, "0")}`;

    const contrato = await baseDados.contrato.create({
      data: {
        numeroContrato,
        tipo: TipoContrato.Professor,
        utilizadorId: dados.professorUtilizadorId,
        valorMensalKz: 0,
        valorPorAulaKz: dados.valorPorAulaKz,
        dataInicio: agora,
        disciplinasAcordadas: dados.disciplinasLecionadas,
        termosAceites: false,
        estado: EstadoContrato.Activo,
        nomeAdminSignatario: "Teodoro Pedro",
        cargoAdminSignatario: "Diretor Geral Pedagógico",
        prazoLimiteAssinatura: new Date(agora.getTime() + 15 * 24 * 60 * 60 * 1000),
      },
    });

    revalidatePath("/administracao/contratos");
    revalidatePath("/administracao/utilizadores/professores");
    revalidatePath("/portal-professor");

    return {
      sucesso: true,
      mensagem: `Contrato de explicador ${numeroContrato} emitido com sucesso! O professor já pode aceder e assinar no portal.`,
      contratoId: contrato.id,
    };
  } catch (erro) {
    console.error("Erro ao emitir contrato para professor:", erro);
    return { sucesso: false, mensagem: "Erro ao emitir contrato docente." };
  }
}

export interface DadosSubmeterContratoProfessor {
  contratoId: string;
  biNumero: string;
  morada: string;
  especialidade: string;
  biAnexoUrl: string;
  declaracaoAceite: boolean;
}

/**
 * O professor assina o contrato de prestação de serviços educativos e anexa a sua identificação.
 */
export async function acaoSubmeterContratoProfessor(
  dados: DadosSubmeterContratoProfessor
): Promise<RespostaAcaoContrato> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "PROFESSOR") {
    return { sucesso: false, mensagem: "Acesso reservado a professores credenciados." };
  }

  if (!dados.declaracaoAceite) {
    return { sucesso: false, mensagem: "Deverá aceitar as 13 cláusulas do contrato docente para prosseguir." };
  }

  if (!dados.biAnexoUrl) {
    return { sucesso: false, mensagem: "Anexe a cópia do seu Bilhete de Identidade." };
  }

  try {
    const agora = new Date();

    const contrato = await baseDados.contrato.update({
      where: { id: dados.contratoId },
      data: {
        biNumero: dados.biNumero.trim().toUpperCase(),
        morada: dados.morada.trim(),
        disciplinasAcordadas: dados.especialidade.trim(),
        biAnexoUrl: dados.biAnexoUrl,
        assinadoPorUtilizador: true,
        dataAssinaturaUtilizador: agora,
        termosAceites: true,
      },
    });

    revalidatePath("/portal-professor");
    revalidatePath("/administracao/contratos");

    return {
      sucesso: true,
      mensagem: "Contrato docente assinado com sucesso! Enviado para homologação da Direção.",
      contratoId: contrato.id,
    };
  } catch (erro) {
    console.error("Erro ao assinar contrato de professor:", erro);
    return { sucesso: false, mensagem: "Não foi possível assinar o contrato docente." };
  }
}
