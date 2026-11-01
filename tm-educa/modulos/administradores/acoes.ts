"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";

export interface RespostaAcaoAdmin {
  sucesso: boolean;
  mensagem: string;
  /** Caminho público da fotografia, quando aplicável. */
  url?: string | null;
}

/** Formatos de imagem aceites para a fotografia de perfil. */
const TIPOS_ACEITES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

/** Tamanho máximo aceite para a fotografia (2 MB). */
const TAMANHO_MAXIMO_BYTES = 2 * 1024 * 1024;

const esquemaPerfilAdmin = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, "O nome completo deve ter pelo menos 3 caracteres.")
    .max(120, "O nome completo é demasiado longo."),
  telefone: z
    .string()
    .trim()
    .min(9, "Indique um número de telefone válido.")
    .max(20, "O número de telefone é demasiado longo."),
  departamento: z.string().trim().max(120).optional(),
  cargo: z.string().trim().max(120).optional(),
});

/**
 * Garante que existe um perfil administrativo para a sessão ativa.
 * Cria-o em caso de ausência, para que a edição de perfil funcione mesmo
 * em contas semeadas antes da existência do perfil.
 */
async function garantirPerfilAdmin(utilizadorId: string) {
  const existente = await baseDados.perfilAdministrador.findUnique({
    where: { utilizadorId },
  });

  if (existente) return existente;

  return await baseDados.perfilAdministrador.create({
    data: { utilizadorId },
  });
}

/**
 * Atualiza os dados de perfil do administrador autenticado.
 */
export async function acaoAtualizarPerfilAdmin(
  dados: z.input<typeof esquemaPerfilAdmin>
): Promise<RespostaAcaoAdmin> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso não autorizado." };
  }

  const validacao = esquemaPerfilAdmin.safeParse(dados);
  if (!validacao.success) {
    return {
      sucesso: false,
      mensagem:
        validacao.error.issues?.[0]?.message || "Dados de perfil inválidos.",
    };
  }

  try {
    await garantirPerfilAdmin(sessao.utilizadorId);

    await baseDados.$transaction(async (tx) => {
      await tx.utilizador.update({
        where: { id: sessao.utilizadorId },
        data: {
          nomeCompleto: validacao.data.nomeCompleto,
          telefone: validacao.data.telefone,
        },
      });

      await tx.perfilAdministrador.update({
        where: { utilizadorId: sessao.utilizadorId },
        data: {
          departamento: validacao.data.departamento?.trim() || null,
          cargo: validacao.data.cargo?.trim() || null,
        },
      });
    });

    revalidatePath("/administracao", "layout");

    return { sucesso: true, mensagem: "Perfil do administrador atualizado." };
  } catch (erro) {
    console.error("Erro ao atualizar o perfil do administrador:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao guardar o perfil. Tente novamente.",
    };
  }
}

/**
 * Recebe a fotografia do administrador, guarda-a em `public/uploads/admin`
 * e associa o caminho público ao perfil.
 */
export async function acaoCarregarFotoAdmin(
  ficheiro: File
): Promise<RespostaAcaoAdmin> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso não autorizado." };
  }

  const extensao = TIPOS_ACEITES[ficheiro.type];
  if (!extensao) {
    return {
      sucesso: false,
      mensagem: "Formato não suportado. Use PNG, JPG ou WEBP.",
    };
  }

  if (ficheiro.size === 0) {
    return { sucesso: false, mensagem: "O ficheiro selecionado está vazio." };
  }

  if (ficheiro.size > TAMANHO_MAXIMO_BYTES) {
    return {
      sucesso: false,
      mensagem: "A fotografia excede o limite de 2 MB.",
    };
  }

  try {
    const pasta = path.join(process.cwd(), "public", "uploads", "admin");
    await fs.mkdir(pasta, { recursive: true });

    const nomeFicheiro = `${sessao.utilizadorId}-${Date.now()}.${extensao}`;
    const destino = path.join(pasta, nomeFicheiro);

    const conteudo = Buffer.from(await ficheiro.arrayBuffer());
    await fs.writeFile(destino, conteudo);

    const urlPublico = `/uploads/admin/${nomeFicheiro}`;

    await garantirPerfilAdmin(sessao.utilizadorId);
    await baseDados.perfilAdministrador.update({
      where: { utilizadorId: sessao.utilizadorId },
      data: { fotoUrl: urlPublico },
    });

    revalidatePath("/administracao", "layout");

    return { sucesso: true, mensagem: "Fotografia actualizada.", url: urlPublico };
  } catch (erro) {
    console.error("Erro ao carregar a fotografia do administrador:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao guardar a fotografia. Tente novamente.",
    };
  }
}

/**
 * Remove a fotografia associada ao perfil do administrador.
 */
export async function acaoRemoverFotoAdmin(): Promise<RespostaAcaoAdmin> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso não autorizado." };
  }

  try {
    const perfil = await baseDados.perfilAdministrador.findUnique({
      where: { utilizadorId: sessao.utilizadorId },
      select: { fotoUrl: true },
    });

    if (perfil?.fotoUrl?.startsWith("/uploads/admin/")) {
      const caminho = path.join(
        process.cwd(),
        "public",
        perfil.fotoUrl.replace(/^\//, "").replace(/\//g, path.sep)
      );
      await fs.unlink(caminho).catch(() => undefined);
    }

    await baseDados.perfilAdministrador.update({
      where: { utilizadorId: sessao.utilizadorId },
      data: { fotoUrl: null },
    });

    revalidatePath("/administracao", "layout");

    return { sucesso: true, mensagem: "Fotografia removida." };
  } catch (erro) {
    console.error("Erro ao remover a fotografia do administrador:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao remover a fotografia.",
    };
  }
}
