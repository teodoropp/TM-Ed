"use client";

import { useState, useTransition } from "react";
import { acaoProcessarFolhaRemuneracao } from "@/modulos/financeiro/acoes";
import { Botao } from "@/componentes/ui/botao";
import { FileSpreadsheet, Plus, X } from "lucide-react";

interface PropriedadesModalProcessarFolha {
  professores: Array<{
    id: string;
    utilizador: { nomeCompleto: string; telefone: string };
  }>;
}

export function ModalProcessarFolha({ professores }: PropriedadesModalProcessarFolha) {
  const [aberto, setAberto] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();
  const [professorId, setProfessorId] = useState("");
  const [mesReferencia, setMesReferencia] = useState("Outubro 2026");
  const [descontosKz, setDescontosKz] = useState("0");
  const [observacoes, setObservacoes] = useState("");

  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!professorId) {
      setErro("Selecione um professor.");
      return;
    }

    setSucesso(null);
    setErro(null);

    iniciarTransicao(async () => {
      const res = await acaoProcessarFolhaRemuneracao({
        professorId,
        mesReferencia,
        descontosKz: Number(descontosKz) || 0,
        observacoes,
      });

      if (res.sucesso) {
        setSucesso(res.mensagem);
        setTimeout(() => setAberto(false), 2500);
      } else {
        setErro(res.mensagem);
      }
    });
  };

  return (
    <div>
      {!aberto ? (
        <Botao
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => setAberto(true)}
        >
          <Plus className="w-4 h-4" />
          Gerar Folha de Remuneração
        </Botao>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Processar Folha do Explicador (Aulas Elegíveis)
              </h3>
              <button
                onClick={() => setAberto(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              O sistema computará automaticamente todas as sessões <strong>Realizadas</strong> e faltas não comunicadas de alunos (<strong>Aluno_Ausente</strong>). Aulas com falta do explicador são excluídas.
            </p>

            {sucesso && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                ✓ {sucesso}
              </div>
            )}

            {erro && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                ✕ {erro}
              </div>
            )}

            <form onSubmit={submeter} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Explicador Credenciado:
                </label>
                <select
                  required
                  value={professorId}
                  onChange={(e) => setProfessorId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="">Selecione o professor...</option>
                  {professores.map((p) => (
                    <option key={p.id} value={p.id}>
                      Prof. {p.utilizador.nomeCompleto} ({p.utilizador.telefone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mês de Competência:
                  </label>
                  <input
                    type="text"
                    required
                    value={mesReferencia}
                    onChange={(e) => setMesReferencia(e.target.value)}
                    placeholder="Ex: Outubro 2026"
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Descontos / Retenções (Kz):
                  </label>
                  <input
                    type="number"
                    value={descontosKz}
                    onChange={(e) => setDescontosKz(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas de Processamento (opcional):
                </label>
                <input
                  type="text"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Folha regular do 1.º mês de aulas."
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
                  {pendente ? "A apurar aulas..." : "Processar e Aprovar Folha"}
                </Botao>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
