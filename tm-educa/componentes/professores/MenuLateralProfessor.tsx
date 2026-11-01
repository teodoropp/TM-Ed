"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoTMEduca } from "@/componentes/ui/logo-tmeduca";
import { useTema } from "@/componentes/layout/provedor-tema";
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  Users,
  Inbox,
  Clock,
  DollarSign,
  UserCheck,
  MessageSquare,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import {
  GRUPOS_NAVEGACAO_PROFESSOR,
  type NomeIconeProfessor,
  type GrupoNavegacaoProfessor,
  type ChaveContadorProfessor,
} from "@/configuracao/navegacao-professor";

const MAPA_ICONES: Record<NomeIconeProfessor, LucideIcon> = {
  dashboard: LayoutDashboard,
  agenda: Calendar,
  aulas: GraduationCap,
  alunos: Users,
  propostas: Inbox,
  disponibilidade: Clock,
  remuneracoes: DollarSign,
  perfil: UserCheck,
  comunicacao: MessageSquare,
};

import { useMenuProfessor } from "./ShellPortalProfessor";
import { acaoEncerrarSessaoCliente } from "@/modulos/autenticacao/acoes";

interface MenuLateralProfessorProps {
  nomeUtilizador?: string | null;
  emailUtilizador?: string | null;
  grupos?: GrupoNavegacaoProfessor[];
  contadores?: Partial<Record<ChaveContadorProfessor, number>>;
  aoTerminarSessao?: () => void | Promise<void>;
}

export function MenuLateralProfessor({
  nomeUtilizador,
  emailUtilizador,
  grupos = GRUPOS_NAVEGACAO_PROFESSOR,
  contadores = {},
  aoTerminarSessao,
}: MenuLateralProfessorProps) {
  const pathname = usePathname();
  const { tema, montado } = useTema();
  const { recolhido, alternarRecolha, menuMobileAberto, setMenuMobileAberto } =
    useMenuProfessor();

  const [menuUtilizadorAberto, setMenuUtilizadorAberto] = React.useState(false);
  const refUtilizador = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!menuUtilizadorAberto) return;
    function aoClicarFora(evento: MouseEvent) {
      if (
        refUtilizador.current &&
        !refUtilizador.current.contains(evento.target as Node)
      ) {
        setMenuUtilizadorAberto(false);
      }
    }
    function aoPremirEsc(evento: KeyboardEvent) {
      if (evento.key === "Escape") setMenuUtilizadorAberto(false);
    }
    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoPremirEsc);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoPremirEsc);
    };
  }, [menuUtilizadorAberto]);

  function estaAtivo(href: string, exato?: boolean): boolean {
    if (!pathname) return false;
    if (exato) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const iniciais = (nomeUtilizador || "Professor")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");

  const temaEscuro = !montado || tema === "dark";

  const classeItem = cn(
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-normal transition-all duration-200",
    recolhido && "lg:justify-center lg:px-0"
  );

  const conteudoLateral = (
    <div className="flex h-full flex-col bg-white/95 backdrop-blur-xl dark:bg-[#07182E]/95">
      {/* CABEÇALHO: LOGO + RECOLHA */}
      <div
        className={cn(
          "flex items-center gap-2 border-b border-slate-200/60 px-4 py-3.5 dark:border-slate-800/60",
          recolhido && "lg:justify-center lg:px-2"
        )}
      >
        <Link
          href="/portal-professor"
          aria-label="Portal do Professor"
          className="shrink-0 transition-transform duration-200 hover:scale-102"
        >
          <LogoTMEduca
            tamanho="sm"
            variante="horizontal"
            corTexto={temaEscuro ? "claro" : "escuro"}
            className={cn(recolhido && "lg:[&>span]:hidden")}
          />
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={alternarRecolha}
            aria-label={recolhido ? "Expandir menu" : "Recolher menu"}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:flex dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                recolhido && "rotate-180"
              )}
            />
          </button>

          <button
            type="button"
            onClick={() => setMenuMobileAberto(false)}
            aria-label="Fechar menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* LISTA DE NAVEGAÇÃO AGRUPADA */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 sem-barra">
        {grupos.map((grupo) => (
          <div key={grupo.rotulo} className="space-y-1">
            <h4
              className={cn(
                "px-3 text-[10px] font-normal uppercase tracking-wider text-slate-400 dark:text-slate-500",
                recolhido && "lg:text-center lg:px-0"
              )}
            >
              {recolhido ? "···" : grupo.rotulo}
            </h4>

            <ul className="space-y-0.5">
              {grupo.itens.map((item) => {
                const Icone = MAPA_ICONES[item.icone];
                const ativo = estaAtivo(item.href, item.exato);
                const valorContador = item.contador ? contadores[item.contador] ?? 0 : 0;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuMobileAberto(false)}
                      title={recolhido ? `${item.rotulo} — ${item.descricao}` : undefined}
                      className={cn(
                        classeItem,
                        ativo
                          ? "bg-emerald-500/10 text-emerald-700 font-normal dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                      )}
                    >
                      <Icone
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          ativo
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                        )}
                      />

                      <span
                        className={cn(
                          "truncate transition-opacity duration-200",
                          recolhido && "lg:hidden"
                        )}
                      >
                        {item.rotulo}
                      </span>

                      {valorContador > 0 && (
                        <span
                          className={cn(
                            "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-normal leading-none",
                            ativo
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
                            recolhido &&
                              "lg:absolute lg:top-1 lg:right-1 lg:h-2 lg:w-2 lg:min-w-0 lg:p-0 lg:text-[0px]"
                          )}
                        >
                          {valorContador}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* RODAPÉ DO MENU: PERFIL + TERMINAR SESSÃO */}
      <div
        ref={refUtilizador}
        className="relative border-t border-slate-200/60 p-3 dark:border-slate-800/60"
      >
        <button
          type="button"
          onClick={() => setMenuUtilizadorAberto((v) => !v)}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/60",
            recolhido && "lg:justify-center lg:p-1"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-xs font-normal text-white ring-2 ring-emerald-500/20 shadow-xs">
            {iniciais}
          </div>

          <div
            className={cn(
              "min-w-0 flex-1 transition-opacity duration-200",
              recolhido && "lg:hidden"
            )}
          >
            <p className="truncate text-xs font-normal text-slate-800 dark:text-slate-200">
              {nomeUtilizador || "Professor"}
            </p>
            <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
              {emailUtilizador || "professor@tmeduca.ao"}
            </p>
          </div>
        </button>

        {/* MENU POPUP DO UTILIZADOR */}
        {menuUtilizadorAberto && (
          <div
            className={cn(
              "absolute bottom-full mb-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-[#07182E] z-50",
              recolhido ? "left-2" : "left-3 right-3"
            )}
          >
            <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
              <span className="block text-[10px] font-normal uppercase tracking-wider text-slate-400">
                Sessão Iniciada
              </span>
              <span className="block truncate text-xs font-normal text-slate-900 dark:text-white">
                {nomeUtilizador}
              </span>
            </div>

            <div className="py-1">
              <Link
                href="/portal-professor/perfil"
                onClick={() => setMenuUtilizadorAberto(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-normal text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                Perfil Profissional
              </Link>
            </div>

            <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await acaoEncerrarSessaoCliente();
                  } catch {}
                  window.location.href = "/entrar";
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-normal text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Terminar Sessão
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 hidden border-r border-slate-200/60 transition-[width] duration-300 ease-in-out lg:block dark:border-slate-800/60 shadow-xs",
          recolhido ? "w-[76px]" : "w-[264px]"
        )}
      >
        {conteudoLateral}
      </aside>

      {/* DRAWER MOBILE */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          menuMobileAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          onClick={() => setMenuMobileAberto(false)}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        <div
          className={cn(
            "absolute top-0 bottom-0 left-0 w-[280px] max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out",
            menuMobileAberto ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {conteudoLateral}
        </div>
      </div>
    </>
  );
}
