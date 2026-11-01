/**
 * Motor de Avaliações de Explicadores, Qualidade Pedagógica e Gestão de Ocorrências
 * Plataforma TM-Educa — Ecossistema de Educação e Acompanhamento Escolar
 *
 * Em estrita conformidade com o documento 05-financeiro-e-qualidade.md
 */

import { TipoOcorrencia, GravidadeOcorrencia, EstadoOcorrencia } from "@prisma/client";

export interface NotasDimensoesAvaliacao {
  qualidadePedagogica: number;
  pontualidade: number;
  comunicacao: number;
  adaptacaoAluno: number;
  profissionalismo: number;
}

/**
 * Calcula a média ponderada das 5 dimensões analíticas de avaliação do explicador (1 a 5 estrelas).
 */
export function calcularMediaAvaliacao(notas: NotasDimensoesAvaliacao): number {
  const soma =
    notas.qualidadePedagogica +
    notas.pontualidade +
    notas.comunicacao +
    notas.adaptacaoAluno +
    notas.profissionalismo;

  const media = soma / 5;
  return Math.round(media * 10) / 10;
}

/**
 * Recalcula a nova avaliação média de um professor após receber uma nova submissão.
 */
export function recalcularAvaliacaoMediaProfessor(
  avaliacoesAnteriores: number[],
  novaNota: number
): number {
  const todasNotas = [...avaliacoesAnteriores, novaNota];
  const soma = todasNotas.reduce((acc, n) => acc + n, 0);
  return Math.round((soma / todasNotas.length) * 10) / 10;
}

/**
 * Formata um código de ocorrência auditado no formato oficial TM-OCO-AAAA-XXXX.
 */
export function formatarNumeroOcorrencia(ano: number, sequencial: number): string {
  return `TM-OCO-${ano}-${String(sequencial).padStart(4, "0")}`;
}

/**
 * Descrição amigável e cor de badge para cada tipo de ocorrência.
 */
export const METADADOS_TIPOS_OCORRENCIA: Record<
  TipoOcorrencia,
  { rotulo: string; descricao: string }
> = {
  Falta: {
    rotulo: "Falta Injustificada / Ausência",
    descricao: "Faltas não comunicadas de alunos ou professores no horário agendado.",
  },
  Reclamacao: {
    rotulo: "Reclamação Pedagógica ou Conduta",
    descricao: "Queixa formal quanto ao método de ensino, postura ou cumprimento do programa.",
  },
  Comportamento: {
    rotulo: "Indisciplina / Comportamento",
    descricao: "Dificuldades de atenção, desrespeito ou incidentes disciplinares na sessão.",
  },
  Pagamento: {
    rotulo: "Contestação Financeira",
    descricao: "Dúvidas sobre valores faturados, atrasos reiterados ou conciliação bancária.",
  },
  Incidente: {
    rotulo: "Incidente Extraordinário",
    descricao: "Situações imprevistas ocorridas durante a prestação da aula ou acompanhamento.",
  },
  Administrativo: {
    rotulo: "Questão Contratual",
    descricao: "Pedidos de alteração de horário, troca de modalidade ou questões administrativas.",
  },
};

/**
 * Definição dos níveis de gravidade da ocorrência.
 */
export const METADADOS_GRAVIDADE: Record<
  GravidadeOcorrencia,
  { rotulo: string; corBadge: "neutro" | "info" | "aviso" | "perigo" }
> = {
  Baixa: { rotulo: "Baixa Prioridade", corBadge: "neutro" },
  Media: { rotulo: "Média Prioridade", corBadge: "info" },
  Alta: { rotulo: "Alta Gravidade", corBadge: "aviso" },
  Urgente: { rotulo: "Urgência Imediata", corBadge: "perigo" },
};
