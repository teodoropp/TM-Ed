"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import { revalidatePath } from "next/cache";

export interface RespostaAcaoPreco {
  sucesso: boolean;
  mensagem: string;
}

/**
 * Atualiza ou cria o valor oficial de preço por aula para um determinado ano escolar e duração (exclusivo Admin).
 */
export async function acaoAtualizarPreco(
  anoEscolarId: string,
  duracaoMinutos: number,
  precoPorAulaKz: number
): Promise<RespostaAcaoPreco> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração." };
  }

  if (precoPorAulaKz <= 0) {
    return { sucesso: false, mensagem: "O preço por aula deve ser superior a zero." };
  }

  try {
    await baseDados.tabelaPreco.upsert({
      where: {
        anoEscolarId_duracaoMinutos: {
          anoEscolarId,
          duracaoMinutos,
        },
      },
      update: {
        precoPorAulaKz,
        vigenteDesde: new Date(),
      },
      create: {
        anoEscolarId,
        duracaoMinutos,
        precoPorAulaKz,
        activo: true,
      },
    });

    revalidatePath("/administracao/catalogo/precos");
    return { sucesso: true, mensagem: "Preço atualizado com sucesso!" };
  } catch (erro) {
    console.error("Erro ao atualizar preço:", erro);
    return { sucesso: false, mensagem: "Erro ao atualizar a tabela de preços." };
  }
}

/**
 * Atualiza ou cria o valor de remuneração de professor por aula (exclusivo Admin).
 */
export async function acaoAtualizarRemuneracao(
  anoEscolarId: string,
  duracaoMinutos: number,
  remuneracaoPorAulaKz: number
): Promise<RespostaAcaoPreco> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração." };
  }

  if (remuneracaoPorAulaKz <= 0) {
    return { sucesso: false, mensagem: "A remuneração deve ser superior a zero." };
  }

  try {
    await baseDados.tabelaRemuneracao.upsert({
      where: {
        anoEscolarId_duracaoMinutos: {
          anoEscolarId,
          duracaoMinutos,
        },
      },
      update: {
        remuneracaoPorAulaKz,
        vigenteDesde: new Date(),
      },
      create: {
        anoEscolarId,
        duracaoMinutos,
        remuneracaoPorAulaKz,
        activo: true,
      },
    });

    revalidatePath("/administracao/catalogo/remuneracoes");
    return { sucesso: true, mensagem: "Remuneração atualizada com sucesso!" };
  } catch (erro) {
    console.error("Erro ao atualizar remuneração:", erro);
    return { sucesso: false, mensagem: "Erro ao atualizar a tabela de remunerações." };
  }
}
