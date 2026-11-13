"use client";

import React, { useEffect, useState, useRef } from "react";
import { RevelarAoRolar } from "@/componentes/animacao/revelar-ao-rolar";

interface MetricaItem {
  valorAlvo: number;
  prefixo?: string;
  sufixo?: string;
  casasDecimais?: number;
  rotulo: string;
}

const METRICAS: MetricaItem[] = [
  {
    valorAlvo: 500,
    prefixo: "+",
    rotulo: "FAMÍLIAS ACOMPANHADAS",
  },
  {
    valorAlvo: 150,
    prefixo: "+",
    rotulo: "EXPLICADORES AUDITADOS",
  },
  {
    valorAlvo: 98,
    sufixo: "%",
    rotulo: "TAXA DE SUCESSO ESCOLAR",
  },
  {
    valorAlvo: 12000,
    prefixo: "+",
    rotulo: "HORAS DE EXPLICAÇÃO",
  },
];

function ContadorAnimado({
  alvo,
  prefixo = "",
  sufixo = "",
  ativo,
}: {
  alvo: number;
  prefixo?: string;
  sufixo?: string;
  ativo: boolean;
}) {
  const [contagem, setContagem] = useState(0);

  useEffect(() => {
    if (!ativo) return;

    let frameId: number;
    const duracaoMs = 2200;
    const inicioTimestamp = performance.now();

    const animar = (tempoAtual: number) => {
      const decorrido = tempoAtual - inicioTimestamp;
      const progresso = Math.min(decorrido / duracaoMs, 1);
      // Easing cúbico desacelerado para transição elegante
      const easeOut = 1 - Math.pow(1 - progresso, 3);
      const valorAtual = Math.floor(easeOut * alvo);

      setContagem(valorAtual);

      if (progresso < 1) {
        frameId = requestAnimationFrame(animar);
      } else {
        setContagem(alvo);
      }
    };

    frameId = requestAnimationFrame(animar);

    return () => cancelAnimationFrame(frameId);
  }, [ativo, alvo]);

  const valorFormatado =
    alvo >= 1000
      ? contagem.toLocaleString("pt-AO")
      : contagem.toString();

  return (
    <span className="text-3xl sm:text-4xl lg:text-[46px] font-normal text-white tracking-tight leading-none tabular-nums inline-block transition-transform duration-300 group-hover:scale-105">
      {prefixo}
      {valorFormatado}
      {sufixo}
    </span>
  );
}

/**
 * Secção 7: Resultados / Números
 * Barra horizontal minimalista com contadores numéricos animados e dinâmicos ao rolar.
 * Fundo no azul oficial da marca (#07182E — --brand-navy).
 */
export function SeccaoResultadosNumeros() {
  const [visivel, setVisivel] = useState(false);
  const seccaoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = seccaoRef.current;
    if (!el) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <section
      ref={seccaoRef}
      id="numeros"
      className="relative w-full bg-[#07182E] py-14 sm:py-18 border-y-2 border-[#102A45] text-white font-normal scroll-mt-20 overflow-hidden"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      {/* Luz ambiente animada no fundo dos números */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#FF2D75_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#FF2D75]/10 blur-[100px] pointer-events-none animate-pulse" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 items-center text-center">
          {METRICAS.map((item, idx) => (
            <RevelarAoRolar
              key={idx}
              animacao="fade-up"
              atrasoMs={idx * 120}
              className="h-full"
            >
              <div className="group flex flex-col items-center justify-center space-y-2 sm:space-y-2.5 p-3 rounded-xl transition-all duration-300 hover:bg-[#102A45]/30">
                <ContadorAnimado
                  alvo={item.valorAlvo}
                  prefixo={item.prefixo}
                  sufixo={item.sufixo}
                  ativo={visivel}
                />
                <span className="text-[11px] sm:text-xs font-normal text-slate-300 group-hover:text-white uppercase tracking-widest transition-colors duration-200">
                  {item.rotulo}
                </span>
                <span className="w-6 h-[2px] bg-[#FF2D75]/40 rounded-full group-hover:w-10 group-hover:bg-[#FF2D75] transition-all duration-300" />
              </div>
            </RevelarAoRolar>
          ))}
        </div>
      </div>
    </section>
  );
}
