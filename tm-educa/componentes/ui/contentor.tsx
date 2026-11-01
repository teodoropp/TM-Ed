/** @format */

import * as React from "react";
import { cn } from "@/lib/utils";

export type TamanhoContentor = "sm" | "md" | "lg" | "xl" | "completo";

const mapaTamanhos: Record<TamanhoContentor, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  completo: "max-w-full",
};

export interface PropriedadesContentor extends React.HTMLAttributes<HTMLDivElement> {
  tamanho?: TamanhoContentor;
  size?: TamanhoContentor; // compatibilidade
  elemento?: React.ElementType;
}

export const Contentor = React.forwardRef<
  HTMLDivElement,
  PropriedadesContentor
>(
  (
    { className, tamanho = "xl", size, elemento: Elemento = "div", ...props },
    ref,
  ) => {
    const estiloTamanho = mapaTamanhos[size || tamanho] || mapaTamanhos.xl;

    return (
      <Elemento
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          estiloTamanho,
          className,
        )}
        {...props}
      />
    );
  },
);

Contentor.displayName = "Contentor";

// Compatibilidade
export const Container = Contentor;
