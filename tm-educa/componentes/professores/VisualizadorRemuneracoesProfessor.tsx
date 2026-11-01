"use client";

import React, { useState, useMemo } from "react";
import {
  Banknote,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  DollarSign,
  Download,
  CreditCard,
  Building,
} from "lucide-react";

import { Cartao, CartaoConteudo } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { formatarKz } from "@/regras/calculo-preco";
import { EstadoVazioProfessor } from "@/componentes/professores/EstadoVazioProfessor";

export interface FolhaRemuneracaoItem {
  id: string;
  codigoFolha: string;
  mesReferencia: string;
  totalAulasElegiveis: number;
  valorBrutoKz: number;
  valorLiquidoKz: number;
  estado: string;
  dataLiquidacao?: Date | string | null;
  observacoes?: string | null;
}

export interface AulaRemuneradaItem {
  id: string;
  dataHoraInicio: Date | string;
  duracaoMinutos: number;
  estado: string;
  remuneracaoPagaKz: number;
  acompanhamento: {
    aluno: {
      nomeCompleto: string;
      anoEscolar: string;
    };
    disciplina: {
      nome: string;
    };
  };
}

interface VisualizadorRemuneracoesProps {
  folhas: FolhaRemuneracaoItem[];
  aulas: AulaRemuneradaItem[];
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

function formatarDataSimples(data: Date | string) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatarHora(data: Date | string) {
  const d = new Date(data);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function VisualizadorRemuneracoesProfessor({
  folhas,
  aulas,
}: VisualizadorRemuneracoesProps) {
  const [abaAtiva, setAbaAtiva] = useState<"folhas" | "aulas">("folhas");

  // Estatísticas Financeiras
  const estatisticas = useMemo(() => {
    // Total histórico pago via folhas
    const totalPago = folhas
      .filter((f) => f.estado === "Paga")
      .reduce((acc, f) => acc + f.valorLiquidoKz, 0);

    // Total de folhas pendentes ou aprovadas
    const totalPendenteFolhas = folhas
      .filter((f) => f.estado === "Rascunho" || f.estado === "Aprovada")
      .reduce((acc, f) => acc + f.valorLiquidoKz, 0);

    // Aulas realizadas
    const aulasRealizadas = aulas.filter((a) => a.estado === "Realizada");
    const totalGanhoAulas = aulasRealizadas.reduce((acc, a) => acc + a.remuneracaoPagaKz, 0);
    const mediaPorAula = aulasRealizadas.length > 0 ? Math.round(totalGanhoAulas / aulasRealizadas.length) : 0;

    return {
      totalPago,
      totalPendenteFolhas,
      totalAulasRealizadas: aulasRealizadas.length,
      totalGanhoAulas,
      mediaPorAula,
    };
  }, [folhas, aulas]);

  return (
    <div className="space-y-6 portal-tipografia">
      {/* 4 Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Recebido */}
        <Cartao className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-5">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Total Liquidado</span>
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-normal text-slate-900 dark:text-white mt-2">
              {formatarKz(estatisticas.totalPago)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Liquidado na sua conta</p>
          </CartaoConteudo>
        </Cartao>

        {/* Pendente em Folhas */}
        <Cartao className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-5">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>A Receber em Folha</span>
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-normal text-slate-900 dark:text-white mt-2">
              {formatarKz(estatisticas.totalPendenteFolhas)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Em processamento pelo financeiro</p>
          </CartaoConteudo>
        </Cartao>

        {/* Total Auferido em Aulas */}
        <Cartao className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-5">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Total Ganho em Aulas</span>
              <div className="h-8 w-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Banknote className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-normal text-slate-900 dark:text-white mt-2">
              {formatarKz(estatisticas.totalGanhoAulas)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {estatisticas.totalAulasRealizadas} aulas realizadas
            </p>
          </CartaoConteudo>
        </Cartao>

        {/* Valor Médio por Sessão */}
        <Cartao className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-5">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Valor Médio / Aula</span>
              <div className="h-8 w-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-normal text-slate-900 dark:text-white mt-2">
              {formatarKz(estatisticas.mediaPorAula)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Por sessão ministrada</p>
          </CartaoConteudo>
        </Cartao>
      </div>

      {/* Alternador de Abas */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setAbaAtiva("folhas")}
          className={`px-4 py-2 rounded-xl text-xs font-normal transition-all ${
            abaAtiva === "folhas"
              ? "bg-[#0A192F] text-white dark:bg-rose-600 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Recibos & Folhas de Pagamento ({folhas.length})
        </button>
        <button
          onClick={() => setAbaAtiva("aulas")}
          className={`px-4 py-2 rounded-xl text-xs font-normal transition-all ${
            abaAtiva === "aulas"
              ? "bg-[#0A192F] text-white dark:bg-rose-600 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Extrato Detalhado por Aula ({aulas.filter((a) => a.estado === "Realizada").length})
        </button>
      </div>

      {/* ABA 1: RECIBOS & FOLHAS */}
      {abaAtiva === "folhas" && (
        <div className="space-y-3">
          {folhas.length === 0 ? (
            <EstadoVazioProfessor
              titulo="Sem folhas de remuneração emitidas"
              descricao="As folhas de remuneração são fechadas e emitidas mensalmente pela equipa financeira da TM-Educa após validação das aulas."
              icone={Banknote}
            />
          ) : (
            folhas.map((folha) => {
              const ehPaga = folha.estado === "Paga";

              return (
                <div
                  key={folha.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#07182E] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-[#0A192F] flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                      <FileText className="h-6 w-6 text-rose-500" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-normal text-slate-900 dark:text-white">
                          Folha de {folha.mesReferencia}
                        </h4>
                        {ehPaga ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-normal">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Liquidada
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 font-normal">
                            <Clock className="h-3 w-3 mr-1" />
                            {folha.estado}
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Código: {folha.codigoFolha} • {folha.totalAulasElegiveis} aulas incluídas
                        {folha.dataLiquidacao
                          ? ` • Liquidada em ${formatarDataSimples(folha.dataLiquidacao)}`
                          : ""}
                      </p>

                      {folha.observacoes && (
                        <p className="text-[11px] text-slate-400 italic mt-1">{folha.observacoes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400">Valor Líquido</span>
                    <span className="text-lg font-normal text-slate-900 dark:text-white">
                      {formatarKz(folha.valorLiquidoKz)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ABA 2: EXTRATO POR AULA */}
      {abaAtiva === "aulas" && (
        <div className="space-y-3">
          {aulas.filter((a) => a.estado === "Realizada").length === 0 ? (
            <EstadoVazioProfessor
              titulo="Nenhuma aula realizada ainda"
              descricao="Assim que realizar e sumariar as suas aulas, cada sessão e o seu valor creditado aparecerão aqui."
              icone={Banknote}
            />
          ) : (
            aulas
              .filter((a) => a.estado === "Realizada")
              .map((aula) => {
                const d = new Date(aula.dataHoraInicio);
                return (
                  <div
                    key={aula.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#07182E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-[#0A192F] flex flex-col items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                        <span className="text-[10px] uppercase font-normal text-slate-400">
                          {NOMES_MESES[d.getMonth()].slice(0, 3)}
                        </span>
                        <span className="text-xs font-normal text-slate-900 dark:text-white leading-none">
                          {d.getDate()}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-normal text-slate-900 dark:text-white">
                          {aula.acompanhamento.aluno.nomeCompleto}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {aula.acompanhamento.disciplina.nome} • {aula.duracaoMinutos} min •{" "}
                          {formatarHora(aula.dataHoraInicio)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400 block">
                        +{formatarKz(aula.remuneracaoPagaKz)}
                      </span>
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-none text-[10px] font-normal">
                        Creditado
                      </Badge>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
}
