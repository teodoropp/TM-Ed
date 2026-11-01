/** @format */

import React from "react";
import { Check, X } from "lucide-react";

/**
 * Secção 6: Por que a TM-Educa
 * - Fundo branco limpo em toda a extensão da secção (bg-white dark:bg-[#07182E]).
 * - Tabela comparativa ampla, espaçosa e altamente organizada (max-w-6xl).
 * - Bordas rigorosamente em 5px (rounded-[5px]).
 * - Critérios transparentes focados no ensino e na tranquilidade familiar.
 */
export function SeccaoPorQueTmEduca() {
  const comparativos = [
    {
      criterio: "Auditoria de Identidade & Registo Criminal",
      tmeduca: "100% verificado com certidão limpa para contacto regular com menores",
      informal: "Geralmente desconhecido, sem verificação ou qualquer histórico formal",
    },
    {
      criterio: "Relatórios Periódicos de Evolução",
      tmeduca: "Sumário digital enviado após cada sessão no Portal dos Pais",
      informal: "Inexistentes ou sem registo objetivo sobre a matéria lecionada",
    },
    {
      criterio: "Garantia de Substituição em Falta",
      tmeduca: "Substituição imediata assegurada em 24h sem quebra no ritmo de estudo",
      informal: "Sessões canceladas ou perdidas sem reposição nem alternativa",
    },
    {
      criterio: "Faturação Legal & Benefício no IRT",
      tmeduca: "Fatura oficial com NIF dedutível a 100% nas despesas de educação",
      informal: "Pagamento informal em dinheiro vivo ou transferência sem recibo fiscal",
    },
    {
      criterio: "Alinhamento com o Currículo Oficial",
      tmeduca: "Plano estruturado conforme metas DGE, IAVE e matriz de exames nacionais",
      informal: "Apenas resolução pontual e improvisada de trabalhos de casa",
    },
    {
      criterio: "Supervisão Pedagógica Contínua",
      tmeduca: "Acompanhamento próximo por coordenação pedagógica dedicada da TM",
      informal: "Sem qualquer supervisão externa, método validado ou garantia de qualidade",
    },
  ];

  return (
    <section
      id="por-que-tmeduca"
      className="w-full bg-white dark:bg-[#07182E] py-14 sm:py-20 lg:py-24 border-y border-slate-200/90 dark:border-slate-800 font-normal scroll-mt-20"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CABEÇALHO DA SECÇÃO */}
        <div className="max-w-4xl mb-12 sm:mb-16 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-[2px] bg-[#FF2D75] rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm uppercase tracking-wider text-[#FF2D75] font-semibold">
              POR QUE A TM-EDUCA
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[35px] font-normal text-[#0A192F] dark:text-white tracking-normal leading-[1.15]">
            A segurança da sua família e o sucesso do seu filho{" "}
            <span className="text-[#FF2D75]">não dependem da sorte</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Compare a tranquilidade de uma instituição estruturada com o risco de explicações particulares informais sem garantias.
          </p>
        </div>

        {/* TABELA COMPARATIVA DE TAMANHO MÉDIO (MAX-W-5XL) COM BORDAS DE 5PX */}
        <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#07182E]">
          {/* CABEÇALHO DA TABELA (FUNDO BRANCO/CLARO LIMPO) */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#0c223d] py-4 px-5 sm:px-7 items-center gap-2">
            <div className="md:col-span-5 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-white uppercase tracking-wider">
              Critério de Avaliação
            </div>
            <div className="md:col-span-4 text-left md:text-center text-xs sm:text-sm font-bold text-[#FF2D75] uppercase tracking-wider flex items-center md:justify-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FF2D75]" />
              TM-Educa Oficial
            </div>
            <div className="md:col-span-3 text-left md:text-center text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Explicador Informal
            </div>
          </div>

          {/* LINHAS DA TABELA (EQUILIBRADAS EM TAMANHO MÉDIO) */}
          {comparativos.map((item, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 md:grid-cols-12 py-4 sm:py-4.5 px-5 sm:px-7 border-b border-slate-200/80 dark:border-slate-800 items-center gap-3 transition-colors hover:bg-slate-50/60 dark:hover:bg-[#102A45]/30 ${
                idx === comparativos.length - 1 ? "border-b-0" : ""
              }`}
            >
              {/* COLUNA DO CRITÉRIO */}
              <div className="md:col-span-5 text-sm sm:text-base font-normal text-[#0A192F] dark:text-white leading-snug">
                {item.criterio}
              </div>

              {/* COLUNA TM-EDUCA */}
              <div className="md:col-span-4 font-normal text-slate-800 dark:text-slate-100 flex items-start md:items-center md:justify-center gap-2.5 text-xs sm:text-sm">
                <div className="w-5 h-5 rounded-[5px] bg-[#FFF0F5] dark:bg-[#FF2D75]/20 border border-[#FF2D75]/20 flex items-center justify-center shrink-0 mt-0.5 md:mt-0">
                  <Check className="w-3.5 h-3.5 text-[#FF2D75] stroke-[2.5]" />
                </div>
                <span className="leading-relaxed font-normal">{item.tmeduca}</span>
              </div>

              {/* COLUNA EXPLICADOR INFORMAL */}
              <div className="md:col-span-3 text-slate-500 dark:text-slate-400 flex items-start md:items-center md:justify-center gap-2.5 text-xs sm:text-sm font-normal">
                <div className="w-5 h-5 rounded-[5px] bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5 md:mt-0">
                  <X className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 stroke-[2.5]" />
                </div>
                <span className="leading-relaxed">{item.informal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
