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
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  ShieldCheck,
  LogOut,
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
  const { recolhido, alternarRecolha, setMenuMobileAberto } = useMenuAdmin();
  const { tema, definirTema, montado } = useTema();
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuMobileAberto(true)}
              aria-label="Abrir navegação lateral"
              className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200/70 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-200">
              <Menu className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={alternarRecolha}
              aria-label={
                recolhido ? "Expandir menu lateral" : "Recolher menu lateral"
              }
              className="hidden h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200/70 bg-white text-slate-500 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 lg:flex dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-400 dark:hover:bg-[#102A45] dark:hover:text-white cursor-pointer"
              title={
                recolhido ? "Expandir menu lateral" : "Recolher menu lateral"
              }>
              {recolhido ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 rounded-[5px] bg-[#FF2D75]/10 px-2.5 py-1 text-[11px] text-[#FF2D75]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administração Central
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => definirTema(temaEscuro ? "light" : "dark")}
              aria-label={
                temaEscuro ? "Mudar para modo claro" : "Mudar para modo escuro"
              }
              className="flex h-8 w-8 items-center justify-center rounded-[5px] border border-slate-200/70 bg-white text-slate-600 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-[#07182E] dark:text-slate-400 dark:hover:bg-[#102A45] dark:hover:text-white cursor-pointer"
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
              className="group flex items-center gap-2 rounded-[5px] p-1 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/60">
              <div className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-gradient-to-br from-[#FF2D75] to-[#E11D48] text-[10px] text-white shadow-xs">
                {iniciais}
              </div>
              <span className="hidden sm:inline text-xs text-slate-700 dark:text-slate-300 group-hover:text-[#FF2D75] transition-colors">
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

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
