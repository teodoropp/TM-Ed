import React from "react";
import {
  AlertTriangle,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { Badge } from "@/componentes/ui/badge";
import { TipoOcorrencia, GravidadeOcorrencia, EstadoOcorrencia } from "@prisma/client";
import {
  METADADOS_TIPOS_OCORRENCIA,
  METADADOS_GRAVIDADE,
} from "@/regras/sistema-qualidade";
import { ModalResolverOcorrencia } from "./ModalResolverOcorrencia";

export interface DadosOcorrencia {
  id: string;
  numeroOcorrencia: string;
  tipo: TipoOcorrencia;
  gravidade: GravidadeOcorrencia;
  estado: EstadoOcorrencia;
  titulo: string;
  descricao: string;
  resolucao?: string | null;
  resolvidoEm?: Date | string | null;
  criadoEm: Date | string;
  autor?: {
    nomeCompleto: string;
    funcao: string;
  };
  responsavel?: {
    nomeCompleto: string;
  } | null;
  acompanhamento?: {
    aluno?: { nomeCompleto: string };
    disciplina?: { nome: string };
  } | null;
}

interface CartaoOcorrenciaProps {
  ocorrencia: DadosOcorrencia;
  modoAdmin?: boolean;
}

export function CartaoOcorrencia({
  ocorrencia,
  modoAdmin = false,
}: CartaoOcorrenciaProps) {
  const dataFormatada = new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ocorrencia.criadoEm));

  const dataResolvidaFormatada = ocorrencia.resolvidoEm
    ? new Intl.DateTimeFormat("pt-PT", {
        dateStyle: "medium",
      }).format(new Date(ocorrencia.resolvidoEm))
    : null;

  const metaGravidade = METADADOS_GRAVIDADE[ocorrencia.gravidade];
  const metaTipo = METADADOS_TIPOS_OCORRENCIA[ocorrencia.tipo];

  const badgesEstado: Record<EstadoOcorrencia, { rotulo: string; variante: "neutro" | "info" | "aviso" | "sucesso" | "perigo" }> = {
    Aberta: { rotulo: "Aberta / Por Analisar", variante: "aviso" },
    EmInvestigacao: { rotulo: "Em Investigação", variante: "info" },
    AguardandoParecer: { rotulo: "Aguardando Parecer", variante: "aviso" },
    Resolvida: { rotulo: "Resolvida e Encerrada", variante: "sucesso" },
    Cancelada: { rotulo: "Cancelada / Arquivada", variante: "neutro" },
  };

  const estadoBadge = badgesEstado[ocorrencia.estado];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Topo do Cartão */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            {ocorrencia.numeroOcorrencia}
          </span>
          <Badge variante={metaGravidade.corBadge}>
            {metaGravidade.rotulo}
          </Badge>
          <Badge variante={estadoBadge.variante}>
            {estadoBadge.rotulo}
          </Badge>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{dataFormatada}</span>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="my-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <FileText className="w-3.5 h-3.5 text-blue-500" />
          <span>{metaTipo?.rotulo || ocorrencia.tipo}</span>
        </div>

        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {ocorrencia.titulo}
        </h4>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          {ocorrencia.descricao}
        </p>
      </div>

      {/* Intervenientes e Acompanhamento */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 py-2 border-t border-slate-100 dark:border-slate-800">
        {ocorrencia.autor && (
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <strong>Aberto por:</strong> {ocorrencia.autor.nomeCompleto} ({ocorrencia.autor.funcao})
          </span>
        )}

        {ocorrencia.acompanhamento?.aluno && (
          <span>
            <strong>Aluno:</strong> {ocorrencia.acompanhamento.aluno.nomeCompleto}
          </span>
        )}

        {ocorrencia.acompanhamento?.disciplina && (
          <span>
            <strong>Disciplina:</strong> {ocorrencia.acompanhamento.disciplina.nome}
          </span>
        )}

        {ocorrencia.responsavel && (
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            <strong>Gestor Responsável:</strong> {ocorrencia.responsavel.nomeCompleto}
          </span>
        )}
      </div>

      {/* Resolução se houver */}
      {ocorrencia.resolucao && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-1 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Parecer e Resolução Final {dataResolvidaFormatada ? `(${dataResolvidaFormatada})` : ""}</span>
          </div>
          <p className="text-xs text-emerald-900 dark:text-emerald-200 whitespace-pre-line">
            {ocorrencia.resolucao}
          </p>
        </div>
      )}

      {/* Ações da Administração */}
      {modoAdmin && ocorrencia.estado !== "Resolvida" && ocorrencia.estado !== "Cancelada" && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <ModalResolverOcorrencia
            ocorrenciaId={ocorrencia.id}
            numeroOcorrencia={ocorrencia.numeroOcorrencia}
            titulo={ocorrencia.titulo}
          />
        </div>
      )}
    </div>
  );
}
