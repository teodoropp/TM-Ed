import * as React from "react";
import { cn } from "@/lib/utils";

export interface PropriedadesBadge extends React.HTMLAttributes<HTMLDivElement> {
  variante?: "sucesso" | "aviso" | "info" | "perigo" | "neutro";
}

export function Badge({
  className,
  variante = "neutro",
  ...props
}: PropriedadesBadge) {
  const variantesClasses = {
    sucesso:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    aviso:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    info:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    perigo:
      "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    neutro:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantesClasses[variante],
        className
      )}
      {...props}
    />
  );
}
