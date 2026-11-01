"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MenuLateralPais } from "@/componentes/encarregados/MenuLateralPais";
import { useTema } from "@/componentes/layout/provedor-tema";
import type { GrupoNavegacaoPais, ChaveContadorPais } from "@/configuracao/navegacao-pais";
import { acaoEncerrarSessaoCliente } from "@/modulos/autenticacao/acoes";
import { Menu, Sun, Moon, PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";

interface ContextoMenuPais {
  recolhido: boolean;
  alternarRecolha: () => void;
  menuMobileAberto: boolean;
  setMenuMobileAberto: (aberto: boolean) => void;
}

export const ContextoMenuPais = React.createContext<ContextoMenuPais | null>(null);

export function ProvedorMenuPais({ children }: { children: React.ReactNode }) {
  const [recolhido, setRecolhido] = React.useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = React.useState(false);

  const valor = React.useMemo(
    () => ({
      recolhido,
      alternarRecolha: () => setRecolhido((v) => !v),
      menuMobileAberto,
      setMenuMobileAberto,
    }),
    [recolhido, menuMobileAberto]
  );

  return (
    <ContextoMenuPais.Provider value={valor}>{children}</ContextoMenuPais.Provider>
  );
}

export function useMenuPais(): ContextoMenuPais {
  const contexto = React.useContext(ContextoMenuPais);
  if (!contexto) {
    throw new Error(
      "useMenuPais tem de ser utilizado dentro de ProvedorMenuPais."
    );
  }
  return contexto;
}

interface ShellPortalPaisProps {
  children: React.ReactNode;
  nomeUtilizador?: string | null;
  emailUtilizador?: string | null;
  grupos?: GrupoNavegacaoPais[];
  contadores?: Partial<Record<ChaveContadorPais, number>>;
  aoTerminarSessao?: () => void | Promise<void>;
}

export function ShellPortalPais({
  children,
  nomeUtilizador,
  emailUtilizador,
  grupos,
  contadores,
  aoTerminarSessao,
}: ShellPortalPaisProps) {
  return (
    <ProvedorMenuPais>
      <AreaPortalPais
        nomeUtilizador={nomeUtilizador}
        emailUtilizador={emailUtilizador}
        grupos={grupos}
        contadores={contadores}
        aoTerminarSessao={aoTerminarSessao}
      >
        {children}
      </AreaPortalPais>
    </ProvedorMenuPais>
  );
}

function AreaPortalPais({
  children,
  nomeUtilizador,
  emailUtilizador,
  grupos,
  contadores,
  aoTerminarSessao,
}: ShellPortalPaisProps) {
  const { recolhido, alternarRecolha, setMenuMobileAberto } = useMenuPais();
  const { tema, definirTema, montado } = useTema();

  const totalPendencias = (contadores?.pagamentos ?? 0) + (contadores?.avaliacoes ?? 0);
  const temaEscuro = !montado || tema === "dark";

  const iniciais = (nomeUtilizador || "Pai")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-[#050C18] transition-colors duration-300 portal-tipografia">
      <MenuLateralPais
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
        {/* HEADER LIMPO DO PORTAL */}
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-md transition-colors sm:px-6 lg:px-8 dark:border-slate-800/70 dark:bg-[#050C18]/85">
          <div className="flex items-center gap-2">
            {/* Botão de Menu para Telas Pequenas */}
            <button
              type="button"
              onClick={() => setMenuMobileAberto(true)}
              aria-label="Abrir navegação lateral"
              className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200/70 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-200"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Alternar Recolha no Desktop */}
            <button
              type="button"
              onClick={alternarRecolha}
              aria-label={recolhido ? "Expandir menu lateral" : "Recolher menu lateral"}
              className="hidden h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200/70 bg-white text-slate-500 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 lg:flex dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-400 dark:hover:bg-[#102A45] dark:hover:text-white cursor-pointer"
              title={recolhido ? "Expandir menu lateral" : "Recolher menu lateral"}
            >
              {recolhido ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* ACÇÕES À DIREITA DO HEADER */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notificação de Pendências Apenas se Existirem */}
            {totalPendencias > 0 && (
              <Link
                href="/portal-encarregado/pagamentos"
                className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-normal text-amber-600 transition-colors hover:bg-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>{totalPendencias} pendência{totalPendencias > 1 ? "s" : ""}</span>
              </Link>
            )}

            {/* Alternador de Tema Rápido */}
            <button
              type="button"
              onClick={() => definirTema(temaEscuro ? "light" : "dark")}
              aria-label={temaEscuro ? "Mudar para modo claro" : "Mudar para modo escuro"}
              className="flex h-8 w-8 items-center justify-center rounded-[5px] border border-slate-200/70 bg-white text-slate-600 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-400 dark:hover:bg-[#102A45] dark:hover:text-white cursor-pointer"
              title={temaEscuro ? "Activar modo claro" : "Activar modo escuro"}
            >
              {temaEscuro ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {/* Separador */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

            {/* Perfil no Topo */}
            <Link
              href="/portal-encarregado/perfil"
              className="group flex items-center gap-2 rounded-[5px] p-1 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-gradient-to-br from-[#0A192F] to-[#1E293B] text-[10px] font-normal text-white ring-1 ring-slate-200 dark:ring-slate-700 shadow-xs">
                {iniciais}
              </div>
              <span className="hidden sm:inline text-xs font-normal text-slate-700 dark:text-slate-300 group-hover:text-[#FF2D75] transition-colors">
                {nomeUtilizador?.split(" ")[0] || "Pai"}
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

        {/* CONTEÚDO */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
