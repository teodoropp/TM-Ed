"use client";

import { useState, useTransition } from "react";
import { acaoSubstituirProfessorAcompanhamento } from "@/modulos/aulas/acoes";
import { Botao } from "@/componentes/ui/botao";
import { UserCheck, AlertCircle, RefreshCw } from "lucide-react";

interface PropriedadesSubstituirProfessor {
  acompanhamentoId: string;
  codigoAcompanhamento: string;
  professorAtualNome: string;
  professoresDisponiveis: Array<{
    id: string;
    utilizador: { nomeCompleto: string; telefone: string };
  }>;
}

export function ModalSubstituirProfessor({
  acompanhamentoId,
  codigoAcompanhamento,
  professorAtualNome,
  professoresDisponiveis,
}: PropriedadesSubstituirProfessor) {
  const [aberto, setAberto] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();
  const [novoProfessorId, setNovoProfessorId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoProfessorId) {
      setErro("Selecione o novo explicador titular.");
      return;
    }
    if (!motivo.trim()) {
      setErro("Descreva a justificação operacional da substituição.");
      return;
    }

    setSucesso(null);
    setErro(null);

    iniciarTransicao(async () => {
      const resposta = await acaoSubstituirProfessorAcompanhamento({
        acompanhamentoId,
        novoProfessorId,
        motivo,
      });

      if (resposta.sucesso) {
        setSucesso(resposta.mensagem);
        setTimeout(() => setAberto(false), 2000);
      } else {
        setErro(resposta.mensagem);
      }
    });
  };

  return (
    <div>
      {!aberto ? (
        <Botao
          variante="contorno"
          tamanho="sm"
          className="flex items-center gap-1.5"
          onClick={() => setAberto(true)}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Substituir Explicador Titular
        </Botao>
      ) : (
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-900 dark:bg-blue-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Protocolo de Substituição do Explicador ({codigoAcompanhamento})
            </h4>
            <button
              onClick={() => setAberto(false)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancelar
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Explicador atual: <strong>Prof. {professorAtualNome}</strong>.  
            Ao substituir o explicador, o contrato do encarregado mantém-se 100% ativo e o novo explicador assume todas as futuras sessões com acesso aos sumários pedagógicos passados.
          </p>

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
                Novo Professor Titular:
              </label>
              <select
                required
                value={novoProfessorId}
                onChange={(e) => setNovoProfessorId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Selecione o novo explicador...</option>
                {professoresDisponiveis.map((p) => (
                  <option key={p.id} value={p.id}>
                    Prof. {p.utilizador.nomeCompleto} ({p.utilizador.telefone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Justificação / Motivo Operacional:
              </label>
              <textarea
                rows={2}
                required
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Impedimento por motivos de saúde / Mudança de horário compatível com o aluno."
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Botao
                type="button"
                variante="contorno"
                tamanho="sm"
                onClick={() => setAberto(false)}
              >
                Voltar
              </Botao>
              <Botao type="submit" tamanho="sm" disabled={pendente}>
                {pendente ? "A atualizar titular..." : "Confirmar Substituição"}
              </Botao>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
