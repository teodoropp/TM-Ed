"use client";

import React, { useState } from "react";
import { acaoAtualizarPreco } from "@/modulos/precos/acoes";
import { formatarKz } from "@/regras/calculo-preco";
import { Edit2, Check, X, Loader2 } from "lucide-react";

interface PropsEditorPrecoAdmin {
  anoEscolarId: string;
  anoNome: string;
  duracaoMinutos: number;
  precoAtualKz: number;
}

export function EditorPrecoAdmin({
  anoEscolarId,
  anoNome,
  duracaoMinutos,
  precoAtualKz,
}: PropsEditorPrecoAdmin) {
  const [emEdicao, setEmEdicao] = useState(false);
  const [valorInput, setValorInput] = useState<string>(precoAtualKz.toString());
  const [precoGuardado, setPrecoGuardado] = useState<number>(precoAtualKz);
  const [aCarregar, setACarregar] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  async function handleSalvar() {
    const novoValor = parseInt(valorInput, 10);
    if (isNaN(novoValor) || novoValor <= 0) {
      alert("Por favor, introduza um valor válido em Kwanzas.");
      return;
    }

    setACarregar(true);
    const resultado = await acaoAtualizarPreco(anoEscolarId, duracaoMinutos, novoValor);
    setACarregar(false);

    if (resultado.sucesso) {
      setPrecoGuardado(novoValor);
      setEmEdicao(false);
      setMensagemSucesso(true);
      setTimeout(() => setMensagemSucesso(false), 3000);
    } else {
      alert(resultado.mensagem);
    }
  }

  if (emEdicao) {
    return (
      <div className="flex items-center gap-1.5 justify-center">
        <input
          type="number"
          value={valorInput}
          onChange={(e) => setValorInput(e.target.value)}
          className="w-24 px-2 py-1 text-xs font-bold rounded border border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-center"
          autoFocus
          step={100}
        />
        <button
          type="button"
          onClick={handleSalvar}
          disabled={aCarregar}
          className="p-1 text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
          title="Guardar novo preço"
        >
          {aCarregar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setValorInput(precoGuardado.toString());
            setEmEdicao(false);
          }}
          disabled={aCarregar}
          className="p-1 text-rose-500 hover:text-rose-600"
          title="Cancelar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative flex items-center justify-center gap-1.5">
      <span className="font-extrabold text-slate-900 dark:text-slate-100">
        {formatarKz(precoGuardado)}
      </span>
      <button
        type="button"
        onClick={() => setEmEdicao(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-emerald-600 rounded"
        title={`Alterar preço de ${anoNome} (${duracaoMinutos} min)`}
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>
      {mensagemSucesso && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded shadow">
          Atualizado!
        </span>
      )}
    </div>
  );
}
