"use client";

import React, { useState, useTransition } from "react";
import { acaoGerarCobrancaMensal } from "@/modulos/financeiro/acoes";
import { Botao } from "@/componentes/ui/botao";
import { formatarKz } from "@/regras/calculo-preco";
import { Receipt, X, Calendar, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PropsModalEmitirCobranca {
  contratoId: string;
  numeroContrato: string;
  clienteNome: string;
  valorMensalKz: number;
}

const MESES_ANO = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function BotaoModalEmitirCobranca({
  contratoId,
  numeroContrato,
  clienteNome,
  valorMensalKz,
}: PropsModalEmitirCobranca) {
  const [aberto, setAberto] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();

  const hoje = new Date();
  const mesSugerido = `${MESES_ANO[hoje.getMonth()]} ${hoje.getFullYear()}`;
  const vencimentoPadrao = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [mesReferencia, setMesReferencia] = useState(mesSugerido);
  const [dataVencimentoStr, setDataVencimentoStr] = useState(vencimentoPadrao);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!mesReferencia.trim() || !dataVencimentoStr) {
      setErro("Preencha o mês de referência e a data limite de pagamento.");
      return;
    }

    iniciarTransicao(async () => {
      const res = await acaoGerarCobrancaMensal({
        contratoId,
        mesReferencia: mesReferencia.trim(),
        dataVencimentoStr,
      });

      if (res.sucesso) {
        setSucesso(res.mensagem);
        setTimeout(() => {
          setAberto(false);
          setSucesso(null);
        }, 1200);
      } else {
        setErro(res.mensagem);
      }
    });
  }

  return (
    <>
      <Botao
        variante="contorno"
        tamanho="sm"
        onClick={() => setAberto(true)}
        className="text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
      >
        <Receipt className="w-3.5 h-3.5" />
        Emitir Fatura
      </Botao>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Emitir Fatura Mensal
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {numeroContrato} · {clienteNome}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAberto(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submeter} className="p-5 space-y-4 text-xs">
              <div className="rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 p-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Valor contratual a faturar:
                </span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {formatarKz(valorMensalKz)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mês / Período de Referência *
                </label>
                <input
                  type="text"
                  required
                  value={mesReferencia}
                  onChange={(e) => setMesReferencia(e.target.value)}
                  placeholder="Ex: Novembro 2026"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Data Limite de Vencimento *
                </label>
                <input
                  type="date"
                  required
                  value={dataVencimentoStr}
                  onChange={(e) => setDataVencimentoStr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {erro && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{erro}</span>
                </div>
              )}

              {sucesso && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{sucesso}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Botao
                  type="button"
                  variante="contorno"
                  tamanho="sm"
                  onClick={() => setAberto(false)}
                  disabled={pendente}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="submit"
                  tamanho="sm"
                  disabled={pendente}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                >
                  {pendente ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      A emitir...
                    </>
                  ) : (
                    "Confirmar Emissão"
                  )}
                </Botao>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

