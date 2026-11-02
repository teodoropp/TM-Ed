import { NextResponse } from "next/server";
import { baseDados } from "@/servicos/base-dados";

export const dynamic = "force-dynamic";

export async function GET() {
  const envDatabaseUrl = process.env.DATABASE_URL;
  const envDirectUrl = process.env.DIRECT_URL;

  // Mascarar senha para exibição segura
  const mascararUrl = (url?: string) => {
    if (!url) return "NÃO DEFINIDA";
    return url.replace(/(:[^:@]+@)/, ":****@");
  };

  const diagnostico: Record<string, unknown> = {
    dataHora: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    variaveisAmbiente: {
      DATABASE_URL_definida: Boolean(envDatabaseUrl),
      DATABASE_URL_valor: mascararUrl(envDatabaseUrl),
      DIRECT_URL_definida: Boolean(envDirectUrl),
      DIRECT_URL_valor: mascararUrl(envDirectUrl),
      NEXTAUTH_SECRET_definida: Boolean(process.env.NEXTAUTH_SECRET),
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NÃO DEFINIDA",
    },
    baseDados: {
      conectada: false,
      totalUtilizadores: 0,
      erro: null,
    },
  };

  try {
    // 1. Testar query simples
    await baseDados.$queryRaw`SELECT 1 as teste`;

    // 2. Contar utilizadores
    const contagem = await baseDados.utilizador.count();

    diagnostico.baseDados = {
      conectada: true,
      totalUtilizadores: contagem,
      erro: null,
    };

    return NextResponse.json(diagnostico, { status: 200 });
  } catch (erro: any) {
    diagnostico.baseDados = {
      conectada: false,
      totalUtilizadores: 0,
      erro: {
        nome: erro?.name || "Desconhecido",
        mensagem: erro?.message || String(erro),
        codigo: erro?.code || null,
      },
    };

    return NextResponse.json(diagnostico, { status: 500 });
  }
}
