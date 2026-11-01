"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";

/**
 * Secção 9: Perguntas Frequentes
 * - Layout fluido e harmonioso em 2 colunas (coluna lateral fixa com apoio direto + acordeão à direita).
 * - Tipografia rigorosamente em Segoe Regular com títulos no padrão text-3xl sm:text-4xl lg:text-[35px].
 * - Todas as curvaturas estritamente em 5px (rounded-[5px]).
 * - Micro-animações suaves e sem sensação de blocos pesados ou desconexos.
 */
export function SeccaoPerguntasFrequentes() {
  const [aberto, setAberto] = useState<number | null>(0);

  const faqs = [
    {
      numero: "01",
      p: "Como é selecionado o explicador ideal para o meu filho?",
      r: "O processo combina um algoritmo inteligente de compatibilidade (que cruza o ano de escolaridade do 1.º ao 12.º ano, disciplina, município de residência e horários pretendidos) com a validação humana rigorosa da nossa coordenação pedagógica. Todos os explicadores possuem certidão de registo criminal limpa para contacto com menores e formação académica comprovada.",
    },
    {
      numero: "02",
      p: "Quanto tempo demora até a primeira explicação se realizar?",
      r: "Apresentamos a proposta pedagógica com o explicador credenciado em menos de 24 horas úteis. Assim que o pai valida os horários e o plano de estudos, as sessões têm início imediato.",
    },
    {
      numero: "03",
      p: "Posso solicitar substituição do explicador se não houver empatia?",
      r: "Sim, com total tranquilidade e garantia TM-Educa. Se por qualquer motivo de afinidade ou método a adaptação não for perfeita, substituímos o explicador em 24h sem qualquer custo adicional nem perda de aulas contratadas.",
    },
    {
      numero: "04",
      p: "Como funciona a política de desmarcação ou reagendamento?",
      r: "Cumprimos a regra transparente das 24 horas: qualquer aviso prévio com 24h de antecedência garante a remarcação da sessão sem qualquer penalização. Faltas sem aviso prévio são contabilizadas em respeito à agenda e deslocação do explicador.",
    },
    {
      numero: "05",
      p: "Como são efetuados os pagamentos e emitida a fatura para o IRT?",
      r: "Os pagamentos são processados com total segurança através de transferência bancária, Unitel Money, Express ou referência Multibanco. Emitimos sempre fatura-recibo oficial com NIF, dedutível nas despesas de educação no IRT.",
    },
    {
      numero: "06",
      p: "Qual é a abrangência das explicações ao domicílio e online?",
      r: "Dispomos de explicadores ao domicílio em Luanda (Talatona, Kilamba, Maianga, Miramar, Belas e Viana) e, em paralelo, a nossa modalidade 100% online interativa (com quadro digital em direto e sessões gravadas) cobre todo o território de Angola.",
    },
  ];

  const alternar = (index: number) => {
    setAberto((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 font-normal scroll-mt-20"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
        {/* COLUNA ESQUERDA: CABEÇALHO INSTITUCIONAL & CARTÃO DE APOIO DIRETO */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-[2px] bg-[#FF2D75] rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-semibold">
                DÚVIDAS FREQUENTES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[35px] font-normal text-[#0A192F] dark:text-white tracking-normal leading-[1.15]">
              Perguntas frequentes sobre o nosso{" "}
              <span className="text-[#FF2D75]">acompanhamento</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Reunimos as respostas para as principais dúvidas dos pais antes de iniciarem as explicações com a TM-Educa.
            </p>
          </div>

          {/* CARTÃO LATERAL DE CONTACTO DIRETO COM BORDAS 5PX */}
          <div className="p-6 rounded-[5px] bg-slate-50 dark:bg-[#0A192F]/70 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[5px] bg-[#FFF1F5] dark:bg-[#FF2D75]/15 text-[#FF2D75] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0A192F] dark:text-white">
                  Ainda tem alguma dúvida?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Fale diretamente com a nossa equipa pedagógica.
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <Link
                href="/portal-encarregado/pedidos/novo"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[5px] bg-[#0A192F] hover:bg-[#FF2D75] text-white text-xs sm:text-sm font-normal transition-colors shadow-xs group"
              >
                <span>Solicitar explicador</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contactos"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[5px] bg-white dark:bg-[#102A45] hover:bg-slate-100 dark:hover:bg-[#17385c] text-[#0A192F] dark:text-white text-xs sm:text-sm font-normal border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <span>Falar com orientador</span>
              </Link>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: ACORDEÃO FLUIDO E MODERNO */}
        <div className="lg:col-span-7 space-y-3">
          {faqs.map((item, idx) => {
            const estaAberto = aberto === idx;

            return (
              <div
                key={idx}
                className={`rounded-[5px] border transition-all duration-300 overflow-hidden ${
                  estaAberto
                    ? "bg-white dark:bg-[#0A192F] border-[#FF2D75]/40 shadow-sm"
                    : "bg-white/80 dark:bg-[#0A192F]/50 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => alternar(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer transition-colors"
                  aria-expanded={estaAberto}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-[5px] transition-colors shrink-0 ${
                        estaAberto
                          ? "bg-[#FFF1F5] dark:bg-[#FF2D75]/20 text-[#FF2D75]"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.numero}
                    </span>
                    <h3 className="text-sm sm:text-base font-normal text-[#0A192F] dark:text-white leading-snug">
                      {item.p}
                    </h3>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-[5px] flex items-center justify-center shrink-0 transition-all duration-300 ${
                      estaAberto
                        ? "bg-[#FFF1F5] dark:bg-[#FF2D75]/20 text-[#FF2D75] rotate-180"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 transition-transform" />
                  </div>
                </button>

                {estaAberto && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="pt-3.5 pl-9 sm:pl-10 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {item.r}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
