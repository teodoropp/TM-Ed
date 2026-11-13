"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTema } from "@/componentes/layout/provedor-tema";
import { acaoEncerrarSessaoCliente } from "@/modulos/autenticacao/acoes";
import { Menu, Sun, Moon, Calendar, LogOut, Search, X, Users, BookOpen, Clock, FileText, DollarSign } from "lucide-react";
import {
  MenuLateralProfessor,
} from "./MenuLateralProfessor";
import {
  type GrupoNavegacaoProfessor,
  type ChaveContadorProfessor,
} from "@/configuracao/navegacao-professor";

interface ContextoMenuProfessor {
  recolhido: boolean;
  alternarRecolha: () => void;
  menuMobileAberto: boolean;
  setMenuMobileAberto: (aberto: boolean) => void;
}

const ContextoMenu = React.createContext<ContextoMenuProfessor | null>(null);

export function useMenuProfessor(): ContextoMenuProfessor {
  const contexto = React.useContext(ContextoMenu);
  if (!contexto) {
    throw new Error(
      "useMenuProfessor deve ser usado dentro de um ShellPortalProfessor."
    );
  }
  return contexto;
}

interface ShellPortalProfessorProps {
  children: React.ReactNode;
  nomeUtilizador?: string | null;
  emailUtilizador?: string | null;
  grupos?: GrupoNavegacaoProfessor[];
  contadores?: Partial<Record<ChaveContadorProfessor, number>>;
  aoTerminarSessao?: () => void | Promise<void>;
}

export function ShellPortalProfessor({
  children,
  nomeUtilizador,
  emailUtilizador,
  grupos,
  contadores,
  aoTerminarSessao,
}: ShellPortalProfessorProps) {
  const [recolhido, setRecolhido] = React.useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = React.useState(false);

  React.useEffect(() => {
    try {
      const guardado = window.localStorage.getItem("tm_menu_professor_recolhido");
      if (guardado !== null) setRecolhido(guardado === "true");
    } catch {
      // Ignora erro em modo restrito
    }
  }, []);

  function alternarRecolha() {
    setRecolhido((v) => {
      const novo = !v;
      try {
        window.localStorage.setItem(
          "tm_menu_professor_recolhido",
          String(novo)
        );
      } catch {
        // Ignora
      }
      return novo;
    });
  }

  const { tema, definirTema, montado } = useTema();
  const temaEscuro = !montado || tema === "dark";

  // Barra de Pesquisa e Atalhos
  const [termoPesquisa, setTermoPesquisa] = React.useState("");
  const [pesquisaAberta, setPesquisaAberta] = React.useState(false);
  const containerPesquisaRef = React.useRef<HTMLDivElement>(null);

  // Formatação do Dia de Hoje
  const [dataHojeFormatada, setDataHojeFormatada] = React.useState("");
  React.useEffect(() => {
    try {
      const hoje = new Date();
      const formatado = hoje.toLocaleDateString("pt-AO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      // Capitalizar a primeira letra
      setDataHojeFormatada(formatado.charAt(0).toUpperCase() + formatado.slice(1));
    } catch {
      setDataHojeFormatada("");
    }
  }, []);

  React.useEffect(() => {
    function tratarCliqueFora(e: MouseEvent) {
      if (
        containerPesquisaRef.current &&
        !containerPesquisaRef.current.contains(e.target as Node)
      ) {
        setPesquisaAberta(false);
      }
    }
    document.addEventListener("mousedown", tratarCliqueFora);
    return () => document.removeEventListener("mousedown", tratarCliqueFora);
  }, []);

  const totalPropostas = contadores?.propostas ?? 0;
  const totalAulasHoje = contadores?.aulasHoje ?? 0;

  const iniciais = (nomeUtilizador || "Professor")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <ContextoMenu.Provider
      value={{
        recolhido,
        alternarRecolha,
        menuMobileAberto,
        setMenuMobileAberto,
      }}
    >
      <div className="min-h-screen bg-slate-50/80 dark:bg-[#050C18] transition-colors duration-300 portal-tipografia">
        <MenuLateralProfessor
          nomeUtilizador={nomeUtilizador}
          emailUtilizador={emailUtilizador}
          grupos={grupos}
          contadores={contadores}
          aoTerminarSessao={aoTerminarSessao}
        />

        <div
          className={cn(
            "min-h-screen flex flex-col transition-[padding] duration-300 ease-in-out",
            recolhido ? "lg:pl-[76px]" : "lg:pl-[264px]"
          )}
        >
          {/* HEADER LIMPO DO PORTAL DO PROFESSOR */}
          <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-md transition-colors sm:px-6 lg:px-8 dark:border-slate-800/70 dark:bg-[#050C18]/85">
            {/* LADO ESQUERDO: MENU MOBILE + DATA DE HOJE */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Botão de Menu para Telas Pequenas */}
              <button
                type="button"
                onClick={() => setMenuMobileAberto(true)}
                aria-label="Abrir navegação lateral"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/70 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-200 cursor-pointer"
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* Botão de Pesquisa no Mobile */}
              <button
                type="button"
                onClick={() => setPesquisaAberta((v) => !v)}
                aria-label="Pesquisar"
                className="md:hidden flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-600 hover:text-slate-900 shadow-xs dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-300 cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
              </button>

              {/* Exibição do Dia de Hoje com Ícone */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-normal">
                <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium">
                  {dataHojeFormatada || "Hoje"}
                </span>
              </div>
            </div>

            {/* CENTRO: BARRA DE PESQUISA RÁPIDA (Desktop/Tablet) */}
            <div ref={containerPesquisaRef} className="hidden md:block flex-1 max-w-md mx-4 sm:mx-6 relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={termoPesquisa}
                  onChange={(e) => {
                    setTermoPesquisa(e.target.value);
                    setPesquisaAberta(true);
                  }}
                  onFocus={() => setPesquisaAberta(true)}
                  placeholder="Pesquisar agenda, alunos, sumários..."
                  className="w-full h-8.5 pl-9 pr-8 text-xs rounded-[6px] border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-[#07182E]/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                {termoPesquisa && (
                  <button
                    type="button"
                    onClick={() => {
                      setTermoPesquisa("");
                      setPesquisaAberta(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Menu Flutuante de Atalhos Rápidos da Pesquisa */}
              {pesquisaAberta && (
                <div className="absolute left-0 right-0 top-full mt-1.5 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-2xl p-2 z-50 text-xs divide-y divide-slate-100 dark:divide-slate-800/80">
                  <div className="pb-1.5 px-2 text-[10px] uppercase font-bold text-slate-400">
                    {termoPesquisa.trim() ? "Aceder rapidamente:" : "Secções do Portal:"}
                  </div>
                  <div className="pt-1.5 space-y-1">
                    <Link
                      href="/portal-professor/agenda"
                      onClick={() => setPesquisaAberta(false)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        Agenda & Horários de Aulas
                      </span>
                      <span className="text-[10px] text-slate-400">Ver calendário</span>
                    </Link>

                    <Link
                      href="/portal-professor/alunos"
                      onClick={() => setPesquisaAberta(false)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        Meus Alunos & Acompanhamentos
                      </span>
                      <span className="text-[10px] text-slate-400">Perfis de alunos</span>
                    </Link>

                    <Link
                      href="/portal-professor/propostas"
                      onClick={() => setPesquisaAberta(false)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        Propostas de Aulas
                      </span>
                      <span className="text-[10px] text-slate-400">Atribuições</span>
                    </Link>

                    <Link
                      href="/portal-professor/remuneracoes"
                      onClick={() => setPesquisaAberta(false)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        Remunerações & Recibos
                      </span>
                      <span className="text-[10px] text-slate-400">Finanças</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* AÇÕES À DIREITA DO HEADER */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Alerta de Aulas de Hoje */}
              {totalAulasHoje > 0 && (
                <Link
                  href="/portal-professor/agenda"
                  className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-normal text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300"
                >
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{totalAulasHoje} aula{totalAulasHoje > 1 ? "s" : ""} hoje</span>
                </Link>
              )}

              {/* Propostas Pendentes */}
              {totalPropostas > 0 && (
                <Link
                  href="/portal-professor/propostas"
                  className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-normal text-amber-700 transition-colors hover:bg-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>{totalPropostas} nova{totalPropostas > 1 ? "s" : ""} proposta{totalPropostas > 1 ? "s" : ""}</span>
                </Link>
              )}

              {/* Alternador de Modo Claro/Escuro */}
              <button
                type="button"
                onClick={() => definirTema(temaEscuro ? "light" : "dark")}
                aria-label={temaEscuro ? "Mudar para modo claro" : "Mudar para modo escuro"}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-600 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-400 dark:hover:bg-[#102A45] dark:hover:text-white cursor-pointer"
                title={temaEscuro ? "Activar modo claro" : "Activar modo escuro"}
              >
                {temaEscuro ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </button>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

              {/* Perfil no Topo */}
              <Link
                href="/portal-professor/perfil"
                className="group flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-[10px] font-normal text-white ring-1 ring-slate-200 dark:ring-slate-700 shadow-xs">
                  {iniciais}
                </div>
                <span className="hidden sm:inline text-xs font-normal text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors pr-1">
                  {nomeUtilizador?.split(" ")[0] || "Professor"}
                </span>
              </Link>

              {/* Botão Direto Terminar Sessão */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    await acaoEncerrarSessaoCliente();
                  } catch {}
                  window.location.href = "/entrar";
                }}
                title="Terminar Sessão"
                className="inline-flex items-center gap-1.5 rounded-[5px] border border-rose-200/80 bg-rose-50/70 px-2.5 py-1.5 text-xs font-normal text-rose-600 transition-colors hover:bg-rose-600 hover:text-white dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Terminar Sessão</span>
              </button>
            </div>
          </header>

          {/* OVERLAY DE PESQUISA RÁPIDA NO MOBILE */}
          {pesquisaAberta && (
            <div className="md:hidden fixed inset-x-0 top-14 z-50 p-3 bg-white/95 dark:bg-[#07182E]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xl space-y-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  placeholder="Pesquisar agenda, alunos, sumários..."
                  className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setPesquisaAberta(false)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 pt-1">
                <Link
                  href="/portal-professor/agenda"
                  onClick={() => setPesquisaAberta(false)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Agenda & Horários
                  </span>
                  <span className="text-[10px] text-slate-400">Ver aulas &rarr;</span>
                </Link>
                <Link
                  href="/portal-professor/alunos"
                  onClick={() => setPesquisaAberta(false)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    Meus Alunos
                  </span>
                  <span className="text-[10px] text-slate-400">Perfis &rarr;</span>
                </Link>
                <Link
                  href="/portal-professor/remuneracoes"
                  onClick={() => setPesquisaAberta(false)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Remunerações & Finanças
                  </span>
                  <span className="text-[10px] text-slate-400">Extrato &rarr;</span>
                </Link>
              </div>
            </div>
          )}

          {/* CONTEÚDO */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </ContextoMenu.Provider>
  );
}
