import { baseDados } from "@/servicos/base-dados";

/**
 * Obtém todos os ciclos de ensino com os respetivos anos escolares ordenados.
 */
export async function obterCiclosComAnos() {
  return await baseDados.catalogoCiclo.findMany({
    orderBy: { ordem: "asc" },
    include: {
      anos: {
        orderBy: { ordem: "asc" },
      },
    },
  });
}

/**
 * Obtém a lista simples de anos escolares ordenados.
 */
export async function obterAnosEscolares() {
  return await baseDados.catalogoAnoEscolar.findMany({
    orderBy: { ordem: "asc" },
    include: { ciclo: true },
  });
}

/**
 * Obtém as disciplinas ativas disponíveis para seleção nos pedidos de acompanhamento.
 */
export async function obterDisciplinasAtivas() {
  return await baseDados.catalogoDisciplina.findMany({
    where: { activo: true },
    orderBy: { nome: "asc" },
  });
}

/**
 * Consulta de todas as disciplinas para o painel de catálogo da administração.
 */
export async function obterTodasDisciplinasAdmin() {
  return await baseDados.catalogoDisciplina.findMany({
    orderBy: { nome: "asc" },
  });
}
