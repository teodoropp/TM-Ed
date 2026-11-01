"use client";

import React, { useState } from "react";
import { acaoRegistarSumarioEPresenca } from "@/modulos/aulas/acoes";
import { Botao } from "@/componentes/ui/botao";
import { EstadoAula } from "@prisma/client";
import { abrirWhatsAppValidacaoEncarregado } from "@/modulos/aulas/validacao-encarregado";
import {
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  BookOpen,
  ShieldAlert,
  MessageSquare,
  Send,
  Lock,
} from "lucide-react";

interface PropsModalSumarioAula {
  aula: {
    id: string;
    dataHoraInicio: Date | string;
    duracaoMinutos: number;
    estado: string;
    sumario?: string | null;
    trabalhosDeCasa?: string | null;
    observacoesPedagogicas?: string | null;
    acompanhamento: {
      aluno: {
        nomeCompleto: string;
      };
      disciplina: {
        nome: string;
      };
      encarregado?: {
        utilizador: {
          nomeCompleto: string;
          telefone?: string | null;
        };
      };
    };
  };
  aberto: boolean;
  aoFechar: () => void;
  aoConcluir?: () => void;
}

export function ModalSumarioAula({
  aula,
  aberto,
  aoFechar,
  aoConcluir,
}: PropsModalSumarioAula) {
  const dataInicio = new Date(aula.dataHoraInicio);
  const agora = new Date();
  const ehAulaFutura = dataInicio > agora;

  const [estado, setEstado] = useState<EstadoAula>(
    (aula.estado as EstadoAula) === "Agendada"
      ? ehAulaFutura
        ? EstadoAula.Agendada
        : EstadoAula.Realizada
      : (aula.estado as EstadoAula)
  );

  const [sumario, setSumario] = useState(aula.sumario || "");
  const [trabalhosDeCasa, setTrabalhosDeCasa] = useState(aula.trabalhosDeCasa || "");
  const [observacoesPedagogicas, setObservacoesPedagogicas] = useState(
    aula.observacoesPedagogicas || ""
  );
  const [solicitarConfirmacaoPai, setSolicitarConfirmacaoPai] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  if (!aberto) return null;

  const horaFormatada = new Intl.DateTimeFormat("pt-AO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dataInicio);

  function abrirConfirmacaoWhatsApp(sumarioTexto: string) {
    abrirWhatsAppValidacaoEncarregado({
      alunoNome: aula.acompanhamento.aluno.nomeCompleto,
      disciplinaNome: aula.acompanhamento.disciplina.nome,
      dataHoraInicio: aula.dataHoraInicio,
      sumario: sumarioTexto,
      trabalhosDeCasa: trabalhosDeCasa || undefined,
      encarregadoNome: aula.acompanhamento.encarregado?.utilizador.nomeCompleto,
      encarregadoTelefone: aula.acompanhamento.encarregado?.utilizador.telefone,
    });
  }

  async function submeter(e: React.FormEvent) {
    e.preventDefault();

    // MECANISMO 1: Bloqueio Temporal
    if (estado === "Realizada" && ehAulaFutura) {
      setErro(
        `Bloqueio Temporal Ativo: Esta aula está agendada para ${horaFormatada}. Não é permitido marcá-la como Realizada antes da sua ocorrência.`
      );
      return;
    }

    if (estado === "Realizada" && sumario.trim().length < 10) {
      setErro("Para aulas realizadas, descreva o conteúdo lecionado no sumário (mínimo 10 caracteres).");
      return;
    }

    if (
      (estado === "Aluno_Ausente" || estado === "Professor_Ausente") &&
      observacoesPedagogicas.trim().length < 5
    ) {
      setErro(
        "Em caso de ausência, justifique ou registe o motivo nas observações pedagógicas (mínimo 5 caracteres)."
      );
      return;
    }

    setCarregando(true);
    setErro(null);

    const res = await acaoRegistarSumarioEPresenca({
      aulaId: aula.id,
      estado,
      sumario: sumario.trim() || undefined,
      trabalhosDeCasa: trabalhosDeCasa.trim() || undefined,
      observacoesPedagogicas: observacoesPedagogicas.trim() || undefined,
    });

    setCarregando(false);

    if (res.sucesso) {
      setSucesso(true);

      // MECANISMO 2: Se optou por notificar o encarregado via WhatsApp
      if (solicitarConfirmacaoPai && estado === "Realizada" && aula.acompanhamento.encarregado?.utilizador.telefone) {
        abrirConfirmacaoWhatsApp(sumario.trim());
      }

      setTimeout(() => {
        aoFechar();
        if (aoConcluir) aoConcluir();
        window.location.reload();
      }, 900);
    } else {
      setErro(res.mensagem);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-xs">
      <div className="relative w-full max-w-lg my-6 rounded-[5px] bg-white shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 dark:bg-[#07182E] text-slate-900 dark:text-white font-normal portal-tipografia">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-normal text-slate-900 dark:text-white">
                Registo de Sumário Pedagógico & Presença
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {aula.acompanhamento.disciplina.nome} · {aula.acompanhamento.aluno.nomeCompleto}
              </p>
            </div>
          </div>

          <button
            onClick={aoFechar}
            aria-label="Fechar"
            className="rounded-[5px] p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informações da Sessão */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/30 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-normal">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            {horaFormatada} ({aula.duracaoMinutos} min)
          </span>
          <span className="font-normal text-slate-700 dark:text-slate-300">
            Aluno: {aula.acompanhamento.aluno.nomeCompleto}
          </span>
        </div>

        {/* MECANISMO 1: BANNER DE BLOQUEIO TEMPORAL DE AULA FUTURA */}
        {ehAulaFutura && (
          <div className="mx-5 mt-4 p-3 rounded-[5px] border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 space-y-1">
            <div className="flex items-center gap-2 font-normal text-xs">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Bloqueio Temporal Ativo (Mecanismo 1)</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-400 font-normal">
              Esta aula está marcada para <strong>{horaFormatada}</strong>. O sistema não permite registar sumário definitivo como "Realizada" antes do horário da aula para evitar lançamentos antecipados.
            </p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={submeter} className="p-5 space-y-4 text-xs font-normal">
          {/* Estado da Presença */}
          <div className="space-y-1.5">
            <label className="font-normal text-slate-700 dark:text-slate-300 block">
              Estado da Aula *
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoAula)}
              className="w-full px-3 py-2 rounded-[5px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-normal"
            >
              <option value="Realizada" disabled={ehAulaFutura}>
                {ehAulaFutura
                  ? "✗ Aula Realizada (Indisponível - Aguardando Horário)"
                  : "✓ Aula Realizada com Sucesso"}
              </option>
              <option value="Agendada">○ Agendada (Pendente de Realização)</option>
              <option value="Aluno_Ausente">✗ Aluno Ausente (Falta sem aviso)</option>
              <option value="Professor_Ausente">✗ Falta do Professor</option>
              <option value="Cancelada">Cancelada (Com Aviso Prévio)</option>
              <option value="Reagendada">Reagendada para outra data</option>
            </select>
          </div>

          {/* Sumário Curricular */}
          <div className="space-y-1.5">
            <label className="font-normal text-slate-700 dark:text-slate-300 block">
              Sumário da Matéria Lecionada {estado === "Realizada" ? "*" : ""}
            </label>
            <textarea
              rows={3}
              value={sumario}
              onChange={(e) => setSumario(e.target.value)}
              placeholder="Ex: Resolução de equações e problemas de aplicação prática. Consolidação de exercícios..."
              className="w-full px-3 py-2 rounded-[5px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-normal"
              disabled={ehAulaFutura}
            />
          </div>

          {/* Trabalhos de Casa (TPC) */}
          <div className="space-y-1.5">
            <label className="font-normal text-slate-700 dark:text-slate-300 block">
              Trabalhos de Casa / Tarefas Recomendadas (Opcional)
            </label>
            <input
              type="text"
              value={trabalhosDeCasa}
              onChange={(e) => setTrabalhosDeCasa(e.target.value)}
              placeholder="Ex: Exercícios 4 a 8 da ficha pedagógica para revisão"
              className="w-full px-3 py-2 rounded-[5px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-normal"
              disabled={ehAulaFutura}
            />
          </div>

          {/* Observações Pedagógicas */}
          <div className="space-y-1.5">
            <label className="font-normal text-slate-700 dark:text-slate-300 block">
              Observações Pedagógicas (Para o Encarregado e Coordenação)
            </label>
            <textarea
              rows={2}
              value={observacoesPedagogicas}
              onChange={(e) => setObservacoesPedagogicas(e.target.value)}
              placeholder="Ex: Aluno participativo, assimilou a matéria com facilidade..."
              className="w-full px-3 py-2 rounded-[5px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-normal"
              disabled={ehAulaFutura}
            />
          </div>

          {/* MECANISMO 2: NOTIFICAÇÃO & CONFIRMAÇÃO CRUZADA COM O ENCARREGADO */}
          {aula.acompanhamento.encarregado?.utilizador.telefone && !ehAulaFutura && (
            <div className="p-3 rounded-[5px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-normal text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={solicitarConfirmacaoPai}
                  onChange={(e) => setSolicitarConfirmacaoPai(e.target.checked)}
                  className="rounded-[3px] text-emerald-600 h-4 w-4 border-slate-300"
                />
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Enviar confirmação de presença ao Encarregado ({aula.acompanhamento.encarregado.utilizador.telefone})
                </span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6 font-normal">
                Dispara o aviso oficial de aula dada com sumário via WhatsApp para validação imediata da família.
              </p>
            </div>
          )}

          {erro && (
            <div className="flex items-center gap-2 p-3 rounded-[5px] bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {sucesso && (
            <div className="flex items-center gap-2 p-3 rounded-[5px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Sumário registado com sucesso!</span>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <Botao
              type="button"
              variante="contorno"
              onClick={aoFechar}
              disabled={carregando}
              className="rounded-[5px] text-xs font-normal h-9 px-4"
            >
              Cancelar
            </Botao>

            <Botao
              type="submit"
              disabled={carregando || (ehAulaFutura && estado === "Realizada")}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[5px] text-xs font-normal h-9 px-5 shadow-xs"
            >
              {carregando ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  A Registar...
                </>
              ) : ehAulaFutura ? (
                "Guardar (Aula Futura)"
              ) : (
                "Concluir Aula & Sumário (Mecanismo 1 e 2)"
              )}
            </Botao>
          </div>
        </form>
      </div>
    </div>
  );
}
