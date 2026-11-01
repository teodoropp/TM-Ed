import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";

/**
 * Consulta todos os contratos registados no sistema para supervisão da administração.
 */
export async function obterTodosContratosAdmin() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return [];
  }

  return await baseDados.contrato.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      utilizador: true,
      acompanhamentos: {
        include: {
          aluno: true,
          professor: { include: { utilizador: true } },
          disciplina: true,
        },
      },
    },
  });
}

/**
 * Consulta os acompanhamentos de serviços ativos do pai autenticado.
 */
export async function obterMeusAcompanhamentosEncarregado() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ENCARREGADO") {
    return [];
  }

  const perfil = await baseDados.perfilEncarregado.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
  });

  if (!perfil) return [];

  return await baseDados.acompanhamentoServico.findMany({
    where: { encarregadoId: perfil.id },
    orderBy: { criadoEm: "desc" },
    include: {
      aluno: true,
      disciplina: true,
      professor: {
        include: { utilizador: true },
      },
      contrato: true,
      aulas: {
        orderBy: { dataHoraInicio: "asc" },
      },
    },
  });
}

/**
 * Consulta os detalhes completos de um acompanhamento específico.
 */
export async function obterAcompanhamentoPorId(id: string) {
  const sessao = await obterSessao();
  if (!sessao) return null;

  const acompanhamento = await baseDados.acompanhamentoServico.findUnique({
    where: { id },
    include: {
      aluno: true,
      disciplina: true,
      encarregado: {
        include: { utilizador: true },
      },
      professor: {
        include: { utilizador: true },
      },
      contrato: true,
      aulas: {
        orderBy: { dataHoraInicio: "asc" },
      },
    },
  });

  if (!acompanhamento) return null;

  // Verificação de permissões
  if (sessao.funcao === "ENCARREGADO") {
    const perfil = await baseDados.perfilEncarregado.findUnique({
      where: { utilizadorId: sessao.utilizadorId },
    });
    if (perfil?.id !== acompanhamento.encarregadoId) {
      return null;
    }
  } else if (sessao.funcao === "PROFESSOR") {
    const perfil = await baseDados.perfilProfessor.findUnique({
      where: { utilizadorId: sessao.utilizadorId },
    });
    if (perfil?.id !== acompanhamento.professorId) {
      return null;
    }
  }

  return acompanhamento;
}

/**
 * Consulta a agenda de aulas do professor autenticado.
 */
export async function obterAgendaProfessor() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "PROFESSOR") {
    return [];
  }

  const perfil = await baseDados.perfilProfessor.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
  });

  if (!perfil) return [];

  return await baseDados.aula.findMany({
    where: {
      acompanhamento: {
        professorId: perfil.id,
      },
    },
    orderBy: { dataHoraInicio: "asc" },
    include: {
      acompanhamento: {
        include: {
          aluno: true,
          disciplina: true,
          encarregado: {
            include: { utilizador: true },
          },
        },
      },
    },
  });
}

/**
 * Consulta todos os acompanhamentos de serviços para a administração.
 */
export async function obterTodosAcompanhamentosAdmin() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return [];
  }

  return await baseDados.acompanhamentoServico.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      aluno: true,
      disciplina: true,
      encarregado: {
        include: { utilizador: true },
      },
      professor: {
        include: { utilizador: true },
      },
      contrato: true,
      aulas: {
        orderBy: { dataHoraInicio: "asc" },
      },
    },
  });
}
