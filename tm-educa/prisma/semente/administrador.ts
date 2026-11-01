import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Configuração do administrador do sistema, lida do ambiente.
 * A palavra-passe nunca é registada no repositório (`.env` está no `.gitignore`).
 */
function lerConfigAdmin() {
  return {
    nome: process.env.ADMIN_NOME,
    email: process.env.ADMIN_EMAIL,
    telefone: process.env.ADMIN_TELEFONE,
    palavraPasse: process.env.ADMIN_PALAVRA_PASSE,
    departamento: process.env.ADMIN_DEPARTAMENTO || "Direção Pedagógica",
  };
}

/**
 * Cria (ou atualiza) a conta de administrador do sistema.
 *
 * Não existe administrador de teste: a conta definida em `ADMIN_EMAIL` é a
 * única conta com a função `ADMINISTRADOR`, e é atualizada em cada execução
 * em vez de duplicada. Idempotente — pode correr várias vezes.
 *
 * @param prisma Cliente do Prisma a utilizar.
 */
export async function semearAdministrador(prisma: PrismaClient) {
  const config = lerConfigAdmin();
  const { nome, email, telefone, palavraPasse, departamento } = config;

  const obrigatorios = {
    ADMIN_NOME: nome,
    ADMIN_EMAIL: email,
    ADMIN_TELEFONE: telefone,
    ADMIN_PALAVRA_PASSE: palavraPasse,
  };

  const emFalta = Object.entries(obrigatorios)
    .filter(([, valor]) => !valor)
    .map(([chave]) => chave);

  if (emFalta.length > 0) {
    throw new Error(
      `Variáveis de ambiente em falta: ${emFalta.join(", ")}.\n` +
        `Defina-as no ficheiro .env antes de semear o administrador.`
    );
  }

  // Mesmo mínimo exigido por `validacoes/autenticacao.esquema.ts`
  if (palavraPasse!.length < 8) {
    throw new Error(
      "ADMIN_PALAVRA_PASSE deve conter pelo menos 8 caracteres."
    );
  }

  const palavraPasseHash = await bcrypt.hash(palavraPasse!, 12);
  const emailNormalizado = email!.trim().toLowerCase();

  return prisma.utilizador.upsert({
    where: { email: emailNormalizado },
    update: {
      nomeCompleto: nome,
      telefone,
      palavraPasseHash,
      funcao: "ADMINISTRADOR",
      activo: true,
    },
    create: {
      nomeCompleto: nome!,
      email: emailNormalizado,
      telefone: telefone!,
      palavraPasseHash,
      funcao: "ADMINISTRADOR",
      perfilAdmin: {
        create: { departamento },
      },
    },
    include: { perfilAdmin: true },
  });
}