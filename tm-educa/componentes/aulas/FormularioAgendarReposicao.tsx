"use client";

import { useState, useTransition } from "react";
import { acaoAgendarReposicao } from "@/modulos/aulas/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Calendar, Clock, RefreshCw } from "lucide-react";

interface PropriedadesAgendarReposicao {
  aulaOriginalId: string;
  duracaoMinutosPadrao: number;
  alunoNome: string;
  disciplinaNome: string;
}

export function FormularioAgendarReposicao({
  aulaOriginalId,
  duracaoMinutosPadrao,
  alunoNome,
  disciplinaNome,
}: PropriedadesAgendarReposicao) {
  const [pendente, iniciarTransicao] = useTransition();
  const [dataHoraInicio, setDataHoraInicio] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState(duracaoMinutosPadrao);
  const [motivo, setMotivo] = useState("");

  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    setSucesso(null);
    setErro(null);

    if (!dataHoraInicio) {
      setErro("Por favor, selecione a data e o horário para a reposição.");
      return;
    }

    iniciarTransicao(async () => {
      const resposta = await acaoAgendarReposicao({
        aulaOriginalId,
        novaDataHoraInicio: new Date(dataHoraInicio).toISOString(),
        duracaoMinutos: Number(duracaoMinutos),
        motivo: motivo || "Reposição acordada entre as partes.",
      });

      if (resposta.sucesso) {
        setSucesso(resposta.mensagem);
      } else {
        setErro(resposta.mensagem);
      }
    });
  };

  return (
    <Cartao className="border-blue-200 bg-blue-50/20 dark:border-blue-900/40 dark:bg-blue-950/10">
      <CartaoCabecalho>
        <CartaoTitulo className="flex items-center gap-2 text-base text-blue-900 dark:text-blue-200">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          Agendar Reposição Oficial de Aula
        </CartaoTitulo>
        <CartaoDescricao>
          Reposição para {alunoNome} ({disciplinaNome}). Esta nova aula ficará vinculada à sessão cancelada no sistema de auditoria.
        </CartaoDescricao>
      </CartaoCabecalho>

      <CartaoConteudo>
        {sucesso && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            ✓ {sucesso}
          </div>
        )}

        {erro && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            ✕ {erro}
          </div>
        )}

        <form onSubmit={submeter} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Data e Horário da Nova Sessão:
              </label>
              <input
                type="datetime-local"
                required
                value={dataHoraInicio}
                onChange={(e) => setDataHoraInicio(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Duração da Sessão:
              </label>
              <select
                value={duracaoMinutos}
                onChange={(e) => setDuracaoMinutos(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value={60}>60 minutos (1 hora)</option>
                <option value={90}>90 minutos (1h30)</option>
                <option value={120}>120 minutos (2 horas)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações / Acordo com os Pais:
            </label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: Sessão combinada para o sábado de manhã com o pai, Sr. Silva."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Botao type="submit" disabled={pendente}>
              {pendente ? "A agendar reposição..." : "Confirmar e Vincular Reposição"}
            </Botao>
          </div>
        </form>
      </CartaoConteudo>
    </Cartao>
  );
}
