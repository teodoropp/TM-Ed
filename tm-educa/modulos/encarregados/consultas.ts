import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";

/**
 * Obtém o perfil completo do pai com os respetivos filhos.
 */
export async function obterPerfilEncarregadoLogado() {
  const sessao = await obterSessao();
  if (!sessao) return null;

  return await baseDados.perfilEncarregado.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
    include: {
      utilizador: true,
      alunos: {
        where: { activo: true },
        orderBy: { criadoEm: "desc" },
      },
    },
  });
}

/**
 * Consulta de todos os pais registados na plataforma para a administração.
 */
export async function obterTodosPaissAdmin() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") return [];

  return await baseDados.perfilEncarregado.findMany({
    include: {
      utilizador: true,
      alunos: {
        where: { activo: true },
      },
    },
    orderBy: { criadoEm: "desc" },
  });
}
