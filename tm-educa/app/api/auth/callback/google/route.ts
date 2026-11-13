import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { baseDados } from "@/servicos/base-dados";
import { criarTokenSessao } from "@/modulos/autenticacao/sessao";
import { enviarEmailBoasVindas } from "@/servicos/email";

export const dynamic = "force-dynamic";

/**
 * Callback oficial do Google OAuth 2.0.
 * Recebe o código de autorização, obtém o perfil verificado da Google,
 * e inicia sessão ou cadastra automaticamente o utilizador.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const urlBase =
    process.env.NEXTAUTH_URL ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;

  // Se o utilizador cancelou ou houve erro no Google
  if (error || !code) {
    const urlRetorno = new URL("/entrar", urlBase);
    urlRetorno.searchParams.set(
      "erro",
      error === "access_denied" ? "google_cancelado" : "google_falha"
    );
    return NextResponse.redirect(urlRetorno);
  }

  // Descodifica o estado
  let funcaoDesejada: "ENCARREGADO" | "PROFESSOR" = "ENCARREGADO";
  let callbackUrl = "";
  const nonceEsperado = request.cookies.get("tm_google_oauth_nonce")?.value;

  if (state) {
    try {
      const estadoObj = JSON.parse(
        Buffer.from(state, "base64url").toString("utf-8")
      );
      if (
        estadoObj.funcao === "PROFESSOR" ||
        estadoObj.funcao === "ENCARREGADO"
      ) {
        funcaoDesejada = estadoObj.funcao;
      }
      callbackUrl = estadoObj.callbackUrl || "";
      if (nonceEsperado && estadoObj.nonce !== nonceEsperado) {
        console.warn("Aviso de segurança: Nonce OAuth não coincidiu.");
      }
    } catch (e) {
      console.warn("Aviso ao analisar state do Google:", e);
    }
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = `${urlBase}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    const urlRetorno = new URL("/entrar", urlBase);
    urlRetorno.searchParams.set("aviso_google", "credenciais_ausentes");
    return NextResponse.redirect(urlRetorno);
  }

  try {
    // 1. Troca o código de autorização por tokens oficiais da Google
    const respostaToken = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!respostaToken.ok) {
      const detalheErro = await respostaToken.text();
      console.error("Erro ao trocar código por token Google:", detalheErro);
      const urlRetorno = new URL("/entrar", urlBase);
      urlRetorno.searchParams.set("erro", "google_token_invalido");
      return NextResponse.redirect(urlRetorno);
    }

    const dadosToken = await respostaToken.json();
    const accessToken = dadosToken.access_token;

    // 2. Obtém os dados verificados do perfil na Google
    const respostaUserInfo = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!respostaUserInfo.ok) {
      console.error("Erro ao obter perfil de utilizador Google");
      const urlRetorno = new URL("/entrar", urlBase);
      urlRetorno.searchParams.set("erro", "google_perfil_invalido");
      return NextResponse.redirect(urlRetorno);
    }

    const googleUser = await respostaUserInfo.json();
    const emailNormalizado = googleUser.email?.toLowerCase().trim();

    if (!emailNormalizado) {
      const urlRetorno = new URL("/entrar", urlBase);
      urlRetorno.searchParams.set("erro", "google_sem_email");
      return NextResponse.redirect(urlRetorno);
    }

    // 3. Procura na base de dados se o utilizador já existe
    let utilizador = await baseDados.utilizador.findUnique({
      where: { email: emailNormalizado },
    });

    if (utilizador) {
      if (!utilizador.activo) {
        const urlRetorno = new URL("/entrar", urlBase);
        urlRetorno.searchParams.set("erro", "conta_inativa");
        return NextResponse.redirect(urlRetorno);
      }
    } else {
      // 4. Cadastra automaticamente o novo utilizador via Google
      const nomeFinal =
        googleUser.name?.trim() ||
        emailNormalizado.split("@")[0].replace(/[._]/g, " ");

      const salt = await bcrypt.genSalt(10);
      const palavraPasseHash = await bcrypt.hash(
        `google_oauth_${Date.now()}_${Math.random()}`,
        salt
      );

      utilizador = await baseDados.$transaction(async (tx) => {
        const u = await tx.utilizador.create({
          data: {
            nomeCompleto: nomeFinal,
            email: emailNormalizado,
            telefone: "+244 923 000 000",
            palavraPasseHash,
            funcao: funcaoDesejada,
            activo: true,
          },
        });

        if (funcaoDesejada === "ENCARREGADO") {
          await tx.perfilEncarregado.create({
            data: {
              utilizadorId: u.id,
            },
          });
        } else if (funcaoDesejada === "PROFESSOR") {
          await tx.perfilProfessor.create({
            data: {
              utilizadorId: u.id,
              estado: "Pendente",
              fotoUrl: googleUser.picture || null,
            },
          });
        }

        return u;
      });

      // Envia e-mail de boas-vindas
      try {
        await enviarEmailBoasVindas({
          nomeCompleto: utilizador.nomeCompleto,
          email: utilizador.email,
          funcao: utilizador.funcao,
        });
      } catch (eEmail) {
        console.warn("Aviso ao enviar e-mail de boas-vindas (Google):", eEmail);
      }
    }

    // 5. Criação do token de sessão JWT
    const tokenSessao = await criarTokenSessao({
      utilizadorId: utilizador.id,
      email: utilizador.email,
      nomeCompleto: utilizador.nomeCompleto,
      funcao: utilizador.funcao,
    });

    // 6. Determina o destino após login/registo
    let destino = callbackUrl;
    if (
      !destino ||
      destino === "/" ||
      destino.startsWith("/entrar") ||
      destino.startsWith("/registar")
    ) {
      switch (utilizador.funcao) {
        case "ADMINISTRADOR":
          destino = "/administracao";
          break;
        case "PROFESSOR":
          destino = "/portal-professor";
          break;
        case "ENCARREGADO":
        default:
          destino = "/portal-encarregado";
          break;
      }
    }

    const respostaFinal = NextResponse.redirect(new URL(destino, urlBase));

    // Grava o cookie seguro de sessão
    respostaFinal.cookies.set("tm_educa_sessao", tokenSessao, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    // Remove o cookie temporário do nonce
    respostaFinal.cookies.delete("tm_google_oauth_nonce");

    return respostaFinal;
  } catch (erro: any) {
    console.error("Erro ao autenticar com Google:", erro);
    const urlRetorno = new URL("/entrar", urlBase);
    urlRetorno.searchParams.set("erro", "google_processamento");
    return NextResponse.redirect(urlRetorno);
  }
}

