import * as React from "react";
import { cn } from "@/lib/utils";

export const Cartao = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[5px] border border-slate-200/80 bg-white text-slate-900 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100",
      className
    )}
    {...props}
  />
));
Cartao.displayName = "Cartao";

export const CartaoCabecalho = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CartaoCabecalho.displayName = "CartaoCabecalho";

export const CartaoTitulo = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-normal leading-tight tracking-tight text-slate-900 dark:text-slate-100",
      className
    )}
    {...props}
  />
));
CartaoTitulo.displayName = "CartaoTitulo";

export const CartaoDescricao = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)}
    {...props}
  />
));
CartaoDescricao.displayName = "CartaoDescricao";

export const CartaoConteudo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CartaoConteudo.displayName = "CartaoConteudo";

export const CartaoRodape = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CartaoRodape.displayName = "CartaoRodape";
