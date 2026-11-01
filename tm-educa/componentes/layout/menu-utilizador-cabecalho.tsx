"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, UserCheck, Loader2 } from "lucide-react";
import { useCabecalho } from "./cabecalho-animado";
import { PayloadSessao } from "@/modulos/autenticacao/sessao";
import { acaoEncerrarSessaoCliente } from "@/modulos/autenticacao/acoes";

interface PropsMenuUtilizadorCabecalho {
  sessao: PayloadSessao | null;
  linkPortal: string;
  etiquetaPortal: string;
}

/**
 * Botão de Utilizador e Popover de Autenticação/Boas-vindas (Entrar / Criar Conta).
 * Réplica do comportamento e visual com balão apontador, texto de boas-vindas
 * e botões em pílula [INICIAR SESSÃO] e [CRIAR CONTA].
 */
export function MenuUtilizadorCabecalho({
  sessao,
  linkPortal,
  etiquetaPortal,
}: PropsMenuUtilizadorCabecalho) {
  const { estaTransparente } = useCabecalho();
  const [aberto, setAberto] = useState(false);
  const [aSair, setASair] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fecharTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  async function manipularTerminarSessao() {
    if (aSair) return;
    setASair(true);
    try {
      await acaoEncerrarSessaoCliente();
    } catch {
      // ignorar
    }
    window.location.href = "/entrar";
  }

  // Fechar ao clicar fora ou pressionar ESC
  useEffect(() => {
    function tratarCliqueFora(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setAberto(false);
      }
    }

    function tratarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", tratarCliqueFora);
    document.addEventListener("keydown", tratarTecla);
    return () => {
      document.removeEventListener("mousedown", tratarCliqueFora);
      document.removeEventListener("keydown", tratarTecla);
    };
  }, []);

  const abrirComHover = () => {
    if (fecharTimeoutRef.current) {
      clearTimeout(fecharTimeoutRef.current);
      fecharTimeoutRef.current = null;
    }
    setAberto(true);
  };

  const fecharComHover = () => {
    fecharTimeoutRef.current = setTimeout(() => {
      setAberto(false);
    }, 200);
  };

  const primeiroNome = sessao?.nomeCompleto
    ? sessao.nomeCompleto.split(" ")[0]
    : null;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center h-full text-left"
      onMouseEnter={abrirComHover}
      onMouseLeave={fecharComHover}
    >
      {/* Botão de Gatilho no Cabeçalho */}
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        aria-expanded={aberto}
        aria-haspopup="dialog"
        className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-0 ${
          estaTransparente
            ? "text-white hover:text-white/95 hover:bg-white/10"
            : "text-slate-800 dark:text-slate-100 hover:text-[#ff2d75] hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
        }`}
        style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
      >
        {/* Ícone de Utilizador */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            estaTransparente
              ? "bg-white/15 text-white group-hover:bg-white/25"
              : sessao
              ? "bg-pink-50 dark:bg-pink-950/40 text-[#ff2d75]"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:text-[#ff2d75]"
          }`}
        >
          {sessao ? (
            <UserCheck className="w-4 h-4 text-[#ff2d75]" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>

        {/* Textos: Olá! / Iniciar Sessão */}
        <div className="text-left flex flex-col justify-center">
          <span
            className={`text-[10.5px] leading-tight font-normal ${
              estaTransparente
                ? "text-white/80"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Olá!
          </span>
          <span
            className={`text-xs font-semibold leading-tight whitespace-nowrap ${
              estaTransparente ? "text-white" : "text-slate-900 dark:text-white"
            }`}
          >
            {sessao ? primeiroNome : "Iniciar Sessão"}
          </span>
        </div>
      </button>

      {/* Popover / Balão Suspenso Colado à Borda Inferior do Cabeçalho */}
      {aberto && (
        <div
          className="absolute right-0 top-full pt-0 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="dialog"
          aria-modal="true"
        >
          {/* Cartão de Conteúdo com bordas quadradas */}
          <div
            className="relative w-[340px] sm:w-[380px] bg-white dark:bg-[#07182E] rounded-none p-6 sm:p-7 shadow-2xl border border-slate-200/90 dark:border-slate-800 text-left backdrop-blur-xl"
            style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
          >
            {!sessao ? (
              <>
                {/* Título e Texto de Boas-vindas para Visitantes */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Bem Vindo!
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Inicia sessão ou cria uma conta para teres uma experiência
                  personalizada!
                </p>

                {/* Botões de Ação em Pílula */}
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href="/entrar"
                    onClick={() => setAberto(false)}
                    className="flex-1 text-center py-2.5 sm:py-3 px-4 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-rose-500/25 active:scale-95 transition-all select-none"
                  >
                    INICIAR SESSÃO
                  </Link>

                  <Link
                    href="/registar"
                    onClick={() => setAberto(false)}
                    className="flex-1 text-center py-2.5 sm:py-3 px-4 rounded-full border-2 border-slate-900 hover:bg-slate-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#07182E] text-slate-900 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all select-none"
                  >
                    CRIAR CONTA
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Visualização para Utilizador com Sessão Ativa */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-950/60 flex items-center justify-center text-[#ff2d75] font-bold text-sm">
                    {primeiroNome?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {sessao.nomeCompleto}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {sessao.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Link
                    href={linkPortal}
                    onClick={() => setAberto(false)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#ff2d75] hover:bg-[#e11d48] text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-pink-500/20 active:scale-95 transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{etiquetaPortal}</span>
                  </Link>

                  <button
                    type="button"
                    disabled={aSair}
                    onClick={manipularTerminarSessao}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-rose-200 dark:border-rose-800/80 bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white text-xs font-semibold cursor-pointer transition-all disabled:opacity-60"
                  >
                    {aSair ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>A terminar sessão...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Terminar Sessão</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
