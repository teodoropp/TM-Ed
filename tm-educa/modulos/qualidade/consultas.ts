import { baseDados } from "@/servicos/base-dados";
import { GravidadeOcorrencia, EstadoOcorrencia } from "@prisma/client";

/**
 * Consulta todas as avaliações recebidas por um determinado professor.
 */
export async function obterAvaliacoesProfessor(professorId: string) {
  return await baseDados.avaliacaoProfessor.findMany({
    where: { professorId },
    include: {
      encarregado: {
        include: {
          utilizador: true,
        },
      },
      aluno: true,
      acompanhamento: {
        include: {
          disciplina: true,
        },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Consulta os acompanhamentos de um pai com professor atribuído,
 * indicando se já foram avaliados ou se estão pendentes de avaliação.
 */
export async function obterAcompanhamentosParaAvaliar(encarregadoId: string) {
  return await baseDados.acompanhamentoServico.findMany({
    where: {
      encarregadoId,
    },
    include: {
      aluno: true,
      disciplina: true,
      professor: {
        include: {
          utilizador: true,
        },
      },
      avaliacoes: {
        where: { encarregadoId },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Consulta as ocorrências reportadas por um utilizador (encarregado ou professor).
 */
export async function obterOcorrenciasPorAutor(autorId: string) {
  return await baseDados.ocorrencia.findMany({
    where: { autorId },
    include: {
      responsavel: true,
      acompanhamento: {
        include: {
          aluno: true,
          disciplina: true,
        },
      },
      aula: true,
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Consulta as ocorrências relevantes para um explicador/professor (reportadas por si ou referentes às suas turmas).
 */
export async function obterOcorrenciasProfessor(professorPerfilId: string, utilizadorId: string) {
  return await baseDados.ocorrencia.findMany({
    where: {
      OR: [
        { autorId: utilizadorId },
        { acompanhamento: { professorId: professorPerfilId } },
      ],
    },
    include: {
      autor: true,
      responsavel: true,
      acompanhamento: {
        include: {
          aluno: true,
          disciplina: true,
        },
      },
      aula: true,
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Consulta global de todas as ocorrências registadas no ecossistema (Administração).
 */
export async function obterTodasOcorrenciasAdmin(filtros?: {
  gravidade?: GravidadeOcorrencia;
  estado?: EstadoOcorrencia;
}) {
  return await baseDados.ocorrencia.findMany({
    where: {
      ...(filtros?.gravidade ? { gravidade: filtros.gravidade } : {}),
      ...(filtros?.estado ? { estado: filtros.estado } : {}),
    },
    include: {
      autor: true,
      responsavel: true,
      acompanhamento: {
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
      aula: true,
    },
    orderBy: [{ gravidade: "desc" }, { criadoEm: "desc" }],
  });
}

/**
 * Consulta global de todas as avaliações pedagógicas emitidas (Administração).
 */
export async function obterTodasAvaliacoesAdmin() {
  return await baseDados.avaliacaoProfessor.findMany({
    include: {
      professor: {
        include: {
          utilizador: true,
        },
      },
      encarregado: {
        include: {
          utilizador: true,
        },
      },
      aluno: true,
      acompanhamento: {
        include: {
          disciplina: true,
        },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Consulta indicadores executivos de qualidade pedagógica e resolução de ocorrências.
 */
export async function obterEstatisticasQualidadeAdmin() {
  const [totalAvaliacoes, totalOcorrencias, ocorrenciasAbertas, ocorrenciasUrgentes, ocorrenciasResolvidas] =
    await Promise.all([
      baseDados.avaliacaoProfessor.count(),
      baseDados.ocorrencia.count(),
      baseDados.ocorrencia.count({ where: { estado: { in: ["Aberta", "EmInvestigacao"] } } }),
      baseDados.ocorrencia.count({ where: { gravidade: "Urgente", estado: { not: "Resolvida" } } }),
      baseDados.ocorrencia.count({ where: { estado: "Resolvida" } }),
    ]);

  const mediaGlobal = await baseDados.avaliacaoProfessor.aggregate({
    _avg: {
      notaMedia: true,
    },
  });

  const taxaResolucao = totalOcorrencias > 0
    ? Math.round((ocorrenciasResolvidas / totalOcorrencias) * 100)
    : 100;

  return {
    totalAvaliacoes,
    mediaGlobal: mediaGlobal._avg.notaMedia ? Math.round(mediaGlobal._avg.notaMedia * 10) / 10 : 5.0,
    totalOcorrencias,
    ocorrenciasAbertas,
    ocorrenciasUrgentes,
    taxaResolucao,
  };
}
