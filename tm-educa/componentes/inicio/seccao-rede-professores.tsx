/** @format */

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle,
  ArrowRight,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Secção 5: A nossa rede de explicadores / Corpo de Explicadores Selecionado
 * - Apresenta o rigor de credenciação e a qualificação dos formadores no sistema de ensino português.
 * - Carrossel interativo e responsivo com navegação por setas e indicadores.
 * - Bordas rigorosamente em 5px (rounded-[5px]).
 * - Informação 100% adaptada ao ensino português (1.º ao 12.º ano), com atuação em Luanda, Angola.
 * - Botão padronizado como "Solicitar formador".
 */
export function SeccaoRedeProfessores() {
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [itensVisiveis, setItensVisiveis] = useState(3);
  const [emPausa, setEmPausa] = useState(false);

  const professoresExemplo = [
    {
      id: "gm",
      nome: "Prof. Gonçalo Mendes",
      fotoIniciais: "GM",
      especialidade: "Matemática A, Físico-Química & Exames",
      ciclo: "Ensino Secundário (10.º ao 12.º ano)",
      zonas: "Talatona • Kilamba • Maianga • Online",
      avaliacao: "4.9",
      aulasDadas: "+160 sessões",
      experiencia: "7 anos de docência",
      destaque: "Especialista em critérios oficiais do IAVE",
    },
    {
      id: "ir",
      nome: "Prof.ª Inês Ramos",
      fotoIniciais: "IR",
      especialidade: "Português, História e Apoio ao Estudo",
      ciclo: "2.º e 3.º Ciclo (5.º ao 9.º ano)",
      zonas: "Miramar • Belas • Viana • Online",
      avaliacao: "5.0",
      aulasDadas: "+130 sessões",
      experiencia: "8 anos de docência",
      destaque: "Métodos de estudo autónomo e síntese",
    },
    {
      id: "tf",
      nome: "Prof. Tiago Ferreira",
      fotoIniciais: "TF",
      especialidade: "Biologia e Geologia & Ciências Naturais",
      ciclo: "3.º Ciclo e Secundário (7.º ao 12.º ano)",
      zonas: "Rangel • Ingombota • Camama • Online",
      avaliacao: "4.9",
      aulasDadas: "+95 sessões",
      experiencia: "6 anos de docência",
      destaque: "Foco intensivo na preparação para exames",
    },
    {
      id: "sc",
      nome: "Prof.ª Sofia Carvalho",
      fotoIniciais: "SC",
      especialidade: "Inglês e Francês (Iniciação e Avançado)",
      ciclo: "Ensino Básico e Secundário (1.º ao 12.º ano)",
      zonas: "Maianga • Talatona • Miramar • Online",
      avaliacao: "5.0",
      aulasDadas: "+145 sessões",
      experiencia: "9 anos de docência",
      destaque: "Preparação Cambridge & conversação ativa",
    },
    {
      id: "da",
      nome: "Prof. Duarte Antunes",
      fotoIniciais: "DA",
      especialidade: "Geometria Descritiva A & Matemática B",
      ciclo: "Ensino Secundário (10.º ao 12.º ano)",
      zonas: "Luanda • Talatona • Kilamba • Online",
      avaliacao: "4.8",
      aulasDadas: "+80 sessões",
      experiencia: "5 anos de docência",
      destaque: "Resolução geométrica no espaço e métodos IAVE",
    },
    {
      id: "bl",
      nome: "Prof.ª Beatriz Lourenço",
      fotoIniciais: "BL",
      especialidade: "1.º Ciclo & Consolidação da Leitura e Cálculo",
      ciclo: "1.º Ciclo do Básico (1.º ao 4.º ano)",
      zonas: "Cacuaco • Viana • Benfica • Online Nacional",
      avaliacao: "5.0",
      aulasDadas: "+115 sessões",
      experiencia: "6 anos de docência",
      destaque: "Acompanhamento lúdico, paciente e sem ansiedade",
    },
  ];

  // Responsividade dos itens visíveis no carrossel
  useEffect(() => {
    const atualizarItens = () => {
      if (window.innerWidth < 640) {
        setItensVisiveis(1);
      } else if (window.innerWidth < 1024) {
        setItensVisiveis(2);
      } else {
        setItensVisiveis(3);
      }
    };

    atualizarItens();
    window.addEventListener("resize", atualizarItens);
    return () => window.removeEventListener("resize", atualizarItens);
  }, []);

  const totalSlides = professoresExemplo.length;
  const maxIndice = Math.max(0, totalSlides - itensVisiveis);

  // Rotação automática suave a cada 5 segundos quando não estiver em foco/hover
  useEffect(() => {
    if (emPausa) return;
    const temporizador = setInterval(() => {
      setIndiceAtivo((prev) => (prev >= maxIndice ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(temporizador);
  }, [emPausa, maxIndice]);

  const slideAnterior = () => {
    setIndiceAtivo((prev) => (prev <= 0 ? maxIndice : prev - 1));
  };

  const proximoSlide = () => {
    setIndiceAtivo((prev) => (prev >= maxIndice ? 0 : prev + 1));
  };

  return (
    <section
      id="corpo-docente"
      className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-normal scroll-mt-20"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      {/* CABEÇALHO DA SECÇÃO */}
      <div className="max-w-3xl mb-10 sm:mb-14 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 sm:w-8 h-[2px] bg-[#FF2D75] rounded-full animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-semibold">
            CORPO DE EXPLICADORES SELECIONADO
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[35px] font-normal text-[#0A192F] dark:text-white tracking-normal leading-[1.15]">
          A nossa rede de explicadores{" "}
          <span className="text-[#FF2D75]">auditados e credenciados</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
          Apenas 1 em cada 5 explicadores é aprovado no nosso processo seletivo. Garantimos profissionais
          idóneos, dedicados e com metodologia comprovada para o sucesso escolar do seu filho.
        </p>
      </div>

      {/* SECÇÃO DO CARROSSEL DE EXPLICADORES */}
      <div
        className="space-y-6"
        onMouseEnter={() => setEmPausa(true)}
        onMouseLeave={() => setEmPausa(false)}
      >
        {/* BARRA DE NAVEGAÇÃO DO CARROSSEL */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/professores/candidatura"
            className="inline-flex text-xs sm:text-sm font-medium text-[#FF2D75] hover:text-[#E11D48] items-center gap-1.5 transition-colors"
          >
            <span>É explicador? Candidate-se à rede</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* CONTROLOS DE NAVEGAÇÃO DO CARROSSEL */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={slideAnterior}
              aria-label="Explicador anterior"
              className="w-9 h-9 rounded-[5px] bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 hover:border-[#FF2D75] hover:text-[#FF2D75] text-[#0A192F] dark:text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={proximoSlide}
              aria-label="Próximo explicador"
              className="w-9 h-9 rounded-[5px] bg-[#0A192F] hover:bg-[#FF2D75] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTENTOR DESLIZANTE DO CARROSSEL */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out -mx-2.5"
            style={{
              transform: `translateX(-${indiceAtivo * (100 / itensVisiveis)}%)`,
            }}
          >
            {professoresExemplo.map((prof) => (
              <div
                key={prof.id}
                className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2.5"
              >
                <div className="h-full p-5 sm:p-6 rounded-[5px] bg-white dark:bg-[#0A192F] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#FF2D75]/40 transition-all duration-200 flex flex-col justify-between group">
                  <div className="space-y-4">
                    {/* CABEÇALHO DO PERFIL */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-[5px] bg-[#0A192F] text-white flex items-center justify-center font-medium text-sm shadow-sm group-hover:bg-[#FF2D75] transition-colors">
                          {prof.fotoIniciais}
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-[#0A192F] dark:text-white flex items-center gap-1.5">
                            {prof.nome}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#FF2D75] font-normal">
                            <CheckCircle className="w-3 h-3 text-[#FF2D75]" /> Explicador Auditado
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-[#FFF1F5] dark:bg-[#FF2D75]/10 text-[#FF2D75] text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-[#FF2D75]" />
                        <span>{prof.avaliacao}</span>
                      </div>
                    </div>

                    {/* DETALHES PEDAGÓGICOS */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <p className="text-sm font-medium text-[#0A192F] dark:text-slate-100 line-clamp-1">
                        {prof.especialidade}
                      </p>
                      <p className="text-xs text-slate-500 font-normal">
                        {prof.ciclo} • {prof.experiencia}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-normal">
                        <MapPin className="w-3.5 h-3.5 text-[#FF2D75] shrink-0" />
                        <span className="truncate">{prof.zonas}</span>
                      </div>
                    </div>

                    {/* ETIQUETA DE DESTAQUE */}
                    <div className="pt-1">
                      <span className="inline-block text-[11px] px-2.5 py-1 rounded-[5px] bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        {prof.destaque}
                      </span>
                    </div>
                  </div>

                  {/* RODAPÉ DO CARTÃO COM O LINK VER DETALHE (SEM BOTÃO) */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-normal shrink-0">
                      {prof.aulasDadas}
                    </span>
                    <Link
                      href="/portal-encarregado/pedidos/novo"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#FF2D75] hover:text-[#E11D48] transition-colors group-hover:translate-x-0.5"
                    >
                      <span>Ver detalhe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INDICADORES / PONTOS DE NAVEGAÇÃO DO CARROSSEL */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {Array.from({ length: maxIndice + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setIndiceAtivo(idx)}
              aria-label={`Ir para a página ${idx + 1} de explicadores`}
              className={`transition-all duration-300 rounded-[5px] h-1.5 cursor-pointer ${
                idx === indiceAtivo
                  ? "w-7 bg-[#FF2D75]"
                  : "w-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
