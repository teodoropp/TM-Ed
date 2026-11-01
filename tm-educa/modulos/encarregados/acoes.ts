"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import { revalidatePath } from "next/cache";

export interface DadosPerfilEncarregadoForm {
  nif?: string;
  municipio?: string;
  bairro?: string;
  endereco?: string;
  profissao?: string;
}

/**
 * Atualiza os dados de residência e contacto do pai.
 */
export async function acaoAtualizarPerfilEncarregado(
  dados: DadosPerfilEncarregadoForm
) {
  const sessao = await obterSessao();
  if (!sessao) {
    return { sucesso: false, mensagem: "Sessão expirada." };
  }

  try {
    await baseDados.perfilEncarregado.upsert({
      where: { utilizadorId: sessao.utilizadorId },
      update: {
        nif: dados.nif?.trim() || null,
        municipio: dados.municipio?.trim() || null,
        bairro: dados.bairro?.trim() || null,
        endereco: dados.endereco?.trim() || null,
        profissao: dados.profissao?.trim() || null,
      },
      create: {
        utilizadorId: sessao.utilizadorId,
        nif: dados.nif?.trim() || null,
        municipio: dados.municipio?.trim() || null,
        bairro: dados.bairro?.trim() || null,
        endereco: dados.endereco?.trim() || null,
        profissao: dados.profissao?.trim() || null,
      },
    });

    revalidatePath("/portal-encarregado/perfil");

    return {
      sucesso: true,
      mensagem: "Perfil e morada atualizados com sucesso!",
    };
  } catch (erro) {
    console.error("Erro ao atualizar perfil de encarregado:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao atualizar os seus dados.",
    };
  }
}
