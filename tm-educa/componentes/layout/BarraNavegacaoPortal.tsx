"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Inbox,
  GraduationCap,
  Calendar,
  CreditCard,
  DollarSign,
  Star,
  AlertTriangle,
  Calculator,
  BookOpen,
  FileText,
  UserCheck,
  Clock,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export type NomeIconePortal =
  | "dashboard"
  | "alunos"
  | "pedidos"
  | "propostas"
  | "aulas"
  | "agenda"
  | "pagamentos"
  | "remuneracoes"
  | "avaliacoes"
  | "ocorrencias"
  | "precos"
  | "catalogo"
  | "contratos"
  | "perfil"
  | "disponibilidade"
  | "comunicacao";

const MAPA_ICONES: Record<NomeIconePortal, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  alunos: Users,
  pedidos: ClipboardList,
  propostas: Inbox,
  aulas: GraduationCap,
  agenda: Calendar,
  pagamentos: CreditCard,
  remuneracoes: DollarSign,
  avaliacoes: Star,
  ocorrencias: AlertTriangle,
  precos: Calculator,
  catalogo: BookOpen,
  contratos: FileText,
  perfil: UserCheck,
  disponibilidade: Clock,
  comunicacao: MessageSquare,
};

export interface ItemNavegacaoPortal {
  rotulo: string;
  href: string;
  icone: NomeIconePortal;
  badge?: number | string | null;
  corBadge?: "aviso" | "perigo" | "info" | "sucesso";
  exato?: boolean;
}

interface BarraNavegacaoPortalProps {
  tituloPortal: string;
  subtitulo?: string;
  itens: ItemNavegacaoPortal[];
  corTema?: "azul" | "esmeralda" | "roxo" | "ambar";
}

export function BarraNavegacaoPortal({
  tituloPortal,
  subtitulo,
  itens,
  corTema = "azul",
}: BarraNavegacaoPortalProps) {
  const pathname = usePathname();

  const coresTema = {
    azul: {
      bordaAtiva: "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/30",
      fundoAtivo: "text-blue-600 dark:text-blue-400",
    },
    esmeralda: {
      bordaAtiva: "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30",
      fundoAtivo: "text-emerald-600 dark:text-emerald-400",
    },
    roxo: {
      bordaAtiva: "border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-950/30",
      fundoAtivo: "text-purple-600 dark:text-purple-400",
    },
    ambar: {
      bordaAtiva: "border-amber-500 text-amber-600 dark:text-amber-400 dark:border-amber-400 bg-amber-50/50 dark:bg-amber-950/30",
      fundoAtivo: "text-amber-600 dark:text-amber-400",
    },
  };

  const estiloTema = coresTema[corTema];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-16 z-40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 sm:hidden">
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {tituloPortal} {subtitulo ? `— ${subtitulo}` : ""}
          </span>
        </div>

        {/* Barra de abas com scroll horizontal suave no telemóvel */}
        <nav
          aria-label="Navegação do Portal"
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth"
        >
          {itens.map((item) => {
            const Icone = MAPA_ICONES[item.icone] || Sparkles;
            const estaAtivo = item.exato
              ? pathname === item.href
              : pathname === item.href ||
                (item.href !== "/portal-encarregado" &&
                  item.href !== "/portal-professor" &&
                  item.href !== "/administracao" &&
                  pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-normal rounded-xl whitespace-nowrap transition-all duration-150 shrink-0",
                  estaAtivo
                    ? cn("shadow-xs font-medium border", estiloTema.bordaAtiva)
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                <Icone
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    estaAtivo ? estiloTema.fundoAtivo : "text-slate-400 dark:text-slate-500"
                  )}
                />
                <span>{item.rotulo}</span>

                {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                  <span
                    className={cn(
                      "ml-1 text-[10px] font-medium px-1.5 py-0.2 rounded-full",
                      item.corBadge === "perigo"
                        ? "bg-rose-500 text-white"
                        : item.corBadge === "aviso"
                        ? "bg-amber-400 text-slate-950"
                        : item.corBadge === "sucesso"
                        ? "bg-emerald-500 text-white"
                        : "bg-blue-600 text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
