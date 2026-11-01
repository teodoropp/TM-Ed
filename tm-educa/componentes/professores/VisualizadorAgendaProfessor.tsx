/** @format */

"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Phone,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Video,
  Home,
  SlidersHorizontal,
  Lock,
  MessageSquare,
  FileText,
} from "lucide-react";

import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { Cartao, CartaoConteudo } from "@/componentes/ui/cartao";
import { ModalSumarioAula } from "@/componentes/professores/ModalSumarioAula";
import { EstadoVazioProfessor } from "@/componentes/professores/EstadoVazioProfessor";
import { abrirWhatsAppValidacaoEncarregado } from "@/modulos/aulas/validacao-encarregado";

interface AulaAgenda {
  id: string;
  dataHoraInicio: Date | string;
  dataHoraFim: Date | string;
  duracaoMinutos: number;
  modalidade: string;
  estado: string;
  sumario?: string | null;
  trabalhosDeCasa?: string | null;
  observacoesPedagogicas?: string | null;
  remuneracaoPagaKz: number;
  acompanhamento: {
    aluno: {
      id: string;
      nomeCompleto: string;
      anoEscolar: string;
    };
    disciplina: {
      id: string;
      nome: string;
    };
    encarregado: {
      utilizador: {
        nomeCompleto: string;
        telefone?: string | null;
      };
    };
    municipio?: string | null;
    bairro?: string | null;
    endereco?: string | null;
  };
}

interface VisualizadorAgendaProps {
  aulas: AulaAgenda[];
}

const NOMES_DIAS_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function ehMesmoDia(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function obterInicioSemana(data: Date): Date {
  const d = new Date(data);
  const diaSemana = d.getDay();
  const diff = d.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff, 0, 0, 0);
}

function formatarHora(data: Date | string) {
  const d = new Date(data);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function VisualizadorAgendaProfessor({
  aulas,
}: VisualizadorAgendaProps) {
  const [dataReferencia, setDataReferencia] = useState(new Date());
  const [visualizacao, setVisualizacao] = useState<"semana" | "dia" | "todas">(
    "semana",
  );
  const [aulaParaSumario, setAulaParaSumario] = useState<AulaAgenda | null>(
    null,
  );

  // Início da semana (segunda-feira)
  const inicioSemana = useMemo(() => {
    return obterInicioSemana(dataReferencia);
  }, [dataReferencia]);

  // Lista dos 7 dias da semana
  const diasDaSemana = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(inicioSemana);
      d.setDate(inicioSemana.getDate() + i);
      return d;
    });
  }, [inicioSemana]);

  // Navegação de datas
  function navegar(direcao: "anterior" | "proximo" | "hoje") {
    if (direcao === "hoje") {
      setDataReferencia(new Date());
      return;
    }
    const delta = visualizacao === "dia" ? 1 : 7;
    setDataReferencia((prev) => {
      const nova = new Date(prev);
      nova.setDate(prev.getDate() + (direcao === "anterior" ? -delta : delta));
      return nova;
    });
  }

  // Aulas do dia selecionado
  const aulasDoDia = useMemo(() => {
    return aulas.filter((a) =>
      ehMesmoDia(new Date(a.dataHoraInicio), dataReferencia),
    );
  }, [aulas, dataReferencia]);

  // Aulas agrupadas por dia da semana
  const aulasPorDiaSemana = useMemo(() => {
    return diasDaSemana.map((dia) => {
      const aulasNesteDia = aulas.filter((a) =>
        ehMesmoDia(new Date(a.dataHoraInicio), dia),
      );
      return {
        dia,
        aulas: aulasNesteDia.sort(
          (a, b) =>
            new Date(a.dataHoraInicio).getTime() -
            new Date(b.dataHoraInicio).getTime(),
        ),
      };
    });
  }, [aulas, diasDaSemana]);

  function renderAcaoEstadoAula(aula: AulaAgenda, modo: "semana" | "detalhe" = "detalhe") {
    const dataInicio = new Date(aula.dataHoraInicio);
    const agora = new Date();
    const ehAulaFutura = dataInicio > agora;
    const estaRealizada =
      aula.estado === "Realizada" ||
      (!!aula.sumario && aula.sumario.trim().length > 0);

    if (estaRealizada) {
      if (modo === "semana") {
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-normal rounded-[5px] text-[10px] px-1.5 py-0.5">
            <CheckCircle2 className="h-2.5 w-2.5 mr-1 inline" />
            Realizada
          </Badge>
        );
      }

      return (
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-normal rounded-[5px]">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Realizada
          </Badge>

          {/* MECANISMO 2: Confirmação Cruzada com o Encarregado via WhatsApp */}
          {aula.acompanhamento.encarregado?.utilizador.telefone && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                abrirWhatsAppValidacaoEncarregado({
                  alunoNome: aula.acompanhamento.aluno.nomeCompleto,
                  disciplinaNome: aula.acompanhamento.disciplina.nome,
                  dataHoraInicio: aula.dataHoraInicio,
                  sumario: aula.sumario,
                  trabalhosDeCasa: aula.trabalhosDeCasa,
                  encarregadoNome: aula.acompanhamento.encarregado.utilizador.nomeCompleto,
                  encarregadoTelefone: aula.acompanhamento.encarregado.utilizador.telefone,
                });
              }}
              className="h-7 px-2.5 rounded-[5px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800 text-[11px] font-normal flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Mecanismo 2: Validar aula com encarregado via WhatsApp"
            >
              <MessageSquare className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Validar c/ Encarregado (Mecanismo 2)</span>
            </button>
          )}
        </div>
      );
    }

    /* Aula NÃO realizada: 'Agendada' foi removido e dá lugar ao Sumário (com Mecanismo 1 se futura) */
    if (ehAulaFutura) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setAulaParaSumario(aula);
          }}
          className={`${
            modo === "semana"
              ? "px-1.5 py-0.5 text-[10px]"
              : "h-7 px-2.5 text-xs"
          } rounded-[5px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-normal flex items-center gap-1 transition-colors cursor-pointer`}
          title="Mecanismo 1: Bloqueio Temporal ativo até o horário da aula"
        >
          <Lock className="h-2.5 w-2.5 text-amber-500 shrink-0" />
          <span>Sumário (Bloqueado)</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setAulaParaSumario(aula);
        }}
        className={`${
          modo === "semana"
            ? "px-2 py-0.5 text-[10px]"
            : "h-7 px-3 text-xs"
        } rounded-[5px] bg-emerald-600 hover:bg-emerald-700 text-white font-normal flex items-center gap-1 shadow-xs transition-colors cursor-pointer`}
      >
        <FileCheck2 className="h-3 w-3 shrink-0" />
        <span>Sumário</span>
      </button>
    );
  }

  const fimSemana = diasDaSemana[6];

  return (
    <div className="space-y-6 portal-tipografia">
      {/* Barra Superior de Controlos */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#07182E] p-4 rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Controles de navegação de data */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navegar("anterior")}
            className="h-9 w-9 flex items-center justify-center rounded-[5px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Período anterior">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navegar("hoje")}
            className="h-9 px-3 rounded-[5px] border border-slate-200 dark:border-slate-700 text-xs font-normal hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Hoje
          </button>
          <button
            onClick={() => navegar("proximo")}
            className="h-9 w-9 flex items-center justify-center rounded-[5px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Próximo período">
            <ChevronRight className="h-4 w-4" />
          </button>

          <span className="text-sm font-normal text-slate-800 dark:text-slate-200 ml-2">
            {visualizacao === "dia"
              ? `${dataReferencia.getDate()} de ${NOMES_MESES[dataReferencia.getMonth()]}`
              : `${inicioSemana.getDate()} de ${NOMES_MESES[inicioSemana.getMonth()].slice(0, 3)} - ${fimSemana.getDate()} de ${NOMES_MESES[fimSemana.getMonth()].slice(0, 3)} ${fimSemana.getFullYear()}`}
          </span>
        </div>

        {/* Alternador de visualização */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-[5px]">
          <button
            onClick={() => setVisualizacao("semana")}
            className={`px-3 py-1.5 rounded-[5px] text-xs font-normal transition-all ${
              visualizacao === "semana"
                ? "bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}>
            Semana
          </button>
          <button
            onClick={() => setVisualizacao("dia")}
            className={`px-3 py-1.5 rounded-[5px] text-xs font-normal transition-all ${
              visualizacao === "dia"
                ? "bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}>
            Dia
          </button>
          <button
            onClick={() => setVisualizacao("todas")}
            className={`px-3 py-1.5 rounded-[5px] text-xs font-normal transition-all ${
              visualizacao === "todas"
                ? "bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}>
            Todas as Aulas
          </button>
        </div>
      </div>

      {/* VISTA 1: SEMANAL */}
      {visualizacao === "semana" && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {aulasPorDiaSemana.map(({ dia, aulas: aulasDia }) => {
            const ehHoje = ehMesmoDia(dia, new Date());
            return (
              <div
                key={dia.toISOString()}
                className={`flex flex-col rounded-[5px] border transition-all ${
                  ehHoje
                    ? "bg-rose-50/40 dark:bg-rose-950/10 border-rose-300/50 dark:border-rose-900/40 shadow-sm"
                    : "bg-white dark:bg-[#07182E] border-slate-200 dark:border-slate-800"
                }`}>
                {/* Cabeçalho do Dia */}
                <div
                  className={`p-3 text-center border-b ${
                    ehHoje
                      ? "border-rose-200 dark:border-rose-900/40 bg-rose-500/10"
                      : "border-slate-100 dark:border-slate-800/80"
                  } rounded-t-[5px]`}>
                  <p className="text-xs uppercase tracking-wider font-normal text-slate-500 dark:text-slate-400">
                    {NOMES_DIAS_CURTO[dia.getDay()]}
                  </p>
                  <p
                    className={`text-lg font-normal mt-0.5 ${
                      ehHoje
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-slate-800 dark:text-slate-200"
                    }`}>
                    {dia.getDate()}
                  </p>
                </div>

                {/* Conteúdo de aulas do dia */}
                <div className="p-2 space-y-2 flex-1 min-h-[140px]">
                  {aulasDia.length === 0 ? (
                    <div className="h-full flex items-center justify-center py-6 text-center text-xs text-slate-400">
                      Sem aulas
                    </div>
                  ) : (
                    aulasDia.map((aula) => (
                      <div
                        key={aula.id}
                        className="p-2.5 rounded-[5px] bg-slate-50 dark:bg-[#0A192F]/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-500/50 transition-all text-left space-y-1.5 group">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatarHora(aula.dataHoraInicio)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {aula.duracaoMinutos}m
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-normal text-slate-900 dark:text-white truncate">
                            {aula.acompanhamento.aluno.nomeCompleto}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {aula.acompanhamento.disciplina.nome}
                          </p>
                        </div>

                        <div className="pt-1 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800">
                          {renderAcaoEstadoAula(aula, "semana")}
                          {aula.sumario && (
                            <button
                              onClick={() => setAulaParaSumario(aula)}
                              className="text-[10px] text-emerald-600 hover:underline flex items-center gap-0.5 ml-1"
                              title="Ver sumário">
                              Ver
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISTA 2: DIÁRIA / DETALHADA */}
      {visualizacao === "dia" && (
        <div className="space-y-4">
          {aulasDoDia.length === 0 ? (
            <EstadoVazioProfessor
              titulo="Nenhuma aula agendada para hoje"
              descricao="Não há sessões de tutoria marcadas para este dia no seu calendário pedagógico."
              icone={CalendarIcon}
              acao={{
                rotulo: "Ver Novas Propostas",
                href: "/portal-professor/propostas",
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aulasDoDia.map((aula) => (
                <Cartao
                  key={aula.id}
                  className="rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                  <CartaoConteudo className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-[5px] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatarHora(aula.dataHoraInicio)} -{" "}
                            {formatarHora(aula.dataHoraFim)} (
                            {aula.duracaoMinutos} min)
                          </span>
                          {renderAcaoEstadoAula(aula, "detalhe")}
                        </div>
                        <h4 className="text-base font-normal text-slate-900 dark:text-white">
                          {aula.acompanhamento.aluno.nomeCompleto}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {aula.acompanhamento.disciplina.nome} •{" "}
                          {aula.acompanhamento.aluno.anoEscolar}
                        </p>
                      </div>

                      <div className="h-10 w-10 rounded-[5px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                        {aula.modalidade === "Online" ? (
                          <Video className="h-5 w-5 text-indigo-500" />
                        ) : (
                          <Home className="h-5 w-5 text-rose-500" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-slate-900 dark:text-slate-200 font-normal">
                            {aula.modalidade === "Online"
                              ? "Aula Online (Google Meet / Zoom)"
                              : aula.acompanhamento.municipio || "Luanda"}
                          </p>
                          {aula.acompanhamento.bairro && (
                            <p className="text-slate-400 text-[11px]">
                              {aula.acompanhamento.bairro}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-slate-900 dark:text-slate-200 font-normal">
                            {
                              aula.acompanhamento.encarregado.utilizador
                                .nomeCompleto
                            }
                          </p>
                          {aula.acompanhamento.encarregado.utilizador
                            .telefone && (
                            <a
                              href={`tel:${aula.acompanhamento.encarregado.utilizador.telefone}`}
                              className="text-rose-500 hover:underline text-[11px] block">
                              {
                                aula.acompanhamento.encarregado.utilizador
                                  .telefone
                              }
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {aula.sumario && (
                      <div className="bg-slate-50 dark:bg-[#0A192F] p-3 rounded-[5px] border border-slate-100 dark:border-slate-800/80 text-xs">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                          Sumário Registado
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 italic">
                          &quot;{aula.sumario}&quot;
                        </p>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setAulaParaSumario(aula)}
                        className="h-9 px-4 rounded-[5px] bg-[#0A192F] hover:bg-[#07182E] text-white dark:bg-rose-600 dark:hover:bg-rose-700 font-normal text-xs flex items-center gap-1.5 transition-colors">
                        <FileCheck2 className="h-3.5 w-3.5 mr-1" />
                        {aula.sumario
                          ? "Atualizar / Ver Sumário"
                          : new Date(aula.dataHoraInicio) > new Date()
                          ? "Sumário (Bloqueado)"
                          : "Preencher Sumário & Presença"}
                      </button>
                    </div>
                  </CartaoConteudo>
                </Cartao>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA 3: TODAS AS AULAS (LISTA CRONOLÓGICA) */}
      {visualizacao === "todas" && (
        <div className="space-y-3">
          {aulas.length === 0 ? (
            <EstadoVazioProfessor
              titulo="Nenhuma aula registada"
              descricao="Ainda não tem histórico de aulas na plataforma."
              icone={CalendarIcon}
            />
          ) : (
            aulas.map((aula) => {
              const d = new Date(aula.dataHoraInicio);
              return (
                <div
                  key={aula.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[5px] bg-white dark:bg-[#07182E] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="h-11 w-11 rounded-[5px] bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                      <span className="text-[10px] uppercase font-normal text-slate-400">
                        {NOMES_MESES[d.getMonth()].slice(0, 3)}
                      </span>
                      <span className="text-sm font-normal text-slate-900 dark:text-white leading-tight">
                        {d.getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-normal text-slate-900 dark:text-white">
                          {aula.acompanhamento.aluno.nomeCompleto}
                        </h4>
                        {renderAcaoEstadoAula(aula, "detalhe")}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {aula.acompanhamento.disciplina.nome} •{" "}
                        {aula.acompanhamento.aluno.anoEscolar} •{" "}
                        {formatarHora(aula.dataHoraInicio)} (
                        {aula.duracaoMinutos} min)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-normal text-slate-600 dark:text-slate-400">
                      {aula.modalidade === "Online"
                        ? "Online"
                        : aula.acompanhamento.municipio || "Domicílio"}
                    </span>

                    <button
                      onClick={() => setAulaParaSumario(aula)}
                      className="h-8 px-3 rounded-[5px] border border-slate-200 dark:border-slate-700 font-normal text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors text-slate-700 dark:text-slate-300">
                      <FileCheck2 className="h-3.5 w-3.5 mr-1" />
                      {aula.sumario
                        ? "Ver Sumário"
                        : new Date(aula.dataHoraInicio) > new Date()
                        ? "Sumário (Bloqueado)"
                        : "Preencher Sumário"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal para Registo e Edição de Sumário e Presença */}
      {aulaParaSumario && (
        <ModalSumarioAula
          aula={aulaParaSumario}
          aberto={!!aulaParaSumario}
          aoFechar={() => setAulaParaSumario(null)}
          aoConcluir={() => {
            setAulaParaSumario(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
