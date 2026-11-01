"use client";

import React, { useState } from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";
import { Botao } from "@/componentes/ui/botao";
import { acaoResolverOcorrencia, acaoCancelarOcorrencia } from "@/modulos/qualidade/acoes";

interface ModalResolverOcorrenciaProps {
  ocorrenciaId: string;
  numeroOcorrencia: string;
  titulo: string;
  aoConcluir?: () => void;
}

export function ModalResolverOcorrencia({
  ocorrenciaId,
  numeroOcorrencia,
  titulo,
  aoConcluir,
}: ModalResolverOcorrenciaProps) {
  const [aberto, setAberto] = useState(false);
  const [parecer, setParecer] = useState("");
  const [aCarregar, setACarregar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function manipularResolucao(e: React.FormEvent) {
    e.preventDefault();
    if (!parecer.trim()) {
      setErro("Por favor insira o parecer formal de resolução.");
      return;
    }

    setACarregar(true);
    setErro(null);

    try {
      const res = await acaoResolverOcorrencia({
        ocorrenciaId,
        resolucao: parecer,
      });

      if (res.sucesso) {
        setAberto(false);
        setParecer("");
        if (aoConcluir) aoConcluir();
      } else {
        setErro(res.mensagem);
      }
    } catch {
      setErro("Erro de comunicação ao resolver ocorrência.");
    } finally {
      setACarregar(false);
    }
  }

  async function manipularCancelamento() {
    if (!parecer.trim()) {
      setErro("Insira uma justificativa no campo de parecer antes de arquivar/cancelar.");
      return;
    }

    setACarregar(true);
    setErro(null);

    try {
      const res = await acaoCancelarOcorrencia({
        ocorrenciaId,
        motivoCancelamento: parecer,
      });

      if (res.sucesso) {
        setAberto(false);
        setParecer("");
        if (aoConcluir) aoConcluir();
      } else {
        setErro(res.mensagem);
      }
    } catch {
      setErro("Erro de comunicação ao cancelar ocorrência.");
    } finally {
      setACarregar(false);
    }
  }

  return (
    <>
      <Botao
        variante="primario"
        tamanho="sm"
        onClick={() => setAberto(true)}
        className="flex items-center gap-1.5"
      >
        <CheckCircle className="w-3.5 h-3.5" />
        Resolver / Concluir
      </Botao>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setAberto(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Parecer Formal de Resolução
                </h3>
                <p className="text-xs text-slate-500">
                  {numeroOcorrencia} — {titulo}
                </p>
              </div>
            </div>

            {erro && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            <form onSubmit={manipularResolucao} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parecer da Coordenação e Medidas Adotadas
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Descreva as deliberações com as partes, compensações acordadas (aula de reposição, advertência, crédito ou ajuste)..."
                  value={parecer}
                  onChange={(e) => setParecer(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={manipularCancelamento}
                  disabled={aCarregar}
                  className="text-xs text-rose-600 hover:text-rose-700 underline font-medium"
                >
                  Arquivar como Cancelada
                </button>

                <div className="flex items-center gap-2">
                  <Botao
                    type="button"
                    variante="contorno"
                    onClick={() => setAberto(false)}
                    disabled={aCarregar}
                  >
                    Fechar
                  </Botao>
                  <Botao
                    type="submit"
                    variante="primario"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={aCarregar}
                  >
                    {aCarregar ? "A gravar..." : "Concluir Resolução"}
                  </Botao>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
