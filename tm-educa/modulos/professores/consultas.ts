import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";

/**
 * Obtém o perfil profissional do professor autenticado com disponibilidade e zonas.
 */
export async function obterPerfilProfessorLogado() {
  const sessao = await obterSessao();
  if (!sessao) return null;

  return await baseDados.perfilProfessor.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
    include: {
      utilizador: true,
      disponibilidades: {
        orderBy: { diaSemana: "asc" },
      },
      zonasAtendimento: true,
      disciplinasLecionadas: {
        include: {
          disciplina: true,
        },
      },
    },
  });
}

/**
 * Consulta de todos os professores para triagem e gestão da administração.
 */
/**
 * Contagem rápida de explicadores credenciados e activos para os indicadores do painel.
 */
export async function obterContagemProfessoresAdmin(): Promise<number> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") return 0;

  return await baseDados.perfilProfessor.count({
    where: { estado: { in: ["Activo", "Verificado"] } },
  });
}

export async function obterTodosProfessoresAdmin() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") return [];

  return await baseDados.perfilProfessor.findMany({
    include: {
      utilizador: true,
      disponibilidades: true,
      zonasAtendimento: true,
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Consulta de professores ativos e verificados disponíveis para substituição.
 */
export async function obterProfessoresAtivosParaSubstituicao() {
  return await baseDados.perfilProfessor.findMany({
    where: {
      estado: {
        in: ["Activo", "Verificado"],
      },
    },
    include: {
      utilizador: {
        select: {
          nomeCompleto: true,
          telefone: true,
        },
      },
    },
    orderBy: {
      utilizador: {
        nomeCompleto: "asc",
      },
    },
  });
}

/**
 * Consulta todos os acompanhamentos e respetivos alunos de um professor.
 */
export async function obterAcompanhamentosProfessor(professorId: string) {
  return await baseDados.acompanhamentoServico.findMany({
    where: {
      professorId,
    },
    include: {
      aluno: true,
      disciplina: true,
      encarregado: {
        include: {
          utilizador: {
            select: {
              id: true,
              nomeCompleto: true,
              email: true,
              telefone: true,
            },
          },
        },
      },
      aulas: {
        orderBy: { dataHoraInicio: "desc" },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}
