"use client";

import { useState, useTransition } from "react";
import { acaoCancelarAula } from "@/modulos/aulas/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { EstadoAula } from "@prisma/client";
import { BookOpen, Calendar, Clock, FileText, User, UserCheck, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormularioAgendarReposicao } from "@/componentes/aulas/FormularioAgendarReposicao";

interface PropriedadesFichaPedagogica {
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
    precoCobradoKz: number;
    registadoEm: Date | null;
    acompanhamento: {
      aluno: { nomeCompleto: string; anoEscolar: string };
      disciplina: { nome: string };
      professor: {
        utilizador: { nomeCompleto: string; telefone: string };
      };
    };
    aulaOriginalReposicao?: { id: string; aulaReposicao: { dataHoraInicio: Date; estado: EstadoAula } } | null;
    reposicaoDe?: { id: string; aulaOriginal: { dataHoraInicio: Date } } | null;
  };
}

export function FichaAulaPedagogica({ aula }: PropriedadesFichaPedagogica) {
  const [pendente, iniciarTransicao] = useTransition();
  const [mostrarCancelamento, setMostrarCancelamento] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const agora = new Date();
  const inicio = new Date(aula.dataHoraInicio);
  const fim = new Date(aula.dataHoraFim);
  const horasAteAula = (inicio.getTime() - agora.getTime()) / (1000 * 60 * 60);
  const temMaisDe24Horas = horasAteAula >= 24;

  const solicitarCancelamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) {
      setMensagemErro("Por favor, descreva o motivo do cancelamento.");
      return;
    }

    setMensagemSucesso(null);
    setMensagemErro(null);

    iniciarTransicao(async () => {
      const resposta = await acaoCancelarAula({
        aulaId: aula.id,
        motivo,
        responsavel: "ENCARREGADO",
      });

      if (resposta.sucesso) {
        setMensagemSucesso(resposta.mensagem);
        setMostrarCancelamento(false);
      } else {
        setMensagemErro(resposta.mensagem);
      }
    });
  };

  const formatarData = (d: Date) => {
    return new Date(d).toLocaleDateString("pt-PT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatarHora = (d: Date) => {
    return new Date(d).toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/portal-encarregado/acompanhamentos"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Acompanhamentos
        </Link>
      </div>

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

      {/* Cartão de Resumo da Sessão */}
      <Cartao>
        <CartaoCabecalho>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CartaoTitulo className="text-xl">
                Ficha Pedagógica — Sessão n.º {aula.numeroSessao}
              </CartaoTitulo>
              <CartaoDescricao className="capitalize">
                {formatarData(inicio)} • {formatarHora(inicio)} às {formatarHora(fim)} ({aula.duracaoMinutos} min)
              </CartaoDescricao>
            </div>
            <Badge
              variante={
                aula.estado === "Realizada"
                  ? "sucesso"
                  : aula.estado === "Agendada"
                  ? "info"
                  : aula.estado === "Aluno_Ausente" || aula.estado === "Professor_Ausente"
                  ? "aviso"
                  : "perigo"
              }
            >
              {aula.estado === "Realizada" && "✓ Realizada"}
              {aula.estado === "Agendada" && "Próxima Sessão"}
              {aula.estado === "Aluno_Ausente" && "Aluno Ausente"}
              {aula.estado === "Professor_Ausente" && "Falta do Professor"}
              {aula.estado === "Cancelada" && "Cancelada"}
              {aula.estado === "Reagendada" && "Reagendada"}
              {aula.estado === "Substituida" && "Substituída"}
            </Badge>
          </div>
        </CartaoCabecalho>

        <CartaoConteudo className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Aluno / Ano
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {aula.acompanhamento.aluno.nomeCompleto} ({aula.acompanhamento.aluno.anoEscolar})
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Disciplina
              </span>
              <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                {aula.acompanhamento.disciplina.nome}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Explicador
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Prof. {aula.acompanhamento.professor.utilizador.nomeCompleto}
              </span>
            </div>
          </div>

          {/* Se a aula foi realizada: Conteúdos Pedagógicos */}
          {aula.estado === "Realizada" ? (
            <div className="space-y-4">
              {/* Sumário */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                <h4 className="flex items-center gap-2 font-bold text-sm text-blue-900 dark:text-blue-200 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Sumário Curricular Lecionado
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {aula.sumario || "Sumário em elaboração pelo professor."}
                </p>
              </div>

              {/* TPC */}
              {aula.trabalhosDeCasa && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <h4 className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-200 mb-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Trabalhos de Casa e Tarefas Recomendadas (TPC)
                  </h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {aula.trabalhosDeCasa}
                  </p>
                </div>
              )}

              {/* Observações Pedagógicas */}
              {aula.observacoesPedagogicas && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <h4 className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-200 mb-2">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    Observações e Desempenho do Aluno
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {aula.observacoesPedagogicas}
                  </p>
                </div>
              )}

              {aula.registadoEm && (
                <p className="text-xs text-slate-500 italic">
                  Sumário registado oficialmente a {new Date(aula.registadoEm).toLocaleDateString("pt-PT")} às {new Date(aula.registadoEm).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}.
                </p>
              )}
            </div>
          ) : (
            /* Aula Ainda Agendada ou Cancelada */
            <div className="space-y-4">
              {aula.estado === "Agendada" && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-200 leading-relaxed">
                  Esta aula está agendada no calendário regular do acompanhamento. O sumário pedagógico e trabalhos de casa ficarão disponíveis aqui logo após a conclusão da sessão.
                </div>
              )}

              {aula.observacoesPedagogicas && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Notas de Auditoria / Ocorrência
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {aula.observacoesPedagogicas}
                  </p>
                </div>
              )}

              {/* Vínculo de Reposição */}
              {aula.aulaOriginalReposicao ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
                  <h4 className="font-semibold text-sm text-emerald-900 dark:text-emerald-200 mb-1">
                    Reposição Oficial Agendada
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Foi gerada uma nova sessão de reposição marcada para {new Date(aula.aulaOriginalReposicao.aulaReposicao.dataHoraInicio).toLocaleDateString("pt-PT")}.
                  </p>
                </div>
              ) : (
                (aula.estado === "Cancelada" || aula.estado === "Professor_Ausente") &&
                aula.precoCobradoKz === 0 && (
                  <div className="pt-2">
                    <FormularioAgendarReposicao
                      aulaOriginalId={aula.id}
                      duracaoMinutosPadrao={aula.duracaoMinutos}
                      alunoNome={aula.acompanhamento.aluno.nomeCompleto}
                      disciplinaNome={aula.acompanhamento.disciplina.nome}
                    />
                  </div>
                )
              )}

              {/* Botão de Cancelamento Preventivo */}
              {aula.estado === "Agendada" && (
                <div className="pt-2">
                  {!mostrarCancelamento ? (
                    <Botao
                      variante="primario"
                      className="bg-rose-600 hover:bg-rose-700 text-white"
                      tamanho="sm"
                      onClick={() => setMostrarCancelamento(true)}
                    >
                      Avisar Impossibilidade / Cancelar Aula
                    </Botao>
                  ) : (
                    <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
                      <h4 className="font-semibold text-sm text-rose-900 dark:text-rose-200 flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        Política Oficial de Cancelamento TM-Educa
                      </h4>
                      <p className="text-xs text-rose-800 dark:text-rose-300 mb-3 leading-relaxed">
                        {temMaisDe24Horas ? (
                          <>
                            ✓ <strong>Aviso prévio tempestivo ({horasAteAula.toFixed(1)} horas restantes):</strong> Como faltam mais de 24 horas para o início da aula, esta sessão <strong>não será consumida</strong> e terá direito a agendar uma reposição sem custos adicionais.
                          </>
                        ) : (
                          <>
                            ⚠ <strong>Cancelamento com menos de 24 horas ({Math.max(0, horasAteAula).toFixed(1)}h restantes):</strong> Conforme os termos contratuais aceites, a aula será contabilizada para salvaguardar a remuneração do professor pela reserva exclusiva da agenda.
                          </>
                        )}
                      </p>

                      <form onSubmit={solicitarCancelamento} className="space-y-3">
                        <textarea
                          rows={2}
                          required
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                          placeholder="Indique o motivo da ausência ou cancelamento..."
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
                            {pendente ? "A cancelar..." : "Confirmar Cancelamento"}
                          </Botao>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CartaoConteudo>
      </Cartao>
    </div>
  );
}
