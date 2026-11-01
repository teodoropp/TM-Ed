import React from "react";
import { formatarHorarioAula } from "@/regras/gerador-calendario";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { Calendar, Clock, MapPin, GraduationCap, CheckCircle2 } from "lucide-react";

export interface ItemAulaAgenda {
  id: string;
  numeroSessao: number;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  duracaoMinutos: number;
  modalidade: string;
  estado: string;
  sumario?: string | null;
  acompanhamento?: {
    aluno: {
      nomeCompleto: string;
    };
    disciplina: {
      nome: string;
    };
    municipio?: string | null;
    bairro?: string | null;
  };
}

interface PropsGrelhaAgendaAulas {
  aulas: ItemAulaAgenda[];
  titulo?: string;
  tipoPortal?: "PROFESSOR" | "ENCARREGADO";
}

export function GrelhaAgendaAulas({
  aulas,
  titulo = "Agenda de Aulas Programadas",
  tipoPortal = "PROFESSOR",
}: PropsGrelhaAgendaAulas) {
  if (aulas.length === 0) {
    return (
      <Cartao className="border-slate-200 dark:border-slate-800 text-center py-12">
        <CartaoConteudo className="space-y-2">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Nenhuma aula programada para este período.
          </p>
          <p className="text-xs text-slate-500">
            As aulas são geradas automaticamente quando o acompanhamento é ativado.
          </p>
        </CartaoConteudo>
      </Cartao>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          {titulo} ({aulas.length} Aulas)
        </h3>
        <span className="text-xs text-slate-500">Cronograma Oficial</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aulas.map((aula) => {
          const inicio = new Date(aula.dataHoraInicio);
          const fim = new Date(aula.dataHoraFim);
          const hoje = new Date();
          const ePassada = fim < hoje;

          return (
            <Cartao
              key={aula.id}
              className={`border transition-all ${
                ePassada
                  ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800"
                  : "bg-white dark:bg-slate-800 border-emerald-100 dark:border-emerald-950/60 hover:shadow-md"
              }`}
            >
              <CartaoConteudo className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    Sessão #{aula.numeroSessao}
                  </span>

                  <Badge
                    variante={
                      aula.estado === "Realizada"
                        ? "sucesso"
                        : aula.estado === "Cancelada"
                        ? "perigo"
                        : aula.estado === "Agendada"
                        ? "info"
                        : "neutro"
                    }
                    className="text-xs"
                  >
                    {aula.estado}
                  </Badge>
                </div>

                {aula.acompanhamento && (
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      {aula.acompanhamento.disciplina.nome} · {aula.acompanhamento.aluno.nomeCompleto}
                    </h4>
                  </div>
                )}

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatarHorarioAula(inicio, fim)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {aula.modalidade}
                      {aula.acompanhamento?.municipio && ` (${aula.acompanhamento.municipio})`}
                    </span>
                  </div>
                </div>

                {aula.sumario && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-500">Sumário da Aula:</span>
                    <p className="mt-0.5 italic">&ldquo;{aula.sumario}&rdquo;</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  {tipoPortal === "PROFESSOR" ? (
                    <a
                      href={`/portal-professor/aulas/${aula.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
                    >
                      Preencher Sumário / Presença &rarr;
                    </a>
                  ) : (
                    <a
                      href={`/portal-encarregado/aulas/${aula.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      Ver Ficha Pedagógica &rarr;
                    </a>
                  )}
                </div>
              </CartaoConteudo>
            </Cartao>
          );
        })}
      </div>
    </div>
  );
}
