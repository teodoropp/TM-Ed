/** @format */

import * as React from "react";
import { cn } from "@/lib/utils";

export type EspacamentoSecao = "nenhum" | "sm" | "md" | "lg" | "xl";
export type VarianteSecao =
  | "padrao"
  | "suave"
  | "destaque"
  | "escuro"
  | "cinza"
  | "muted"
  | "default";

const mapaEspacamentos: Record<EspacamentoSecao, string> = {
  nenhum: "py-0",
  sm: "py-8 sm:py-12",
  md: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-24 lg:py-32",
  xl: "py-24 sm:py-32 lg:py-40",
};

const mapaVariantes: Record<string, string> = {
  padrao: "bg-background text-foreground",
  default: "bg-background text-foreground",
  suave: "bg-muted/50 text-foreground",
  muted: "bg-muted/50 text-foreground",
  destaque: "bg-primary text-primary-foreground",
  escuro: "bg-primary-dark text-white",
  cinza: "bg-slate-50 text-foreground border-y border-border",
};

export interface PropriedadesSecao extends React.HTMLAttributes<HTMLElement> {
  espacamento?: EspacamentoSecao;
  variante?: VarianteSecao;
  spacing?: EspacamentoSecao; // compatibilidade
  variant?: VarianteSecao; // compatibilidade
}

export const Secao = React.forwardRef<HTMLElement, PropriedadesSecao>(
  (
    {
      className,
      espacamento = "lg",
      variante = "padrao",
      spacing,
      variant,
      ...props
    },
    ref,
  ) => {
    const estiloEspacamento =
      mapaEspacamentos[spacing || espacamento] || mapaEspacamentos.lg;
    const estiloVariante =
      mapaVariantes[variant || variante] || mapaVariantes.padrao;

    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden",
          estiloEspacamento,
          estiloVariante,
          className,
        )}
        {...props}
      />
    );
  },
);

Secao.displayName = "Secao";

// Compatibilidade
export const Section = Secao;
