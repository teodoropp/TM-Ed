import * as React from "react";
import { cn } from "@/lib/utils";

interface BarraGrafico {
  rotulo: string;
  valor: number;
  /** Cor CSS da barra (por omissão usa a cor da marca). */
  cor?: string;
}

interface GraficoBarrasProps {
  dados: BarraGrafico[];
  /** Altura da área do gráfico em pixels. */
  altura?: number;
  /** Texto formatado para o valor apresentado na dica. */
  formatador?: (valor: number) => string;
  className?: string;
}

/**
 * Gráfico de barras leve, construído apenas com CSS (sem dependências externas).
 * Utilizado no painel de administração para volume de pedidos, aulas e receita.
 */
export function GraficoBarras({
  dados,
  altura = 180,
  formatador = (valor) => String(valor),
  className,
}: GraficoBarrasProps) {
  const maximo = Math.max(...dados.map((d) => d.valor), 1);

  return (
    <div className={cn("w-full", className)}>
      <div
        className="flex items-end gap-2 sm:gap-3"
        style={{ height: `${altura}px` }}
      >
        {dados.map((barra) => {
          const percentagem = Math.max((barra.valor / maximo) * 100, 2);

          return (
            <div
              key={barra.rotulo}
              className="group flex h-full flex-1 flex-col justify-end"
              title={`${barra.rotulo}: ${formatador(barra.valor)}`}
            >
              <div
                className="w-full rounded-t-[6px] transition-all duration-300"
                style={{
                  height: `${percentagem}%`,
                  backgroundColor: barra.cor ?? "#FF2D75",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-end gap-2 border-t border-slate-100 pt-2 sm:gap-3 dark:border-slate-800">
        {dados.map((barra) => (
          <span
            key={barra.rotulo}
            className="flex-1 truncate text-center text-[10px] text-slate-500 dark:text-slate-400"
          >
            {barra.rotulo}
          </span>
        ))}
      </div>
    </div>
  );
}

interface AnelProgressoProps {
  /** Percentagem (0 a 100). */
  percentagem: number;
  /** Texto no centro do anel. */
  rotulo?: string;
  /** Texto secundário por baixo da percentagem. */
  subRotulo?: string;
  tamanho?: number;
  cor?: string;
  className?: string;
}

/**
 * Anel de progresso em SVG, usado nos cartões bento de estado (taxa de
 * resolução, taxa de ocupação, etc.).
 */
export function AnelProgresso({
  percentagem,
  rotulo,
  subRotulo,
  tamanho = 132,
  cor = "#FF2D75",
  className,
}: AnelProgressoProps) {
  const raio = 52;
  const circunferencia = 2 * Math.PI * raio;
  const preenchido = (Math.min(Math.max(percentagem, 0), 100) / 100) * circunferencia;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative shrink-0" style={{ width: tamanho, height: tamanho }}>
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full -rotate-90"
          role="img"
          aria-label={`Progresso: ${Math.round(percentagem)}%`}
        >
          <circle
            cx="60"
            cy="60"
            r={raio}
            fill="none"
            strokeWidth="10"
            className="stroke-slate-100 dark:stroke-slate-800"
          />
          <circle
            cx="60"
            cy="60"
            r={raio}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            stroke={cor}
            strokeDasharray={`${preenchido} ${circunferencia}`}
            className="transition-all duration-700"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl text-slate-900 dark:text-white">
            {rotulo ?? `${Math.round(percentagem)}%`}
          </span>
          {subRotulo && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {subRotulo}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface BarraProgressoProps {
  rotulo: string;
  valor: number;
  total: number;
  cor?: string;
  className?: string;
}

/**
 * Barra de progresso linear com legenda, para Occupation/taxa de estados.
 */
export function BarraProgresso({
  rotulo,
  valor,
  total,
  cor = "#FF2D75",
  className,
}: BarraProgressoProps) {
  const percentagem = total > 0 ? (valor / total) * 100 : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-600 dark:text-slate-300">{rotulo}</span>
        <span className="text-slate-500 dark:text-slate-400">
          {valor} · {Math.round(percentagem)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentagem}%`, backgroundColor: cor }}
        />
      </div>
    </div>
  );
}
