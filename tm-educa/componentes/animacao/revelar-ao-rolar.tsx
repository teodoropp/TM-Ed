"use client";

import React, { useEffect, useRef, useState } from "react";

interface PropsRevelarAoRolar {
  children: React.ReactNode;
  animacao?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "scale-up";
  duracaoMs?: number;
  atrasoMs?: number;
  className?: string;
  distanciaPx?: number;
  desencadearUmaVez?: boolean;
}

/**
 * Componente de revelação suave e profissional ao rolar (Scroll Reveal).
 * Utiliza IntersectionObserver nativo de alta performance (60 FPS) para animar
 * a entrada de secções, cartões e títulos sem dependências pesadas.
 */
export function RevelarAoRolar({
  children,
  animacao = "fade-up",
  duracaoMs = 700,
  atrasoMs = 0,
  className = "",
  distanciaPx = 28,
  desencadearUmaVez = true,
}: PropsRevelarAoRolar) {
  const [visivel, setVisivel] = useState(false);
  const elementoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = elementoRef.current;
    if (!elemento) return;

    // Se o utilizador prefere movimento reduzido no SO, exibe imediatamente
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisivel(true);
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            setVisivel(true);
            if (desencadearUmaVez) {
              observador.unobserve(entrada.target);
            }
          } else if (!desencadearUmaVez) {
            setVisivel(false);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    observador.observe(elemento);

    return () => {
      observador.disconnect();
    };
  }, [desencadearUmaVez]);

  const obterEstiloTransform = () => {
    if (visivel) return "translate3d(0, 0, 0) scale(1)";

    switch (animacao) {
      case "fade-up":
        return `translate3d(0, ${distanciaPx}px, 0)`;
      case "fade-down":
        return `translate3d(0, -${distanciaPx}px, 0)`;
      case "fade-left":
        return `translate3d(-${distanciaPx}px, 0, 0)`;
      case "fade-right":
        return `translate3d(${distanciaPx}px, 0, 0)`;
      case "zoom-in":
      case "scale-up":
        return `scale(0.92) translate3d(0, ${distanciaPx / 2}px, 0)`;
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  return (
    <div
      ref={elementoRef}
      className={`transition-all ${className}`}
      style={{
        opacity: visivel ? 1 : 0,
        transform: obterEstiloTransform(),
        transitionDuration: `${duracaoMs}ms`,
        transitionDelay: `${atrasoMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

