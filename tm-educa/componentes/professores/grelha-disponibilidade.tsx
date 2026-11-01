"use client";

import * as React from "react";
import { acaoAtualizarDisponibilidadeProfessor } from "@/modulos/professores/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { DadosDisponibilidadeProfessor } from "@/validacoes/professor.esquema";

const DIAS_SEMANA: Array<{
  valor: DadosDisponibilidadeProfessor["diaSemana"];
  rotulo: string;
}> = [
  { valor: "Segunda", rotulo: "Segunda-feira" },
  { valor: "Terca", rotulo: "Terça-feira" },
  { valor: "Quarta", rotulo: "Quarta-feira" },
  { valor: "Quinta", rotulo: "Quinta-feira" },
  { valor: "Sexta", rotulo: "Sexta-feira" },
  { valor: "Sabado", rotulo: "Sábado" },
  { valor: "Domingo", rotulo: "Domingo" },
];

export interface PropriedadesGrelhaDisponibilidade {
  disponibilidadesIniciais: Array<{
    diaSemana: string;
    horaInicio: string;
    horaFim: string;
    activo: boolean;
  }>;
}

export function GrelhaDisponibilidade({
  disponibilidadesIniciais,
}: PropriedadesGrelhaDisponibilidade) {
  const [horarios, setHorarios] = React.useState<
    Record<string, { activo: boolean; horaInicio: string; horaFim: string }>
  >(() => {
    const estado: Record<
      string,
      { activo: boolean; horaInicio: string; horaFim: string }
    > = {};

    DIAS_SEMANA.forEach(({ valor }) => {
      const existente = disponibilidadesIniciais.find(
        (d) => d.diaSemana === valor
      );
      estado[valor] = {
        activo: existente ? existente.activo : valor !== "Domingo",
        horaInicio: existente ? existente.horaInicio : "16:00",
        horaFim: existente ? existente.horaFim : "20:00",
      };
    });

    return estado;
  });

  const [carregando, setCarregando] = React.useState(false);
  const [mensagemSucesso, setMensagemSucesso] = React.useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = React.useState<string | null>(null);

  function alternarDia(dia: string) {
    setHorarios((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], activo: !prev[dia].activo },
    }));
  }

  function alterarHorario(dia: string, campo: "horaInicio" | "horaFim", valor: string) {
    setHorarios((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [campo]: valor },
    }));
  }

  async function guardar() {
    setCarregando(true);
    setMensagemSucesso(null);
    setMensagemErro(null);

    try {
      const blocos: DadosDisponibilidadeProfessor[] = Object.entries(horarios)
        .filter(([, v]) => v.activo)
        .map(([dia, v]) => ({
          diaSemana: dia as DadosDisponibilidadeProfessor["diaSemana"],
          horaInicio: v.horaInicio,
          horaFim: v.horaFim,
          activo: true,
        }));

      const res = await acaoAtualizarDisponibilidadeProfessor(blocos);

      if (!res.sucesso) {
        setMensagemErro(res.mensagem);
        setCarregando(false);
        return;
      }

      setMensagemSucesso(res.mensagem);
      setCarregando(false);
    } catch {
      setMensagemErro("Ocorreu um erro ao guardar a disponibilidade.");
      setCarregando(false);
    }
  }

  return (
    <div className="space-y-6">
      {mensagemErro && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <p>{mensagemErro}</p>
        </div>
      )}

      {mensagemSucesso && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <p>{mensagemSucesso}</p>
        </div>
      )}

      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {DIAS_SEMANA.map(({ valor, rotulo }) => {
          const configDia = horarios[valor];
          return (
            <div
              key={valor}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 gap-4 transition-colors ${
                configDia.activo
                  ? "bg-white dark:bg-slate-900"
                  : "bg-slate-50/60 dark:bg-slate-950/40 opacity-70"
              }`}
            >
              <div className="flex items-center gap-3 min-w-44">
                <input
                  type="checkbox"
                  id={`check-${valor}`}
                  checked={configDia.activo}
                  onChange={() => alternarDia(valor)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor={`check-${valor}`}
                  className="font-medium text-sm text-slate-900 dark:text-white cursor-pointer select-none"
                >
                  {rotulo}
                </label>
              </div>

              {configDia.activo ? (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Das</span>
                    <input
                      type="time"
                      value={configDia.horaInicio}
                      onChange={(e) =>
                        alterarHorario(valor, "horaInicio", e.target.value)
                      }
                      className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">às</span>
                    <input
                      type="time"
                      value={configDia.horaFim}
                      onChange={(e) =>
                        alterarHorario(valor, "horaFim", e.target.value)
                      }
                      className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs font-medium text-slate-400 italic">
                  Indisponível neste dia
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Botao
          onClick={guardar}
          variante="destaque"
          className="gap-2 min-w-48 shadow-md"
          disabled={carregando}
        >
          {carregando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              A guardar horários...
            </>
          ) : (
            <>
              <Clock className="h-4 w-4" />
              Guardar Disponibilidade
            </>
          )}
        </Botao>
      </div>
    </div>
  );
}
