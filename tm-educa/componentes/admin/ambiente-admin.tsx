import * as React from "react";
import { cn } from "@/lib/utils";

interface AmbienteAdminProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Contentor padrão das páginas do painel de administração.
 * Garante largura máxima, respiro lateral e ritmo vertical consistente.
 */
export function AmbienteAdmin({ children, className }: AmbienteAdminProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabelaAdminProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Invólucro de tabela com deslocamento horizontal, cabeçalho e linhas
 * padronizados (Segoe UI regular, bordas de 5px).
 */
export function TabelaAdmin({ children, className }: TabelaAdminProps) {
  return (
    <div
      className={cn(
        "sem-barra w-full overflow-x-auto rounded-[5px] border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#07182E]",
        className
      )}
    >
      <table className="w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function CabecalhoTabela({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60">
      <tr className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {children}
      </tr>
    </thead>
  );
}

export function CorpoTabela({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
      {children}
    </tbody>
  );
}

export function CelulaTabela({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-4 py-3 align-middle text-slate-600 dark:text-slate-300", className)}
      {...props}
    >
      {children}
    </td>
  );
}

export function CabecalhoCelula({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-4 py-3 font-normal", className)}
      {...props}
    >
      {children}
    </th>
  );
}
