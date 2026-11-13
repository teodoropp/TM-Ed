/** @format */

"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MenuLateralAdmin } from "@/componentes/layout/MenuLateralAdmin";
import {
  ProvedorMenuAdmin,
  useMenuAdmin,
} from "@/componentes/layout/contexto-menu-admin";
import { useTema } from "@/componentes/layout/provedor-tema";
import { acaoEncerrarSessaoCliente } from "@/modulos/autenticacao/acoes";
import {
  Menu,
  Sun,
  Moon,
  ShieldCheck,
  LogOut,
  Calendar,
  Search,
  X,
  Users,
  GraduationCap,
  ClipboardList,
  Receipt,
} from "lucide-react";

interface ShellAdministracaoProps {
  children: React.ReactNode;
  nomeUtilizador?: string | null;
  emailUtilizador?: string | null;
  fotoUrl?: string | null;
  aoTerminarSessao?: () => void | Promise<void>;
}

/**
 * Contentor do painel de administração: menu lateral fixo à esquerda,
 * barra superior executiva e conteúdo à direita.
 */
export function ShellAdministracao({
  children,
  nomeUtilizador,
  emailUtilizador,
  fotoUrl,
  aoTerminarSessao,
}: ShellAdministracaoProps) {
  return (
    <ProvedorMenuAdmin>
      <AreaAdministracao
        nomeUtilizador={nomeUtilizador}
        emailUtilizador={emailUtilizador}
        fotoUrl={fotoUrl}
        aoTerminarSessao={aoTerminarSessao}>
        {children}
      </AreaAdministracao>
    </ProvedorMenuAdmin>
  );
}

function AreaAdministracao({
  children,
  nomeUtilizador,
  emailUtilizador,
  fotoUrl,
  aoTerminarSessao,
}: ShellAdministracaoProps) {
  const { recolhido, setMenuMobileAberto } = useMenuAdmin();
  const { tema, definirTema, montado } = useTema();

  const [dataHojeFormatada, setDataHojeFormatada] = React.useState("");
  const [termoPesquisa, setTermoPesquisa] = React.useState("");
  const [pesquisaAberta, setPesquisaAberta] = React.useState(false);
  const containerPesquisaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const hoje = new Date();
    const texto = hoje.toLocaleDateString("pt-AO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setDataHojeFormatada(texto.charAt(0).toUpperCase() + texto.slice(1));
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

  const temaEscuro = !montado || tema === "dark";

  const iniciais = (nomeUtilizador || "Admin")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="admin-tipografia min-h-screen bg-slate-50/80 dark:bg-[#050C18] transition-colors duration-300">
      <MenuLateralAdmin
        nomeUtilizador={nomeUtilizador}
        emailUtilizador={emailUtilizador}
        fotoUrl={fotoUrl}
        aoTerminarSessao={aoTerminarSessao}
      />

      <div
        className={cn(
          "min-h-screen flex flex-col transition-[padding] duration-200",
          recolhido ? "lg:pl-[76px]" : "lg:pl-[264px]",
        )}>
        {/* BARRA SUPERIOR EXECUTIVA DO PAINEL ADMINISTRATIVO */}
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-md transition-colors sm:px-6 lg:px-8 dark:border-slate-800/70 dark:bg-[#050C18]/85">
          {/* LADO ESQUERDO: MENU MOBILE + DATA DE HOJE */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMenuMobileAberto(true)}
              aria-label="Abrir navegação lateral"
              className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200/70 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-200 cursor-pointer">
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
              <Calendar className="h-4 w-4 text-[#FF2D75] shrink-0" />
              <span className="font-medium">
                {dataHojeFormatada || "Hoje"}
              </span>
            </div>
          </div>

          {/* CENTRO: BARRA DE PESQUISA RÁPIDA DA ADMINISTRAÇÃO (Desktop/Tablet) */}
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
                placeholder="Pesquisar pedidos, explicadores, faturas..."
                className="w-full h-8.5 pl-9 pr-8 text-xs rounded-[6px] border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-[#07182E]/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF2D75] focus:border-[#FF2D75] transition-all"
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
                  {termoPesquisa.trim() ? "Aceder rapidamente:" : "Gestão Administrativa:"}
                </div>
                <div className="pt-1.5 space-y-1">
                  <Link
                    href="/administracao/pedidos"
                    onClick={() => setPesquisaAberta(false)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ClipboardList className="w-3.5 h-3.5 text-[#FF2D75]" />
                      Triagem e Atribuição de Pedidos
                    </span>
                    <span className="text-[10px] text-slate-400">Pedidos</span>
                  </Link>
                  <Link
                    href="/administracao/utilizadores/professores"
                    onClick={() => setPesquisaAberta(false)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                      Rede de Explicadores
                    </span>
                    <span className="text-[10px] text-slate-400">Docentes</span>
                  </Link>
                  <Link
                    href="/administracao/financeiro"
                    onClick={() => setPesquisaAberta(false)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                      Faturação & Cobranças
                    </span>
                    <span className="text-[10px] text-slate-400">Financeiro</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => definirTema(temaEscuro ? "light" : "dark")}
              aria-label={
                temaEscuro ? "Mudar para modo claro" : "Mudar para modo escuro"
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-600 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-400 dark:hover:bg-[#102A45] dark:hover:text-white cursor-pointer"
              title={temaEscuro ? "Ativar modo claro" : "Ativar modo escuro"}>
              {temaEscuro ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

            <Link
              href="/administracao/perfil"
              className="group flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/60">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FF2D75] to-[#E11D48] text-[10px] text-white shadow-xs">
                {iniciais}
              </div>
              <span className="hidden sm:inline text-xs text-slate-700 dark:text-slate-300 group-hover:text-[#FF2D75] transition-colors pr-1">
                {nomeUtilizador?.split(" ")[0] || "Admin"}
              </span>
            </Link>

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
                placeholder="Pesquisar pedidos, explicadores, faturas..."
                className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF2D75]"
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
                href="/administracao/pedidos"
                onClick={() => setPesquisaAberta(false)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5 text-[#FF2D75]" />
                  Triagem e Atribuição de Pedidos
                </span>
                <span className="text-[10px] text-slate-400">Pedidos &rarr;</span>
              </Link>
              <Link
                href="/administracao/utilizadores/professores"
                onClick={() => setPesquisaAberta(false)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                  Rede de Explicadores
                </span>
                <span className="text-[10px] text-slate-400">Docentes &rarr;</span>
              </Link>
              <Link
                href="/administracao/financeiro"
                onClick={() => setPesquisaAberta(false)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                  Faturação & Cobranças
                </span>
                <span className="text-[10px] text-slate-400">Financeiro &rarr;</span>
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
