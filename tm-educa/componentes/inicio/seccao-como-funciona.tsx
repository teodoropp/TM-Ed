/** @format */

import * as React from "react";
import { Contentor } from "@/componentes/ui/contentor";
import { Secao } from "@/componentes/ui/secao";
import { RevelarAoRolar } from "@/componentes/animacao/revelar-ao-rolar";

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
      "A nossa equipa seleciona o explicador credenciado ideal com base na zona, experiência curricular e perfil de aprendizagem do aluno.",
  },
  {
    passo: "03",
    titulo: "Confirmação & Pagamento",
    descricao:
      "Validação da proposta com preçário 100% transparente e seguro, com confirmação imediata do agendamento.",
  },
  {
    passo: "04",
    titulo: "Aulas & Acompanhamento",
    descricao:
      "Sessões presenciais ao domicílio ou online interativas, com sumários pedagógicos detalhados após cada aula para acompanhamento total dos pais.",
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

        {/* Fluxo Metodológico com Linha Ondulada Tracejada Fluida e Dinâmica */}
        <div className="relative pt-4 pb-6">
          {/* Linha Ondulada com animação fluida contínua */}
          <div
            className="hidden md:block absolute top-0 left-0 right-0 w-full h-[115px] pointer-events-none z-0"
            aria-hidden="true">
            <svg
              viewBox="0 0 1000 100"
              className="w-full h-full text-slate-300 dark:text-slate-700"
              fill="none"
              preserveAspectRatio="none">
              <path
                d="M 10,50 C 45,50 80,6 125,6 C 170,6 205,94 250,94 C 295,94 330,6 375,6 C 420,6 455,94 500,94 C 545,94 580,6 625,6 C 670,6 705,94 750,94 C 795,94 830,6 875,6 C 920,6 955,50 990,50"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                d="M 10,50 C 45,50 80,6 125,6 C 170,6 205,94 250,94 C 295,94 330,6 375,6 C 420,6 455,94 500,94 C 545,94 580,6 625,6 C 670,6 705,94 750,94 C 795,94 830,6 875,6 C 920,6 955,50 990,50"
                stroke="#FF2D75"
                strokeWidth="2.5"
                className="animate-dash-flow opacity-70"
              />
            </svg>
          </div>

          {/* Grelha de 4 Passos com revelação escalonada e animação ao passar o rato */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 lg:gap-8 pt-8 md:pt-11">
            {ETAPAS_METODOLOGIA.map((etapa, idx) => (
              <RevelarAoRolar
                key={etapa.passo}
                animacao="fade-up"
                atrasoMs={idx * 140}
                className="h-full"
              >
                <div className="group flex flex-col items-center text-center space-y-2.5 relative max-w-[260px] mx-auto p-4 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-50/80 dark:hover:bg-[#102A45]/30">
                  {/* Linha Vertical Tracejada para Mobile */}
                  <div
                    className="md:hidden absolute left-[-16px] top-6 bottom-[-32px] w-[1.5px] border-l-2 border-dashed border-[#FF2D75]/40 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Número do Passo em Destaque com efeito dinâmico */}
                  <div className="relative">
                    <span className="text-3xl sm:text-4xl font-display font-regular text-[#FF2D75] tracking-tight transition-transform duration-300 group-hover:scale-110 inline-block">
                      {etapa.passo}
                    </span>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#FF2D75]/30 rounded-full group-hover:w-8 group-hover:bg-[#FF2D75] transition-all duration-300" />
                  </div>

                  {/* Título do Passo */}
                  <h3 className="text-[16px] sm:text-[16.5px] font-regular text-[#0b1c2d] dark:text-white leading-snug pt-1 group-hover:text-[#FF2D75] transition-colors duration-200">
                    {etapa.titulo}
                  </h3>

                  {/* Descrição Concisa */}
                  <p className="text-[12.5px] sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {etapa.descricao}
                  </p>
                </div>
              </RevelarAoRolar>
            ))}
          </div>
        </div>
      </Contentor>
    </Secao>
  );
};

// Compatibilidade
export const ServicesHowWeWorkSection = SeccaoComoFunciona;
