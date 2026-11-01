"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Inbox, CheckCircle2, XCircle, Clock, Filter } from "lucide-react";
import {
  CartaoPropostaProfessor,
  ItemPropostaProfessor,
} from "@/componentes/pedidos/cartao-proposta-professor";
import { EstadoVazioProfessor } from "@/componentes/professores/EstadoVazioProfessor";

interface PropsListaPropostas {
  propostas: ItemPropostaProfessor[];
}

export function ListaPropostasProfessor({ propostas }: PropsListaPropostas) {
  const [filtro, setFiltro] = useState<"todas" | "Pendente" | "Aceite" | "Rejeitada">("todas");

  const contadores = useMemo(() => {
    return {
      todas: propostas.length,
      pendentes: propostas.filter((p) => p.estado === "Pendente").length,
      aceites: propostas.filter((p) => p.estado === "Aceite").length,
      recusadas: propostas.filter((p) => p.estado === "Rejeitada").length,
    };
  }, [propostas]);

  const propostasFiltradas = useMemo(() => {
    if (filtro === "todas") return propostas;
    return propostas.filter((p) => p.estado === filtro);
  }, [propostas, filtro]);

  return (
    <div className="space-y-6 portal-tipografia">
      {/* Abas de Filtragem de Propostas */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#07182E] p-2 rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setFiltro("todas")}
          className={`px-4 py-2 rounded-[5px] text-xs font-normal transition-all ${
            filtro === "todas"
              ? "bg-[#0A192F] text-white dark:bg-rose-600 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Todas ({contadores.todas})
        </button>
        <button
          onClick={() => setFiltro("Pendente")}
          className={`px-4 py-2 rounded-[5px] text-xs font-normal transition-all flex items-center gap-1.5 ${
            filtro === "Pendente"
              ? "bg-amber-500 text-white shadow-sm"
              : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Novas / Pendentes ({contadores.pendentes})
        </button>
        <button
          onClick={() => setFiltro("Aceite")}
          className={`px-4 py-2 rounded-[5px] text-xs font-normal transition-all flex items-center gap-1.5 ${
            filtro === "Aceite"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Aceites ({contadores.aceites})
        </button>
        <button
          onClick={() => setFiltro("Rejeitada")}
          className={`px-4 py-2 rounded-[5px] text-xs font-normal transition-all flex items-center gap-1.5 ${
            filtro === "Rejeitada"
              ? "bg-rose-600 text-white shadow-sm"
              : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
          }`}
        >
          <XCircle className="h-3.5 w-3.5" />
          Recusadas ({contadores.recusadas})
        </button>
      </div>

      {/* Grid de Propostas */}
      {propostasFiltradas.length === 0 ? (
        <EstadoVazioProfessor
          titulo="Nenhuma proposta nesta categoria"
          descricao={
            filtro === "Pendente"
              ? "Não tem novos convites de tutoria pendentes no momento. Manter a sua disponibilidade e zonas de atendimento atualizadas aumenta as suas oportunidades!"
              : "Não existem propostas para o filtro selecionado."
          }
          icone={Sparkles}
          acao={
            filtro === "Pendente"
              ? {
                  rotulo: "Atualizar Minha Disponibilidade",
                  href: "/portal-professor/disponibilidade",
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {propostasFiltradas.map((proposta) => (
            <CartaoPropostaProfessor key={proposta.id} proposta={proposta} />
          ))}
        </div>
      )}
    </div>
  );
}
