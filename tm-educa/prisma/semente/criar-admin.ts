import { PrismaClient } from "@prisma/client";
import { semearAdministrador } from "./administrador";

const prisma = new PrismaClient();

/**
 * Atalho de linha de comandos para criar ou atualizar a conta de
 * administrador do sistema. A lógica partilhada está em `administrador.ts`.
 *
 * Execução: node --experimental-strip-types --env-file=.env prisma/semente/criar-admin.ts
 */
async function criarAdministrador() {
  const administrador = await semearAdministrador(prisma);

  console.log("✓ Administrador do sistema pronto:");
  console.log(`  Nome:         ${administrador.nomeCompleto}`);
  console.log(`  Email:        ${administrador.email}`);
  console.log(`  Telefone:     ${administrador.telefone}`);
  console.log(`  Função:       ${administrador.funcao}`);
  console.log(`  Departamento: ${administrador.perfilAdmin?.departamento ?? "—"}`);
  console.log(`  ID:           ${administrador.id}`);
  console.log("\nA palavra-passe não é apresentada por segurança.");
}

criarAdministrador()
  .catch((erro) => {
    console.error("Erro ao criar o administrador:", erro.message ?? erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });