"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTema } from "./provedor-tema";
import { useCabecalho } from "./cabecalho-animado";

interface PropsSeletorTema {
  className?: string;
  tamanho?: "sm" | "md";
}

/**
 * Botão flutuante de alternância de tema no cabeçalho.
 * Exibe ícone do Sol quando em modo Escuro (para mudar para Branco)
 * e ícone da Lua quando em modo Claro (para voltar ao Escuro).
 */
export function SeletorTema({ className = "", tamanho = "md" }: PropsSeletorTema) {
  const { tema, alternarTema, montado } = useTema();
  const { estaTransparente } = useCabecalho();

  // Enquanto hidrata no SSR, renderiza placeholder seguro com o tema escuro padrão
  const eEscuro = !montado || tema === "dark";

  const dimensaoIcone = tamanho === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const paddingBotao = tamanho === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={eEscuro ? "Mudar para tema branco / claro" : "Mudar para tema escuro (padrão)"}
      title={eEscuro ? "Mudar para tema branco / claro" : "Mudar para tema escuro"}
      className={`relative rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-0 ${paddingBotao} ${
        estaTransparente
          ? "bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs"
          : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800/90 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 shadow-xs"
      } ${className}`}
    >
      <span className="sr-only">
        {eEscuro ? "Ativar modo branco" : "Ativar modo escuro"}
      </span>

      {eEscuro ? (
        <Sun
          className={`${dimensaoIcone} text-amber-300 hover:text-amber-200 transition-transform duration-300 hover:rotate-45`}
        />
      ) : (
        <Moon
          className={`${dimensaoIcone} text-slate-700 dark:text-slate-200 transition-transform duration-300 hover:-rotate-12`}
        />
      )}
    </button>
  );
}

/**
 * Interruptor segmentado para inserção em menus suspensos (popovers) e perfis.
 * Apresenta as opções "Escuro (Padrão)" e "Branco" com realce de seleção.
 */
export function InterruptorTemaMenu() {
  const { tema, definirTema, montado } = useTema();

  const eEscuro = !montado || tema === "dark";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Aparência do Site
        </span>
        <span className="text-[10px] text-pink-500 dark:text-pink-400 font-medium">
          {eEscuro ? "Tema Escuro" : "Tema Branco"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800">
        {/* Opção Escuro (Principal / Padrão) */}
        <button
          type="button"
          onClick={() => definirTema("dark")}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
            eEscuro
              ? "bg-[#0a192f] text-white shadow-xs border border-pink-500/40 ring-1 ring-pink-500/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-pink-400" />
          <span>Escuro</span>
          <span className="text-[9px] opacity-75 font-normal">(Padrão)</span>
        </button>

        {/* Opção Branco */}
        <button
          type="button"
          onClick={() => definirTema("light")}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
            !eEscuro
              ? "bg-white text-slate-900 shadow-sm border border-slate-200 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Branco</span>
        </button>
      </div>
    </div>
  );
}
