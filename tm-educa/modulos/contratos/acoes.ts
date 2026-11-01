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
