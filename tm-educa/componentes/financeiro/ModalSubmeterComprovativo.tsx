"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { acaoSubmeterComprovativoPagamento } from "@/modulos/financeiro/acoes";
import { CONTAS_BANCARIAS_TM_EDUCA } from "@/regras/calculo-financeiro";
import { Botao } from "@/componentes/ui/botao";
import {
  CreditCard,
  Copy,
  Check,
  Upload,
  X,
  FileCheck2,
  FileText,
  Building,
} from "lucide-react";

interface PropriedadesModalComprovativo {
  cobrancaId: string;
  numeroFatura: string;
  valorKz: number;
  mesReferencia: string;
}

export function ModalSubmeterComprovativo({
  cobrancaId,
  numeroFatura,
  valorKz,
  mesReferencia,
}: PropriedadesModalComprovativo) {
  const [aberto, setAberto] = useState(false);
  const [montado, setMontado] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();

  const [referencia, setReferencia] = useState("");
  const [bancoOrigem, setBancoOrigem] = useState("BAI");
  const [observacoes, setObservacoes] = useState("");
  const [ibanCopiado, setIbanCopiado] = useState<string | null>(null);

  // Upload do PDF / Imagem do Comprovativo
  const [comprovativoUrl, setComprovativoUrl] = useState<string>("");
  const [nomeArquivo, setNomeArquivo] = useState<string>("");

  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setMontado(true);
  }, []);

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

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    setSucesso(null);
    setErro(null);

    if (!comprovativoUrl && !referencia.trim()) {
      setErro("Por favor, anexe o comprovativo em PDF/Imagem ou indique a referência bancária.");
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

  const conteudoModal = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setAberto(false);
      }}
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/80 p-4 sm:p-6 backdrop-blur-sm flex justify-center items-start"
    >
      <div className="relative w-full max-w-xl my-4 sm:my-6 rounded-2xl bg-white p-4 sm:p-6 shadow-2xl dark:bg-[#07182E] border border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-5">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#FF2D75]" />
              Liquidação da Fatura {numeroFatura}
            </h3>
            <p className="text-xs text-slate-500">
              Referência: <strong>{mesReferencia}</strong> · Montante:{" "}
              <strong className="text-emerald-600 font-extrabold text-sm">
                {valorKz.toLocaleString("pt-PT")} Kz
              </strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Coordenadas Bancárias Oficiais */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-blue-600" />
            1. Contas Oficiais da TM-Educa para Transferência:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {CONTAS_BANCARIAS_TM_EDUCA.map((c) => (
              <div
                key={c.sigla}
                className="p-3 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 flex flex-col justify-between gap-1.5"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{c.banco}</div>
                  <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 break-all select-all">
                    IBAN: {c.iban}
                  </div>
                  {c.numeroConta && (
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      N.º Conta: <span className="font-semibold select-all text-slate-700 dark:text-slate-200">{c.numeroConta}</span>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400">Titular: {c.titular}</div>
                </div>

                <button
                  type="button"
                  onClick={() => copiarIban(c.iban)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 self-end"
                >
                  {ibanCopiado === c.iban ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar IBAN
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Formulário de Envio do Comprovativo com Upload de PDF / Imagem */}
        <form onSubmit={submeter} className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-emerald-600" />
            2. Anexar Comprovativo de Pagamento (PDF ou Imagem):
          </h4>

          {sucesso && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              ✓ {sucesso}
            </div>
          )}

          {erro && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
              ✕ {erro}
            </div>
          )}

          {/* UPLOAD DE PDF / IMAGEM DO COMPROVATIVO */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Ficheiro do Comprovativo <span className="text-rose-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-emerald-400 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition-all">
                <Upload className="w-4 h-4" />
                <span>{comprovativoUrl ? "Substituir Comprovativo" : "Selecionar Comprovativo (PDF / Imagem)"}</span>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleArquivo}
                  className="hidden"
                />
              </label>

              {comprovativoUrl && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span className="truncate max-w-[200px]">{nomeArquivo || "Documento anexado"}</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Anexe o recibo gerado pelo Multicaixa Express, internet banking ou foto do talão de depósito.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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
                N.º da Operação / Ref. Bancária:
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações (opcional):
            </label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Pagamento referente ao aluno..."
              className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Botao
              type="button"
              variante="contorno"
              tamanho="sm"
              onClick={() => setAberto(false)}
            >
              Cancelar
            </Botao>
            <Botao
              type="submit"
              variante="primario"
              tamanho="sm"
              disabled={pendente || (!comprovativoUrl && !referencia.trim())}
              className="gap-2 font-bold"
            >
              <Check className="w-4 h-4" />
              {pendente ? "A Submeter..." : "Enviar Comprovativo"}
            </Botao>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      <Botao
        variante="primario"
        tamanho="sm"
        className="gap-1.5 text-xs font-semibold"
        onClick={() => setAberto(true)}
      >
        <Upload className="w-3.5 h-3.5" />
        Enviar Comprovativo
      </Botao>

      {aberto && montado && createPortal(conteudoModal, document.body)}
    </div>
  );
}
