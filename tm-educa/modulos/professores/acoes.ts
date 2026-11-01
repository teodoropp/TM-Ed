"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import {
  esquemaPerfilProfessor,
  DadosPerfilProfessor,
  DadosDisponibilidadeProfessor,
} from "@/validacoes/professor.esquema";
import { revalidatePath } from "next/cache";
import { EstadoProfessor, DiaSemana } from "@prisma/client";

export interface RespostaAcaoProfessor {
  sucesso: boolean;
  mensagem: string;
}

/**
 * Atualiza o perfil pedagógico e formação do professor.
 */
export async function acaoAtualizarPerfilProfessor(
  dados: DadosPerfilProfessor,
  municipiosAtendimento?: string[],
  disciplinasIds?: string[]
): Promise<RespostaAcaoProfessor> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "PROFESSOR") {
    return { sucesso: false, mensagem: "Acesso não autorizado." };
  }

  const validacao = esquemaPerfilProfessor.safeParse(dados);
  if (!validacao.success) {
    return {
      sucesso: false,
      mensagem: validacao.error.issues?.[0]?.message || "Dados inválidos.",
    };
  }

  try {
    const perfil = await baseDados.perfilProfessor.findUnique({
      where: { utilizadorId: sessao.utilizadorId },
    });

    if (!perfil) {
      return { sucesso: false, mensagem: "Perfil de explicador não encontrado." };
    }

    await baseDados.$transaction(async (tx) => {
      await tx.perfilProfessor.update({
        where: { id: perfil.id },
        data: {
          biografia: validacao.data.biografia?.trim() || null,
          formacaoAcademica: validacao.data.formacaoAcademica.trim(),
          anosExperiencia: validacao.data.anosExperiencia,
          fotoUrl: validacao.data.fotoUrl !== undefined ? validacao.data.fotoUrl?.trim() || null : undefined,
        },
      });

      if (validacao.data.telefone && validacao.data.telefone.trim().length > 0) {
        await tx.utilizador.update({
          where: { id: sessao.utilizadorId },
          data: {
            telefone: validacao.data.telefone.trim(),
          },
        });
      }

      // Se informou municípios, substitui as zonas de atendimento
      if (municipiosAtendimento && municipiosAtendimento.length > 0) {
        await tx.professorZonaAtendimento.deleteMany({
          where: { professorId: perfil.id },
        });

        await tx.professorZonaAtendimento.createMany({
          data: municipiosAtendimento.map((m) => ({
            professorId: perfil.id,
            municipio: m.trim(),
          })),
        });
      }

      // Se informou disciplinas habilitadas, substitui o vínculo curricular
      if (disciplinasIds !== undefined) {
        await tx.professorDisciplina.deleteMany({
          where: { professorId: perfil.id },
        });

        const idsUnicos = Array.from(new Set(disciplinasIds.filter(Boolean)));
        if (idsUnicos.length > 0) {
          await tx.professorDisciplina.createMany({
            data: idsUnicos.map((disciplinaId) => ({
              professorId: perfil.id,
              disciplinaId,
            })),
          });
        }
      }
    });

    revalidatePath("/portal-professor/perfil");
    revalidatePath("/portal-professor/perfil-profissional");
    revalidatePath("/portal-professor");

    return {
      sucesso: true,
      mensagem: "Perfil profissional atualizado com sucesso!",
    };
  } catch (erro) {
    console.error("Erro ao atualizar perfil de explicador:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao guardar as alterações.",
    };
  }
}

/**
 * Atualiza a grelha semanal de disponibilidade horária do professor.
 */
export async function acaoAtualizarDisponibilidadeProfessor(
  blocos: DadosDisponibilidadeProfessor[]
): Promise<RespostaAcaoProfessor> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "PROFESSOR") {
    return { sucesso: false, mensagem: "Acesso não autorizado." };
  }

  try {
    const perfil = await baseDados.perfilProfessor.findUnique({
      where: { utilizadorId: sessao.utilizadorId },
    });

    if (!perfil) {
      return { sucesso: false, mensagem: "Perfil de explicador não encontrado." };
    }

    await baseDados.$transaction(async (tx) => {
      await tx.professorDisponibilidade.deleteMany({
        where: { professorId: perfil.id },
      });

      if (blocos.length > 0) {
        await tx.professorDisponibilidade.createMany({
          data: blocos.map((b) => ({
            professorId: perfil.id,
            diaSemana: b.diaSemana as unknown as DiaSemana,
            horaInicio: b.horaInicio,
            horaFim: b.horaFim,
            activo: b.activo,
          })),
        });
      }
    });

    revalidatePath("/portal-professor/disponibilidade");
    revalidatePath("/portal-professor");

    return {
      sucesso: true,
      mensagem: "Grelha semanal de disponibilidade guardada com sucesso!",
    };
  } catch (erro) {
    console.error("Erro ao guardar disponibilidade:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao atualizar os seus horários.",
    };
  }
}

/**
 * Ação da Administração para aprovação e alteração de estado do explicador.
 */
export async function acaoAlterarEstadoProfessorAdmin(
  professorId: string,
  novoEstado: EstadoProfessor
): Promise<RespostaAcaoProfessor> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração." };
  }

  try {
    await baseDados.perfilProfessor.update({
      where: { id: professorId },
      data: { estado: novoEstado },
    });

    revalidatePath("/administracao/utilizadores/professores");

    return {
      sucesso: true,
      mensagem: `Estado do professor atualizado para "${novoEstado}" com sucesso.`,
    };
  } catch (erro) {
    console.error("Erro ao alterar estado do professor:", erro);
    return {
      sucesso: false,
      mensagem: "Não foi possível alterar o estado do professor.",
    };
  }
}
