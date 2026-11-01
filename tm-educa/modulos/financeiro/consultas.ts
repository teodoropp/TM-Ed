import { baseDados } from "@/servicos/base-dados";
import { calcularMargemBrutaConsolidada, apurarRemuneracaoDocente } from "@/regras/calculo-financeiro";
import { EstadoCobranca, EstadoFolhaRemuneracao } from "@prisma/client";

/**
 * Consulta todas as cobranças e faturas emitidas para um pai.
 */
export async function obterCobrancasEncarregado(encarregadoId: string) {
  return await baseDados.cobrancaCliente.findMany({
    where: { encarregadoId },
    include: {
      contrato: {
        include: {
          acompanhamentos: {
            include: {
              aluno: true,
              disciplina: true,
            },
          },
        },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Consulta os detalhes completos de uma fatura de cobrança.
 */
export async function obterCobrancaPorId(id: string) {
  return await baseDados.cobrancaCliente.findUnique({
    where: { id },
    include: {
      encarregado: {
        include: {
          utilizador: true,
        },
      },
      contrato: {
        include: {
          acompanhamentos: {
            include: {
              aluno: true,
              disciplina: true,
              professor: {
                include: {
                  utilizador: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Consulta as folhas de remuneração emitidas para um determinado explicador.
 */
export async function obterFolhasRemuneracaoProfessor(professorId: string) {
  return await baseDados.folhaRemuneracao.findMany({
    where: { professorId },
    include: {
      professor: {
        include: {
          utilizador: true,
        },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Consulta global de cobranças a clientes para o painel de administração.
 */
export async function obterTodasCobrancasAdmin(filtros?: { estado?: EstadoCobranca }) {
  return await baseDados.cobrancaCliente.findMany({
    where: {
      ...(filtros?.estado ? { estado: filtros.estado } : {}),
    },
    include: {
      encarregado: {
        include: {
          utilizador: true,
        },
      },
      contrato: {
        include: {
          acompanhamentos: {
            include: {
              aluno: true,
              disciplina: true,
            },
          },
        },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Consulta global de folhas de pagamento aos professores para a administração.
 */
export async function obterTodasFolhasAdmin(filtros?: { estado?: EstadoFolhaRemuneracao }) {
  return await baseDados.folhaRemuneracao.findMany({
    where: {
      ...(filtros?.estado ? { estado: filtros.estado } : {}),
    },
    include: {
      professor: {
        include: {
          utilizador: true,
        },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Indicadores consolidados de faturação, despesas dos explicadores e margem bruta da TM-Educa.
 */
export async function obterResumoFinanceiroAdmin() {
  const [cobrancasPagas, cobrancasPendentes, cobrancasEmAnalise, folhasPagas] = await Promise.all([
    baseDados.cobrancaCliente.findMany({
      where: { estado: "Pago" },
      select: { valorKz: true },
    }),
    baseDados.cobrancaCliente.findMany({
      where: { estado: "Pendente" },
      select: { valorKz: true },
    }),
    baseDados.cobrancaCliente.findMany({
      where: { estado: "EmAnalise" },
      select: { valorKz: true },
    }),
    baseDados.folhaRemuneracao.findMany({
      where: { estado: "Paga" },
      select: { valorLiquidoKz: true },
    }),
  ]);

  const totalFaturadoPagoKz = cobrancasPagas.reduce((acc, c) => acc + c.valorKz, 0);
  const totalPendenteReceberKz = cobrancasPendentes.reduce((acc, c) => acc + c.valorKz, 0);
  const totalEmAnaliseKz = cobrancasEmAnalise.reduce((acc, c) => acc + c.valorKz, 0);
  const totalRemuneracoesPagasKz = folhasPagas.reduce((acc, f) => acc + f.valorLiquidoKz, 0);

  const margem = calcularMargemBrutaConsolidada(totalFaturadoPagoKz, totalRemuneracoesPagasKz);

  return {
    totalFaturadoPagoKz,
    totalPendenteReceberKz,
    totalEmAnaliseKz,
    totalEmAnaliseContagem: cobrancasEmAnalise.length,
    totalRemuneracoesPagasKz,
    margemBrutaKz: margem.margemBrutaKz,
    margemBrutaPercentual: margem.margemBrutaPercentual,
  };
}

/**
 * Calcula em tempo real as aulas elegíveis de um explicador para emissão de folha.
 */
export async function obterAulasElegiveisProfessor(professorId: string) {
  const aulas = await baseDados.aula.findMany({
    where: {
      acompanhamento: {
        professorId,
      },
    },
    select: {
      id: true,
      numeroSessao: true,
      dataHoraInicio: true,
      estado: true,
      remuneracaoPagaKz: true,
      acompanhamento: {
        select: {
          aluno: { select: { nomeCompleto: true } },
          disciplina: { select: { nome: true } },
        },
      },
    },
    orderBy: { dataHoraInicio: "desc" },
  });

  const apuramento = apurarRemuneracaoDocente(aulas);

  return {
    aulas,
    ...apuramento,
  };
}
