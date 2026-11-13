"use client";

import React, { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { DADOS_INSTITUCIONAIS_EMPRESA } from "@/modulos/contratos/clausulas";
import { CONTAS_BANCARIAS_TM_EDUCA } from "@/regras/calculo-financeiro";
import { acaoSubmeterComprovativoPagamento } from "@/modulos/financeiro/acoes";
import { Botao } from "@/componentes/ui/botao";
import {
  FileText,
  Printer,
  FileDown,
  X,
  Building,
  CheckCircle2,
  Clock,
  Upload,
  FileCheck2,
  Check,
  CreditCard,
  Copy,
} from "lucide-react";

interface PropsModalFaturaOficialPDF {
  cobrancaId?: string;
  numeroFatura: string;
  clienteNome: string;
  clienteBi?: string | null;
  alunoNome?: string;
  disciplinaNome?: string;
  mesReferencia: string;
  valorKz: number;
  estado: string;
  dataEmissao?: string | Date;
  dataVencimento?: string | Date;
  dataPagamento?: string | Date | null;
  referenciaBancaria?: string | null;
}

export function ModalFaturaOficialPDF({
  cobrancaId,
  numeroFatura,
  clienteNome,
  clienteBi,
  alunoNome,
  disciplinaNome,
  mesReferencia,
  valorKz,
  estado,
  dataEmissao = new Date(),
  dataVencimento = new Date(),
  dataPagamento,
  referenciaBancaria,
}: PropsModalFaturaOficialPDF) {
  const [aberto, setAberto] = useState(false);
  const [montado, setMontado] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();

  // Envio de comprovativo integrado
  const [referencia, setReferencia] = useState("");
  const [bancoOrigem, setBancoOrigem] = useState("BAI");
  const [observacoes, setObservacoes] = useState("");
  const [comprovativoUrl, setComprovativoUrl] = useState<string>("");
  const [nomeArquivo, setNomeArquivo] = useState<string>("");
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [ibanCopiado, setIbanCopiado] = useState<string | null>(null);

  useEffect(() => {
    setMontado(true);
  }, []);

  const formatarData = (d: string | Date) => {
    return new Date(d).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const copiarIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setIbanCopiado(iban);
    setTimeout(() => setIbanCopiado(null), 3000);
  };

  const handleArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("O ficheiro do comprovativo deve ter no máximo 8MB.");
      return;
    }

    setNomeArquivo(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setComprovativoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const submeterComprovativo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cobrancaId) return;
    setSucesso(null);
    setErro(null);

    if (!comprovativoUrl && !referencia.trim()) {
      setErro("Por favor, selecione o comprovativo em PDF/Imagem ou indique a referência da transferência.");
      return;
    }

    iniciarTransicao(async () => {
      const res = await acaoSubmeterComprovativoPagamento({
        cobrancaId,
        referenciaBancaria: referencia || `ANEXO-${Date.now()}`,
        bancoOrigem,
        comprovativoUrl: comprovativoUrl || undefined,
        observacoes,
      });

      if (res.sucesso) {
        setSucesso(res.mensagem);
        setTimeout(() => {
          setAberto(false);
          window.location.reload();
        }, 1800);
      } else {
        setErro(res.mensagem);
      }
    });
  };

  const guardarFaturaPDF = () => {
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

    const valorFormatado = valorKz.toLocaleString("pt-PT") + " Kz";
    const emissaoFormatada = formatarData(dataEmissao);
    const vencimentoFormatado = formatarData(dataVencimento);

    doc.open();
    doc.write(`
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <title>Fatura Comercial TM-Educa - ${numeroFatura}</title>
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
      border-bottom: 2.5px solid #FF2D75;
      padding-bottom: 16px;
      margin-bottom: 16px;
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
      margin-top: 2px;
    }
    .invoice-badge {
      text-align: right;
    }
    .invoice-num {
      display: inline-block;
      font-size: 14px;
      font-weight: 700;
      font-family: monospace;
      padding: 6px 12px;
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      margin-bottom: 6px;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      margin-top: 4px;
      border: 1px solid;
    }
    .status-pago {
      background: #ECFDF5;
      color: #065F46;
      border-color: #6EE7B7;
    }
    .status-analise {
      background: #FEF3C7;
      color: #92400E;
      border-color: #FCD34D;
    }
    .status-pendente {
      background: #FFF1F2;
      color: #9F1239;
      border-color: #FDA4AF;
    }
    .grid-duas-colunas {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 20px;
    }
    .col-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #94A3B8;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    .col-name {
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 2px;
    }
    .col-detail {
      font-size: 12px;
      color: #475569;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      overflow: hidden;
    }
    th {
      background: #F1F5F9;
      color: #475569;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 10px 14px;
      border-bottom: 1px solid #CBD5E1;
      text-align: left;
    }
    td {
      padding: 12px 14px;
      font-size: 12px;
      border-bottom: 1px solid #F1F5F9;
    }
    .td-right {
      text-align: right;
    }
    .td-center {
      text-align: center;
    }
    .total-row td {
      background: #F8FAFC;
      font-weight: 700;
      border-top: 2px solid #CBD5E1;
      font-size: 14px;
    }
    .total-valor {
      color: #FF2D75;
      font-size: 16px;
      font-weight: 900;
    }
    .bancos-box {
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 14px 16px;
      background: #F8FAFC;
      margin-bottom: 18px;
    }
    .bancos-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #0A192F;
      margin-bottom: 8px;
    }
    .bancos-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .banco-card {
      background: #ffffff;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 11px;
    }
    .banco-nome {
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 3px;
    }
    .banco-iban {
      font-family: monospace;
      font-size: 11px;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 2px;
    }
    .footer-nota {
      font-size: 10px;
      color: #64748B;
      text-align: center;
      border-top: 1px solid #E2E8F0;
      padding-top: 12px;
      margin-top: 18px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">TM<span>-Educa</span></div>
      <div class="brand-sub">Centro Educativo Temilara</div>
      <div class="brand-loc">A Excelência do Saber no Conforto do Teu Lar</div>
      <div class="brand-loc" style="margin-top: 4px;">Luanda, Angola · Tel: (+244) 955 916 711 / 923 000 000</div>
      <div class="brand-loc">E-mail: tmeduca99@gmail.com</div>
    </div>
    <div class="invoice-badge">
      <div class="invoice-num">${numeroFatura}</div>
      <div style="font-size: 11px; color: #64748B;">Emissão: ${emissaoFormatada}</div>
      <div style="font-size: 11px; color: #64748B;">Vencimento: <strong style="color: #0F172A;">${vencimentoFormatado}</strong></div>
      <div>
        ${
          estado === "Pago"
            ? '<span class="status-badge status-pago">✓ LIQUIDADA / PAGA</span>'
            : estado === "EmAnalise"
            ? '<span class="status-badge status-analise">EM ANÁLISE / CONFERÊNCIA</span>'
            : '<span class="status-badge status-pendente">A LIQUIDAR</span>'
        }
      </div>
    </div>
  </div>

  <div class="grid-duas-colunas">
    <div>
      <div class="col-title">Encarregado de Educação (Cliente)</div>
      <div class="col-name">${clienteNome}</div>
      <div class="col-detail">BI / NIF: ${clienteBi || "Não especificado"}</div>
    </div>
    <div>
      <div class="col-title">Beneficiário / Serviço</div>
      <div class="col-name">${alunoNome ? `Aluno: ${alunoNome}` : "Acompanhamento Pedagógico"}</div>
      <div class="col-detail">${disciplinaNome ? `Disciplina: ${disciplinaNome}` : "Explicações Personalizadas"}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Descrição do Serviço Pedagógico</th>
        <th class="td-center">Referência</th>
        <th class="td-right">Montante</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div style="font-weight: 700; color: #0F172A;">Mensalidade de Explicações ao Domicílio</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Plano pedagógico curricular estruturado com professor credenciado TM-Educa</div>
        </td>
        <td class="td-center" style="color: #475569; font-weight: 600;">${mesReferencia}</td>
        <td class="td-right" style="font-weight: 700;">${valorFormatado}</td>
      </tr>
      <tr class="total-row">
        <td colspan="2" class="td-right" style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.04em;">Total Faturado:</td>
        <td class="td-right total-valor">${valorFormatado}</td>
      </tr>
    </tbody>
  </table>

  <div class="bancos-box">
    <div class="bancos-title">Coordenadas Bancárias Oficiais para Liquidação:</div>
    <div class="bancos-grid">
      <div class="banco-card">
        <div class="banco-nome">BAI — Banco Angolano de Investimentos</div>
        <div class="banco-iban">AO06.0040.0000.9578.9097.1014.5</div>
        <div style="font-size: 10px; color: #64748B;">N.º Conta: 004000009578909710145</div>
        <div style="font-size: 10px; color: #64748B;">Titular: TM-Educa Prestação de Serviços, Lda.</div>
      </div>
      <div class="banco-card">
        <div class="banco-nome">BFA — Banco de Fomento Angola</div>
        <div class="banco-iban">AO06.0006.0000.0202.7170.3019.4</div>
        <div style="font-size: 10px; color: #64748B;">N.º Conta: 000600000202717030194</div>
        <div style="font-size: 10px; color: #64748B;">Titular: TM-Educa Prestação de Serviços, Lda.</div>
      </div>
    </div>
  </div>

  <div class="footer-nota">
    Documento emitido eletronicamente pela Plataforma Oficial TM-Educa. Centro Educativo Temilara · Luanda, Angola.
  </div>
</body>
</html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 3000);
    }, 350);
  };

  const modalConteudo = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setAberto(false);
      }}
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start print:p-0 print:bg-white print:static print:backdrop-blur-none"
    >
      <div className="relative w-full max-w-3xl my-4 sm:my-6 rounded-2xl bg-white p-4 sm:p-8 shadow-2xl dark:bg-[#07182E] border border-slate-200 dark:border-slate-800 space-y-5 sm:space-y-6 print:border-none print:shadow-none print:p-0 print:text-black">
        {/* Botões do Topo (não impressos) */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FF2D75]" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Fatura Comercial Oficial TM-Educa
              </h3>
              <p className="text-xs text-slate-500 font-mono">{numeroFatura}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Botao
              type="button"
              variante="primario"
              tamanho="sm"
              onClick={guardarFaturaPDF}
              className="gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5" />
              Guardar PDF
            </Botao>
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CORPO DA FATURA OFICIAL TIMBRADA */}
        <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200 print:text-black">
          {/* Cabeçalho da Empresa */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b-2 border-[#FF2D75] pb-5">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-[#0A192F] dark:text-white print:text-black">
                TM-Educa
              </h1>
              <p className="text-xs font-bold text-[#FF2D75]">
                Centro Educativo Temilara
              </p>
              <p className="text-[11px] text-slate-500">
                A Excelência do Saber no Conforto do Teu Lar
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Luanda, Angola · Tel: {DADOS_INSTITUCIONAIS_EMPRESA.telefonePrincipal}
              </p>
              <p className="text-[11px] text-slate-500">
                E-mail: {DADOS_INSTITUCIONAIS_EMPRESA.email}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-1 font-mono text-sm font-bold text-slate-900 dark:text-white print:border print:border-slate-300">
                {numeroFatura}
              </div>
              <p className="text-[11px] text-slate-500">
                Data de Emissão: {formatarData(dataEmissao)}
              </p>
              <p className="text-[11px] text-slate-500">
                Vencimento: <strong>{formatarData(dataVencimento)}</strong>
              </p>
              <div className="pt-1">
                {estado === "Pago" ? (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ LIQUIDADA / PAGA
                  </span>
                ) : estado === "EmAnalise" ? (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    EM CONFERÊNCIA
                  </span>
                ) : (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300">
                    A LIQUIDAR
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl print:border print:border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Dados do Encarregado (Cliente)
              </span>
              <p className="font-bold text-sm text-slate-900 dark:text-white print:text-black">
                {clienteNome}
              </p>
              <p className="text-slate-500">
                BI / NIF: {clienteBi || "Não especificado"}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Beneficiário / Serviço
              </span>
              <p className="font-semibold text-slate-900 dark:text-white print:text-black">
                {alunoNome ? `Aluno: ${alunoNome}` : "Acompanhamento Pedagógico"}
              </p>
              <p className="text-slate-500">
                {disciplinaNome ? `Disciplina: ${disciplinaNome}` : "Explicações Personalizadas"}
              </p>
            </div>
          </div>

          {/* Tabela Discriminativa dos Serviços */}
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Descrição do Serviço Pedagógico</th>
                  <th className="p-3 text-center">Referência</th>
                  <th className="p-3 text-right">Montante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white print:text-black">
                      Mensalidade de Explicações ao Domicílio
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Plano de acompanhamento escolar e reforço pedagógico contínuo
                    </p>
                  </td>
                  <td className="p-3 text-center text-slate-600 dark:text-slate-400">
                    {mesReferencia}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white print:text-black">
                    {valorKz.toLocaleString("pt-PT")} Kz
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold border-t border-slate-200 dark:border-slate-700">
                  <td colSpan={2} className="p-3 text-right uppercase text-[11px]">
                    Total a Liquidar:
                  </td>
                  <td className="p-3 text-right text-base font-black text-[#FF2D75]">
                    {valorKz.toLocaleString("pt-PT")} Kz
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Coordenadas Bancárias Oficiais para Pagamento */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50/60 dark:bg-slate-800/30 print:border-slate-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white print:text-black text-xs">
                <Building className="w-4 h-4 text-[#FF2D75]" />
                <span>Coordenadas Bancárias para Transferência / Depósito:</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              {CONTAS_BANCARIAS_TM_EDUCA.map((c) => (
                <div key={c.sigla} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-1">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{c.banco}: </span>
                    <div className="font-mono text-xs text-slate-700 dark:text-slate-300 select-all">IBAN: {c.iban}</div>
                    {c.numeroConta && (
                      <p className="text-[10px] text-slate-500 font-mono">
                        N.º Conta: <span className="font-semibold select-all text-slate-700 dark:text-slate-300">{c.numeroConta}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400">Titular: {c.titular}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copiarIban(c.iban)}
                    className="self-end text-[10px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 inline-flex items-center gap-1 print:hidden"
                  >
                    {ibanCopiado === c.iban ? (
                      <span className="text-emerald-600 font-bold">✓ Copiado</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copiar IBAN
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-500 pt-1 italic">
              * Indique o número da fatura ({numeroFatura}) no descritivo da transferência e anexe o comprovativo.
            </p>
          </div>

          {/* SECÇÃO PARA ENVIAR COMPROVATIVO DE PAGAMENTO (PDF / IMAGEM) */}
          {cobrancaId && (estado === "Pendente" || estado === "Falhado") && (
            <div className="rounded-xl border-2 border-dashed border-emerald-400/80 bg-emerald-50/50 dark:border-emerald-700/60 dark:bg-emerald-950/20 p-5 space-y-4 print:hidden">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Enviar Comprovativo de Pagamento desta Fatura (PDF ou Foto)
                </h4>
              </div>

              {sucesso && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-100/70 p-3 text-xs font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓ {sucesso}
                </div>
              )}

              {erro && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                  ✕ {erro}
                </div>
              )}

              <form onSubmit={submeterComprovativo} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                    Anexar Ficheiro do Comprovativo (PDF / Imagem) <span className="text-rose-500">*</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>{comprovativoUrl ? "Substituir Ficheiro" : "Selecionar Comprovativo (PDF / Imagem)"}</span>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={handleArquivo}
                        className="hidden"
                      />
                    </label>

                    {comprovativoUrl && (
                      <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-100/60 dark:bg-emerald-900/40 px-3 py-1.5 rounded-lg">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        <span className="truncate max-w-[240px]">{nomeArquivo || "Documento anexado com sucesso"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Banco de Origem:
                    </label>
                    <select
                      value={bancoOrigem}
                      onChange={(e) => setBancoOrigem(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value="BAI">BAI (Banco Angolano de Investimentos)</option>
                      <option value="BFA">BFA (Banco de Fomento Angola)</option>
                      <option value="Multicaixa Express">Multicaixa Express</option>
                      <option value="BIC">Banco BIC</option>
                      <option value="BPC">BPC (Banco de Poupança e Crédito)</option>
                      <option value="Standard Bank">Standard Bank Angola</option>
                      <option value="Millennium Atlantico">Banco Millennium Atlântico</option>
                      <option value="Outro">Outro Banco Angolano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      N.º Operação / Ref. Bancária:
                    </label>
                    <input
                      type="text"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      placeholder="Ex: TRF-20261007 ou MCX"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Botao
                    type="submit"
                    variante="primario"
                    tamanho="sm"
                    disabled={pendente || (!comprovativoUrl && !referencia.trim())}
                    className="gap-2 font-bold px-4 py-2"
                  >
                    <Check className="w-4 h-4" />
                    {pendente ? "A Submeter..." : "Confirmar e Enviar Comprovativo"}
                  </Botao>
                </div>
              </form>
            </div>
          )}

          {estado === "EmAnalise" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 flex items-center gap-2.5 print:hidden">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Comprovativo de liquidação já submetido. A equipa de administração está a conferir o crédito bancário.
              </span>
            </div>
          )}

          {estado === "Pago" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2.5 print:hidden">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Esta fatura encontra-se liquidada e arquivada com sucesso.
                {dataPagamento && ` Data: ${formatarData(dataPagamento)}.`}
              </span>
            </div>
          )}

          {/* Rodapé Institucional */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-center space-y-1 text-[10px] text-slate-400">
            <p className="font-bold text-slate-600 dark:text-slate-300">
              TEOMILARA — Explicações ao Domicílio · Luanda, Angola
            </p>
            <p>Documento processado por computador com certificação de auditoria TM-Educa.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Botao
        type="button"
        variante="contorno"
        tamanho="sm"
        onClick={() => setAberto(true)}
        className="gap-1.5 text-xs text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <FileText className="w-3.5 h-3.5 text-[#FF2D75]" />
        Ver Fatura (PDF)
      </Botao>

      {aberto && montado && createPortal(modalConteudo, document.body)}
    </>
  );
}
