import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";

/**
 * Obtém o perfil administrativo do utilizador autenticado, incluindo a
 * fotografia (quando existir) e os dados da conta associada.
 *
 * Devolve `null` quando não há sessão ativa ou quando a conta não é de
 * administrador.
 */
export async function obterPerfilAdminLogado() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") return null;

  try {
    return await baseDados.utilizador.findUnique({
      where: { id: sessao.utilizadorId },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        telefone: true,
        funcao: true,
        perfilAdmin: {
          select: {
            id: true,
            departamento: true,
            cargo: true,
            fotoUrl: true,
          },
        },
      },
    });
  } catch (erro) {
    console.error("Erro ao obter o perfil do administrador:", erro);
    return null;
  }
}
