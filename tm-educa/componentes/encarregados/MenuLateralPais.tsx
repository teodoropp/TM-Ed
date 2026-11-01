"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoTMEduca } from "@/componentes/ui/logo-tmeduca";
import { useTema } from "@/componentes/layout/provedor-tema";
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  CalendarClock,
  Star,
  CreditCard,
  Calculator,
  ShieldAlert,
  UserCog,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Settings,
  Home,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react";
import {
  GRUPOS_NAVEGACAO_PAIS,
  type NomeIconePais,
  type GrupoNavegacaoPais,
  type ChaveContadorPais,
} from "@/configuracao/navegacao-pais";

const MAPA_ICONES: Record<NomeIconePais, LucideIcon> = {
  dashboard: LayoutDashboard,
  filhos: GraduationCap,
  pedidos: ClipboardList,
  acompanhamentos: CalendarClock,
  avaliacoes: Star,
  pagamentos: CreditCard,
  precos: Calculator,
  ocorrencias: ShieldAlert,
  perfil: UserCog,
};

import { useMenuPais } from "./ShellPortalPais";
import { acaoEncerrarSessaoCliente } from "@/modulos/autenticacao/acoes";

interface MenuLateralPaisProps {
  /** Nome do pai autenticado. */
  nomeUtilizador?: string | null;
  /** E-mail do pai autenticado. */
  emailUtilizador?: string | null;
  /** Grupos de navegação a apresentar. */
  grupos?: GrupoNavegacaoPais[];
  /** Contadores de pendências por chave de navegação. */
  contadores?: Partial<Record<ChaveContadorPais, number>>;
  /** Acção de terminar sessão (server action). */
  aoTerminarSessao?: () => void | Promise<void>;
}

export function MenuLateralPais({
  nomeUtilizador,
  emailUtilizador,
  grupos = GRUPOS_NAVEGACAO_PAIS,
  contadores = {},
  aoTerminarSessao,
}: MenuLateralPaisProps) {
  const pathname = usePathname();
  const { tema, definirTema, montado } = useTema();

  let contextoMenu: ReturnType<typeof useMenuPais> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    contextoMenu = useMenuPais();
  } catch {
    contextoMenu = null;
  }

  const [menuAbertoLocal, setMenuAbertoLocal] = React.useState(false);
  const [recolhidoLocal, setRecolhidoLocal] = React.useState(false);

  const recolhido = contextoMenu ? contextoMenu.recolhido : recolhidoLocal;
  const alternarRecolha = contextoMenu ? contextoMenu.alternarRecolha : () => setRecolhidoLocal((v) => !v);
  const menuAberto = contextoMenu ? contextoMenu.menuMobileAberto : menuAbertoLocal;
  const setMenuAberto = contextoMenu ? contextoMenu.setMenuMobileAberto : setMenuAbertoLocal;

  const [menuUtilizadorAberto, setMenuUtilizadorAberto] = React.useState(false);
  const refUtilizador = React.useRef<HTMLDivElement>(null);

  // Fecha o menu do utilizador ao clicar fora ou ao premir ESC.
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

  const iniciais = (nomeUtilizador || "Pai")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");

  // Enquanto hidrata, assume o tema escuro (predefinição da plataforma).
  const temaEscuro = !montado || tema === "dark";

  const classeItem = cn(
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
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
          href="/portal-encarregado"
          aria-label="Portal dos Pais"
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
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* NAVEGAÇÃO PRINCIPAL */}
      <nav
        aria-label="Navegação do Portal dos Pais"
        className="sem-barra flex-1 overflow-y-auto px-3 py-3"
      >
        {grupos.map((grupo) => (
          <div key={grupo.rotulo} className="mb-2 last:mb-0">
            {/* TÍTULO DO GRUPO */}
            <p
              className={cn(
                "px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500",
                recolhido && "lg:hidden"
              )}
            >
              {grupo.rotulo}
            </p>

            <ul className="mt-0.5 space-y-1">
              {grupo.itens.map((item) => {
                const Icone = MAPA_ICONES[item.icone];
                const ativo = estaAtivo(item.href, item.exato);
                const contador = item.contador
                  ? (contadores[item.contador] ?? 0)
                  : 0;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuAberto(false)}
                      title={recolhido ? item.rotulo : undefined}
                      aria-current={ativo ? "page" : undefined}
                      className={cn(
                        classeItem,
                        ativo
                          ? "bg-gradient-to-r from-[#FF2D75]/15 to-[#FF2D75]/5 text-[#FF2D75] font-semibold shadow-xs"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      )}
                    >
                      {/* Barra lateral sutil no item activo */}
                      {ativo && (
                        <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#FF2D75]" />
                      )}

                      <Icone
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                          ativo
                            ? "text-[#FF2D75]"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                        )}
                      />

                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          recolhido && "lg:hidden"
                        )}
                      >
                        {item.rotulo}
                      </span>

                      {contador > 0 && (
                        <span
                          className={cn(
                            "ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight animate-pulse",
                            ativo
                              ? "bg-[#FF2D75]/20 text-[#FF2D75]"
                              : "bg-amber-500 text-white shadow-xs"
                          )}
                        >
                          {contador}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* VOLTAR AO SITE PÚBLICO */}
        <div className="mt-3 border-t border-slate-200/80 pt-2 dark:border-slate-800">
          <Link
            href="/"
            title={recolhido ? "Voltar ao site" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white",
              recolhido && "lg:justify-center lg:px-0"
            )}
          >
            <Home className="h-[18px] w-[18px] shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
            <span className={cn("truncate", recolhido && "lg:hidden")}>
              Voltar ao site
            </span>
          </Link>
        </div>
      </nav>

      {/* RODAPÉ: CARTÃO DO UTILIZADOR COM MENU */}
      <div
        className="relative border-t border-slate-200/80 p-3 dark:border-slate-800"
        ref={refUtilizador}
      >
        {/* MENU DO UTILIZADOR */}
        {menuUtilizadorAberto && (
          <div className="absolute bottom-full left-3 right-3 z-30 mb-2 overflow-hidden rounded-[10px] border border-slate-200/80 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <Link
              href="/portal-encarregado/perfil"
              onClick={() => setMenuUtilizadorAberto(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <UserCog className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              O Meu Perfil
            </Link>

            <Link
              href="/portal-encarregado/precos"
              onClick={() => setMenuUtilizadorAberto(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Settings className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              Preçário & Simulador
            </Link>

            <button
              type="button"
              onClick={async () => {
                try {
                  await acaoEncerrarSessaoCliente();
                } catch {}
                window.location.href = "/entrar";
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              Terminar Sessão
            </button>

            <div className="border-t border-slate-100 p-2 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-1 rounded-[10px] bg-slate-100 p-1 dark:bg-slate-800/70">
                <button
                  type="button"
                  onClick={() => definirTema("light")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-[8px] py-1.5 text-[11px] transition-all",
                    !temaEscuro
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                  )}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Claro
                </button>
                <button
                  type="button"
                  onClick={() => definirTema("dark")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-[8px] py-1.5 text-[11px] transition-all",
                    temaEscuro
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                  )}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Escuro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARTÃO DO UTILIZADOR */}
        <button
          type="button"
          onClick={() => setMenuUtilizadorAberto((aberto) => !aberto)}
          aria-haspopup="menu"
          aria-expanded={menuUtilizadorAberto}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-[10px] px-2 py-1.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70",
            recolhido && "lg:justify-center lg:px-0"
          )}
        >
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
            <span className="flex h-full w-full items-center justify-center bg-[#0A192F] text-[10px] text-white">
              {iniciais}
            </span>
          </div>

          <div
            className={cn(
              "min-w-0 flex-1 leading-tight",
              recolhido && "lg:hidden"
            )}
          >
            <p className="truncate text-xs text-slate-800 dark:text-slate-100">
              {nomeUtilizador || "Pai"}
            </p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {emailUtilizador || "pais@tmeduca.ao"}
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* BOTÃO DE ABERTURA (MOBILE) */}
      <button
        type="button"
        onClick={() => setMenuAberto(true)}
        aria-label="Abrir menu de navegação"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A192F] text-white shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* SOBREPOSIÇÃO (MOBILE) */}
      {menuAberto && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMenuAberto(false)}
          aria-hidden="true"
        />
      )}

      {/* MENU LATERAL */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 border-r border-slate-200/70 shadow-sm transition-[width,transform] duration-300 ease-in-out dark:border-slate-800/80",
          recolhido ? "lg:w-[76px]" : "lg:w-[264px]",
          "w-[264px]",
          menuAberto ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {conteudoLateral}
      </aside>
    </>
  );
}
