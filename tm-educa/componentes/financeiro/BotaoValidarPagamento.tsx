"use client";

import { useState, useTransition } from "react";
import { acaoValidarPagamentoCliente } from "@/modulos/financeiro/acoes";
import { Botao } from "@/componentes/ui/botao";
import { CheckCircle2, XCircle } from "lucide-react";

interface PropriedadesValidarPagamento {
  cobrancaId: string;
  numeroFatura: string;
}

export function BotaoValidarPagamento({
  cobrancaId,
  numeroFatura,
}: PropriedadesValidarPagamento) {
  const [pendente, iniciarTransicao] = useTransition();
  const [mostrarRejeicao, setMostrarRejeicao] = useState(false);
  const [motivo, setMotivo] = useState("");

  const aprovar = () => {
    iniciarTransicao(async () => {
      await acaoValidarPagamentoCliente({
        cobrancaId,
        aprovado: true,
      });
    });
  };

  const rejeitar = (e: React.FormEvent) => {
    e.preventDefault();
    iniciarTransicao(async () => {
      await acaoValidarPagamentoCliente({
        cobrancaId,
        aprovado: false,
        motivoRejeicao: motivo,
      });
      setMostrarRejeicao(false);
    });
  };

  return (
    <div className="flex items-center gap-1.5 justify-end">
      {!mostrarRejeicao ? (
        <>
          <Botao
            tamanho="sm"
            onClick={aprovar}
            disabled={pendente}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2.5 text-xs gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Validar
          </Botao>
          <Botao
            variante="contorno"
            tamanho="sm"
            onClick={() => setMostrarRejeicao(true)}
            disabled={pendente}
            className="text-rose-600 hover:text-rose-700 h-7 px-2.5 text-xs gap-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            Rejeitar
          </Botao>
        </>
      ) : (
        <form onSubmit={rejeitar} className="flex items-center gap-1">
          <input
            type="text"
            required
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo..."
            className="h-7 w-28 rounded border border-rose-300 p-1 text-[11px] focus:outline-none dark:bg-slate-900"
          />
          <Botao
            type="submit"
            tamanho="sm"
            variante="primario"
            className="bg-rose-600 hover:bg-rose-700 text-white h-7 px-2 text-[11px]"
            disabled={pendente}
          >
            OK
          </Botao>
          <button
            type="button"
            onClick={() => setMostrarRejeicao(false)}
            className="text-xs text-slate-400 hover:text-slate-600 px-1"
          >
            ✕
          </button>
        </form>
      )}
    </div>
  );
}
