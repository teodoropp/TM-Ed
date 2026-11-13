"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
} from "lucide-react";

interface AulaItem {
  id: string;
  numeroSessao: number;
  dataHoraInicio: string | Date;
  dataHoraFim: string | Date;
  estado: string;
  precoCobradoKz: number;
  remuneracaoPagaKz: number;
  acompanhamento: {
    aluno: {
      nomeCompleto: string;
      anoEscolar: string;
    };
    disciplina: {
      nome: string;
    };
    professor: {
      utilizador: {
        nomeCompleto: string;
        telefone: string;
      };
    };
  };
}

interface PropsTabelaSupervisaoAulas {
  aulas: AulaItem[];
}

export function TabelaSupervisaoAulas({ aulas }: PropsTabelaSupervisaoAulas) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(8);
  const [busca, setBusca] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  // Filtragem
  const aulasFiltradas = useMemo(() => {
    return aulas.filter((aula) => {
      const matchBusca =
        !busca.trim() ||
        aula.acompanhamento.aluno.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) ||
        aula.acompanhamento.disciplina.nome.toLowerCase().includes(busca.toLowerCase()) ||
        aula.acompanhamento.professor.utilizador.nomeCompleto.toLowerCase().includes(busca.toLowerCase());

      const matchEstado =
        filtroEstado === "TODOS" || aula.estado === filtroEstado;

      return matchBusca && matchEstado;
    });
  }, [aulas, busca, filtroEstado]);

  // Paginação
  const totalPaginas = Math.max(1, Math.ceil(aulasFiltradas.length / itensPorPagina));

  // Ajustar página se exceder total
  const paginaValida = Math.min(paginaAtual, totalPaginas);

  const inicioIndice = (paginaValida - 1) * itensPorPagina;
  const fimIndice = Math.min(inicioIndice + itensPorPagina, aulasFiltradas.length);
  const aulasPaginadas = aulasFiltradas.slice(inicioIndice, fimIndice);

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Pesquisa */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por aluno, explicador ou disciplina..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Estado:</span>
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaAtual(1);
            }}
            aria-label="Filtrar por estado da aula"
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="TODOS">Todos os estados</option>
            <option value="Agendada">Agendadas</option>
            <option value="Realizada">Realizadas</option>
            <option value="Aluno_Ausente">Aluno Ausente</option>
            <option value="Professor_Ausente">Professor Ausente</option>
            <option value="Cancelada">Canceladas</option>
          </select>

          <select
            value={itensPorPagina}
            onChange={(e) => {
              setItensPorPagina(Number(e.target.value));
              setPaginaAtual(1);
            }}
            aria-label="Quantidade de itens por página"
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value={8}>8 por pág.</option>
            <option value={15}>15 por pág.</option>
            <option value={25}>25 por pág.</option>
            <option value={50}>50 por pág.</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      {aulasFiltradas.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs">
          Nenhuma aula encontrada com os filtros selecionados.
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[520px] overflow-y-auto rounded-b-xl">
          <table className="w-full min-w-[780px] text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 shadow-xs">
              <tr className="border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-400">
                <th className="p-3.5 w-14 text-center">#</th>
                <th className="p-3.5">Aluno & Ciclo</th>
                <th className="p-3.5">Disciplina</th>
                <th className="p-3.5">Explicador Titular</th>
                <th className="p-3.5">Data & Horário</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5">Cobrado (Kz)</th>
                <th className="p-3.5">Pago Prof (Kz)</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {aulasPaginadas.map((aula, idx) => {
                const numeroSequencial = inicioIndice + idx + 1;
                const inicio = new Date(aula.dataHoraInicio);
                const fim = new Date(aula.dataHoraFim);

                return (
                  <tr
                    key={aula.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    {/* Contagem progressiva de 1 até N */}
                    <td className="p-3.5 text-center font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      #{numeroSequencial}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {aula.acompanhamento.aluno.nomeCompleto}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {aula.acompanhamento.aluno.anoEscolar}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-medium text-blue-700 dark:text-blue-300">
                      {aula.acompanhamento.disciplina.nome}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Prof. {aula.acompanhamento.professor.utilizador.nomeCompleto}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {aula.acompanhamento.professor.utilizador.telefone}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="text-slate-800 dark:text-slate-200">
                        {inicio.toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {inicio.toLocaleTimeString("pt-PT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {fim.toLocaleTimeString("pt-PT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <Badge
                        variante={
                          aula.estado === "Realizada"
                            ? "sucesso"
                            : aula.estado === "Agendada"
                            ? "info"
                            : aula.estado === "Aluno_Ausente" ||
                              aula.estado === "Professor_Ausente"
                            ? "aviso"
                            : "perigo"
                        }
                      >
                        {aula.estado.replace("_", " ")}
                      </Badge>
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900 dark:text-slate-100">
                      {aula.precoCobradoKz.toLocaleString("pt-PT")} Kz
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-semibold text-emerald-700 dark:text-emerald-400">
                      {aula.remuneracaoPagaKz.toLocaleString("pt-PT")} Kz
                    </td>

                    {/* Botão renomeado para "Detalhes" */}
                    <td className="p-3.5 whitespace-nowrap text-right">
                      <Link href={`/portal-encarregado/aulas/${aula.id}`}>
                        <Botao
                          variante="contorno"
                          tamanho="sm"
                          className="text-xs h-7 px-3 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300"
                        >
                          Detalhes
                        </Botao>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Rodapé com Navegação de Páginas */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          A mostrar{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            {aulasFiltradas.length === 0 ? 0 : inicioIndice + 1}
          </strong>{" "}
          a{" "}
          <strong className="text-slate-700 dark:text-slate-300">{fimIndice}</strong> de{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            {aulasFiltradas.length}
          </strong>{" "}
          aulas
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center gap-1">
            <Botao
              variante="contorno"
              tamanho="sm"
              className="h-7 w-7 p-0"
              disabled={paginaValida <= 1}
              onClick={() => setPaginaAtual(1)}
              title="Primeira página"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Botao>

            <Botao
              variante="contorno"
              tamanho="sm"
              className="h-7 w-7 p-0"
              disabled={paginaValida <= 1}
              onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              title="Página anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Botao>

            <span className="px-3 py-1 font-medium text-slate-700 dark:text-slate-300">
              Página {paginaValida} de {totalPaginas}
            </span>

            <Botao
              variante="contorno"
              tamanho="sm"
              className="h-7 w-7 p-0"
              disabled={paginaValida >= totalPaginas}
              onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
              title="Próxima página"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Botao>

            <Botao
              variante="contorno"
              tamanho="sm"
              className="h-7 w-7 p-0"
              disabled={paginaValida >= totalPaginas}
              onClick={() => setPaginaAtual(totalPaginas)}
              title="Última página"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </Botao>
          </div>
        )}
      </div>
    </div>
  );
}

