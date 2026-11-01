import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, type LucideIcon } from "lucide-react";

interface CabecalhoPaginaPaisProps {
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
 * Cabeçalho normalizado de todas as páginas do Portal dos Pais.
 *
 * Garante hierarquia visual idêntica em todo o portal: voltar, migalhas,
 * título com ícone, descrição e área de ações.
 */
export function CabecalhoPaginaPais({
  titulo,
  descricao,
  icone: Icone,
  caminho,
  acoes,
  className,
}: CabecalhoPaginaPaisProps) {
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
            className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium"
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
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">
                    {passo.rotulo}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3.5">
          {Icone && (
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF2D75]/15 to-[#FF2D75]/5 text-[#FF2D75] ring-1 ring-[#FF2D75]/20 shadow-sm transition-transform duration-200 hover:scale-105">
              <Icone className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {titulo}
            </h1>
            {descricao && (
              <p className="mt-1 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {descricao}
              </p>
            )}
          </div>
        </div>
      </div>

      {acoes && (
        <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0 shrink-0">
          {acoes}
        </div>
      )}
    </header>
  );
}
