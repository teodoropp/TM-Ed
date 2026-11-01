"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoTMEduca } from "@/componentes/ui/logo-tmeduca";
import { useTema } from "@/componentes/layout/provedor-tema";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarClock,
  FileText,
  GraduationCap,
  Wallet,
  ShieldAlert,
  Star,
  BookOpen,
  Calculator,
  Coins,
  Library,
  Users,
  UserCog,
  Baby,
  School,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  LogOut,
  Settings,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react";
import {
  GRUPOS_NAVEGACAO_ADMIN,
  type NomeIconeAdmin,
  type GrupoNavegacaoAdmin,
} from "@/configuracao/navegacao-admin";
import { useMenuAdmin } from "@/componentes/layout/contexto-menu-admin";
import { acaoEncerrarSessaoCliente } from "@/modulos/autenticacao/acoes";

const MAPA_ICONES: Record<NomeIconeAdmin, LucideIcon> = {
  painel: LayoutDashboard,
  pedidos: ClipboardList,
  acompanhamentos: CalendarClock,
  contratos: FileText,
  aulas: GraduationCap,
  financeiro: Wallet,
  ocorrencias: ShieldAlert,
  avaliacoes: Star,
  catalogo: BookOpen,
  precos: Calculator,
  remuneracoes: Coins,
  disciplinas: Library,
  utilizadores: Users,
  encarregados: UserCog,
  alunos: Baby,
  professores: School,
  configuracoes: Settings,
};

interface MenuLateralAdminProps {
  /** Nome do administrador autenticado. */
  nomeUtilizador?: string | null;
  /** E-mail do administrador autenticado. */
  emailUtilizador?: string | null;
  /** Caminho público da fotografia do administrador. */
  fotoUrl?: string | null;
  /** Grupos de navegação a apresentar. */
  grupos?: GrupoNavegacaoAdmin[];
  /** Acção de terminar sessão (server action). */
  aoTerminarSessao?: () => void | Promise<void>;
}

export function MenuLateralAdmin({
  nomeUtilizador,
  emailUtilizador,
  fotoUrl,
  grupos = GRUPOS_NAVEGACAO_ADMIN,
  aoTerminarSessao,
}: MenuLateralAdminProps) {
  const pathname = usePathname();
  const { recolhido, alternarRecolha, menuMobileAberto: menuAberto, setMenuMobileAberto: setMenuAberto } = useMenuAdmin();
  const { tema, definirTema, montado } = useTema();

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

  const iniciais = (nomeUtilizador || "Admin")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");

  // Enquanto hidrata, assume o tema escuro (predefinição da plataforma).
  const temaEscuro = !montado || tema === "dark";

  const classeItem = cn(
    "group flex items-center gap-2.5 rounded-[5px] px-3 py-1.5 text-[13px] transition-colors",
    recolhido && "lg:justify-center lg:px-0"
  );

  const conteudoLateral = (
    <div className="flex h-full flex-col bg-white dark:bg-[#07182E]">
      {/* CABEÇALHO: LOGO + TEMA + RECOLHA */}
      <div
        className={cn(
          "flex items-center gap-2 border-b border-slate-200/80 px-4 py-3 dark:border-slate-800",
          recolhido && "lg:justify-center lg:px-2"
        )}
      >
        <Link
          href="/"
          aria-label="Voltar à página inicial"
          className="shrink-0"
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
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:flex dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                recolhido && "rotate-180"
              )}
            />
          </button>

          <button
            type="button"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* NAVEGAÇÃO PRINCIPAL */}
      <nav
        aria-label="Navegação da Administração"
        className="sem-barra flex-1 overflow-y-auto px-3 pb-3"
      >
        {grupos.map((grupo) => {
          return (
            <div key={grupo.rotulo} className="mb-1 last:mb-0">
              {/* TÍTULO DO GRUPO — SEMPRE VISÍVEL E FIXO AO SCROLL */}
              <p
                className={cn(
                  "sticky top-0 z-10 -mx-3 bg-white px-3 pb-1.5 pt-3 text-[9px] uppercase tracking-[0.16em] text-slate-400 dark:bg-[#07182E]",
                  recolhido && "lg:hidden"
                )}
              >
                {grupo.rotulo}
              </p>

              <ul className="mt-0.5 space-y-0.5">
                {grupo.itens.map((item) => {
                  const Icone = MAPA_ICONES[item.icone];
                  const ativo = estaAtivo(item.href, item.exato);

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
                            ? "rounded-[5px] bg-[#FF2D75]/10 text-[#FF2D75]"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-[#102A45]/70 dark:hover:text-white"
                        )}
                      >
                        <Icone
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-colors",
                            ativo
                              ? "text-[#FF2D75]"
                              : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                          )}
                        />
                        <span
                          className={cn(
                            "truncate",
                            recolhido && "lg:hidden"
                          )}
                        >
                          {item.rotulo}
                        </span>

                        {item.badge !== undefined &&
                          item.badge !== null &&
                          item.badge !== 0 && (
                            <span
                              className={cn(
                                "ml-auto rounded-full px-1.5 py-0.5 text-[10px]",
                                ativo
                                  ? "bg-[#FF2D75]/20 text-[#FF2D75]"
                                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* RODAPÉ: CARTÃO DO UTILIZADOR COM FOTOGRAFIA E MENU */}
      <div
        className="relative border-t border-slate-200/80 p-3 dark:border-slate-800"
        ref={refUtilizador}
      >
        {/* MENU DO UTILIZADOR */}
        {menuUtilizadorAberto && (
          <div className="absolute bottom-full left-3 right-3 z-30 mb-2 overflow-hidden rounded-[10px] border border-slate-200/80 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <Link
              href="/administracao/perfil"
              onClick={() => setMenuUtilizadorAberto(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <UserCog className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              O Meu Perfil
            </Link>

            <Link
              href="/administracao/configuracoes"
              onClick={() => setMenuUtilizadorAberto(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Settings className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              Definições
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
            {fotoUrl ? (
              <Image
                src={fotoUrl}
                alt={nomeUtilizador || "Administrador"}
                fill
                sizes="32px"
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-[#0A192F] text-[10px] text-white">
                {iniciais}
              </span>
            )}
          </div>

          <div
            className={cn(
              "min-w-0 flex-1 leading-tight",
              recolhido && "lg:hidden"
            )}
          >
            <p className="truncate text-xs text-slate-800 dark:text-slate-100">
              {nomeUtilizador || "Administrador"}
            </p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {emailUtilizador || "gestao@tmeduca.ao"}
            </p>
          </div>

          {menuUtilizadorAberto ? (
            <ChevronUp
              className={cn(
                "h-4 w-4 shrink-0 text-slate-400",
                recolhido && "lg:hidden"
              )}
            />
          ) : (
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-slate-400",
                recolhido && "lg:hidden"
              )}
            />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* SOBREPOSIÇÃO (MOBILE) */}
      {menuAberto && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuAberto(false)}
          aria-hidden="true"
        />
      )}

      {/* MENU LATERAL */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 border-r border-slate-200/80 transition-[width,transform] duration-200 dark:border-slate-800",
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
