import { PrismaClient } from "@prisma/client";

/**
 * Instância global única (singleton) do Prisma Client para evitar exaustão
 * do pool de conexões com o PostgreSQL durante recarregamento em desenvolvimento.
 */
const globalParaPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const baseDados =
  globalParaPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = baseDados;
}
