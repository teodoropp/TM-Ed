import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, type LucideIcon } from "lucide-react";

interface CabecalhoPaginaProfessorProps {
  /** Título principal da página. */
  titulo: string;
  /** Texto de apoio por baixo do título. */
  descricao?: string;
  /** Ícone apresentado à esquerda do título. */
  icone?: LucideIcon;
  /** Ligações de navegação (migalhas) exibidas acima do título. */
  caminho?: { rotulo: string; href?: string }[];
  /** Ações à direita (botões, ligações). */
  acoes?: React.ReactNode;
  className?: string;
}

/**
 * Cabeçalho normalizado de todas as páginas do Portal do Professor.
 */
export function CabecalhoPaginaProfessor({
  titulo,
  descricao,
  icone: Icone,
  caminho,
  acoes,
  className,
}: CabecalhoPaginaProfessorProps) {
  return (
    <header
      className={cn(
        "relative flex flex-col gap-5 border-b border-slate-200/60 pb-6 lg:flex-row lg:items-end lg:justify-between dark:border-slate-800/60",
        className
      )}
    >
      <div className="min-w-0 space-y-2.5">
        {caminho && caminho.length > 0 && (
          <nav
            aria-label="Trilho de navegação"
            className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-normal"
          >
            {caminho.map((passo, indice) => (
              <React.Fragment key={`${passo.rotulo}-${indice}`}>
                {indice > 0 && (
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                )}
                {passo.href ? (
                  <Link
                    href={passo.href}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-[#FF2D75] text-slate-500 dark:text-slate-400"
                  >
                    {indice === 0 && <ArrowLeft className="h-3.5 w-3.5" />}
                    {passo.rotulo}
                  </Link>
                ) : (
                  <span className="font-normal text-slate-700 dark:text-slate-300">
                    {passo.rotulo}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {Icone && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/25 shadow-xs transition-transform duration-300 hover:scale-105">
              <Icone className="h-5 w-5" />
            </div>
          )}
          <h1 className="text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {titulo}
          </h1>
        </div>

        {descricao && (
          <p className="max-w-3xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-normal">
            {descricao}
          </p>
        )}
      </div>

      {acoes && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {acoes}
        </div>
      )}
    </header>
  );
}
