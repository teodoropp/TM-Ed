import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { Botao } from "@/componentes/ui/botao";

interface EstadoVazioPaisProps {
  /** Ícone ilustrativo do estado vazio. */
  icone: LucideIcon;
  /** Título principal do aviso. */
  titulo: string;
  /** Explicação do que o pai deve fazer a seguir. */
  descricao: string;
  /** Ação principal (ligação interna). */
  acao?: { rotulo: string; href: string };
  /** Paleta do ícone: neutro, sucesso ou aviso. */
  tom?: "neutro" | "sucesso" | "aviso";
  className?: string;
}

const TONS = {
  neutro: {
    icone: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  },
  sucesso: {
    icone: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  },
  aviso: {
    icone: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
  },
};

/**
 * Estado vazio padronizado do Portal dos Pais.
 *
 * Todas as listas do portal partilham o mesmo tratamento visual, com uma
 * explicação clara e, quando aplicável, a acção que resolve a situação.
 */
export function EstadoVazioPais({
  icone: Icone,
  titulo,
  descricao,
  acao,
  tom = "neutro",
  className,
}: EstadoVazioPaisProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-slate-200/80 bg-white/70 backdrop-blur-sm px-6 py-14 text-center dark:border-slate-800/80 dark:bg-slate-900/60 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700",
        className
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl ring-1 shadow-sm transition-transform duration-300 hover:scale-105",
          tom === "sucesso"
            ? "bg-emerald-50 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/30"
            : tom === "aviso"
            ? "bg-amber-50 text-amber-600 ring-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/30"
            : "bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"
        )}
      >
        <Icone className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{titulo}</h3>

      <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {descricao}
      </p>

      {acao && (
        <Link href={acao.href} className="mt-6">
          <Botao className="gap-2 shadow-sm rounded-xl px-5 py-2.5 transition-all hover:scale-102 hover:shadow-md">
            {acao.rotulo}
          </Botao>
        </Link>
      )}
    </div>
  );
}
