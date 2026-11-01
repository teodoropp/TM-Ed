"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import { esquemaAluno, DadosAluno } from "@/validacoes/aluno.esquema";
import { revalidatePath } from "next/cache";

export interface RespostaAcaoAluno {
  sucesso: boolean;
  mensagem: string;
  alunoId?: string;
}

/**
 * Cria um novo aluno associado ao encarregado autenticado.
 */
export async function acaoCriarAluno(
  dados: DadosAluno
): Promise<RespostaAcaoAluno> {
  const sessao = await obterSessao();
  if (!sessao || (sessao.funcao !== "ENCARREGADO" && sessao.funcao !== "ADMINISTRADOR")) {
    return {
      sucesso: false,
      mensagem: "Não tem permissão para registar alunos.",
    };
  }

  const validacao = esquemaAluno.safeParse(dados);
  if (!validacao.success) {
    return {
      sucesso: false,
      mensagem: validacao.error.issues?.[0]?.message || "Dados do aluno inválidos.",
    };
  }

  const perfil = await baseDados.perfilEncarregado.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
  });

  if (!perfil) {
    return {
      sucesso: false,
      mensagem: "Perfil de pai não encontrado.",
    };
  }

  try {
    const dataNascimentoParsed = validacao.data.dataNascimento
      ? new Date(validacao.data.dataNascimento)
      : null;

    const aluno = await baseDados.aluno.create({
      data: {
        encarregadoId: perfil.id,
        nomeCompleto: validacao.data.nomeCompleto.trim(),
        dataNascimento: dataNascimentoParsed,
        sexo: validacao.data.sexo,
        anoEscolar: validacao.data.anoEscolar,
        sistemaEnsino: validacao.data.sistemaEnsino,
        escola: validacao.data.escola?.trim() || null,
        dificuldades: validacao.data.dificuldades?.trim() || null,
        objectivos: validacao.data.objectivos?.trim() || null,
        observacoes: validacao.data.observacoes?.trim() || null,
      },
    });

    revalidatePath("/portal-encarregado/alunos");
    revalidatePath("/portal-encarregado");

    return {
      sucesso: true,
      mensagem: "Filho registado com sucesso!",
      alunoId: aluno.id,
    };
  } catch (erro) {
    console.error("Erro ao criar aluno:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao guardar os dados do aluno. Tente novamente.",
    };
  }
}

/**
 * Atualiza os dados pedagógicos de um aluno com validação tutelar.
 */
export async function acaoAtualizarAluno(
  id: string,
  dados: DadosAluno
): Promise<RespostaAcaoAluno> {
  const sessao = await obterSessao();
  if (!sessao) {
    return { sucesso: false, mensagem: "Sessão expirada." };
  }

  const alunoExistente = await baseDados.aluno.findUnique({
    where: { id },
    include: { encarregado: true },
  });

  if (!alunoExistente || !alunoExistente.activo) {
    return { sucesso: false, mensagem: "Aluno não encontrado." };
  }

  if (
    sessao.funcao !== "ADMINISTRADOR" &&
    alunoExistente.encarregado.utilizadorId !== sessao.utilizadorId
  ) {
    return {
      sucesso: false,
      mensagem: "Não tem permissão para editar este aluno.",
    };
  }

  const validacao = esquemaAluno.safeParse(dados);
  if (!validacao.success) {
    return {
      sucesso: false,
      mensagem: validacao.error.issues?.[0]?.message || "Dados inválidos.",
    };
  }

  try {
    const dataNascimentoParsed = validacao.data.dataNascimento
      ? new Date(validacao.data.dataNascimento)
      : null;

    await baseDados.aluno.update({
      where: { id },
      data: {
        nomeCompleto: validacao.data.nomeCompleto.trim(),
        dataNascimento: dataNascimentoParsed,
        sexo: validacao.data.sexo,
        anoEscolar: validacao.data.anoEscolar,
        sistemaEnsino: validacao.data.sistemaEnsino,
        escola: validacao.data.escola?.trim() || null,
        dificuldades: validacao.data.dificuldades?.trim() || null,
        objectivos: validacao.data.objectivos?.trim() || null,
        observacoes: validacao.data.observacoes?.trim() || null,
      },
    });

    revalidatePath(`/portal-encarregado/alunos/${id}`);
    revalidatePath("/portal-encarregado/alunos");

    return {
      sucesso: true,
      mensagem: "Dados do aluno atualizados com sucesso!",
    };
  } catch (erro) {
    console.error("Erro ao atualizar aluno:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao atualizar os dados.",
    };
  }
}

/**
 * Remove logicamente um aluno tutelado (Soft Delete).
 */
export async function acaoRemoverAluno(id: string): Promise<RespostaAcaoAluno> {
  const sessao = await obterSessao();
  if (!sessao) {
    return { sucesso: false, mensagem: "Sessão expirada." };
  }

  const alunoExistente = await baseDados.aluno.findUnique({
    where: { id },
    include: { encarregado: true },
  });

  if (!alunoExistente) {
    return { sucesso: false, mensagem: "Aluno não encontrado." };
  }

  if (
    sessao.funcao !== "ADMINISTRADOR" &&
    alunoExistente.encarregado.utilizadorId !== sessao.utilizadorId
  ) {
    return { sucesso: false, mensagem: "Acesso negado." };
  }

  try {
    await baseDados.aluno.update({
      where: { id },
      data: { activo: false },
    });

    revalidatePath("/portal-encarregado/alunos");
    revalidatePath("/portal-encarregado");

    return {
      sucesso: true,
      mensagem: "Aluno removido com sucesso.",
    };
  } catch (erro) {
    console.error("Erro ao remover aluno:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao remover o registo.",
    };
  }
}
