/** @format */

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DadosSlideHero } from "./dados-slides-hero";

interface PropsSlideHero {
  slide: DadosSlideHero;
  estaAtivo: boolean;
  ePrimeiroSlide: boolean;
  totalSlides?: number;
}

/**
 * Componente responsável por renderizar um slide individual da secção Hero.
 * Card com cantos retos (sem curvas), tipografia Segoe UI regular (sem bold),
 * badge limpo sem pontinho, sem borda e sem fundo.
 */
export function SlideHero({
  slide,
  estaAtivo,
  ePrimeiroSlide,
  totalSlides = 5,
}: PropsSlideHero) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${slide.ordem} de ${totalSlides}: ${slide.titulo}`}
      aria-hidden={!estaAtivo}
      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
        estaAtivo
          ? "opacity-100 z-10 pointer-events-auto"
          : "opacity-0 z-0 pointer-events-none"
      }`}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Imagem Desktop (>= 768px) com cobertura total, foco no topo e animação fluida Ken Burns */}
        <div className="hidden md:block relative w-full h-full">
          <Image
            src={slide.imagemDesktop}
            alt={slide.textoAlternativo}
            fill
            priority={ePrimeiroSlide}
            sizes="100vw"
            quality={92}
            className={`object-cover object-top select-none transition-transform duration-[7000ms] ease-out ${
              estaAtivo ? "scale-105" : "scale-100"
            }`}
          />
        </div>

        {/* Imagem Mobile (< 768px) adaptada para enquadramento focado e leve movimento */}
        <div className="block md:hidden relative w-full h-full">
          <Image
            src={slide.imagemMobile}
            alt={slide.textoAlternativo}
            fill
            priority={ePrimeiroSlide}
            sizes="100vw"
            quality={92}
            className={`object-cover object-top select-none transition-transform duration-[7000ms] ease-out ${
              estaAtivo ? "scale-105" : "scale-100"
            }`}
          />
        </div>

        {/* Ligação de Ação acessível sobre o slide de fundo */}
        {slide.linkAcao && (
          <Link
            href={slide.linkAcao}
            tabIndex={estaAtivo ? 0 : -1}
            aria-label={`${slide.etiquetaAcao || "Saber mais"}: ${slide.titulo}`}
            className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff2d75]"
          />
        )}

        {/* Cartão de texto com animação fluida de entrada e saída */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-end md:items-center justify-start p-4 pb-16 sm:p-8 sm:pl-24 md:p-10 md:pl-28 lg:pl-32">
          <div
            className={`pointer-events-none relative flex w-full max-w-[360px] sm:max-w-[400px] flex-col overflow-hidden rounded-xl sm:rounded-none bg-white/95 dark:bg-[#07182E]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-700 delay-100 ${
              estaAtivo
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
            style={{
              fontFamily:
                "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
            }}>
            {/* Conteúdo com espaçamento e tipografia Segoe regular (não bold) */}
            <div className="relative space-y-2.5">
              {/* Título em Segoe Regular (sem bold) */}
              <h2
                className="text-lg sm:text-xl md:text-2xl font-normal leading-tight text-[#07182E] dark:text-white tracking-normal"
                style={{
                  fontFamily: "'Segoe UI', -apple-system, sans-serif",
                  fontWeight: 400,
                }}>
                {slide.titulo}
              </h2>

              {/* Subtítulo em Segoe Regular */}
              {slide.subtitulo && (
                <p
                  className="text-xs sm:text-[13px] font-normal leading-relaxed text-slate-600 dark:text-slate-300"
                  style={{
                    fontFamily: "'Segoe UI', -apple-system, sans-serif",
                    fontWeight: 400,
                  }}>
                  {slide.subtitulo}
                </p>
              )}

              {/* Chancelas em Segoe Regular */}
              <div
                className="pt-2 flex items-center gap-3 text-[11px] font-normal text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800"
                style={{
                  fontFamily: "'Segoe UI', -apple-system, sans-serif",
                  fontWeight: 400,
                }}>
                <span className="flex items-center gap-1 text-[#07182E] dark:text-slate-200">
                  <span className="text-[#ff2d75]">✓</span> Ao Domicílio &
                  Online
                </span>
                <span className="flex items-center gap-1 text-[#07182E] dark:text-slate-200">
                  <span className="text-[#ff2d75]">★</span> Explicadores
                  Auditados
                </span>
              </div>
            </div>

            {/* Botão com cantos retos (não curvos), Segoe Regular e efeito de brilho suave */}
            {slide.linkAcao && slide.etiquetaAcao && (
              <div className="pt-3 mt-1">
                <Link
                  href={slide.linkAcao}
                  tabIndex={estaAtivo ? 0 : -1}
                  aria-label={`${slide.etiquetaAcao}: ${slide.titulo}`}
                  style={{
                    fontFamily: "'Segoe UI', -apple-system, sans-serif",
                    fontWeight: 400,
                  }}
                  className="group shimmer-ativo pointer-events-auto inline-flex items-center gap-2 rounded-none bg-gradient-to-r from-[#ff2d75] to-[#e11d48] px-5 py-2.5 text-xs sm:text-sm font-normal text-white shadow-md shadow-pink-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#ff2d75]">
                  <span>{slide.etiquetaAcao}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
