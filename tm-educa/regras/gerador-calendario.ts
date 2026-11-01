import { ModalidadeAula, EstadoAula } from "@prisma/client";

export interface ParametrosGeracaoAulas {
  dataInicio: Date;
  diasSemana: string[]; // ["Segunda", "Quarta", "Sexta"]
  horarioPreferencial: string; // "15:00" ou "15:00 - 16:30"
  duracaoMinutos: number;
  modalidade: ModalidadeAula;
  precoPorAulaKz: number;
  remuneracaoPorAulaKz: number;
  numeroSemanas?: number;
}

export interface ProjecaoAula {
  numeroSessao: number;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  duracaoMinutos: number;
  modalidade: ModalidadeAula;
  estado: EstadoAula;
  precoCobradoKz: number;
  remuneracaoPagaKz: number;
}

const MAPA_DIAS_SEMANA: Record<string, number> = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};

/**
 * Converte string de hora (ex: "15:00" ou "15:30") em horas e minutos numéricos.
 */
function extrairHoraEMinuto(horarioStr: string): { hora: number; minuto: number } {
  const correspondencia = horarioStr.match(/(\d{1,2}):(\d{2})/);
  if (correspondencia) {
    return {
      hora: parseInt(correspondencia[1], 10),
      minuto: parseInt(correspondencia[2], 10),
    };
  }
  return { hora: 15, minuto: 0 }; // Padrão: 15:00
}

/**
 * Normaliza o nome do dia da semana (remove acentos e espaços).
 */
function normalizarNomeDia(dia: string): string {
  return dia
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("-feira", "")
    .trim();
}

/**
 * Gera a projeção de instâncias individuais de aulas para um acompanhamento escolar.
 */
export function projetarAulasAcompanhamento(
  params: ParametrosGeracaoAulas
): ProjecaoAula[] {
  const {
    dataInicio,
    diasSemana,
    horarioPreferencial,
    duracaoMinutos,
    modalidade,
    precoPorAulaKz,
    remuneracaoPorAulaKz,
    numeroSemanas = 4,
  } = params;

  const aulas: ProjecaoAula[] = [];
  const { hora, minuto } = extrairHoraEMinuto(horarioPreferencial);

  // Mapear dias pretendidos para índices numéricos do JavaScript (0 a 6)
  const indicesDias = diasSemana
    .map((d) => MAPA_DIAS_SEMANA[normalizarNomeDia(d)])
    .filter((idx) => idx !== undefined);

  if (indicesDias.length === 0) {
    indicesDias.push(1, 3); // Padrão se vazio: Segunda e Quarta
  }

  let dataCorrente = new Date(dataInicio);
  // Garantir que a hora base seja configurada
  dataCorrente.setHours(0, 0, 0, 0);

  const totalDiasLimite = numeroSemanas * 7;
  let sessoesContador = 1;

  for (let diaOffset = 0; diaOffset < totalDiasLimite; diaOffset++) {
    const dataCalculada = new Date(dataCorrente);
    dataCalculada.setDate(dataCorrente.getDate() + diaOffset);

    const diaSemanaAtual = dataCalculada.getDay();

    if (indicesDias.includes(diaSemanaAtual)) {
      const inicio = new Date(dataCalculada);
      inicio.setHours(hora, minuto, 0, 0);

      const fim = new Date(inicio);
      fim.setMinutes(fim.getMinutes() + duracaoMinutos);

      aulas.push({
        numeroSessao: sessoesContador++,
        dataHoraInicio: inicio,
        dataHoraFim: fim,
        duracaoMinutos,
        modalidade,
        estado: EstadoAula.Agendada,
        precoCobradoKz: precoPorAulaKz,
        remuneracaoPagaKz: remuneracaoPorAulaKz,
      });
    }
  }

  return aulas;
}

/**
 * Formata um intervalo de aula para apresentação amigável ao utilizador.
 * Exemplo: "Segunda-feira, 12 de Outubro de 2026, das 15:00 às 16:30"
 */
export function formatarHorarioAula(inicio: Date, fim: Date): string {
  const diaSemana = new Intl.DateTimeFormat("pt-AO", { weekday: "long" }).format(inicio);
  const diaMes = new Intl.DateTimeFormat("pt-AO", { day: "numeric", month: "long" }).format(inicio);
  const horaInicio = inicio.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" });
  const horaFim = fim.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" });

  const diaSemanaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  return `${diaSemanaCapitalizado}, ${diaMes} · ${horaInicio} às ${horaFim}`;
}
