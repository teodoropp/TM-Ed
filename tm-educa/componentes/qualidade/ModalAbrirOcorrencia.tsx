"use client";

import React, { useState } from "react";
import { AlertTriangle, Plus, X, AlertCircle } from "lucide-react";
import { Botao } from "@/componentes/ui/botao";
import { acaoAbrirOcorrencia } from "@/modulos/qualidade/acoes";
import { TipoOcorrencia, GravidadeOcorrencia } from "@prisma/client";
import {
  METADADOS_TIPOS_OCORRENCIA,
  METADADOS_GRAVIDADE,
} from "@/regras/sistema-qualidade";

interface ModalAbrirOcorrenciaProps {
  acompanhamentos?: Array<{
    id: string;
    aluno: { nomeCompleto: string };
    disciplina: { nome: string };
  }>;
  aoConcluir?: () => void;
}

export function ModalAbrirOcorrencia({
  acompanhamentos,
  aoConcluir,
}: ModalAbrirOcorrenciaProps) {
  const [aberto, setAberto] = useState(false);
  const [tipo, setTipo] = useState<TipoOcorrencia>("Reclamacao");
  const [gravidade, setGravidade] = useState<GravidadeOcorrencia>("Media");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [acompanhamentoId, setAcompanhamentoId] = useState("");

  const [aCarregar, setACarregar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) {
      setErro("Por favor preencha o título e a descrição da ocorrência.");
      return;
    }

    setACarregar(true);
    setErro(null);

    try {
      const res = await acaoAbrirOcorrencia({
        tipo,
        gravidade,
        titulo,
        descricao,
        acompanhamentoId: acompanhamentoId || undefined,
      });

      if (res.sucesso) {
        setAberto(false);
        setTitulo("");
        setDescricao("");
        setAcompanhamentoId("");
        if (aoConcluir) aoConcluir();
      } else {
        setErro(res.mensagem);
      }
    } catch {
      setErro("Erro de comunicação ao registar a ocorrência.");
    } finally {
      setACarregar(false);
    }
  }

  return (
    <>
      <Botao
        variante="destaque"
        onClick={() => setAberto(true)}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Registar Ocorrência
      </Botao>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            {/* Fechar */}
            <button
              onClick={() => setAberto(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Registo Formal de Ocorrência
                </h3>
                <p className="text-xs text-slate-500">
                  Comunicação auditada para a equipa pedagógica e coordenação do TM-Educa.
                </p>
              </div>
            </div>

            {erro && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            <form onSubmit={submeter} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tipo de Ocorrência */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Ocorrência
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoOcorrencia)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(METADADOS_TIPOS_OCORRENCIA).map(([chave, meta]) => (
                      <option key={chave} value={chave}>
                        {meta.rotulo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gravidade */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nível de Gravidade / Urgência
                  </label>
                  <select
                    value={gravidade}
                    onChange={(e) => setGravidade(e.target.value as GravidadeOcorrencia)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(METADADOS_GRAVIDADE).map(([chave, meta]) => (
                      <option key={chave} value={chave}>
                        {meta.rotulo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Acompanhamento associado se existir */}
              {acompanhamentos && acompanhamentos.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Acompanhamento Escolar Associado (Opcional)
                  </label>
                  <select
                    value={acompanhamentoId}
                    onChange={(e) => setAcompanhamentoId(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nenhum / Ocorrência Geral</option>
                    {acompanhamentos.map((ac) => (
                      <option key={ac.id} value={ac.id}>
                        {ac.aluno.nomeCompleto} — {ac.disciplina.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título Breve da Situação
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Atraso de 40 minutos sem aviso prévio"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Descrição detalhada */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição Circunstanciada dos Fatos
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Descreva o ocorrido com clareza (data, hora, contexto e impacto para o aluno ou família)..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Botao
                  type="button"
                  variante="contorno"
                  onClick={() => setAberto(false)}
                  disabled={aCarregar}
                >
                  Cancelar
                </Botao>
                <Botao
                  type="submit"
                  variante="primario"
                  disabled={aCarregar}
                >
                  {aCarregar ? "A registar..." : "Registar Ocorrência"}
                </Botao>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
