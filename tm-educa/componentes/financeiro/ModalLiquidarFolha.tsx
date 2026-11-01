"use client";

import { useState, useTransition } from "react";
import { acaoLiquidarFolhaRemuneracao } from "@/modulos/financeiro/acoes";
import { Botao } from "@/componentes/ui/botao";
import { CheckCircle2, X } from "lucide-react";

interface PropriedadesModalLiquidarFolha {
  folhaId: string;
  codigoFolha: string;
  valorLiquidoKz: number;
  professorNome: string;
}

export function ModalLiquidarFolha({
  folhaId,
  codigoFolha,
  valorLiquidoKz,
  professorNome,
}: PropriedadesModalLiquidarFolha) {
  const [aberto, setAberto] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();
  const [ibanDestino, setIbanDestino] = useState("AO06.");
  const [comprovativoUrl, setComprovativoUrl] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ibanDestino.trim() || ibanDestino.length < 15) {
      setErro("Indique um IBAN válido para transferência.");
      return;
    }

    setSucesso(null);
    setErro(null);

    iniciarTransicao(async () => {
      const res = await acaoLiquidarFolhaRemuneracao({
        folhaId,
        ibanDestino,
        comprovativoPagamentoUrl: comprovativoUrl,
        observacoes,
      });

      if (res.sucesso) {
        setSucesso(res.mensagem);
        setTimeout(() => setAberto(false), 2000);
      } else {
        setErro(res.mensagem);
      }
    });
  };

  return (
    <div>
      {!aberto ? (
        <Botao
          tamanho="sm"
          className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2.5"
          onClick={() => setAberto(true)}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Liquidar IBAN
        </Botao>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Liquidar Folha {codigoFolha}
                </h3>
                <p className="text-xs text-slate-500">
                  Beneficiário: Prof. {professorNome} • Valor:{" "}
                  <strong className="text-emerald-600 font-bold">
                    {valorLiquidoKz.toLocaleString("pt-PT")} Kz
                  </strong>
                </p>
              </div>
              <button onClick={() => setAberto(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sucesso && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                ✓ {sucesso}
              </div>
            )}

            {erro && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                ✕ {erro}
              </div>
            )}

            <form onSubmit={submeter} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  IBAN Bancário de Destino:
                </label>
                <input
                  type="text"
                  required
                  value={ibanDestino}
                  onChange={(e) => setIbanDestino(e.target.value)}
                  placeholder="AO06.0040.0000.XXXX.XXXX.XXXX.X"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs font-mono text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ref. / ID da Transferência Bancária:
                </label>
                <input
                  type="text"
                  value={comprovativoUrl}
                  onChange={(e) => setComprovativoUrl(e.target.value)}
                  placeholder="Ex: TRF-TM-2026-901"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Botao
                  type="button"
                  variante="contorno"
                  tamanho="sm"
                  onClick={() => setAberto(false)}
                >
                  Cancelar
                </Botao>
                <Botao type="submit" tamanho="sm" disabled={pendente}>
                  {pendente ? "A registar..." : "Confirmar Liquidação"}
                </Botao>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
