"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  Filter,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Banknote,
  GraduationCap,
  Home,
  Video,
  FileText,
  User,
  ArrowRight,
  Lock,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import { Input } from "@/componentes/ui/input";
import { Badge } from "@/componentes/ui/badge";
import { Cartao, CartaoConteudo } from "@/componentes/ui/cartao";
import { formatarKz } from "@/regras/calculo-preco";
import { ModalSumarioAula } from "@/componentes/professores/ModalSumarioAula";
import { EstadoVazioProfessor } from "@/componentes/professores/EstadoVazioProfessor";
import { abrirWhatsAppValidacaoEncarregado } from "@/modulos/aulas/validacao-encarregado";
import { FormularioAgendarReposicao } from "@/componentes/aulas/FormularioAgendarReposicao";

interface ItemAulaProfessor {
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
    id: string;
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
  };
}

interface VisualizadorAulasProps {
  aulas: ItemAulaProfessor[];
}

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

function formatarHora(data: Date | string) {
  const d = new Date(data);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function VisualizadorAulasProfessor({ aulas }: VisualizadorAulasProps) {
  const [abaAtiva, setAbaAtiva] = useState<"todas" | "pendentes" | "realizadas" | "agendadas">("todas");
  const [pesquisa, setPesquisa] = useState("");
  const [aulaParaSumario, setAulaParaSumario] = useState<ItemAulaProfessor | null>(null);
  const [aulaParaReposicaoId, setAulaParaReposicaoId] = useState<string | null>(null);

  const agora = new Date();

  // Filtra as aulas
  const aulasFiltradas = useMemo(() => {
    return aulas.filter((aula) => {
      const inicio = new Date(aula.dataHoraInicio);
      const passou = inicio <= agora;
      const temSumario = !!aula.sumario && aula.sumario.trim().length > 0;

      // Filtro de abas
      if (abaAtiva === "pendentes") {
        const precisaSumario = (aula.estado === "Realizada" || (aula.estado === "Agendada" && passou)) && !temSumario;
        if (!precisaSumario) return false;
      } else if (abaAtiva === "realizadas") {
        if (aula.estado !== "Realizada") return false;
      } else if (abaAtiva === "agendadas") {
        if (aula.estado !== "Agendada") return false;
      }

      // Filtro de pesquisa por texto
      if (pesquisa.trim()) {
        const termo = pesquisa.toLowerCase();
        const nomeAluno = aula.acompanhamento.aluno.nomeCompleto.toLowerCase();
        const nomeDisciplina = aula.acompanhamento.disciplina.nome.toLowerCase();
        const sumarioTexto = (aula.sumario || "").toLowerCase();
        return (
          nomeAluno.includes(termo) ||
          nomeDisciplina.includes(termo) ||
          sumarioTexto.includes(termo)
        );
      }

      return true;
    });
  }, [aulas, abaAtiva, pesquisa, agora]);

  // Contadores
  const contadores = useMemo(() => {
    const pendentes = aulas.filter((a) => {
      const inicio = new Date(a.dataHoraInicio);
      const passou = inicio <= agora;
      const temSumario = !!a.sumario && a.sumario.trim().length > 0;
      return (a.estado === "Realizada" || (a.estado === "Agendada" && passou)) && !temSumario;
    }).length;

    const realizadas = aulas.filter((a) => a.estado === "Realizada").length;
    const agendadas = aulas.filter((a) => a.estado === "Agendada").length;

    return { total: aulas.length, pendentes, realizadas, agendadas };
  }, [aulas, agora]);

  return (
    <div className="space-y-6 portal-tipografia">
      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => setAbaAtiva("todas")}
          className={`p-4 rounded-[5px] border cursor-pointer transition-all ${
            abaAtiva === "todas"
              ? "bg-slate-900 text-white dark:bg-[#0A192F] dark:border-rose-500/40 shadow-sm"
              : "bg-white dark:bg-[#07182E] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
          }`}
        >
          <p className="text-xs font-normal opacity-80">Todas as Aulas</p>
          <p className="text-2xl font-normal mt-1">{contadores.total}</p>
        </div>

        <div
          onClick={() => setAbaAtiva("pendentes")}
          className={`p-4 rounded-[5px] border cursor-pointer transition-all ${
            abaAtiva === "pendentes"
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-white dark:bg-[#07182E] border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-400"
          }`}
        >
          <p className="text-xs font-normal opacity-90 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            Pendentes de Sumário
          </p>
          <p className="text-2xl font-normal mt-1">{contadores.pendentes}</p>
        </div>

        <div
          onClick={() => setAbaAtiva("realizadas")}
          className={`p-4 rounded-[5px] border cursor-pointer transition-all ${
            abaAtiva === "realizadas"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white dark:bg-[#07182E] border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          <p className="text-xs font-normal opacity-90 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Realizadas
          </p>
          <p className="text-2xl font-normal mt-1">{contadores.realizadas}</p>
        </div>

        <div
          onClick={() => setAbaAtiva("agendadas")}
          className={`p-4 rounded-[5px] border cursor-pointer transition-all ${
            abaAtiva === "agendadas"
              ? "bg-sky-600 text-white shadow-sm"
              : "bg-white dark:bg-[#07182E] border-slate-200 dark:border-slate-800 text-sky-600 dark:text-sky-400"
          }`}
        >
          <p className="text-xs font-normal opacity-90 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Por Realizar
          </p>
          <p className="text-2xl font-normal mt-1">{contadores.agendadas}</p>
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#07182E] p-3 rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="Pesquisar por aluno, disciplina ou sumário..."
            className="pl-9 h-10 rounded-[5px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A192F] text-xs font-normal"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setAbaAtiva("todas")}
            className={`px-3 py-1.5 rounded-[5px] text-xs font-normal whitespace-nowrap transition-all ${
              abaAtiva === "todas"
                ? "bg-slate-900 text-white dark:bg-rose-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Todas ({contadores.total})
          </button>
          <button
            onClick={() => setAbaAtiva("pendentes")}
            className={`px-3 py-1.5 rounded-[5px] text-xs font-normal whitespace-nowrap transition-all ${
              abaAtiva === "pendentes"
                ? "bg-amber-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Pendentes ({contadores.pendentes})
          </button>
          <button
            onClick={() => setAbaAtiva("realizadas")}
            className={`px-3 py-1.5 rounded-[5px] text-xs font-normal whitespace-nowrap transition-all ${
              abaAtiva === "realizadas"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Realizadas ({contadores.realizadas})
          </button>
          <button
            onClick={() => setAbaAtiva("agendadas")}
            className={`px-3 py-1.5 rounded-[5px] text-xs font-normal whitespace-nowrap transition-all ${
              abaAtiva === "agendadas"
                ? "bg-sky-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Por Realizar ({contadores.agendadas})
          </button>
        </div>
      </div>

      {/* Lista de Aulas */}
      <div className="space-y-4">
        {aulasFiltradas.length === 0 ? (
          <EstadoVazioProfessor
            titulo="Nenhuma aula encontrada"
            descricao="Não existem aulas correspondentes aos filtros selecionados."
            icone={BookOpen}
          />
        ) : (
          aulasFiltradas.map((aula) => {
            const dataInicio = new Date(aula.dataHoraInicio);
            const ehAulaFutura = dataInicio > agora;
            const estaRealizada =
              aula.estado === "Realizada" ||
              (!!aula.sumario && aula.sumario.trim().length > 0);
            const ehPendente =
              (aula.estado === "Realizada" || !ehAulaFutura) &&
              (!aula.sumario || aula.sumario.trim().length === 0);

            return (
              <Cartao
                key={aula.id}
                className={`rounded-[5px] border transition-all ${
                  ehPendente
                    ? "border-amber-300 dark:border-amber-800/60 bg-white dark:bg-[#07182E] shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <CartaoConteudo className="p-5 space-y-4">
                  {/* Linha 1: Metadados principais */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-[5px] bg-slate-100 dark:bg-[#0A192F] flex flex-col items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                        <span className="text-[10px] uppercase font-normal text-slate-400">
                          {NOMES_MESES[dataInicio.getMonth()].slice(0, 3)}
                        </span>
                        <span className="text-base font-normal text-slate-900 dark:text-white leading-none">
                          {dataInicio.getDate()}
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-base font-normal text-slate-900 dark:text-white">
                            {aula.acompanhamento.aluno.nomeCompleto}
                          </h4>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-normal text-slate-600 dark:text-slate-300">
                            {aula.acompanhamento.disciplina.nome}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            {aula.acompanhamento.aluno.anoEscolar}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatarHora(dataInicio)} ({aula.duracaoMinutos} min)
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            {aula.modalidade === "Online" ? (
                              <Video className="h-3.5 w-3.5 text-indigo-500" />
                            ) : (
                              <Home className="h-3.5 w-3.5 text-rose-500" />
                            )}
                            {aula.modalidade === "Online"
                              ? "Online"
                              : aula.acompanhamento.municipio || "Domicílio"}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-normal">
                            Remuneração: {formatarKz(aula.remuneracaoPagaKz)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LADO DIREITO: 'Agendada' removido! Em seu lugar fica a opção de Sumário e quando preenchido vira 'Realizada' */}
                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                      {estaRealizada ? (
                        <>
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-normal rounded-[5px] flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Realizada
                          </Badge>

                          {/* MECANISMO 2: Confirmação Cruzada com o Encarregado via WhatsApp */}
                          {aula.acompanhamento.encarregado?.utilizador.telefone && (
                            <button
                              onClick={() => {
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
                              title="Mecanismo 2: Notificar e validar aula com encarregado via WhatsApp"
                            >
                              <MessageSquare className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Validar c/ Encarregado (Mecanismo 2)</span>
                            </button>
                          )}
                        </>
                      ) : ehAulaFutura ? (
                        /* MECANISMO 1: Bloqueio Temporal de Aula Futura */
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setAulaParaSumario(aula)}
                            className="h-7 px-2.5 rounded-[5px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-normal flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Mecanismo 1: Bloqueio temporal ativo até o horário da aula"
                          >
                            <Lock className="h-3 w-3 text-amber-500" />
                            <span>Sumário (Bloqueado até a aula)</span>
                          </button>
                          <span className="text-[11px] text-slate-400 font-normal hidden lg:inline">
                            Mecanismo 1 Ativo
                          </span>
                        </div>
                      ) : (
                        /* Aula decorrida ou de hoje pronta para sumariar */
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setAulaParaSumario(aula)}
                            className="h-7 px-3 rounded-[5px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-normal flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <FileCheck2 className="h-3.5 w-3.5" />
                            <span>Registar Sumário</span>
                          </button>
                          {ehPendente && (
                            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 font-normal rounded-[5px]">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pendente
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Linha 2: Sumário e Detalhes Pedagógicos se existirem */}
                  {aula.sumario ? (
                    <div className="bg-slate-50 dark:bg-[#0A192F]/80 p-4 rounded-[5px] border border-slate-100 dark:border-slate-800/80 space-y-3">
                      <div>
                        <p className="text-[11px] font-normal uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                          <FileText className="h-3 w-3" />
                          Sumário Curricular
                        </p>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                          {aula.sumario}
                        </p>
                      </div>

                      {aula.trabalhosDeCasa && (
                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                          <span className="font-normal text-slate-700 dark:text-slate-300">
                            Trabalhos de Casa (TPC):
                          </span>{" "}
                          <span className="text-slate-600 dark:text-slate-400">{aula.trabalhosDeCasa}</span>
                        </div>
                      )}

                      {aula.observacoesPedagogicas && (
                        <div className="pt-1 text-xs">
                          <span className="font-normal text-slate-700 dark:text-slate-300">
                            Notas Pedagógicas:
                          </span>{" "}
                          <span className="text-slate-500 italic">
                            {aula.observacoesPedagogicas}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : ehPendente ? (
                    <div className="bg-amber-500/10 dark:bg-amber-950/20 p-3.5 rounded-[5px] border border-amber-300/40 dark:border-amber-900/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>
                          Esta aula já decorreu ou foi marcada como realizada mas ainda não tem o sumário preenchido.
                        </span>
                      </div>
                      <button
                        onClick={() => setAulaParaSumario(aula)}
                        className="h-8 px-3 rounded-[5px] bg-amber-600 hover:bg-amber-700 text-white font-normal text-xs shrink-0 flex items-center gap-1.5 transition-colors"
                      >
                        <FileCheck2 className="h-3.5 w-3.5 mr-1" />
                        Registar Agora
                      </button>
                    </div>
                  ) : null}

                  {/* Linha 3: Ações e Contacto Encarregado */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-500">
                      Encarregado(a):{" "}
                      <span className="text-slate-800 dark:text-slate-200 font-normal">
                        {aula.acompanhamento.encarregado.utilizador.nomeCompleto}
                      </span>
                      {aula.acompanhamento.encarregado.utilizador.telefone && (
                        <a
                          href={`tel:${aula.acompanhamento.encarregado.utilizador.telefone}`}
                          className="text-rose-500 hover:underline ml-2"
                        >
                          ({aula.acompanhamento.encarregado.utilizador.telefone})
                        </a>
                      )}
                    </span>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {(aula.estado === "Cancelada" || aula.estado === "Professor_Ausente") && (
                        <button
                          onClick={() =>
                            setAulaParaReposicaoId(
                              aulaParaReposicaoId === aula.id ? null : aula.id
                            )
                          }
                          className="h-8 px-3 rounded-[5px] border border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/30 font-normal text-xs hover:bg-sky-100 dark:hover:bg-sky-900/50 flex items-center gap-1.5 transition-colors text-sky-700 dark:text-sky-300 cursor-pointer"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>
                            {aulaParaReposicaoId === aula.id
                              ? "Fechar Reposição"
                              : "Agendar Reposição"}
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => setAulaParaSumario(aula)}
                        className="h-8 px-3 rounded-[5px] border border-slate-200 dark:border-slate-700 font-normal text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors text-slate-700 dark:text-slate-300"
                      >
                        <FileCheck2 className="h-3.5 w-3.5 mr-1" />
                        {estaRealizada
                          ? "Ver / Editar Sumário"
                          : ehAulaFutura
                          ? "Sumário (Bloqueado)"
                          : "Registar Sumário & Presença"}
                      </button>
                    </div>
                  </div>

                  {aulaParaReposicaoId === aula.id && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <FormularioAgendarReposicao
                        aulaOriginalId={aula.id}
                        duracaoMinutosPadrao={aula.duracaoMinutos}
                        alunoNome={aula.acompanhamento.aluno.nomeCompleto}
                        disciplinaNome={aula.acompanhamento.disciplina.nome}
                      />
                    </div>
                  )}
                </CartaoConteudo>
              </Cartao>
            );
          })
        )}
      </div>

      {/* Modal de Sumário */}
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
