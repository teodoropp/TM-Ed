"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  BookOpen,
  CheckCircle2,
  Home,
  Video,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Input } from "@/componentes/ui/input";
import { Badge } from "@/componentes/ui/badge";
import { Cartao, CartaoConteudo } from "@/componentes/ui/cartao";
import { EstadoVazioProfessor } from "@/componentes/professores/EstadoVazioProfessor";

interface ItemAlunoProfessor {
  id: string;
  codigo: string;
  modalidade: string;
  duracaoMinutos: number;
  frequenciaSemanal: number;
  diasSemana: string;
  horarioPreferencial: string;
  municipio?: string | null;
  bairro?: string | null;
  endereco?: string | null;
  estado: string;
  aluno: {
    id: string;
    nomeCompleto: string;
    anoEscolar: string;
    escola?: string | null;
    dificuldades?: string | null;
    observacoes?: string | null;
  };
  disciplina: {
    id: string;
    nome: string;
  };
  encarregado: {
    utilizador: {
      nomeCompleto: string;
      email: string;
      telefone?: string | null;
    };
  };
  aulas: Array<{
    id: string;
    estado: string;
    dataHoraInicio: Date | string;
  }>;
}

interface VisualizadorAlunosProps {
  acompanhamentos: ItemAlunoProfessor[];
}

export function VisualizadorAlunosProfessor({ acompanhamentos }: VisualizadorAlunosProps) {
  const [pesquisa, setPesquisa] = useState("");

  const acompanhamentosFiltrados = useMemo(() => {
    if (!pesquisa.trim()) return acompanhamentos;
    const termo = pesquisa.toLowerCase();
    return acompanhamentos.filter((acomp) => {
      const nomeAluno = acomp.aluno.nomeCompleto.toLowerCase();
      const disc = acomp.disciplina.nome.toLowerCase();
      const enc = acomp.encarregado.utilizador.nomeCompleto.toLowerCase();
      const muni = (acomp.municipio || "").toLowerCase();
      return (
        nomeAluno.includes(termo) ||
        disc.includes(termo) ||
        enc.includes(termo) ||
        muni.includes(termo)
      );
    });
  }, [acompanhamentos, pesquisa]);

  // Estatísticas
  const estatisticas = useMemo(() => {
    const totalAlunos = acompanhamentos.length;
    const totalHorasSemanais = acompanhamentos.reduce((acc, curr) => {
      return acc + (curr.frequenciaSemanal * curr.duracaoMinutos) / 60;
    }, 0);
    const totalAulasRealizadas = acompanhamentos.reduce((acc, curr) => {
      return acc + curr.aulas.filter((a) => a.estado === "Realizada").length;
    }, 0);

    return { totalAlunos, totalHorasSemanais: Math.round(totalHorasSemanais * 10) / 10, totalAulasRealizadas };
  }, [acompanhamentos]);

  function formatarWhatsapp(telefone?: string | null) {
    if (!telefone) return null;
    const limpo = telefone.replace(/\D/g, "");
    if (limpo.startsWith("244")) return limpo;
    if (limpo.length === 9) return `244${limpo}`;
    return limpo;
  }

  return (
    <div className="space-y-6 portal-tipografia">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Alunos Ativos</span>
            <Users className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-normal text-slate-900 dark:text-white mt-1">
            {estatisticas.totalAlunos}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Acompanhamentos em vigor</p>
        </div>

        <div className="p-4 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Carga Semanal</span>
            <Clock className="h-4 w-4 text-sky-500" />
          </div>
          <p className="text-2xl font-normal text-slate-900 dark:text-white mt-1">
            {estatisticas.totalHorasSemanais} h
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Dedicadas por semana</p>
        </div>

        <div className="p-4 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Aulas Realizadas</span>
            <CheckCircle2 className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-normal text-slate-900 dark:text-white mt-1">
            {estatisticas.totalAulasRealizadas}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Total de sessões dadas</p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          placeholder="Pesquisar por aluno, disciplina, encarregado ou município..."
          className="pl-9 h-11 rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] text-xs font-normal shadow-sm"
        />
      </div>

      {/* Lista de Alunos */}
      {acompanhamentosFiltrados.length === 0 ? (
        <EstadoVazioProfessor
          titulo="Nenhum aluno encontrado"
          descricao={
            pesquisa.trim()
              ? "Nenhum resultado corresponde à sua pesquisa."
              : "Ainda não tem alunos ativos vinculados. Verifique as propostas de novos alunos pendentes."
          }
          icone={Users}
          acao={{
            rotulo: "Ver Propostas de Alunos",
            href: "/portal-professor/propostas",
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {acompanhamentosFiltrados.map((acomp) => {
            const aulasRealizadas = acomp.aulas.filter((a) => a.estado === "Realizada").length;
            const numeroWhatsapp = formatarWhatsapp(acomp.encarregado.utilizador.telefone);

            return (
              <Cartao
                key={acomp.id}
                className="rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <CartaoConteudo className="p-5 space-y-4">
                  {/* Cabeçalho do Aluno */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-[5px] bg-slate-100 dark:bg-[#0A192F] border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center shrink-0 text-slate-800 dark:text-slate-200 font-normal text-lg">
                        {acomp.aluno.nomeCompleto.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-normal text-slate-900 dark:text-white">
                            {acomp.aluno.nomeCompleto}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {acomp.aluno.anoEscolar}
                          {acomp.aluno.escola ? ` • ${acomp.aluno.escola}` : ""}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 font-normal text-[11px] rounded-[5px]">
                            {acomp.disciplina.nome}
                          </Badge>
                          <Badge className="text-slate-500 font-normal text-[11px] border-slate-300 dark:border-slate-700 rounded-[5px]">
                            {acomp.frequenciaSemanal}x / sem ({acomp.duracaoMinutos} min)
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="h-9 w-9 rounded-[5px] bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                      {acomp.modalidade === "Online" ? (
                        <Video className="h-4 w-4 text-indigo-500" />
                      ) : (
                        <Home className="h-4 w-4 text-rose-500" />
                      )}
                    </div>
                  </div>

                  {/* Informações de Localização e Horário */}
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#0A192F]/60 p-3 rounded-[5px] border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-normal text-slate-800 dark:text-slate-200">
                          {acomp.diasSemana}:
                        </strong>{" "}
                        {acomp.horarioPreferencial}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        {acomp.modalidade === "Online"
                          ? "Modalidade 100% Online"
                          : `${acomp.municipio || "Luanda"}${acomp.bairro ? ` • ${acomp.bairro}` : ""}${
                              acomp.endereco ? ` (${acomp.endereco})` : ""
                            }`}
                      </span>
                    </div>

                    {(acomp.aluno.dificuldades || acomp.aluno.observacoes) && (
                      <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-amber-600 dark:text-amber-400">
                        {acomp.aluno.dificuldades
                          ? `Dificuldades: ${acomp.aluno.dificuldades}`
                          : `Notas: ${acomp.aluno.observacoes}`}
                      </div>
                    )}
                  </div>

                  {/* Contactos do Encarregado */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="text-[11px] text-slate-400">Encarregado(a)</p>
                      <p className="font-normal text-slate-800 dark:text-slate-200">
                        {acomp.encarregado.utilizador.nomeCompleto}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {acomp.encarregado.utilizador.telefone && (
                        <a
                          href={`tel:${acomp.encarregado.utilizador.telefone}`}
                          className="h-8 px-2.5 rounded-[5px] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-normal text-xs transition-colors"
                          title="Ligar para o encarregado"
                        >
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          <span>Ligar</span>
                        </a>
                      )}

                      {numeroWhatsapp && (
                        <a
                          href={`https://wa.me/${numeroWhatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 px-2.5 rounded-[5px] bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-normal text-xs transition-colors"
                          title="Enviar mensagem WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Rodapé com progresso e link de aulas */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {aulasRealizadas} aulas dadas
                    </span>

                    <Link
                      href={`/portal-professor/aulas`}
                      className="text-rose-500 hover:underline flex items-center gap-1 font-normal"
                    >
                      <span>Ver histórico de aulas</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CartaoConteudo>
              </Cartao>
            );
          })}
        </div>
      )}
    </div>
  );
}
