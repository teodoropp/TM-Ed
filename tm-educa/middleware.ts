import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const NOME_COOKIE_SESSAO = "tm_educa_sessao";
const SEGREDO_SESSAO = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ||
    "chave_secreta_padrao_tm_educa_angola_2026_minimo_32_bytes_para_assinatura"
);

interface PayloadToken {
  utilizadorId: string;
  email: string;
  nomeCompleto: string;
  funcao: "ADMINISTRADOR" | "ENCARREGADO" | "PROFESSOR";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(NOME_COOKIE_SESSAO)?.value;

  let sessao: PayloadToken | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SEGREDO_SESSAO, {
        algorithms: ["HS256"],
      });
      sessao = payload as unknown as PayloadToken;
    } catch {
      sessao = null;
    }
  }

  const rotasPublicasAutenticacao = ["/entrar", "/registar", "/recuperar-senha"];
  const estaEmRotaAutenticacao = rotasPublicasAutenticacao.some((rota) =>
    pathname.startsWith(rota)
  );

  // Se já está autenticado e tenta aceder ao login/registo, redireciona para o portal respetivo
  if (sessao && estaEmRotaAutenticacao) {
    let destino = "/portal-encarregado";
    if (sessao.funcao === "ADMINISTRADOR") destino = "/administracao";
    if (sessao.funcao === "PROFESSOR") destino = "/portal-professor";
    return NextResponse.redirect(new URL(destino, request.url));
  }

  // Rotas protegidas por RBAC
  const requerAdmin = pathname.startsWith("/administracao");
  const requerEncarregado = pathname.startsWith("/portal-encarregado");
  const requerProfessor = pathname.startsWith("/portal-professor");

  const requerAutenticacao = requerAdmin || requerEncarregado || requerProfessor;

  if (requerAutenticacao) {
    if (!sessao) {
      const urlLogin = new URL("/entrar", request.url);
      urlLogin.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(urlLogin);
    }

    // Validação de Função (RBAC)
    if (requerAdmin && sessao.funcao !== "ADMINISTRADOR") {
      const destinoRedirecionamento =
        sessao.funcao === "PROFESSOR" ? "/portal-professor" : "/portal-encarregado";
      return NextResponse.redirect(new URL(destinoRedirecionamento, request.url));
    }

    if (requerEncarregado && sessao.funcao !== "ENCARREGADO" && sessao.funcao !== "ADMINISTRADOR") {
      return NextResponse.redirect(new URL("/portal-professor", request.url));
    }

    if (requerProfessor && sessao.funcao !== "PROFESSOR" && sessao.funcao !== "ADMINISTRADOR") {
      return NextResponse.redirect(new URL("/portal-encarregado", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/administracao/:path*",
    "/portal-encarregado/:path*",
    "/portal-professor/:path*",
    "/entrar",
    "/registar",
    "/recuperar-senha",
  ],
};
