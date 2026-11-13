"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RevelarAoRolar } from "@/componentes/animacao/revelar-ao-rolar";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  MessageCircle,
} from "lucide-react";

/**
 * Secção 10: Contacto Oficial da Landing Page
 * - Disposta diretamente na secção (sem card flutuante ou caixa pesada).
 * - Layout em 2 colunas: canais diretos de comunicação e formulário simples e intuitivo.
 * - Bordas rigorosamente em 5px (rounded-[5px]) e tipografia Segoe Regular.
 * - Alinhada ao sistema de ensino português (1.º ao 12.º ano, IRT, pagamentos em Angola).
 */
export function SeccaoCtaFinal() {
  const [enviado, setEnviado] = useState(false);

  function manipularEnvio(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <section
      id="contacto"
      className="w-full bg-white dark:bg-[#07182E] pt-12 sm:pt-16 pb-4 sm:pb-6 font-normal scroll-mt-20 border-t border-slate-200/90 dark:border-slate-800"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* CABEÇALHO DIRETO NA SECÇÃO (SEM CARD) */}
        <RevelarAoRolar animacao="fade-up" duracaoMs={700}>
          <div className="max-w-3xl space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-[2px] bg-[#FF2D75] rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-semibold">
                CONTACTO DIRETO
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[35px] font-normal text-[#0A192F] dark:text-white tracking-normal leading-[1.15]">
              Fale connosco e encontre o{" "}
              <span className="text-[#FF2D75]">apoio certo</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              A nossa equipa pedagógica está disponível para esclarecer dúvidas, avaliar as necessidades escolares do seu filho e apresentar o explicador ideal.
            </p>
          </div>
        </RevelarAoRolar>

        {/* GRELHA PRINCIPAL DIRETA NA SECÇÃO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* COLUNA ESQUERDA: CANAIS DIRETOS DE ATENDIMENTO */}
          <div className="lg:col-span-5 space-y-8">
            <RevelarAoRolar animacao="fade-right" duracaoMs={750}>
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-normal text-[#0A192F] dark:text-white">
                    Canais Diretos de Atendimento
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    Escolha o meio mais conveniente para falar com a nossa coordenação pedagógica.
                  </p>
                </div>

            {/* LISTA DE CONTACTOS DIRETOS */}
            <div className="space-y-5 divide-y divide-slate-100 dark:divide-slate-800">
              {/* Telefone & WhatsApp */}
              <div className="flex items-start gap-3.5 pt-4 first:pt-0">
                <Phone className="w-5 h-5 text-[#FF2D75] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#0A192F] dark:text-white">
                    Telefone & WhatsApp
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium flex flex-wrap items-center gap-2">
                    <a
                      href="tel:+244955916711"
                      className="hover:text-[#FF2D75] transition-colors"
                    >
                      (+244) 955 916 711
                    </a>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <a
                      href="https://wa.me/244955916711"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp Direto
                    </a>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Atendimento imediato para pais e explicadores
                  </p>
                </div>
              </div>

              {/* Correio Eletrónico */}
              <div className="flex items-start gap-3.5 pt-5">
                <Mail className="w-5 h-5 text-[#FF2D75] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#0A192F] dark:text-white">
                    Correio Eletrónico
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                    <a
                      href="mailto:tmeduca99@gmail.com"
                      className="hover:text-[#FF2D75] transition-colors"
                    >
                      tmeduca99@gmail.com
                    </a>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Resposta assegurada em menos de 24 horas úteis
                  </p>
                </div>
              </div>

              {/* Horário */}
              <div className="flex items-start gap-3.5 pt-5">
                <Clock className="w-5 h-5 text-[#FF2D75] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#0A192F] dark:text-white">
                    Horário de Atendimento
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    Segunda a Sexta: 08h30 – 19h30
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sábados: 09h00 – 14h00 (Aulas em horários flexíveis acordados)
                  </p>
                </div>
              </div>

              {/* Cobertura Geográfica */}
              <div className="flex items-start gap-3.5 pt-5">
                <MapPin className="w-5 h-5 text-[#FF2D75] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#0A192F] dark:text-white">
                    Cobertura Geográfica
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    Luanda — Apoio ao domicílio (Talatona, Kilamba, Maianga, Miramar, Belas e Viana) e 100% Online Nacional.
                  </p>
                </div>
              </div>
            </div>

            {/* NOTA DE CONFIANÇA DIRETA NA SECÇÃO */}
            <div className="p-5 rounded-[5px] bg-slate-50 dark:bg-[#0A192F] border border-slate-200/90 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0A192F] dark:text-white">
                <ShieldCheck className="w-4 h-4 text-[#FF2D75]" />
                <span>Garantia TM-Educa</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Faturação oficial com NIF dedutível a 100% no IRT nas despesas de educação. Substituição de explicador assegurada em 24h sem encargos adicionais.
              </p>
            </div>
          </div>
        </RevelarAoRolar>
      </div>

      {/* COLUNA DIREITA: FORMULÁRIO SIMPLES E FÁCIL DE ENTENDER */}
      <div className="lg:col-span-7 space-y-6">
        <RevelarAoRolar animacao="fade-left" duracaoMs={750} atrasoMs={150}>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-normal text-[#0A192F] dark:text-white">
                Envie uma Mensagem à Coordenação
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-normal">
                Indique as necessidades do seu filho. Entraremos em contacto no mesmo dia.
              </p>
            </div>

            {enviado ? (
              <div className="p-8 rounded-[5px] bg-[#FFF1F5] dark:bg-[#FF2D75]/10 border border-[#FF2D75]/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-[5px] bg-[#FF2D75] text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-normal text-[#0A192F] dark:text-white">
                  Mensagem Enviada com Sucesso!
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto font-normal">
                  Obrigado pelo seu contacto. A nossa coordenação pedagógica entrará em comunicação brevemente através do telefone ou e-mail indicado.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setEnviado(false)}
                    className="text-xs text-[#FF2D75] underline hover:text-[#E11D48] cursor-pointer"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={manipularEnvio} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome Completo */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dra. Marlene Cardoso"
                      className="w-full text-sm rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A192F] px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#FF2D75] focus:ring-1 focus:ring-[#FF2D75] transition-colors"
                    />
                  </div>

                  {/* Telefone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 955 916 711"
                      className="w-full text-sm rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A192F] px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#FF2D75] focus:ring-1 focus:ring-[#FF2D75] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="exemplo@email.ao"
                      className="w-full text-sm rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A192F] px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#FF2D75] focus:ring-1 focus:ring-[#FF2D75] transition-colors"
                    />
                  </div>

                  {/* Ano de Escolaridade */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Ano de Escolaridade *
                    </label>
                    <select
                      defaultValue="3ciclo"
                      className="w-full text-sm rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A192F] px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#FF2D75] focus:ring-1 focus:ring-[#FF2D75] transition-colors"
                    >
                      <option value="1ciclo">1.º Ciclo (1.º ao 4.º ano)</option>
                      <option value="2ciclo">2.º Ciclo (5.º e 6.º ano)</option>
                      <option value="3ciclo">3.º Ciclo (7.º ao 9.º ano)</option>
                      <option value="secundario">Ensino Secundário (10.º ao 12.º ano)</option>
                      <option value="exames">Preparação para Exames Nacionais</option>
                      <option value="outro">Outro Apoio Educativo</option>
                    </select>
                  </div>
                </div>

                {/* Mensagem / Disciplinas */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Disciplinas / Mensagem
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Indique as disciplinas prioritárias (ex: Matemática, Físico-Química), o município e eventuais dúvidas..."
                    className="w-full text-sm rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A192F] px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#FF2D75] focus:ring-1 focus:ring-[#FF2D75] transition-colors"
                  />
                </div>

                {/* Botão de Envio com Efeito Shimmer e Elevação */}
                <button
                  type="submit"
                  className="w-full shimmer-ativo inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-[5px] bg-[#0A192F] hover:bg-[#FF2D75] text-white text-sm sm:text-base font-normal transition-all duration-300 hover:shadow-xl hover:shadow-[#FF2D75]/25 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem à Coordenação</span>
                </button>
              </form>
            )}
            </div>
          </RevelarAoRolar>
        </div>
      </div>
      </div>
    </section>
  );
}
