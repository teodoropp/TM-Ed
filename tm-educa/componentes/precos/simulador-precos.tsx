"use client";

import React, { useState, useMemo } from "react";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { formatarKz, calcularEstimativaDetalhada } from "@/regras/calculo-preco";
import { Calculator, CheckCircle2, Clock, Calendar, Sparkles } from "lucide-react";

export interface ItemAnoComPrecos {
  id: string;
  nome: string;
  ciclo: {
    nome: string;
  };
  precos: {
    duracaoMinutos: number;
    precoPorAulaKz: number;
  }[];
}

interface PropsSimuladorPrecos {
  dadosAnos: ItemAnoComPrecos[];
  mostrarAvisoOficial?: boolean;
}

export function SimuladorPrecos({ dadosAnos, mostrarAvisoOficial = true }: PropsSimuladorPrecos) {
  // Estado inicial padrão
  const primeiroAno = dadosAnos[0];
  const [anoSelecionadoId, setAnoSelecionadoId] = useState<string>(primeiroAno?.id || "");
  const [duracaoSelecionada, setDuracaoSelecionada] = useState<number>(60);
  const [frequenciaSemanal, setFrequenciaSemanal] = useState<number>(3);
  const [quantidadeAlunos, setQuantidadeAlunos] = useState<number>(1);

  // Ano atual
  const anoAtual = useMemo(() => {
    return dadosAnos.find((a) => a.id === anoSelecionadoId) || primeiroAno;
  }, [dadosAnos, anoSelecionadoId, primeiroAno]);

  // Preço por aula correspondente
  const precoAulaUnitario = useMemo(() => {
    if (!anoAtual) return 0;
    const itemPreco = anoAtual.precos.find((p) => p.duracaoMinutos === duracaoSelecionada);
    return itemPreco ? itemPreco.precoPorAulaKz : 0;
  }, [anoAtual, duracaoSelecionada]);

  // Cálculo da estimativa mensal oficial
  const estimativa = useMemo(() => {
    return calcularEstimativaDetalhada(precoAulaUnitario, frequenciaSemanal, quantidadeAlunos);
  }, [precoAulaUnitario, frequenciaSemanal, quantidadeAlunos]);

  return (
    <Cartao className="border-emerald-200/60 dark:border-emerald-950/60 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 shadow-xl overflow-hidden">
      <CartaoCabecalho className="border-b border-emerald-100/60 dark:border-emerald-900/40 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <CartaoTitulo className="text-xl font-bold text-slate-900 dark:text-white">
              Simulador Oficial de Investimento Escolar
            </CartaoTitulo>
            <CartaoDescricao className="text-slate-600 dark:text-slate-400">
              Calcule com precisão o valor mensal do acompanhamento personalizado para o seu filho.
            </CartaoDescricao>
          </div>
        </div>
      </CartaoCabecalho>

      <CartaoConteudo className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Seleção do Ano Escolar */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Ano Escolar / Nível
            </label>
            <select
              value={anoSelecionadoId}
              onChange={(e) => setAnoSelecionadoId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-sm"
            >
              {dadosAnos.map((ano) => (
                <option key={ano.id} value={ano.id}>
                  {ano.nome} ({ano.ciclo.nome})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Duração da Sessão */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Duração da Aula
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { min: 60, rotulo: "1h (60m)" },
                { min: 90, rotulo: "1h30 (90m)" },
                { min: 120, rotulo: "2h (120m)" },
              ].map((item) => (
                <button
                  key={item.min}
                  type="button"
                  onClick={() => setDuracaoSelecionada(item.min)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                    duracaoSelecionada === item.min
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400"
                  }`}
                >
                  {item.rotulo}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Dias Úteis por Semana (2, 3 ou 4 — conforme a tabela oficial) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Dias Úteis por Semana
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[2, 3, 4].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequenciaSemanal(freq)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all text-center ${
                    frequenciaSemanal === freq
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400"
                  }`}
                >
                  {freq}x
                </button>
              ))}
            </div>
          </div>

          {/* 4. Número de Filhos */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              N.º de Filhos
            </label>
            <select
              value={quantidadeAlunos}
              onChange={(e) => setQuantidadeAlunos(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-sm"
            >
              <option value={1}>1 Filho</option>
              <option value={2}>2 Filhos</option>
              <option value={3}>3 Filhos</option>
              <option value={4}>4 Filhos</option>
            </select>
          </div>
        </div>

        {/* Painel de Resultados do Investimento */}
        <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-emerald-200/80 dark:border-emerald-800/50 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Preço Oficial Unitário
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {formatarKz(precoAulaUnitario)}
                <span className="text-xs font-normal text-slate-500 ml-1.5">/ aula</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {duracaoSelecionada} minutos de tutoria dedicada
              </p>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l md:border-r border-slate-200 dark:border-slate-700 pt-4 md:pt-0 md:px-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Volume Mensal Estimado
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {estimativa.totalAulasEstimadasMes} Aulas
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {frequenciaSemanal} dias úteis/semana × 4 semanas do mês
              </p>
            </div>

            <div className="space-y-1 text-left md:text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Estimativa Mensal Total
              </span>
              <p className="text-3xl lg:text-4xl font-black text-emerald-700 dark:text-emerald-400">
                {formatarKz(estimativa.totalEstimadoMensalKz)}
              </p>
              <p className="text-xs font-medium text-emerald-800/80 dark:text-emerald-200/80">
                {estimativa.avisoEstimativa}
              </p>
            </div>
          </div>

          {mostrarAvisoOficial && (
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>
                  Valores regulamentados pela tabela oficial TM-Educa. Sem custos ocultos nem taxas de matrícula adicionais.
                </span>
              </div>
            </div>
          )}
        </div>
      </CartaoConteudo>
    </Cartao>
  );
}
