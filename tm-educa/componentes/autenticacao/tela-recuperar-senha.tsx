"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  acaoSolicitarRecuperacaoSenha,
  acaoRedefinirPalavraPasse,
} from "@/modulos/autenticacao/acoes";
import { LogoTMEduca } from "@/componentes/ui/logo-tmeduca";
import {
  Eye,
  EyeOff,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

type EtapaRecuperacao = "SOLICITAR" | "REDEFINIR" | "CONCLUIDO";

export function TelaRecuperarSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailUrl = searchParams.get("email") || "";
  const codigoUrl = searchParams.get("codigo") || "";
  const tokenUrl = searchParams.get("token") || "";

  const [etapa, setEtapa] = React.useState<EtapaRecuperacao>(() =>
    emailUrl && (codigoUrl || tokenUrl) ? "REDEFINIR" : "SOLICITAR"
  );

  const [email, setEmail] = React.useState(emailUrl);
  const [codigoVerificacao, setCodigoVerificacao] = React.useState(codigoUrl);
  const [tokenLink, setTokenLink] = React.useState(tokenUrl);
  const [novaPalavraPasse, setNovaPalavraPasse] = React.useState("");
  const [confirmarPalavraPasse, setConfirmarPalavraPasse] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const [carregando, setCarregando] = React.useState(false);
  const [mensagemErro, setMensagemErro] = React.useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = React.useState<string | null>(
    null
  );
  const [codigoDemo, setCodigoDemo] = React.useState<string | null>(null);

  async function manipularSolicitacao(e: React.FormEvent) {
    e.preventDefault();
    setMensagemErro(null);
    setMensagemSucesso(null);
    setCarregando(true);

    try {
      const resultado = await acaoSolicitarRecuperacaoSenha(email);
      setCarregando(false);

      if (!resultado.sucesso) {
        setMensagemErro(resultado.mensagem);
        return;
      }

      setMensagemSucesso(resultado.mensagem);
      if (resultado.codigoDemonstracao) {
        setCodigoDemo(resultado.codigoDemonstracao);
      }
      setEtapa("REDEFINIR");
    } catch {
      setCarregando(false);
      setMensagemErro(
        "Ocorreu um erro de ligação. Verifique a sua rede e tente novamente."
      );
    }
  }

  async function manipularRedefinicao(e: React.FormEvent) {
    e.preventDefault();
    setMensagemErro(null);

    if (novaPalavraPasse !== confirmarPalavraPasse) {
      setMensagemErro("As palavras-passe introduzidas não coincidem.");
      return;
    }

    if (novaPalavraPasse.length < 8) {
      setMensagemErro("A nova palavra-passe deve conter pelo menos 8 caracteres.");
      return;
    }

    const codigoOuTokenFinal = codigoVerificacao.trim() || tokenLink.trim();
    if (!codigoOuTokenFinal) {
      setMensagemErro("Introduza o código de verificação de 6 dígitos enviado para o seu e-mail.");
      return;
    }

    setCarregando(true);

    try {
      const resultado = await acaoRedefinirPalavraPasse({
        email,
        codigoOuToken: codigoOuTokenFinal,
        novaPalavraPasse,
      });

      setCarregando(false);

      if (!resultado.sucesso) {
        setMensagemErro(resultado.mensagem);
        return;
      }

      setMensagemSucesso(resultado.mensagem);
      setEtapa("CONCLUIDO");
    } catch {
      setCarregando(false);
      setMensagemErro(
        "Ocorreu um erro ao atualizar a sua palavra-passe. Tente novamente."
      );
    }
  }

  async function reenviarCodigo() {
    setMensagemErro(null);
    setMensagemSucesso(null);
    setCarregando(true);

    try {
      const resultado = await acaoSolicitarRecuperacaoSenha(email);
      setCarregando(false);
      if (resultado.sucesso) {
        setMensagemSucesso("Novo código enviado com sucesso para o seu e-mail.");
        if (resultado.codigoDemonstracao) {
          setCodigoDemo(resultado.codigoDemonstracao);
        }
      } else {
        setMensagemErro(resultado.mensagem);
      }
    } catch {
      setCarregando(false);
      setMensagemErro("Não foi possível reenviar o código neste momento.");
    }
  }

  return (
    <div
      className="relative min-h-[100dvh] w-full bg-[#F8FAFC] flex items-center justify-center p-3 sm:p-5 font-normal selection:bg-[#FF2D75] selection:text-white lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden lg:p-6"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      {/* LUZES AMBIENTAIS SUAVES NO FUNDO */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-[10px] bg-slate-200/50 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-[10px] bg-[#FF2D75]/5 blur-[150px] pointer-events-none" />

      {/* CARD PRINCIPAL FLUTUANTE EM AZUL ESCURO INSTITUCIONAL */}
      <div className="relative w-full max-w-[960px] bg-[#0A192F] rounded-[10px] shadow-2xl shadow-[#0A192F]/20 border border-slate-800/80 overflow-hidden flex flex-col lg:h-[calc(100dvh-3rem)] lg:max-h-[720px]">
        {/* BOTÃO FECHAR (MOBILE) */}
        <Link
          href="/entrar"
          aria-label="Voltar ao login"
          className="lg:hidden absolute top-4 right-4 z-30 h-9 w-9 rounded-[10px] bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm"
        >
          <X className="h-4 w-4" />
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:flex-1 lg:min-h-0">
          {/* COLUNA ESQUERDA: FLUXO DE RECUPERAÇÃO DE SENHA */}
          <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between bg-[#0A192F] text-white lg:overflow-y-auto sem-barra">
            <div className="shrink-0">
              {/* CABEÇALHO COM LOGO */}
              <div className="flex items-center justify-between mb-5">
                <Link
                  href="/"
                  className="group flex items-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <LogoTMEduca
                    tamanho="sm"
                    variante="horizontal"
                    corTexto="claro"
                  />
                </Link>
              </div>

              {/* INDICADOR DE ETAPAS */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    etapa === "SOLICITAR" ||
                    etapa === "REDEFINIR" ||
                    etapa === "CONCLUIDO"
                      ? "bg-[#FF2D75]"
                      : "bg-slate-800"
                  }`}
                />
                <span
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    etapa === "REDEFINIR" || etapa === "CONCLUIDO"
                      ? "bg-[#FF2D75]"
                      : "bg-slate-800"
                  }`}
                />
                <span
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    etapa === "CONCLUIDO" ? "bg-emerald-500" : "bg-slate-800"
                  }`}
                />
              </div>

              {/* ETAPA 1: SOLICITAR CÓDIGO POR E-MAIL */}
              {etapa === "SOLICITAR" && (
                <>
                  <div className="space-y-1.5 mb-5">
                    <h1 className="text-2xl sm:text-[26px] font-normal text-white tracking-normal">
                      Recuperar Palavra-passe
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
                      Introduza o correio eletrónico associado à sua conta TM-Educa. Enviaremos um código de 6 dígitos e um link seguro para criar uma nova senha.
                    </p>
                  </div>

                  {mensagemErro && (
                    <div className="mb-4 flex items-center gap-2.5 rounded-[10px] border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-200 shadow-sm">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      <p>{mensagemErro}</p>
                    </div>
                  )}

                  <form onSubmit={manipularSolicitacao} className="space-y-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="emailRecuperacao"
                        className="block text-xs font-normal text-slate-300"
                      >
                        Correio Eletrónico da Conta
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          id="emailRecuperacao"
                          type="email"
                          placeholder="exemplo@tmeduca.ao"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={carregando}
                          className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-[#102A45]/70 hover:bg-[#102A45] focus:bg-[#102A45] text-sm text-white placeholder-slate-400 border border-slate-700/80 focus:border-[#FF2D75] focus:outline-none focus:ring-2 focus:ring-[#FF2D75]/30 transition-all font-normal"
                        />
                      </div>
                    </div>

                    <div className="rounded-[10px] bg-[#102A45]/40 border border-slate-800 p-3 space-y-1.5 text-[11px] text-slate-300">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#FF2D75] shrink-0" />
                        <span>Código de verificação válido por 30 minutos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#FF2D75] shrink-0" />
                        <span>Proteção encriptada de uso único</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={carregando}
                      className="w-full h-11 rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] active:scale-[0.99] text-white font-normal text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-black/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {carregando ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>A enviar código...</span>
                        </>
                      ) : (
                        <span>ENVIAR CÓDIGO DE RECUPERAÇÃO</span>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* ETAPA 2: INTRODUZIR CÓDIGO E DEFINIR NOVA PALAVRA-PASSE */}
              {etapa === "REDEFINIR" && (
                <>
                  <div className="space-y-1 mb-4">
                    <h1 className="text-2xl sm:text-[26px] font-normal text-white tracking-normal">
                      Definir Nova Senha
                    </h1>
                    <p className="text-xs text-slate-400 font-normal">
                      Enviámos o código de segurança para{" "}
                      <span className="text-white">{email}</span>
                    </p>
                  </div>

                  {mensagemSucesso && (
                    <div className="mb-3 flex items-start gap-2 rounded-[10px] border border-emerald-500/40 bg-emerald-950/50 p-3 text-xs text-emerald-200">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <div className="space-y-1">
                        <p>{mensagemSucesso}</p>
                        {codigoDemo && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setCodigoVerificacao(codigoDemo)}
                              className="inline-flex items-center gap-1.5 rounded-[6px] bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-[11px] text-emerald-100 hover:bg-emerald-500/30 cursor-pointer"
                            >
                              <KeyRound className="h-3 w-3" />
                              <span>
                                Código gerado: <strong>{codigoDemo}</strong> (clique para preencher)
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {mensagemErro && (
                    <div className="mb-3 flex items-center gap-2.5 rounded-[10px] border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-200">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      <p>{mensagemErro}</p>
                    </div>
                  )}

                  <form onSubmit={manipularRedefinicao} className="space-y-3">
                    {/* CAMPO: CÓDIGO DE 6 DÍGITOS */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="codigoVerificacao"
                          className="block text-xs font-normal text-slate-300"
                        >
                          Código de Verificação (6 dígitos)
                        </label>
                        <button
                          type="button"
                          onClick={reenviarCodigo}
                          disabled={carregando}
                          className="inline-flex items-center gap-1 text-[11px] text-[#FF2D75] hover:text-[#fb7185] hover:underline cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Reenviar código</span>
                        </button>
                      </div>
                      <input
                        id="codigoVerificacao"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={codigoVerificacao}
                        onChange={(e) =>
                          setCodigoVerificacao(
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        required={!tokenLink}
                        disabled={carregando}
                        className="w-full h-11 px-4 rounded-[10px] bg-[#102A45]/80 text-center tracking-[0.4em] text-base text-white placeholder-slate-500 border border-slate-700/80 focus:border-[#FF2D75] focus:outline-none focus:ring-2 focus:ring-[#FF2D75]/30 transition-all font-normal"
                      />
                    </div>

                    {/* CAMPO: NOVA PALAVRA-PASSE */}
                    <div className="space-y-1">
                      <label
                        htmlFor="novaPalavraPasse"
                        className="block text-xs font-normal text-slate-300"
                      >
                        Nova Palavra-passe
                      </label>
                      <div className="relative">
                        <input
                          id="novaPalavraPasse"
                          type={mostrarSenha ? "text" : "password"}
                          placeholder="Mínimo de 8 caracteres"
                          value={novaPalavraPasse}
                          onChange={(e) => setNovaPalavraPasse(e.target.value)}
                          required
                          disabled={carregando}
                          className="w-full h-10 pl-4 pr-10 rounded-[10px] bg-[#102A45]/70 text-sm text-white placeholder-slate-400 border border-slate-700/80 focus:border-[#FF2D75] focus:outline-none focus:ring-2 focus:ring-[#FF2D75]/30 transition-all font-normal"
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                          tabIndex={-1}
                        >
                          {mostrarSenha ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* CAMPO: CONFIRMAR NOVA PALAVRA-PASSE */}
                    <div className="space-y-1">
                      <label
                        htmlFor="confirmarNovaPalavraPasse"
                        className="block text-xs font-normal text-slate-300"
                      >
                        Confirmar Nova Palavra-passe
                      </label>
                      <input
                        id="confirmarNovaPalavraPasse"
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="Repita a nova palavra-passe"
                        value={confirmarPalavraPasse}
                        onChange={(e) =>
                          setConfirmarPalavraPasse(e.target.value)
                        }
                        required
                        disabled={carregando}
                        className="w-full h-10 px-4 rounded-[10px] bg-[#102A45]/70 text-sm text-white placeholder-slate-400 border border-slate-700/80 focus:border-[#FF2D75] focus:outline-none focus:ring-2 focus:ring-[#FF2D75]/30 transition-all font-normal"
                      />
                    </div>

                    <div className="pt-1 flex flex-col gap-2">
                      <button
                        type="submit"
                        disabled={carregando}
                        className="w-full h-11 rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] active:scale-[0.99] text-white font-normal text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-black/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                      >
                        {carregando ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>A atualizar palavra-passe...</span>
                          </>
                        ) : (
                          <span>GUARDAR NOVA PALAVRA-PASSE</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEtapa("SOLICITAR");
                          setMensagemErro(null);
                          setMensagemSucesso(null);
                        }}
                        className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Alterar endereço de correio eletrónico
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* ETAPA 3: CONCLUÍDO COM SUCESSO */}
              {etapa === "CONCLUIDO" && (
                <div className="py-6 text-center space-y-4">
                  <div className="mx-auto h-14 w-14 rounded-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-normal text-white">
                      Palavra-passe Atualizada!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      A sua nova palavra-passe foi gravada com sucesso. Já pode aceder normalmente ao seu portal na TM-Educa.
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => router.push("/entrar?recuperada=1")}
                      className="w-full h-11 rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] text-white font-normal text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-black/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>INICIAR SESSÃO AGORA</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RODAPÉ DE NAVEGAÇÃO */}
            <div className="mt-6 pt-3 border-t border-slate-800 shrink-0 flex items-center justify-between text-xs text-slate-400">
              <Link
                href="/entrar"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#FF2D75] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Voltar para Iniciar Sessão</span>
              </Link>

              <Link
                href="/registar"
                className="text-[#FF2D75] hover:text-[#fb7185] hover:underline"
              >
                Criar Conta
              </Link>
            </div>
          </div>

          {/* COLUNA DIREITA: IMAGEM INSTITUCIONAL */}
          <div className="hidden lg:flex lg:col-span-7 p-4 bg-[#0A192F] min-h-0">
            <div className="relative w-full h-full min-h-0 rounded-[10px] overflow-hidden shadow-xl border border-slate-800/80 bg-[#0A192F]">
              <Image
                src="/imagens/login-hero.jpg"
                alt="Segurança e acompanhamento pedagógico TM-Educa"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/20 to-black/20 pointer-events-none" />

              <Link
                href="/entrar"
                aria-label="Voltar ao login"
                className="absolute top-4 right-4 z-20 h-9 w-9 rounded-[10px] bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <X className="h-4 w-4" />
              </Link>

              <div className="absolute inset-x-6 bottom-6 z-20">
                <div className="bg-[#0A192F]/85 backdrop-blur-xl border border-white/15 rounded-[10px] p-4 text-white shadow-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[#FF2D75]">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="uppercase tracking-wider">
                      Proteção de Conta TM-Educa
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Os seus dados académicos, contratos e histórico pedagógico estão protegidos com encriptação de ponta a ponta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

