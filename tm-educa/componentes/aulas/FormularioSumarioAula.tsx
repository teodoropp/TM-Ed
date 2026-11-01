"use client";

import { useState, useTransition } from "react";
import { acaoRegistarSumarioEPresenca, acaoCancelarAula } from "@/modulos/aulas/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { EstadoAula } from "@prisma/client";
import { CheckCircle2, UserX, AlertTriangle, BookOpen, Clock, FileText, Ban } from "lucide-react";

interface PropriedadesFormularioSumario {
  aula: {
    id: string;
    numeroSessao: number;
    dataHoraInicio: Date;
    dataHoraFim: Date;
    duracaoMinutos: number;
    modalidade: string;
    estado: EstadoAula;
    sumario: string | null;
    trabalhosDeCasa: string | null;
    observacoesPedagogicas: string | null;
    acompanhamento: {
      aluno: { nomeCompleto: string; anoEscolar: string };
      disciplina: { nome: string };
      precoPorAulaKz: number;
      remuneracaoPorAulaKz: number;
    };
  };
}

export function FormularioSumarioAula({ aula }: PropriedadesFormularioSumario) {
  const [pendente, iniciarTransicao] = useTransition();
  const [estado, setEstado] = useState<EstadoAula>(
    aula.estado === "Agendada" ? "Realizada" : aula.estado
  );
  const [sumario, setSumario] = useState(aula.sumario || "");
  const [trabalhosDeCasa, setTrabalhosDeCasa] = useState(aula.trabalhosDeCasa || "");
  const [observacoesPedagogicas, setObservacoesPedagogicas] = useState(
    aula.observacoesPedagogicas || ""
  );

  // Estados de Cancelamento
  const [mostrarCancelamento, setMostrarCancelamento] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const submeterSumario = (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemSucesso(null);
    setMensagemErro(null);

    iniciarTransicao(async () => {
      const resposta = await acaoRegistarSumarioEPresenca({
        aulaId: aula.id,
        estado,
        sumario,
        trabalhosDeCasa,
        observacoesPedagogicas,
      });

      if (resposta.sucesso) {
        setMensagemSucesso(resposta.mensagem);
      } else {
        setMensagemErro(resposta.mensagem);
      }
    });
  };

  const submeterCancelamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivoCancelamento.trim()) {
      setMensagemErro("Indique obrigatoriamente o motivo do cancelamento.");
      return;
    }

    setMensagemSucesso(null);
    setMensagemErro(null);

    iniciarTransicao(async () => {
      const resposta = await acaoCancelarAula({
        aulaId: aula.id,
        motivo: motivoCancelamento,
        responsavel: "PROFESSOR",
      });

      if (resposta.sucesso) {
        setMensagemSucesso(resposta.mensagem);
        setMostrarCancelamento(false);
      } else {
        setMensagemErro(resposta.mensagem);
      }
    });
  };

  return (
    <div className="space-y-6">
      {mensagemSucesso && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          ✓ {mensagemSucesso}
        </div>
      )}

      {mensagemErro && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
          ✕ {mensagemErro}
        </div>
      )}

      <Cartao>
        <CartaoCabecalho>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CartaoTitulo className="text-xl">
                Registo Pedagógico — Sessão n.º {aula.numeroSessao}
              </CartaoTitulo>
              <CartaoDescricao>
                {aula.acompanhamento.disciplina.nome} • Aluno: {aula.acompanhamento.aluno.nomeCompleto} ({aula.acompanhamento.aluno.anoEscolar})
              </CartaoDescricao>
            </div>
            <Badge variante={aula.estado === "Realizada" ? "sucesso" : aula.estado === "Agendada" ? "info" : "aviso"}>
              Estado Atual: {aula.estado}
            </Badge>
          </div>
        </CartaoCabecalho>

        <CartaoConteudo>
          <form onSubmit={submeterSumario} className="space-y-6">
            {/* Escolha do Estado da Sessão */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                1. Registo de Presença / Desfecho da Sessão:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setEstado("Realizada")}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    estado === "Realizada"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Aula Realizada</div>
                    <div className="text-xs text-slate-500">Aluno esteve presente</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEstado("Aluno_Ausente")}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    estado === "Aluno_Ausente"
                      ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20 dark:bg-amber-950/40 dark:text-amber-200"
                      : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <UserX className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Aluno Ausente</div>
                    <div className="text-xs text-slate-500">Falta não comunicada</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEstado("Professor_Ausente")}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    estado === "Professor_Ausente"
                      ? "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20 dark:bg-rose-950/40 dark:text-rose-200"
                      : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Falta do Explicador</div>
                    <div className="text-xs text-slate-500">Sem remuneração • Reposição obrigatória</div>
                  </div>
                </button>
              </div>

              {/* Nota comercial da política */}
              {estado === "Realizada" && (
                <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
                  ✓ Remuneração prevista: {aula.acompanhamento.remuneracaoPorAulaKz.toLocaleString("pt-PT")} Kz. O sumário é visível no portal do pai.
                </p>
              )}
              {estado === "Aluno_Ausente" && (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                  ℹ Falta sem aviso prévio: Conforme a política TM-Educa, a sua remuneração de {aula.acompanhamento.remuneracaoPorAulaKz.toLocaleString("pt-PT")} Kz está salvaguardada pela reserva de horário.
                </p>
              )}
              {estado === "Professor_Ausente" && (
                <p className="mt-2 text-xs text-rose-700 dark:text-rose-400">
                  ⚠ Falta do professor: Não há remuneração atribuída. A sessão será listada para reposição obrigatória sem custos para a família.
                </p>
              )}
            </div>

            {/* Sumário da Matéria */}
            {estado === "Realizada" && (
              <div>
                <label htmlFor="sumario" className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  2. Sumário Curricular Lecionado (Obrigatório):
                </label>
                <textarea
                  id="sumario"
                  rows={4}
                  required={estado === "Realizada"}
                  value={sumario}
                  onChange={(e) => setSumario(e.target.value)}
                  placeholder="Ex: Resolução de equações de 2.º grau pela fórmula de Bhaskara. Análise do discriminante (delta) e resolução de 6 exercícios práticos do manual escolar."
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <span className="text-xs text-slate-500">
                  Descreva detalhadamente os tópicos abordados para consulta da família e acompanhamento pedagógico.
                </span>
              </div>
            )}

            {/* Trabalhos de Casa (TPC) */}
            {estado === "Realizada" && (
              <div>
                <label htmlFor="tpc" className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  3. Trabalhos de Casa / Tarefas Recomendadas (TPC):
                </label>
                <textarea
                  id="tpc"
                  rows={3}
                  value={trabalhosDeCasa}
                  onChange={(e) => setTrabalhosDeCasa(e.target.value)}
                  placeholder="Ex: Exercícios 4 a 9 da página 142 do manual. Rever o cálculo mental das tabuadas do 7 e 8 para o teste da próxima quinta-feira."
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            )}

            {/* Observações Pedagógicas */}
            <div>
              <label htmlFor="obs" className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                {estado === "Realizada" ? "4. Notas Pedagógicas e Comportamento:" : "2. Justificação da Ocorrência:"}
              </label>
              <textarea
                id="obs"
                rows={3}
                required={estado !== "Realizada"}
                value={observacoesPedagogicas}
                onChange={(e) => setObservacoesPedagogicas(e.target.value)}
                placeholder={
                  estado === "Realizada"
                    ? "Ex: O aluno demonstrou excelente concentração e evolução clara no raciocínio abstrato face à sessão anterior."
                    : "Descreva o motivo da ausência ou justificação da ocorrência."
                }
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Botao type="submit" disabled={pendente}>
                {pendente ? "A guardar registo..." : "Guardar Sumário e Presença"}
              </Botao>

              {aula.estado === "Agendada" && (
                <button
                  type="button"
                  onClick={() => setMostrarCancelamento(!mostrarCancelamento)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-400"
                >
                  <Ban className="w-3.5 h-3.5" />
                  {mostrarCancelamento ? "Fechar cancelamento" : "Solicitar cancelamento da sessão"}
                </button>
              )}
            </div>
          </form>

          {/* Secção de Cancelamento Rápido com Aviso das 24h */}
          {mostrarCancelamento && (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
              <h4 className="font-semibold text-sm text-rose-900 dark:text-rose-200 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Cancelamento de Sessão Agendada (Política TM-Educa)
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mb-3 leading-relaxed">
                Atenção: O cancelamento por parte do explicador suspende a remuneração desta sessão e cria automaticamente uma obrigação de reposição em horário a combinar com a família.
              </p>
              <form onSubmit={submeterCancelamento} className="space-y-3">
                <textarea
                  rows={2}
                  required
                  value={motivoCancelamento}
                  onChange={(e) => setMotivoCancelamento(e.target.value)}
                  placeholder="Motivo detalhado para o cancelamento da sessão..."
                  className="w-full rounded-lg border border-rose-200 bg-white p-2.5 text-xs text-slate-900 focus:border-rose-500 focus:outline-none dark:border-rose-800 dark:bg-slate-900 dark:text-slate-100"
                />
                <div className="flex justify-end gap-2">
                  <Botao
                    type="button"
                    variante="contorno"
                    tamanho="sm"
                    onClick={() => setMostrarCancelamento(false)}
                  >
                    Voltar
                  </Botao>
                  <Botao
                    type="submit"
                    variante="primario"
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                    tamanho="sm"
                    disabled={pendente}
                  >
                    {pendente ? "A processar..." : "Confirmar Cancelamento"}
                  </Botao>
                </div>
              </form>
            </div>
          )}
        </CartaoConteudo>
      </Cartao>
    </div>
  );
}
