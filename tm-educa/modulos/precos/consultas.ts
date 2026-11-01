import { baseDados } from "@/servicos/base-dados";

/**
 * Consulta a tabela completa de preços oficiais agrupada por ciclo e ano.
 */
export async function obterTabelaPrecosCompleta() {
  return await baseDados.catalogoCiclo.findMany({
    orderBy: { ordem: "asc" },
    include: {
      anos: {
        orderBy: { ordem: "asc" },
        include: {
          precos: {
            where: { activo: true },
            orderBy: { duracaoMinutos: "asc" },
          },
        },
      },
    },
  });
}

/**
 * Consulta o preço por aula para um determinado ano escolar e duração em minutos.
 */
export async function obterPrecoPorAnoEDuracao(anoEscolarId: string, duracaoMinutos: number) {
  return await baseDados.tabelaPreco.findUnique({
    where: {
      anoEscolarId_duracaoMinutos: {
        anoEscolarId,
        duracaoMinutos,
      },
    },
  });
}

/**
 * Consulta a tabela completa de remunerações de professores agrupada por ciclo e ano.
 * Exclusivo para visualização administrativa.
 */
export async function obterTabelaRemuneracoesCompleta() {
  return await baseDados.catalogoCiclo.findMany({
    orderBy: { ordem: "asc" },
    include: {
      anos: {
        orderBy: { ordem: "asc" },
        include: {
          remuneracoes: {
            where: { activo: true },
            orderBy: { duracaoMinutos: "asc" },
          },
        },
      },
    },
  });
}

/**
 * Consulta a remuneração para um determinado ano escolar e duração em minutos.
 */
export async function obterRemuneracaoPorAnoEDuracao(anoEscolarId: string, duracaoMinutos: number) {
  return await baseDados.tabelaRemuneracao.findUnique({
    where: {
      anoEscolarId_duracaoMinutos: {
        anoEscolarId,
        duracaoMinutos,
      },
    },
  });
}

/**
 * Obtém matriz unificada de preços e remunerações por ano escolar para a gestão financeira do administrador.
 */
export async function obterMatrizFinanceiraAdmin() {
  const ciclos = await baseDados.catalogoCiclo.findMany({
    orderBy: { ordem: "asc" },
    include: {
      anos: {
        orderBy: { ordem: "asc" },
        include: {
          precos: { orderBy: { duracaoMinutos: "asc" } },
          remuneracoes: { orderBy: { duracaoMinutos: "asc" } },
        },
      },
    },
  });

  return ciclos;
}
