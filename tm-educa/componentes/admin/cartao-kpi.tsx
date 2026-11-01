import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type TomCartaoKpi = "rosa" | "azul" | "esmeralda" | "ambar" | "roxo" | "neutro";

interface CartaoKpiProps {
  /** Etiqueta do indicador. */
  rotulo: string;
  /** Valor principal (já formatado). */
  valor: string | number;
  /** Texto secundário por baixo do valor. */
  detalhe?: string;
  /** Ícone apresentado no canto superior direito. */
  icone?: React.ReactNode;
  /** Paleta de destaque. */
  tom?: TomCartaoKpi;
  /** Variação percentual (ex.: "+12%"), apresentada com seta. */
  variacao?: { valor: string; positiva?: boolean };
  /** Torna o cartão clicável. */
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

const TONS: Record<TomCartaoKpi, { icone: string; variacao: string }> = {
  rosa: {
    icone: "bg-[#FF2D75]/10 text-[#FF2D75]",
    variacao: "text-emerald-600 dark:text-emerald-400",
  },
  azul: {
    icone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    variacao: "text-emerald-600 dark:text-emerald-400",
  },
  esmeralda: {
    icone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    variacao: "text-emerald-600 dark:text-emerald-400",
  },
  ambar: {
    icone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    variacao: "text-amber-600 dark:text-amber-400",
  },
  roxo: {
    icone: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    variacao: "text-emerald-600 dark:text-emerald-400",
  },
  neutro: {
    icone: "bg-slate-500/10 text-slate-500 dark:text-slate-400",
    variacao: "text-slate-500 dark:text-slate-400",
  },
};

/**
 * Cartão de indicador chave (KPI) do painel de administração.
 * Formato compacto, com raio de 10px e tipografia Segoe UI regular.
 */
export function CartaoKpi({
  rotulo,
  valor,
  detalhe,
  icone,
  tom = "neutro",
  variacao,
  href,
  className,
  children,
}: CartaoKpiProps) {
  const paleta = TONS[tom] ?? TONS.neutro;

  const conteudo = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">{rotulo}</p>
        {icone && (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px]",
              paleta.icone
            )}
          >
            {icone}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-baseline gap-2 pt-3">
        <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {valor}
        </span>
        {variacao && (
          <span className={cn("text-[11px]", paleta.variacao)}>
            {variacao.valor}
          </span>
        )}
      </div>

      {detalhe && (
        <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {detalhe}
        </p>
      )}

      {children}
    </>
  );

  const classes = cn(
    "flex h-full flex-col rounded-[5px] border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800/80 dark:bg-[#07182E]",
    href && "hover:border-[#FF2D75]/50",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {conteudo}
      </Link>
    );
  }

  return <div className={classes}>{conteudo}</div>;
}
