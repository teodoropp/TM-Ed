"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import { revalidatePath } from "next/cache";

export interface RespostaAcaoCatalogo {
  sucesso: boolean;
  mensagem: string;
}

/**
 * Cria uma nova disciplina curricular no catálogo escolar (exclusivo Admin).
 */
export async function acaoCriarDisciplina(
  nome: string,
  descricao?: string
): Promise<RespostaAcaoCatalogo> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração." };
  }

  const nomeLimpo = nome.trim();
  if (nomeLimpo.length < 2) {
    return { sucesso: false, mensagem: "O nome da disciplina é obrigatório." };
  }

  try {
    const existente = await baseDados.catalogoDisciplina.findUnique({
      where: { nome: nomeLimpo },
    });

    if (existente) {
      return { sucesso: false, mensagem: "Esta disciplina já existe no catálogo." };
    }

    await baseDados.catalogoDisciplina.create({
      data: {
        nome: nomeLimpo,
        descricao: descricao?.trim() || null,
        activo: true,
      },
    });

    revalidatePath("/administracao/catalogo/disciplinas");
    return { sucesso: true, mensagem: "Disciplina adicionada com sucesso!" };
  } catch (erro) {
    console.error("Erro ao criar disciplina:", erro);
    return { sucesso: false, mensagem: "Erro ao registar a disciplina." };
  }
}

/**
 * Ativa ou desativa uma disciplina escolar no catálogo (exclusivo Admin).
 */
export async function acaoAlternarEstadoDisciplina(
  id: string,
  activo: boolean
): Promise<RespostaAcaoCatalogo> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração." };
  }

  try {
    await baseDados.catalogoDisciplina.update({
      where: { id },
      data: { activo },
    });

    revalidatePath("/administracao/catalogo/disciplinas");
    return {
      sucesso: true,
      mensagem: `Disciplina ${activo ? "ativada" : "desativada"} com sucesso.`,
    };
  } catch (erro) {
    console.error("Erro ao alternar estado da disciplina:", erro);
    return { sucesso: false, mensagem: "Não foi possível alterar o estado." };
  }
}
