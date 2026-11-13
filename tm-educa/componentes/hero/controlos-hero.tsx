import React from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { DadosSlideHero } from "./dados-slides-hero";

interface PropsControlosHero {
  slides: DadosSlideHero[];
  indiceAtual: number;
  emReproducao: boolean;
  aoMudarSlide: (novoIndice: number) => void;
  aoAlternarReproducao: () => void;
  aoRetroceder: () => void;
  aoAvancar: () => void;
}

/**
 * Controlos de navegação inspirados no modelo de referência full-screen.
 * Setas circulares discretas nas margens da tela e indicadores centralizados na base.
 */
export function ControlosHero({
  slides,
  indiceAtual,
  emReproducao,
  aoMudarSlide,
  aoAlternarReproducao,
  aoRetroceder,
  aoAvancar,
}: PropsControlosHero) {
  return (
    <>
      {/* Seta Lateral Esquerda (Borda da Tela - Oculta em telemóveis para não obstruir o conteúdo, onde há suporte a Swipe táctil) */}
      <button
        type="button"
        onClick={aoRetroceder}
        aria-label="Slide anterior"
        className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md shadow-2xl items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Seta Lateral Direita (Borda da Tela) */}
      <button
        type="button"
        onClick={aoAvancar}
        aria-label="Próximo slide"
        className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md shadow-2xl items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Indicadores Centrais na Base Inferior (Estilo Referência) */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((slide, idx) => {
          const estaAtivo = idx === indiceAtual;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => aoMudarSlide(idx)}
              aria-label={`Ir para o slide ${idx + 1}`}
              aria-current={estaAtivo ? "true" : undefined}
              className="py-2 focus:outline-none cursor-pointer transition-all"
            >
              <div
                className={`transition-all duration-300 rounded-full ${
                  estaAtivo
                    ? "w-7 md:w-8 h-2 bg-[#ff2d75] shadow-lg shadow-pink-500/50"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            </button>
          );
        })}

        {/* Botão sutil de pausa/play para acessibilidade WCAG */}
        <button
          type="button"
          onClick={aoAlternarReproducao}
          aria-label={emReproducao ? "Pausar rotação automática" : "Retomar rotação automática"}
          title={emReproducao ? "Pausar" : "Reproduzir"}
          className="ml-2 w-6 h-6 rounded-full bg-black/30 hover:bg-black/60 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          {emReproducao ? (
            <Pause className="w-2.5 h-2.5" />
          ) : (
            <Play className="w-2.5 h-2.5 ml-0.5" />
          )}
        </button>
      </div>
    </>
  );
}
