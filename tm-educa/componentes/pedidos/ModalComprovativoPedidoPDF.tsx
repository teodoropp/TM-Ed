"use client";

import React, { useState } from "react";
import { LogoTMEduca } from "@/componentes/ui/logo-tmeduca";
import { formatarKz } from "@/regras/calculo-preco";
import { Botao } from "@/componentes/ui/botao";
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  BookOpen,
} from "lucide-react";

export interface DadosComprovativoPedido {
  numeroPedido: string;
  dataEmissao: Date | string;
  nomeEncarregado: string;
  emailEncarregado?: string | null;
  telefoneEncarregado?: string | null;
  municipio?: string | null;
  bairro?: string | null;
  endereco?: string | null;
  nomeAluno: string;
  anoEscolar: string;
  sistemaEnsino?: string | null;
  disciplinas: string[];
  modalidade: string;
  duracaoMinutos: number;
  frequenciaSemanal: number;
  diasSemana: string;
  horarioPreferencial: string;
  objetivo?: string | null;
  observacoes?: string | null;
  precoUnitarioKz: number;
  estimativaMensalKz: number;
  estado?: string;
}

interface PropsModalComprovativo {
  dados: DadosComprovativoPedido;
  aberto: boolean;
  aoFechar: () => void;
}

/**
 * Dispara a impressão ou download em PDF num iframe isolado para garantir
 * que não haja interferência do layout, modo escuro ou elementos da página.
 */
export function imprimirComprovativoDireto(dados: DadosComprovativoPedido) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.zIndex = "-1000";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  const dataFormatada = new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dados.dataEmissao));

  const totalAulasMes = dados.frequenciaSemanal * 4;
  const precoAulaFormatado = formatarKz(dados.precoUnitarioKz);
  const totalMensalFormatado = formatarKz(dados.estimativaMensalKz);

  doc.open();
  doc.write(`
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <title>Comprovativo Oficial TM-Educa - ${dados.numeroPedido}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #0A192F;
      background: #ffffff;
      padding: 24px;
      line-height: 1.45;
      font-size: 13px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #0A192F;
      padding-bottom: 16px;
      margin-bottom: 12px;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: #0A192F;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }
    .brand-title span {
      color: #FF2D75;
    }
    .brand-sub {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #FF2D75;
      letter-spacing: 0.05em;
      margin-top: 3px;
    }
    .brand-loc {
      font-size: 11px;
      color: #64748B;
      margin-top: 1px;
    }
    .ref-box {
      text-align: right;
    }
    .badge-ref {
      display: inline-block;
      background: #0A192F;
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 9999px;
      margin-bottom: 6px;
      letter-spacing: 0.05em;
    }
    .ref-num {
      font-family: monospace;
      font-size: 13px;
      font-weight: 700;
      color: #0A192F;
    }
    .ref-date {
      font-size: 11px;
      color: #64748B;
      margin-top: 2px;
    }
    .divider {
      height: 4px;
      background: linear-gradient(90deg, #FF2D75 0%, #0A192F 50%, #10B981 100%);
      border-radius: 4px;
      margin-bottom: 18px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 18px;
    }
    .box-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748B;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
      margin-bottom: 8px;
      letter-spacing: 0.05em;
    }
    .person-name {
      font-size: 15px;
      font-weight: 700;
      color: #0A192F;
      margin-bottom: 4px;
    }
    .person-info {
      font-size: 12px;
      color: #334155;
      margin-bottom: 2px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #0A192F;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chips-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 6px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #0A192F;
    }
    .chip-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      background: #FF2D75;
      border-radius: 50%;
      margin-right: 8px;
    }
    .sub-note {
      font-size: 11px;
      color: #64748B;
      font-style: italic;
      margin-bottom: 18px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 12px;
    }
    .grid-card {
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 8px 12px;
      background: #ffffff;
    }
    .grid-card-label {
      font-size: 10px;
      color: #64748B;
      display: block;
      margin-bottom: 3px;
    }
    .grid-card-value {
      font-size: 12px;
      font-weight: 700;
      color: #0A192F;
    }
    .finance-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 18px;
    }
    .finance-header {
      background: #0A192F;
      color: #ffffff;
      padding: 9px 16px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      justify-content: space-between;
    }
    .finance-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 16px;
      border-top: 1px solid #F1F5F9;
      font-size: 12px;
    }
    .finance-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-top: 2px solid #CBD5E1;
      background: #F8FAFC;
    }
    .total-val {
      font-size: 20px;
      font-weight: 900;
      color: #FF2D75;
    }
    .terms-box {
      border: 1px solid #E2E8F0;
      background: #F8FAFC;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 11px;
      color: #475569;
      line-height: 1.45;
      margin-bottom: 18px;
    }
    .terms-title {
      font-weight: 700;
      color: #0A192F;
      margin-bottom: 5px;
      text-transform: uppercase;
      font-size: 10.5px;
      letter-spacing: 0.05em;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #E2E8F0;
      padding-top: 14px;
      font-size: 10.5px;
      color: #64748B;
    }
    .stamp-box {
      border: 2px solid #059669;
      background: #ECFDF5;
      border-radius: 10px;
      padding: 6px 14px;
      text-align: center;
      transform: rotate(-2deg);
    }
    .stamp-title {
      font-size: 9px;
      font-weight: 900;
      color: #065F46;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stamp-sub {
      font-size: 8px;
      font-weight: 700;
      color: #059669;
      margin-top: 1px;
    }
    .stamp-date {
      font-size: 8px;
      font-family: monospace;
      color: #047857;
      margin-top: 1px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">
      <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="100,20 170,50 100,80 30,50" fill="#0A192F" />
        <path d="M 58,61 Q 100,86 142,61 L 142,71 Q 100,96 58,71 Z" fill="#0A192F" />
        <path d="M 42,55 Q 38,70 36,86" stroke="#FF2D75" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <circle cx="36" cy="88" r="3" fill="#FF2D75" />
        <path d="M 33,90 L 39,90 L 41,106 L 31,106 Z" fill="#FF2D75" />
        <path d="M 34,92 Q 67,78 100,94 Q 133,78 166,92 L 166,154 Q 133,140 100,162 Q 67,140 34,154 Z" fill="none" stroke="#FF2D75" stroke-width="6.5" stroke-linejoin="round" stroke-linecap="round" />
        <line x1="100" y1="94" x2="100" y2="162" stroke="#FF2D75" stroke-width="4.5" stroke-linecap="round" />
        <text x="100" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#0A192F" text-anchor="middle" letter-spacing="2">TM</text>
      </svg>
      <div>
        <div class="brand-title">TM<span>-Educa</span></div>
        <div class="brand-sub">Explicações ao Domicílio & Apoio Escolar</div>
        <div class="brand-loc">Luanda · República de Angola · www.tmeduca.ao</div>
      </div>
    </div>
    <div class="ref-box">
      <div class="badge-ref">Comprovativo Oficial</div>
      <div class="ref-num">Ref: ${dados.numeroPedido}</div>
      <div class="ref-date">Emitido em: ${dataFormatada}</div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="grid-2">
    <div>
      <div class="box-title">Encarregado de Educação</div>
      <div class="person-name">${dados.nomeEncarregado}</div>
      ${dados.telefoneEncarregado ? `<div class="person-info"><strong>Tel:</strong> ${dados.telefoneEncarregado}</div>` : ""}
      ${dados.emailEncarregado ? `<div class="person-info"><strong>E-mail:</strong> ${dados.emailEncarregado}</div>` : ""}
      ${dados.municipio ? `<div class="person-info"><strong>Localidade:</strong> ${dados.municipio}${dados.bairro ? `, ${dados.bairro}` : ""}${dados.endereco ? ` (${dados.endereco})` : ""}</div>` : ""}
    </div>
    <div>
      <div class="box-title">Educando / Percurso Escolar</div>
      <div class="person-name">${dados.nomeAluno}</div>
      <div class="person-info"><strong>Ano Escolar:</strong> ${dados.anoEscolar}</div>
      <div class="person-info"><strong>Sistema:</strong> ${dados.sistemaEnsino || "Geral Angolano"}</div>
      ${dados.objetivo ? `<div class="person-info"><strong>Objetivo:</strong> ${dados.objetivo}</div>` : ""}
    </div>
  </div>

  <div class="section-title">
    <span>Disciplinas Integradas no Plano (${dados.disciplinas.length})</span>
    <span style="color: #059669; font-weight: 600; text-transform: none;">✓ Valor único por ano escolar</span>
  </div>

  <div class="chips-container">
    ${dados.disciplinas.map((d) => `<div class="chip"><span class="chip-dot"></span>${d}</div>`).join("")}
  </div>
  <div class="sub-note">
    * Conforme a política oficial TM-Educa, o valor do serviço é tabelado estritamente por ano de escolaridade e frequência semanal. Todas as disciplinas selecionadas estão plenamente integradas no mesmo acompanhamento, sem qualquer acréscimo de custo por disciplina.
  </div>

  <div class="section-title">
    <span>Condições Logísticas & Horário</span>
  </div>

  <div class="grid-4">
    <div class="grid-card">
      <span class="grid-card-label">Modalidade</span>
      <span class="grid-card-value">${dados.modalidade === "Domicilio" ? "Ao Domicílio" : "Online"}</span>
    </div>
    <div class="grid-card">
      <span class="grid-card-label">Duração da Aula</span>
      <span class="grid-card-value">${dados.duracaoMinutos} Minutos</span>
    </div>
    <div class="grid-card">
      <span class="grid-card-label">Frequência Semanal</span>
      <span class="grid-card-value">${dados.frequenciaSemanal}x por semana</span>
    </div>
    <div class="grid-card">
      <span class="grid-card-label">Horário</span>
      <span class="grid-card-value">${dados.horarioPreferencial}</span>
    </div>
  </div>
  <div style="font-size: 11px; color: #475569; margin-bottom: 18px;">
    <strong>Dias de Aulas:</strong> ${dados.diasSemana}
  </div>

  <div class="finance-table">
    <div class="finance-header">
      <span>Investimento Regulamentado Oficial</span>
      <span>Tabela Oficial ${dados.anoEscolar}</span>
    </div>
    <div class="finance-row">
      <span>Preço Regulamentado por Aula (${dados.duracaoMinutos} min):</span>
      <strong>${precoAulaFormatado}</strong>
    </div>
    <div class="finance-row">
      <span>Carga Horária Mensal (${dados.frequenciaSemanal} aulas/sem × 4 semanas):</span>
      <strong>${totalAulasMes} Aulas no Mês</strong>
    </div>
    <div class="finance-row">
      <span>Disciplinas Abrangidas (${dados.disciplinas.length}):</span>
      <strong style="color: #059669;">Incluídas no Plano (Sem acréscimo)</strong>
    </div>
    <div class="finance-total">
      <span style="font-size: 13px; font-weight: 700; color: #0A192F;">Estimativa Mensal Oficial:</span>
      <span class="total-val">${totalMensalFormatado}</span>
    </div>
  </div>

  <div class="terms-box">
    <div class="terms-title">Garantias e Dizeres Institucionais TM-Educa</div>
    <p>1. <strong>Sem cobrança imediata:</strong> A submissão deste pedido não exige liquidação financeira prévia. O processo de alocação e matching do explicador credenciado é iniciado sem custos.</p>
    <p>2. <strong>Contacto Pedagógico:</strong> A coordenação pedagógica da TM-Educa entrará em contacto nas próximas 24 a 48 horas úteis para confirmar o perfil do explicador e agendar a primeira sessão diagnóstica.</p>
    <p>3. <strong>Qualidade Garantida:</strong> Corpo docente rigorosamente verificado, credenciado e com acompanhamento pedagógico contínuo.</p>
  </div>

  <div class="footer">
    <div>
      <strong>TM-Educa Serviços Educacionais, Lda.</strong><br />
      Luanda, Angola · WhatsApp / Linha de Apoio: (+244) 955 916 711 · tmeduca99@gmail.com<br />
      Documento timbrado emitido eletronicamente pela plataforma TM-Educa
    </div>
    <div class="stamp-box">
      <div class="stamp-title">TM-EDUCA ANGOLA</div>
      <div class="stamp-sub">REGISTO OFICIAL VÁLIDO</div>
      <div class="stamp-date">${new Date().toISOString().slice(0, 10)}</div>
    </div>
  </div>
</body>
</html>
  `);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 4000);
  }, 400);
}

export function ModalComprovativoPedidoPDF({
  dados,
  aberto,
  aoFechar,
}: PropsModalComprovativo) {
  if (!aberto) return null;

  const dataFormatada = new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dados.dataEmissao));

  const totalAulasMes = dados.frequenciaSemanal * 4;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-slate-950/85 p-3 sm:p-6 backdrop-blur-md">
      {/* Container Principal */}
      <div className="relative w-full max-w-4xl my-4 sm:my-8 rounded-2xl bg-white shadow-2xl overflow-hidden text-slate-900 border border-slate-200">
        {/* Barra Superior Sticky */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-[#07182E] px-5 py-3.5 text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF2D75]/20 text-[#FF2D75]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white block">
                Comprovativo Oficial de Pedido
              </span>
              <span className="text-[11px] text-slate-400">
                TM-Educa · Ref: {dados.numeroPedido}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Botao
              type="button"
              onClick={() => imprimirComprovativoDireto(dados)}
              className="gap-2 bg-[#FF2D75] hover:bg-[#E11D48] text-white text-xs px-4 py-2 rounded-xl shadow-sm transition-transform hover:scale-102"
            >
              <Printer className="h-4 w-4" />
              <span>Descarregar / Imprimir PDF</span>
            </Botao>
            <button
              type="button"
              onClick={aoFechar}
              aria-label="Fechar"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* DOCUMENTO OFICIAL NA TELA (Iniciando no Topo) */}
        <div
          id="comprovativo-oficial-imprimir"
          className="p-8 sm:p-12 space-y-6 bg-white font-sans text-slate-900"
          style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
        >
          {/* TOPO: LOGO & CABEÇALHO INSTITUCIONAL */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-[#0A192F] pb-6">
            <div className="space-y-1.5">
              <LogoTMEduca tamanho="md" variante="horizontal" corTexto="escuro" />
              <p className="text-[11px] font-semibold tracking-wider uppercase text-[#FF2D75]">
                Plataforma de Explicações ao Domicílio e Apoio Escolar
              </p>
              <p className="text-[11px] text-slate-500">
                Luanda · República de Angola · www.tmeduca.ao
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="inline-block rounded-full bg-[#0A192F] px-3.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white">
                Comprovativo de Pedido
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 pt-1">
                Ref: {dados.numeroPedido}
              </p>
              <p className="text-[11px] text-slate-500">
                Emitido em: {dataFormatada}
              </p>
            </div>
          </div>

          {/* FAIXA DECORATIVA TM-EDUCA */}
          <div className="h-1 w-full bg-gradient-to-r from-[#FF2D75] via-[#0A192F] to-[#10B981] rounded-full" />

          {/* DADOS DO ENCARREGADO E DO ALUNO (2 COLUNAS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs">
            {/* Coluna 1: Encarregado */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
                Encarregado de Educação
              </p>
              <p className="text-sm font-bold text-[#0A192F]">
                {dados.nomeEncarregado}
              </p>
              {dados.telefoneEncarregado && (
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-[#FF2D75]" />
                  {dados.telefoneEncarregado}
                </p>
              )}
              {dados.emailEncarregado && (
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-[#FF2D75]" />
                  {dados.emailEncarregado}
                </p>
              )}
              {dados.municipio && (
                <p className="text-slate-600 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[#FF2D75]" />
                  {dados.municipio}
                  {dados.bairro ? `, ${dados.bairro}` : ""}
                  {dados.endereco ? ` (${dados.endereco})` : ""}
                </p>
              )}
            </div>

            {/* Coluna 2: Aluno */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
                Educando / Percurso Escolar
              </p>
              <p className="text-sm font-bold text-[#0A192F]">
                {dados.nomeAluno}
              </p>
              <p className="text-slate-700 font-semibold flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-[#FF2D75]" />
                Ano Escolar: {dados.anoEscolar}
              </p>
              <p className="text-slate-600">
                Sistema de Ensino: {dados.sistemaEnsino || "Geral Angolano"}
              </p>
              {dados.objetivo && (
                <p className="text-slate-600">
                  <span className="font-medium text-slate-700">Foco:</span> {dados.objetivo}
                </p>
              )}
            </div>
          </div>

          {/* DISCIPLINAS INTEGRADAS NO PLANO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0A192F] flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-[#FF2D75]" />
                Disciplinas Abrangidas no Plano ({dados.disciplinas.length})
              </p>
              <span className="text-[11px] font-semibold text-emerald-700">
                ✓ Valor único por ano escolar (Sem custo adicional por disciplina)
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {dados.disciplinas.map((disc, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0A192F]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF2D75]" />
                  {disc}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 italic">
              * Conforme a política comercial TM-Educa, o valor do serviço é tabelado estritamente por ano de escolaridade e frequência semanal. Todas as disciplinas selecionadas estão plenamente integradas no mesmo acompanhamento sem cobrança adicional.
            </p>
          </div>

          {/* LOGÍSTICA E CONDIÇÕES CONTRATADAS */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0A192F] border-b border-slate-200 pb-1">
              Condições Logísticas & Calendário
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="rounded-lg border border-slate-200 p-2.5">
                <span className="text-[10px] text-slate-500 block">Modalidade</span>
                <span className="font-bold text-[#0A192F]">
                  {dados.modalidade === "Domicilio" ? "Ao Domicílio" : "Online Interativo"}
                </span>
              </div>

              <div className="rounded-lg border border-slate-200 p-2.5">
                <span className="text-[10px] text-slate-500 block">Duração da Sessão</span>
                <span className="font-bold text-[#0A192F]">{dados.duracaoMinutos} Minutos</span>
              </div>

              <div className="rounded-lg border border-slate-200 p-2.5">
                <span className="text-[10px] text-slate-500 block">Frequência Semanal</span>
                <span className="font-bold text-[#0A192F]">
                  {dados.frequenciaSemanal}x por semana
                </span>
              </div>

              <div className="rounded-lg border border-slate-200 p-2.5">
                <span className="text-[10px] text-slate-500 block">Horário Preferencial</span>
                <span className="font-bold text-[#0A192F]">{dados.horarioPreferencial}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Dias de Aulas:</span> {dados.diasSemana}
            </p>
          </div>

          {/* QUADRO FINANCEIRO OFICIAL */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0A192F] px-4 py-2.5 text-white flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">
                Investimento Regulamentado Oficial
              </span>
              <span className="text-[11px] text-slate-300">
                Tabela Oficial TM-Educa {dados.anoEscolar}
              </span>
            </div>

            <div className="divide-y divide-slate-100 bg-white text-xs">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-600">Preço Regulamentado por Aula ({dados.duracaoMinutos} min):</span>
                <span className="font-bold text-slate-900">{formatarKz(dados.precoUnitarioKz)}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-600">
                  Carga Horária Mensal ({dados.frequenciaSemanal} aulas/sem × 4 semanas):
                </span>
                <span className="font-bold text-slate-900">{totalAulasMes} Aulas no Mês</span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-600">Disciplinas Abrangidas ({dados.disciplinas.length}):</span>
                <span className="font-semibold text-emerald-700">Incluídas no Plano (Sem acréscimo)</span>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-t-2 border-slate-200">
                <span className="text-sm font-bold text-[#0A192F]">
                  Estimativa Mensal Oficial:
                </span>
                <span className="text-xl font-black text-[#FF2D75]">
                  {formatarKz(dados.estimativaMensalKz)}
                </span>
              </div>
            </div>
          </div>

          {/* TERMOS E DIZERES INSTITUCIONAIS */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-[11px] leading-relaxed text-slate-600 space-y-1.5">
            <p className="font-bold text-[#0A192F] uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Garantias e Dizeres Institucionais TM-Educa
            </p>
            <p>
              1. <strong>Sem cobrança prévia:</strong> A submissão deste pedido não exige liquidação imediata. O processo de alocação e matching do explicador credenciado é iniciado gratuitamente.
            </p>
            <p>
              2. <strong>Contacto Pedagógico:</strong> A coordenação pedagógica da TM-Educa entrará em contacto nas próximas 24 a 48 horas úteis para confirmar o explicador e agendar a primeira sessão diagnóstica.
            </p>
            <p>
              3. <strong>Qualidade Garantida:</strong> Corpo docente rigorosamente verificado, credenciado e com acompanhamento pedagógico contínuo.
            </p>
          </div>

          {/* RODAPÉ COM CARIMBO DE VALIDAÇÃO */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="font-semibold text-slate-700">TM-Educa Serviços Educacionais, Lda.</p>
              <p>Luanda, Angola · Telefone / WhatsApp: (+244) 955 916 711 · tmeduca99@gmail.com</p>
              <p className="text-[10px] text-slate-400">Documento emitido eletronicamente pela plataforma TM-Educa</p>
            </div>

            {/* Carimbo Visual Digital */}
            <div className="border-2 border-emerald-600/80 rounded-xl px-3.5 py-1.5 text-center rotate-[-2deg] bg-emerald-50/50">
              <p className="text-[9px] font-black uppercase tracking-wider text-emerald-800">
                TM-EDUCA ANGOLA
              </p>
              <p className="text-[8px] font-bold text-emerald-700">
                REGISTO VÁLIDO & VERIFICADO
              </p>
              <p className="text-[8px] font-mono text-emerald-600">
                {new Date(dados.dataEmissao).toISOString().slice(0, 10)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Botão independente para acionar o modal de comprovativo em qualquer página */
export function BotaoGerarComprovativoPDF({
  dados,
  className = "",
}: {
  dados: DadosComprovativoPedido;
  className?: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Botao
        type="button"
        onClick={() => setAberto(true)}
        className={`gap-2 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white border border-slate-700 shadow-xs transition-all hover:scale-102 ${className}`}
      >
        <FileText className="h-4 w-4 text-[#FF2D75]" />
        Gerar Comprovativo PDF
      </Botao>

      <ModalComprovativoPedidoPDF
        dados={dados}
        aberto={aberto}
        aoFechar={() => setAberto(false)}
      />
    </>
  );
}
