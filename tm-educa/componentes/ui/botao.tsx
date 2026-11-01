import * as React from "react";
import { cn } from "@/lib/utils";

export interface PropriedadesBotao
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario" | "destaque" | "fantasma" | "contorno";
  tamanho?: "sm" | "md" | "lg";
}

export const Botao = React.forwardRef<HTMLButtonElement, PropriedadesBotao>(
  ({ className, variante = "primario", tamanho = "md", children, ...props }, ref) => {
    const variantesClasses = {
      primario:
        "bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-[0.98]",
      secundario:
        "bg-slate-800 text-white hover:bg-slate-900 shadow-sm active:scale-[0.98]",
      destaque:
        "bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 shadow-md active:scale-[0.98]",
      fantasma:
        "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
      contorno:
        "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    };

    const tamanhosClasses = {
      sm: "h-8 px-3 text-xs rounded-[10px]",
      md: "h-10 px-4 py-2 text-sm rounded-[10px]",
      lg: "h-12 px-6 text-base rounded-[10px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-normal transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D75] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantesClasses[variante],
          tamanhosClasses[tamanho],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Botao.displayName = "Botao";
