import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface CabecalhoPaginaProps {
  /** Título principal da página. */
  titulo: string;
  /** Texto de apoio underneath do título. */
  descricao?: string;
  /** Trilho de navegação (ex.: Administração › Pedidos). */
  caminho?: { rotulo: string; href?: string }[];
  /** Ações à direita (botões, filtros, ligações). */
  acoes?: React.ReactNode;
  className?: string;
}

/**
 * Cabeçalho normalizado de todas as páginas do painel de administração.
 * Tipografia Segoe UI regular e separadores de 10px, em coerência com
 * a identidade visual da TM-Educa.
 */
export function CabecalhoPagina({
  titulo,
  descricao,
  caminho,
  acoes,
  className,
}: CabecalhoPaginaProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800",
        "lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-2">
        {caminho && caminho.length > 0 && (
          <nav
            aria-label="Trilho de navegação"
            className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400"
          >
            {caminho.map((passo, indice) => (
              <React.Fragment key={`${passo.rotulo}-${indice}`}>
                {indice > 0 && (
                  <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                )}
                {passo.href ? (
                  <Link
                    href={passo.href}
                    className="transition-colors hover:text-[#FF2D75]"
                  >
                    {passo.rotulo}
                  </Link>
                ) : (
                  <span className="text-slate-600 dark:text-slate-300">
                    {passo.rotulo}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="text-xl font-normal tracking-tight text-slate-900 sm:text-2xl dark:text-white">
          {titulo}
        </h1>

        {descricao && (
          <p className="max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            {descricao}
          </p>
        )}
      </div>

      {acoes && (
        <div className="flex flex-wrap items-center gap-2">{acoes}</div>
      )}
    </header>
  );
}
