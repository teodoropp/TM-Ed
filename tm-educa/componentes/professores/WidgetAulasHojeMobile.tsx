import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";

export interface AulaHojeDocente {
  id: string;
  dataHoraInicio: Date | string;
  duracaoMinutos: number;
  estado: string;
  conteudoProgramatico?: string | null;
  acompanhamento: {
    modalidade: "Domicilio" | "Online" | "Centro";
    aluno: {
      nomeCompleto: string;
    };
    disciplina: {
      nome: string;
    };
    encarregado?: {
      bairro?: string | null;
      municipio?: string | null;
      endereco?: string | null;
    } | null;
  };
}

interface WidgetAulasHojeMobileProps {
  aulas: AulaHojeDocente[];
}

export function WidgetAulasHojeMobile({ aulas }: WidgetAulasHojeMobileProps) {
  const agora = new Date();

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-emerald-700/40 relative overflow-hidden">
      {/* Detalhe de fundo */}
      <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Cabeçalho do Widget */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5">
              Acesso Rápido de Campo
              <span className="text-[10px] bg-emerald-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                Hoje & Próximas
              </span>
            </h3>
            <p className="text-xs text-emerald-200/70">
              Marcação imediata de presença e sumário no telemóvel ao iniciar a sessão.
            </p>
          </div>
        </div>

        <Link href="/portal-professor/aulas">
          <Botao
            variante="fantasma"
            tamanho="sm"
            className="text-xs text-emerald-300 hover:text-white hover:bg-emerald-800/40 hidden sm:flex items-center gap-1"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </Botao>
        </Link>
      </div>

      {/* Conteúdo */}
      {aulas.length === 0 ? (
        <div className="py-8 text-center text-emerald-200/70 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400/60 mx-auto" />
          <p className="text-sm font-semibold">Sem aulas agendadas para hoje.</p>
          <p className="text-xs text-emerald-200/50">
            Aproveite para rever o cronograma semanal na aba Agenda ou submeter a sua disponibilidade.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {aulas.slice(0, 3).map((aula) => {
            const dataAula = new Date(aula.dataHoraInicio);
            const horaFormatada = new Intl.DateTimeFormat("pt-PT", {
              timeStyle: "short",
            }).format(dataAula);

            const dataFormatada = new Intl.DateTimeFormat("pt-PT", {
              dateStyle: "short",
            }).format(dataAula);

            const ehHoje = dataAula.toDateString() === agora.toDateString();

            return (
              <div
                key={aula.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-300/20">
                      <Clock className="w-3.5 h-3.5" />
                      {horaFormatada} ({aula.duracaoMinutos} min)
                    </span>
                    <span className="text-xs text-white/70">
                      {ehHoje ? "Hoje" : dataFormatada}
                    </span>
                    <Badge
                      variante={aula.estado === "Realizada" ? "sucesso" : "neutro"}
                      className="text-[10px]"
                    >
                      {aula.estado}
                    </Badge>
                  </div>

                  <h4 className="text-sm font-extrabold text-white">
                    {aula.acompanhamento.aluno.nomeCompleto} —{" "}
                    <span className="text-emerald-300">
                      {aula.acompanhamento.disciplina.nome}
                    </span>
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>
                      {aula.acompanhamento.modalidade === "Online"
                        ? "Sessão Online Interativa"
                        : aula.acompanhamento.encarregado?.bairro
                        ? `Domicílio: ${aula.acompanhamento.encarregado.bairro}, ${aula.acompanhamento.encarregado.municipio || "Luanda"}`
                        : "Domicílio familiar"}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  <Link href={`/portal-professor/aulas/${aula.id}`}>
                    <Botao
                      variante="destaque"
                      tamanho="sm"
                      className="w-full sm:w-auto text-xs font-bold gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {aula.estado === "Realizada" ? "Ver Sumário" : "Dar Presença & Sumário"}
                    </Botao>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
