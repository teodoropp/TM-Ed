import { baseDados } from "@/servicos/base-dados";
import { EstadoAula } from "@prisma/client";

/**
 * Consulta os detalhes completos de uma aula por ID com todas as relações pedagógicas.
 */
export async function obterAulaPorId(id: string) {
  return await baseDados.aula.findUnique({
    where: { id },
    include: {
      acompanhamento: {
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
          professor: {
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
        },
      },
      aulaOriginalReposicao: {
        include: {
          aulaReposicao: true,
        },
      },
      reposicaoDe: {
        include: {
          aulaOriginal: true,
        },
      },
    },
  });
}

/**
 * Consulta todas as aulas de um explicador específico com ordenação cronológica.
 */
export async function obterAulasProfessor(professorId: string) {
  return await baseDados.aula.findMany({
    where: {
      acompanhamento: {
        professorId,
      },
    },
    include: {
      acompanhamento: {
        include: {
          aluno: true,
          disciplina: true,
          encarregado: {
            include: {
              utilizador: {
                select: {
                  id: true,
                  nomeCompleto: true,
                  telefone: true,
                },
              },
            },
          },
        },
      },
      aulaOriginalReposicao: {
        include: {
          aulaReposicao: true,
        },
      },
      reposicaoDe: {
        include: {
          aulaOriginal: true,
        },
      },
    },
    orderBy: {
      dataHoraInicio: "desc",
    },
  });
}

/**
 * Consulta as aulas associadas aos filhos de um determinado encarregado.
 */
export async function obterAulasEncarregado(encarregadoId: string) {
  return await baseDados.aula.findMany({
    where: {
      acompanhamento: {
        encarregadoId,
      },
    },
    include: {
      acompanhamento: {
        include: {
          aluno: true,
          disciplina: true,
          professor: {
            include: {
              utilizador: {
                select: {
                  id: true,
                  nomeCompleto: true,
                  telefone: true,
                },
              },
            },
          },
        },
      },
      aulaOriginalReposicao: {
        include: {
          aulaReposicao: true,
        },
      },
      reposicaoDe: {
        include: {
          aulaOriginal: true,
        },
      },
    },
    orderBy: {
      dataHoraInicio: "desc",
    },
  });
}

/**
 * Consulta global de aulas para supervisão pela administração central.
 */
export async function obterTodasAulasAdmin(filtros?: {
  estado?: EstadoAula;
}) {
  return await baseDados.aula.findMany({
    where: {
      ...(filtros?.estado ? { estado: filtros.estado } : {}),
    },
    include: {
      acompanhamento: {
        include: {
          aluno: true,
          disciplina: true,
          professor: {
            include: {
              utilizador: {
                select: {
                  id: true,
                  nomeCompleto: true,
                  telefone: true,
                },
              },
            },
          },
          encarregado: {
            include: {
              utilizador: {
                select: {
                  id: true,
                  nomeCompleto: true,
                  telefone: true,
                },
              },
            },
          },
        },
      },
      aulaOriginalReposicao: {
        include: {
          aulaReposicao: true,
        },
      },
      reposicaoDe: {
        include: {
          aulaOriginal: true,
        },
      },
    },
    orderBy: {
      dataHoraInicio: "desc",
    },
    take: 100,
  });
}

/**
 * Estatísticas pedagógicas e operacionais para o portal do explicador.
 */
export async function obterEstatisticasAulasProfessor(professorId: string) {
  const agora = new Date();
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const fimHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59);

  const [totalRealizadas, pendentesSumario, aulasHoje, reposicoes] = await Promise.all([
    baseDados.aula.count({
      where: {
        acompanhamento: { professorId },
        estado: "Realizada",
      },
    }),
    baseDados.aula.count({
      where: {
        acompanhamento: { professorId },
        estado: "Agendada",
        dataHoraFim: { lte: agora },
      },
    }),
    baseDados.aula.count({
      where: {
        acompanhamento: { professorId },
        dataHoraInicio: { gte: inicioHoje, lte: fimHoje },
      },
    }),
    baseDados.aula.count({
      where: {
        acompanhamento: { professorId },
        reposicaoDe: { isNot: null },
      },
    }),
  ]);

  return {
    totalRealizadas,
    pendentesSumario,
    aulasHoje,
    reposicoes,
  };
}

/**
 * Estatísticas globais de aulas para o painel de administração.
 */
export async function obterEstatisticasAulasAdmin() {
  const agora = new Date();
  const [total, agendadas, realizadas, faltasAluno, faltasProfessor, canceladas] = await Promise.all([
    baseDados.aula.count(),
    baseDados.aula.count({ where: { estado: "Agendada" } }),
    baseDados.aula.count({ where: { estado: "Realizada" } }),
    baseDados.aula.count({ where: { estado: "Aluno_Ausente" } }),
    baseDados.aula.count({ where: { estado: "Professor_Ausente" } }),
    baseDados.aula.count({ where: { estado: "Cancelada" } }),
  ]);

  return {
    total,
    agendadas,
    realizadas,
    faltasAluno,
    faltasProfessor,
    canceladas,
  };
}
