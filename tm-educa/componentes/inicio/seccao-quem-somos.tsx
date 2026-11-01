/** @format */

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Secção institucional "Quem Somos" apresentada imediatamente após o Banner / Carrossel Hero.
 * Disposta diretamente na secção (sem card artificial, sem borda e sem fundo),
 * com espaçamento superior compacto e harmonioso, tipografia Segoe Regular,
 * micro-animações dinâmicas e imagem com formato curvo expressivo colada à borda direita.
 */
export function SeccaoQuemSomos() {
  return (
    <section
      id="quem-somos"
      className="relative w-full overflow-hidden pt-1 sm:pt-2 pb-6 sm:pb-8 lg:pb-10 font-normal scroll-mt-20"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}>
      {/* LUZ AMBIENTAL SUAVE ANIMADA EM FUNDO */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#FF2D75]/5 dark:bg-[#FF2D75]/10 blur-3xl pointer-events-none animate-pulse" />

      {/* CONTENTOR ALINHADO COM SANGRAMENTO DIRETO À BORDA DIREITA DO ECRÃ */}
      <div className="w-full max-w-[1680px] ml-auto mr-0 pl-4 sm:pl-6 lg:pl-12 xl:pl-20 pr-0">
        {/* CABEÇALHO SUPERIOR DA SECÇÃO: INDICADOR COM PULSO SUAVE */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 pr-4 sm:pr-6 lg:pr-12 xl:pr-20">
          <div className="flex items-center gap-2.5">
            <span className="w-6 sm:w-8 h-[2px] bg-[#FF2D75] rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-normal">
              QUEM SOMOS
            </span>
          </div>
        </div>

        {/* GRELHA PRINCIPAL EM 2 COLUNAS COM ANIMAÇÃO DE ENTRADA SUAVE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* COLUNA ESQUERDA: TEXTO INSTITUCIONAL E AÇÕES */}
          <div className="lg:col-span-6 space-y-4 lg:space-y-5 pr-4 sm:pr-6 lg:pr-4">
            {/* TÍTULO PRINCIPAL EM SEGOE REGULAR */}
            <h2 className="text-3xl sm:text-4xl lg:text-[35px] font-normal text-[#0A192F] dark:text-white tracking-normal leading-[1.15]">
              Mais do que somente aulas.{" "}
              <span className="block text-[#FF2D75]">
                Um futuro está em causa.
              </span>
            </h2>

            {/* TEXTOS DESCRITIVOS EM SEGOE REGULAR */}
            <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              <p>
                A TM-Educa é um ecossistema de educação e acompanhamento escolar
                que liga pais, alunos e explicadores, oferecendo soluções
                completas para o desenvolvimento académico de cada aluno.
              </p>
              <p>
                Mais do que encontrar um explicador, acompanhamos todo o
                processo, desde a solicitação até aos resultados.
              </p>
            </div>

            {/* BOTÃO DE AÇÃO COM CURVAS DE 10PX E ANIMAÇÃO DE HOVER */}
            <div className="flex flex-wrap items-center gap-4 pt-1 sm:pt-2">
              <Link
                href="/#servicos"
                className="inline-flex bg-[#0A192F] text-white transition-all duration-300 hover:translate-x-1.5 items-center justify-center gap-2.5 px-6 py-3 rounded-[5px] dark:border-slate-700 text-[#0A192F] hover:text-white dark:text-white dark:hover:bg-[#FF2D75] dark:hover:border-[#FF2D75] font-normal text-sm shadow-sm hover:shadow-md group">
                <span>Explorar Soluções</span>
                <ArrowRight className="w-4 h-4 text-[#FF2D75] transition-all duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>

          {/* COLUNA DIREITA: IMAGEM COLADA À BORDA DIREITA DO ECRÃ COM CURVAS EXPRESSIVAS E MICRO-ANIMAÇÃO */}
          <div className="lg:col-span-6 w-full flex justify-end">
            <div className="relative w-full max-w-2xl lg:max-w-none group/imagem">
              {/* LINHA DE CONTORNO ARTÍSTICA ORGÂNICA COM TRANSIÇÃO SUAVE */}
              <div className="absolute -left-3 sm:-left-5 top-1/4 bottom-2 w-28 border-l-2 border-b-2 border-[#FF2D75]/40 rounded-bl-[100px] sm:rounded-bl-[140px] pointer-events-none z-0 transition-transform duration-500 group-hover/imagem:scale-105 group-hover/imagem:-translate-x-1" />

              {/* CONTENTOR DA IMAGEM: CURVADO À ESQUERDA E COLADO À BORDA DIREITA */}
              <div className="relative z-10 w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/10] overflow-hidden rounded-tl-[80px] sm:rounded-tl-[120px] lg:rounded-tl-[160px] rounded-bl-[80px] sm:rounded-bl-[120px] lg:rounded-bl-[160px] rounded-tr-[10px] lg:rounded-tr-none rounded-br-[10px] lg:rounded-br-none shadow-2xl shadow-slate-900/10 dark:shadow-black/40 border border-slate-200/80 lg:border-r-0 dark:border-slate-800 bg-[#0A192F] transition-all duration-500 group-hover/imagem:shadow-slate-900/20">
                <Image
                  src="/imagens/Estudo com apoio e bons hábitos.png"
                  alt="Estudo com apoio e bons hábitos — TM-Educa"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 group-hover/imagem:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
