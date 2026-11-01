import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "./sessao";

/**
 * Obtém os dados completos do utilizador autenticado a partir da sessão ativa.
 */
export async function obterUtilizadorAutenticado() {
  const sessao = await obterSessao();
  if (!sessao) return null;

  try {
    return await baseDados.utilizador.findUnique({
      where: { id: sessao.utilizadorId },
      include: {
        perfilEncarregado: true,
        perfilProfessor: {
          include: {
            disponibilidades: true,
          },
        },
        perfilAdmin: true,
      },
    });
  } catch (erro) {
    console.error("Erro ao obter utilizador autenticado:", erro);
    return null;
  }
}

/**
 * Verifica se o utilizador autenticado possui uma das funções permitidas (RBAC).
 */
export async function verificarAutorizacao(funcoesPermitidas: string[]) {
  const sessao = await obterSessao();
  if (!sessao) return { autorizado: false, motivo: "NAO_AUTENTICADO" };

  if (!funcoesPermitidas.includes(sessao.funcao)) {
    return { autorizado: false, motivo: "ACESSO_NEGADO", funcao: sessao.funcao };
  }

  return { autorizado: true, sessao };
}
