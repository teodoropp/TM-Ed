/** @format */

import * as React from "react";
import { Contentor } from "@/componentes/ui/contentor";
import { Secao } from "@/componentes/ui/secao";

interface EtapaMetodologia {
  passo: string;
  titulo: string;
  descricao: string;
}

const ETAPAS_METODOLOGIA: EtapaMetodologia[] = [
  {
    passo: "01",
    titulo: "Solicitação",
    descricao:
      "Os pais indicam o ano de escolaridade do aluno (1.º ao 12.º ano), as disciplinas prioritárias e os horários mais convenientes para as aulas.",
  },
  {
    passo: "02",
    titulo: "Seleção do Explicador",
    descricao:
      "O algoritimo seleciona o explicador credenciado ideal com base na zona, experiência curricular e perfil do aluno.",
  },
  {
    passo: "03",
    titulo: "Pagamento",
    descricao:
      "Validação da proposta com preçário 100% transparente e seguro, com confirmação imediata do agenfamento.",
  },
  {
    passo: "04",
    titulo: "Aulas",
    descricao:
      "Sessões presenciais ao domicílio ou online interativas, com relatório após a ultima aula para acompanhamento total dos pais.",
  },
];

/**
 * 04 — Seção Metodologia de Trabalho (Como Trabalhamos)
 * - Fundo branco limpo
 * - Linha ondulada tracejada conectando os passos 01, 02, 03 e 04
 * - Sem cartões ou bordas pesadas, tipografia limpa e organizada
 */
export const SeccaoComoFunciona: React.FC = () => {
  return (
    <Secao
      espacamento="sm"
      className="bg-white dark:bg-[#07182E] scroll-mt-20"
      id="metodologia">
      <Contentor size="xl">
        {/* Cabeçalho Centralizado*/}
        <div className="flex items-center justify-between mb-3 sm:mb-[8%] pr-4 sm:pr-6 lg:pr-12 xl:pr-20">
          <div className="flex items-center gap-2.5">
            <span className="w-6 sm:w-8 h-[2px] bg-[#FF2D75] rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-normal">
              COMO FUNCIONA
            </span>
          </div>
        </div>

        {/* Fluxo Metodológico com Linha Ondulada Tracejada e Alta Amplitude */}
        <div className="relative pt-4 pb-6">
          {/* Linha Ondulada Tracejada Esticada (Exibida em ecrãs médios e grandes) */}
          <div
            className="hidden md:block absolute top-0 left-0 right-0 w-full h-[115px] pointer-events-none z-0"
            aria-hidden="true">
            <svg
              viewBox="0 0 1000 100"
              className="w-full h-full text-slate-400 dark:text-slate-600"
              fill="none"
              preserveAspectRatio="none">
              <path
                d="M 10,50 C 45,50 80,6 125,6 C 170,6 205,94 250,94 C 295,94 330,6 375,6 C 420,6 455,94 500,94 C 545,94 580,6 625,6 C 670,6 705,94 750,94 C 795,94 830,6 875,6 C 920,6 955,50 990,50"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          {/* Grelha de 4 Passos posicionados sob as cristas da onda */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 lg:gap-8 pt-8 md:pt-11">
            {ETAPAS_METODOLOGIA.map((etapa) => (
              <div
                key={etapa.passo}
                className="flex flex-col items-center text-center space-y-2.5 relative max-w-[260px] mx-auto">
                {/* Linha Vertical Tracejada para Mobile */}
                <div
                  className="md:hidden absolute left-[-16px] top-6 bottom-[-32px] w-[1.5px] border-l-2 border-dashed border-slate-300 dark:border-slate-700 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Número do Passo em Destaque — Posicionado diretamente embaixo da ondulação */}
                <span className="text-3xl sm:text-4xl font-display font-regular text-accent text-[#FF2D75] tracking-tight">
                  {etapa.passo}
                </span>

                {/* Título do Passo */}
                <h3 className="text-[16px] sm:text-[16.5px] font-regular text-[#0b1c2d] dark:text-white leading-snug">
                  {etapa.titulo}
                </h3>

                {/* Descrição Concisa */}
                <p className="text-[12.5px] sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {etapa.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Contentor>
    </Secao>
  );
};

// Compatibilidade
export const ServicesHowWeWorkSection = SeccaoComoFunciona;
