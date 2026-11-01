import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import { FuncaoUtilizador } from "@/tipos";

export const NOME_COOKIE_SESSAO = "tm_educa_sessao";
const CHAVE_SECRETA_TEXTO =
  process.env.NEXTAUTH_SECRET ||
  "chave_secreta_padrao_tm_educa_angola_2026_minimo_32_bytes_para_assinatura";
const SEGREDO_SESSAO = new TextEncoder().encode(CHAVE_SECRETA_TEXTO);

export interface PayloadSessao {
  utilizadorId: string;
  email: string;
  nomeCompleto: string;
  funcao: FuncaoUtilizador;
}

/**
 * Cria e assina digitalmente um token JWT seguro de sessão.
 */
export async function criarTokenSessao(
  payload: PayloadSessao,
  duracaoHoras: number = 24 * 7 // 7 dias
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${duracaoHoras}h`)
    .sign(SEGREDO_SESSAO);
}

/**
 * Valida a integridade e expiração do token de sessão.
 */
export async function verificarTokenSessao(
  token: string
): Promise<PayloadSessao | null> {
  try {
    const { payload } = await jwtVerify(token, SEGREDO_SESSAO, {
      algorithms: ["HS256"],
    });
    return payload as unknown as PayloadSessao;
  } catch {
    return null;
  }
}

/**
 * Guarda o token de sessão num cookie HTTP-Only seguro.
 */
export async function definirCookieSessao(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(NOME_COOKIE_SESSAO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias em segundos
  });
}

/**
 * Obtém a sessão ativa a partir dos cookies do pedido.
 */
export async function obterSessao(): Promise<PayloadSessao | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NOME_COOKIE_SESSAO)?.value;
  if (!token) return null;
  return await verificarTokenSessao(token);
}

/**
 * Destrói o cookie de sessão para efetuar o logout do utilizador.
 */
export async function destruirSessao() {
  const cookieStore = await cookies();
  cookieStore.delete(NOME_COOKIE_SESSAO);
  cookieStore.set(NOME_COOKIE_SESSAO, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

const JANELA_CODIGO_MS = 15 * 60 * 1000; // 15 minutos por janela (válido até 45 min)

function calcularCodigo6Digitos(
  utilizadorId: string,
  email: string,
  palavraPasseHash: string,
  indiceJanela: number
): string {
  const hmac = crypto
    .createHmac("sha256", CHAVE_SECRETA_TEXTO)
    .update(`${utilizadorId}:${email.toLowerCase()}:${palavraPasseHash}:${indiceJanela}`)
    .digest("hex");
  const numero = parseInt(hmac.slice(0, 8), 16) % 900000;
  return String(100000 + numero);
}

/**
 * Gera um código de verificação de 6 dígitos e um token JWT de uso único (30 min)
 * vinculados ao hash atual da palavra-passe (invalida-se automaticamente após redefinição).
 */
export async function gerarDadosRecuperacaoSenha(dados: {
  utilizadorId: string;
  email: string;
  palavraPasseHash: string;
}): Promise<{ codigo: string; token: string }> {
  const janelaAtual = Math.floor(Date.now() / JANELA_CODIGO_MS);
  const codigo = calcularCodigo6Digitos(
    dados.utilizadorId,
    dados.email,
    dados.palavraPasseHash,
    janelaAtual
  );

  const token = await new SignJWT({
    finalidade: "RECUPERACAO_SENHA",
    utilizadorId: dados.utilizadorId,
    email: dados.email.toLowerCase(),
    fp: dados.palavraPasseHash.slice(-12),
    codigo,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(SEGREDO_SESSAO);

  return { codigo, token };
}

/**
 * Valida se o código de 6 dígitos ou o token JWT de recuperação é autêntico,
 * não expirou e ainda não foi utilizado.
 */
export async function verificarDadosRecuperacaoSenha(dados: {
  utilizadorId: string;
  email: string;
  palavraPasseHashAtual: string;
  codigoOuToken: string;
}): Promise<boolean> {
  const valor = dados.codigoOuToken.trim();

  // 1. Se for código numérico de 6 dígitos
  if (/^\d{6}$/.test(valor)) {
    const janelaAtual = Math.floor(Date.now() / JANELA_CODIGO_MS);
    for (const desvio of [0, -1, -2]) {
      const esperado = calcularCodigo6Digitos(
        dados.utilizadorId,
        dados.email,
        dados.palavraPasseHashAtual,
        janelaAtual + desvio
      );
      if (esperado === valor) {
        return true;
      }
    }
    return false;
  }

  // 2. Se for token JWT do link de recuperação
  try {
    const { payload } = await jwtVerify(valor, SEGREDO_SESSAO, {
      algorithms: ["HS256"],
    });
    return (
      payload.finalidade === "RECUPERACAO_SENHA" &&
      payload.utilizadorId === dados.utilizadorId &&
      payload.email === dados.email.toLowerCase() &&
      payload.fp === dados.palavraPasseHashAtual.slice(-12)
    );
  } catch {
    return false;
  }
}
