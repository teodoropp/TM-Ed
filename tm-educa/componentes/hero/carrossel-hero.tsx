"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SLIDES_HERO } from "./dados-slides-hero";
import { SlideHero } from "./slide-hero";
import { ControlosHero } from "./controlos-hero";

const INTERVALO_AUTOPLAY_MS = 6000;

/**
 * Carrossel interactivo da secção Hero da TM-Educa.
 * Altura optimizada para acomodar as imagens em escala completa sem cortes,
 * com gradiente sutil no topo para contraste perfeito do menu transparente.
 */
export function CarrosselHero() {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [emReproducao, setEmReproducao] = useState(true);
  const [emPausaTemporaria, setEmPausaTemporaria] = useState(false);

  const toqueInicioX = useRef<number | null>(null);
  const toqueFimX = useRef<number | null>(null);
  const contentorRef = useRef<HTMLDivElement>(null);

  const totalSlides = SLIDES_HERO.length;

  const avancar = useCallback(() => {
    setIndiceAtual((anterior) => (anterior + 1) % totalSlides);
  }, [totalSlides]);

  const retroceder = useCallback(() => {
    setIndiceAtual((anterior) => (anterior - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const mudarParaSlide = useCallback((novoIndice: number) => {
    setIndiceAtual(novoIndice);
  }, []);

  const alternarReproducao = useCallback(() => {
    setEmReproducao((anterior) => !anterior);
  }, []);

  // Gestão do temporizador de rotação automática
  useEffect(() => {
    if (!emReproducao || emPausaTemporaria) return;

    const temporizador = setInterval(() => {
      avancar();
    }, INTERVALO_AUTOPLAY_MS);

    return () => clearInterval(temporizador);
  }, [emReproducao, emPausaTemporaria, avancar, indiceAtual]);

  // Navegação por teclado
  const aoPressionarTecla = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      retroceder();
    } else if (e.key === "ArrowRight") {
      avancar();
    }
  };

  // Suporte táctil (Touch / Swipe)
  const aoIniciarToque = (e: React.TouchEvent) => {
    toqueInicioX.current = e.touches[0].clientX;
    toqueFimX.current = null;
  };

  const aoMoverToque = (e: React.TouchEvent) => {
    toqueFimX.current = e.touches[0].clientX;
  };

  const aoTerminarToque = () => {
    if (toqueInicioX.current === null || toqueFimX.current === null) return;
    const distancia = toqueInicioX.current - toqueFimX.current;
    const LIMIAR_SWIPE = 50;

    if (distancia > LIMIAR_SWIPE) {
      avancar();
    } else if (distancia < -LIMIAR_SWIPE) {
      retroceder();
    }

    toqueInicioX.current = null;
    toqueFimX.current = null;
  };

  return (
    <div
      ref={contentorRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Campanha TM-Educa"
      tabIndex={0}
      onKeyDown={aoPressionarTecla}
      onMouseEnter={() => setEmPausaTemporaria(true)}
      onMouseLeave={() => setEmPausaTemporaria(false)}
      onFocus={() => setEmPausaTemporaria(true)}
      onBlur={() => setEmPausaTemporaria(false)}
      onTouchStart={aoIniciarToque}
      onTouchMove={aoMoverToque}
      onTouchEnd={aoTerminarToque}
      /* Altura proporcional para que as imagens apareçam por completo sem cortes */
      className="relative w-full h-[460px] sm:h-[520px] md:h-[580px] lg:h-[620px] xl:h-[660px] overflow-hidden bg-slate-900 outline-none"
    >
      {/* Véu sutil de protecção no topo para manter a legibilidade do menu transparente */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/25 via-black/10 to-transparent pointer-events-none z-20" />

      {/* Slides com dimensionamento proporcional integral */}
      {SLIDES_HERO.map((slide, idx) => (
        <SlideHero
          key={slide.id}
          slide={slide}
          estaAtivo={idx === indiceAtual}
          ePrimeiroSlide={idx === 0}
          totalSlides={SLIDES_HERO.length}
        />
      ))}

      {/* Controlos Laterais e Indicadores Centrais na Base */}
      <ControlosHero
        slides={SLIDES_HERO}
        indiceAtual={indiceAtual}
        emReproducao={emReproducao && !emPausaTemporaria}
        aoMudarSlide={mudarParaSlide}
        aoAlternarReproducao={alternarReproducao}
        aoRetroceder={retroceder}
        aoAvancar={avancar}
      />
    </div>
  );
}
