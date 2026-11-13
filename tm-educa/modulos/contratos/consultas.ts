import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import { TipoContrato } from "@prisma/client";

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

export interface EstadoContratualEncarregado {
  temContrato: boolean;
  contratoId?: string;
  numeroContrato?: string;
  assinadoPeloPai: boolean;
  assinadoPeloAdmin: boolean;
  dataAssinaturaPai?: Date | null;
  dataAssinaturaAdmin?: Date | null;
  biNumero?: string | null;
  biAnexoUrl?: string | null;
  biAdminAnexoUrl?: string | null;
  prazoLimiteAssinatura: Date;
  diasRestantes: number;
  prazoExpirado: boolean;
  alunoNome?: string;
  alunoClasse?: string;
  alunoIdade?: string;
  alunoId?: string;
}

/**
 * Obtém o estado contratual e os dados para formalização do contrato do pai autenticado.
 * Calcula o prazo de 7 dias com base na data de criação da conta ou do primeiro pedido.
 */
export async function obterEstadoContratualEncarregado(): Promise<EstadoContratualEncarregado | null> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ENCARREGADO") {
    return null;
  }

  const utilizador = await baseDados.utilizador.findUnique({
    where: { id: sessao.utilizadorId },
    include: {
      perfilEncarregado: {
        include: {
          alunos: {
            where: { activo: true },
            orderBy: { criadoEm: "asc" },
          },
          pedidos: {
            orderBy: { criadoEm: "asc" },
            include: {
              aluno: true,
              disciplina: true,
              anoEscolar: true,
            },
          },
        },
      },
      contratos: {
        where: { tipo: TipoContrato.Cliente },
        orderBy: { criadoEm: "desc" },
        take: 1,
      },
    },
  });

  if (!utilizador || !utilizador.perfilEncarregado) {
    return null;
  }

  const primeiroAluno = utilizador.perfilEncarregado.alunos[0];
  const primeiroPedido = utilizador.perfilEncarregado.pedidos[0];
  const contratoExistente = utilizador.contratos[0];

  // Cálculo da data base e do prazo de 7 dias
  const dataBase = utilizador.criadoEm;
  const prazoLimite = contratoExistente?.prazoLimiteAssinatura
    ? new Date(contratoExistente.prazoLimiteAssinatura)
    : new Date(dataBase.getTime() + 7 * 24 * 60 * 60 * 1000);

  const agora = new Date();
  const diferencaMs = prazoLimite.getTime() - agora.getTime();
  const diasRestantes = Math.max(0, Math.ceil(diferencaMs / (1000 * 60 * 60 * 24)));
  const prazoExpirado = diferencaMs < 0;

  return {
    temContrato: Boolean(contratoExistente),
    contratoId: contratoExistente?.id,
    numeroContrato: contratoExistente?.numeroContrato,
    assinadoPeloPai: Boolean(contratoExistente?.assinadoPorUtilizador),
    assinadoPeloAdmin: Boolean(contratoExistente?.assinadoPorAdmin),
    dataAssinaturaPai: contratoExistente?.dataAssinaturaUtilizador,
    dataAssinaturaAdmin: contratoExistente?.dataAssinaturaAdmin,
    biNumero: contratoExistente?.biNumero || utilizador.perfilEncarregado.nif,
    biAnexoUrl: contratoExistente?.biAnexoUrl,
    biAdminAnexoUrl: contratoExistente?.biAdminAnexoUrl,
    prazoLimiteAssinatura: prazoLimite,
    diasRestantes,
    prazoExpirado,
    alunoNome: contratoExistente?.alunoNome || primeiroAluno?.nomeCompleto || primeiroPedido?.aluno?.nomeCompleto || "",
    alunoClasse: contratoExistente?.alunoClasseAno || primeiroAluno?.anoEscolar || primeiroPedido?.anoEscolar?.nome || "",
    alunoIdade: contratoExistente?.alunoIdade || "",
    alunoId: primeiroAluno?.id || primeiroPedido?.alunoId,
  };
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
