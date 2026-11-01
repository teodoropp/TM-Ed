import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";

/**
 * Obtém todos os alunos tutelados pertencentes ao encarregado autenticado.
 */
export async function obterMeusAlunos() {
  const sessao = await obterSessao();
  if (!sessao) return [];

  const perfil = await baseDados.perfilEncarregado.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
  });

  if (!perfil) return [];

  return await baseDados.aluno.findMany({
    where: {
      encarregadoId: perfil.id,
      activo: true,
    },
    orderBy: { criadoEm: "desc" },
  });
}

/**
 * Obtém os detalhes de um aluno garantindo que pertence ao encarregado autenticado (ou admin).
 */
export async function obterAlunoPorId(id: string) {
  const sessao = await obterSessao();
  if (!sessao) return null;

  const aluno = await baseDados.aluno.findUnique({
    where: { id },
    include: { encarregado: { include: { utilizador: true } } },
  });

  if (!aluno || !aluno.activo) return null;

  if (
    sessao.funcao !== "ADMINISTRADOR" &&
    aluno.encarregado.utilizadorId !== sessao.utilizadorId
  ) {
    return null; // Acesso não autorizado
  }

  return aluno;
}

/**
 * Consulta de todos os alunos da plataforma para a administração.
 */
/**
 * Contagem rápida de alunos activos para os indicadores do painel.
 */
export async function obterContagemAlunosAdmin(): Promise<number> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") return 0;

  return await baseDados.aluno.count({ where: { activo: true } });
}

export async function obterTodosAlunosAdmin() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") return [];

  return await baseDados.aluno.findMany({
    where: { activo: true },
    include: {
      encarregado: {
        include: {
          utilizador: {
            select: { nomeCompleto: true, email: true, telefone: true },
          },
        },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}
