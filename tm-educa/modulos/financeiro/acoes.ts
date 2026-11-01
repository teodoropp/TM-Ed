"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import {
  formatarNumeroFatura,
  formatarCodigoFolhaRemuneracao,
  apurarRemuneracaoDocente,
} from "@/regras/calculo-financeiro";
import { revalidatePath } from "next/cache";

export interface RespostaAcaoFinanceira {
  sucesso: boolean;
  mensagem: string;
  id?: string;
}

/**
 * Emissão de aviso de pagamento/fatura mensal para um contrato de cliente (Administração).
 */
export async function acaoGerarCobrancaMensal(dados: {
  contratoId: string;
  mesReferencia: string;
  dataVencimentoStr: string;
}): Promise<RespostaAcaoFinanceira> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração central." };
  }

  const contrato = await baseDados.contrato.findUnique({
    where: { id: dados.contratoId },
    include: {
      utilizador: {
        include: { perfilEncarregado: true },
      },
    },
  });

  if (!contrato || !contrato.utilizador.perfilEncarregado) {
    return { sucesso: false, mensagem: "Contrato de cliente não encontrado." };
  }

  const anoAtual = new Date().getFullYear();
  const totalCobrancas = await baseDados.cobrancaCliente.count();
  const numeroFatura = formatarNumeroFatura(anoAtual, totalCobrancas + 1);

  const cobranca = await baseDados.cobrancaCliente.create({
    data: {
      numeroFatura,
      contratoId: contrato.id,
      encarregadoId: contrato.utilizador.perfilEncarregado.id,
      mesReferencia: dados.mesReferencia,
      valorKz: contrato.valorMensalKz,
      estado: "Pendente",
      dataVencimento: new Date(dados.dataVencimentoStr),
    },
  });

  revalidatePath("/administracao/financeiro");
  revalidatePath("/administracao/contratos");
  revalidatePath("/portal-encarregado/pagamentos");

  return {
    sucesso: true,
    mensagem: `Fatura ${numeroFatura} emitida com sucesso no valor de ${contrato.valorMensalKz.toLocaleString("pt-PT")} Kz.`,
    id: cobranca.id,
  };
}

/**
 * Submissão de comprovativo de transferência ou referência pelo Pai.
 */
export async function acaoSubmeterComprovativoPagamento(dados: {
  cobrancaId: string;
  referenciaBancaria: string;
  bancoOrigem: string;
  observacoes?: string;
}): Promise<RespostaAcaoFinanceira> {
  const sessao = await obterSessao();
  if (!sessao) {
    return { sucesso: false, mensagem: "Sessão expirada. Inicie sessão novamente." };
  }

  const cobranca = await baseDados.cobrancaCliente.findUnique({
    where: { id: dados.cobrancaId },
    include: { encarregado: true },
  });

  if (!cobranca) {
    return { sucesso: false, mensagem: "Cobrança não encontrada." };
  }

  const eDono =
    sessao.funcao === "ENCARREGADO" &&
    cobranca.encarregado.utilizadorId === sessao.utilizadorId;
  const eAdmin = sessao.funcao === "ADMINISTRADOR";

  if (!eDono && !eAdmin) {
    return { sucesso: false, mensagem: "Não tem permissão para liquidar esta cobrança." };
  }

  if (!dados.referenciaBancaria.trim()) {
    return {
      sucesso: false,
      mensagem: "Por favor, indique a referência ou ID da transferência bancária.",
    };
  }

  await baseDados.cobrancaCliente.update({
    where: { id: dados.cobrancaId },
    data: {
      estado: "EmAnalise",
      referenciaBancaria: dados.referenciaBancaria.trim(),
      bancoOrigem: dados.bancoOrigem.trim(),
      observacoes: dados.observacoes || null,
      dataPagamento: new Date(),
    },
  });

  revalidatePath("/portal-encarregado/pagamentos");
  revalidatePath(`/portal-encarregado/pagamentos/${dados.cobrancaId}`);
  revalidatePath("/administracao/financeiro");

  return {
    sucesso: true,
    mensagem: "Comprovativo de liquidação submetido com sucesso! A administração conferirá o crédito bancário brevemente.",
    id: dados.cobrancaId,
  };
}

/**
 * Validação de crédito bancário e liquidação de fatura pelo Administrador.
 */
export async function acaoValidarPagamentoCliente(dados: {
  cobrancaId: string;
  aprovado: boolean;
  motivoRejeicao?: string;
}): Promise<RespostaAcaoFinanceira> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração central." };
  }

  const cobranca = await baseDados.cobrancaCliente.findUnique({
    where: { id: dados.cobrancaId },
  });

  if (!cobranca) {
    return { sucesso: false, mensagem: "Cobrança não encontrada." };
  }

  if (dados.aprovado) {
    await baseDados.cobrancaCliente.update({
      where: { id: dados.cobrancaId },
      data: {
        estado: "Pago",
        validadoEm: new Date(),
        validadoPorId: sessao.utilizadorId,
      },
    });

    revalidatePath("/administracao/financeiro");
    revalidatePath("/portal-encarregado/pagamentos");

    return {
      sucesso: true,
      mensagem: `Pagamento da fatura ${cobranca.numeroFatura} confirmado e validado com sucesso!`,
      id: dados.cobrancaId,
    };
  } else {
    const nota = dados.motivoRejeicao
      ? `Comprovativo rejeitado: ${dados.motivoRejeicao}`
      : "Comprovativo não identificado no extrato bancário.";

    await baseDados.cobrancaCliente.update({
      where: { id: dados.cobrancaId },
      data: {
        estado: "Falhado",
        observacoes: cobranca.observacoes ? `${cobranca.observacoes} | ${nota}` : nota,
      },
    });

    revalidatePath("/administracao/financeiro");
    revalidatePath("/portal-encarregado/pagamentos");

    return {
      sucesso: true,
      mensagem: `Cobrança rejeitada e notificada à família para correção do pagamento.`,
      id: dados.cobrancaId,
    };
  }
}

/**
 * Geração de folha de pagamento de remuneração do explicador com base em aulas elegíveis (Administração).
 */
export async function acaoProcessarFolhaRemuneracao(dados: {
  professorId: string;
  mesReferencia: string;
  descontosKz?: number;
  observacoes?: string;
}): Promise<RespostaAcaoFinanceira> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração central." };
  }

  const professor = await baseDados.perfilProfessor.findUnique({
    where: { id: dados.professorId },
    include: { utilizador: true },
  });

  if (!professor) {
    return { sucesso: false, mensagem: "Professor não encontrado." };
  }

  // Buscar aulas para apurar elegibilidade
  const aulas = await baseDados.aula.findMany({
    where: {
      acompanhamento: { professorId: dados.professorId },
    },
    select: {
      estado: true,
      remuneracaoPagaKz: true,
    },
  });

  const apuramento = apurarRemuneracaoDocente(aulas);

  if (apuramento.totalAulasElegiveis === 0) {
    return {
      sucesso: false,
      mensagem: "Este professor não tem aulas elegíveis para remuneração neste período.",
    };
  }

  const anoAtual = new Date().getFullYear();
  const totalFolhas = await baseDados.folhaRemuneracao.count();
  const codigoFolha = formatarCodigoFolhaRemuneracao(anoAtual, totalFolhas + 1);

  const descontos = dados.descontosKz || 0;
  const valorLiquidoKz = Math.max(0, apuramento.totalBrutoKz - descontos);

  const folha = await baseDados.folhaRemuneracao.create({
    data: {
      codigoFolha,
      professorId: dados.professorId,
      mesReferencia: dados.mesReferencia,
      totalAulasElegiveis: apuramento.totalAulasElegiveis,
      valorBrutoKz: apuramento.totalBrutoKz,
      descontosKz: descontos,
      valorLiquidoKz,
      estado: "Aprovada",
      observacoes: dados.observacoes || null,
      processadoPorId: sessao.utilizadorId,
    },
  });

  revalidatePath("/administracao/financeiro");
  revalidatePath("/portal-professor/remuneracoes");

  return {
    sucesso: true,
    mensagem: `Folha ${codigoFolha} aprovada no valor líquido de ${valorLiquidoKz.toLocaleString("pt-PT")} Kz (${apuramento.totalAulasElegiveis} aulas elegíveis).`,
    id: folha.id,
  };
}

/**
 * Liquidação final de folha de remuneração dos explicadores com registo de IBAN e transferência (Administração).
 */
export async function acaoLiquidarFolhaRemuneracao(dados: {
  folhaId: string;
  ibanDestino: string;
  comprovativoPagamentoUrl?: string;
  observacoes?: string;
}): Promise<RespostaAcaoFinanceira> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração central." };
  }

  const folha = await baseDados.folhaRemuneracao.findUnique({
    where: { id: dados.folhaId },
  });

  if (!folha) {
    return { sucesso: false, mensagem: "Folha de remuneração não encontrada." };
  }

  await baseDados.folhaRemuneracao.update({
    where: { id: dados.folhaId },
    data: {
      estado: "Paga",
      ibanDestino: dados.ibanDestino.trim(),
      comprovativoPagamentoUrl: dados.comprovativoPagamentoUrl || null,
      observacoes: dados.observacoes || folha.observacoes,
      dataLiquidacao: new Date(),
    },
  });

  revalidatePath("/administracao/financeiro");
  revalidatePath("/portal-professor/remuneracoes");

  return {
    sucesso: true,
    mensagem: `Folha de remuneração ${folha.codigoFolha} liquidada com sucesso via transferência bancária!`,
    id: dados.folhaId,
  };
}
