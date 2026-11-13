import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * Endpoint de início de fluxo de autenticação e registo Google OAuth 2.0.
 * Redireciona o utilizador para a página de consentimento e seleção de conta da Google.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const funcao = searchParams.get("funcao") || "ENCARREGADO";
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const modo = searchParams.get("modo") || "entrar";

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  const urlBase =
    process.env.NEXTAUTH_URL ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;

  // Se as variáveis GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não estiverem definidas no .env
  if (!clientId || !clientSecret) {
    const urlRetorno = new URL(modo === "registar" ? "/registar" : "/entrar", urlBase);
    urlRetorno.searchParams.set("aviso_google", "credenciais_ausentes");
    if (callbackUrl) urlRetorno.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(urlRetorno);
  }

  // Gera um nonce criptográfico para segurança contra ataques CSRF
  const nonce = crypto.randomBytes(16).toString("hex");

  // Guarda o estado com função pretendida e URL de retorno
  const estadoObj = {
    nonce,
    funcao,
    callbackUrl,
    modo,
  };
  const state = Buffer.from(JSON.stringify(estadoObj)).toString("base64url");

  const redirectUri = `${urlBase}/api/auth/callback/google`;

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  const resposta = NextResponse.redirect(googleAuthUrl);

  // Guarda o nonce num cookie HTTP-Only para validação cruzada no retorno
  resposta.cookies.set("tm_google_oauth_nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 minutos
  });

  return resposta;
}

