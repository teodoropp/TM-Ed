/**
 * Motor de Cálculo Financeiro, Margem Comercial e Coordenadas Bancárias
 * Plataforma TM-Educa — Ecossistema de Educação e Acompanhamento Escolar
 *
 * Em estrita conformidade com o documento 05-financeiro-e-qualidade.md
 */

import { EstadoAula } from "@prisma/client";

/**
 * Coordenadas bancárias oficiais da TM-Educa em Angola para transferências e depósitos.
 */
export const CONTAS_BANCARIAS_TM_EDUCA = [
  {
    banco: "BAI — Banco Angolano de Investimentos",
    sigla: "BAI",
    titular: "TM-Educa Prestação de Serviços, Lda.",
    iban: "AO06.0040.0000.1234.5678.9012.3",
    numeroConta: "123456789.10.001",
  },
  {
    banco: "BFA — Banco de Fomento Angola",
    sigla: "BFA",
    titular: "TM-Educa Prestação de Serviços, Lda.",
    iban: "AO06.0006.0000.9876.5432.1098.7",
    numeroConta: "987654321.20.001",
  },
];

export interface ResultadoMargemBruta {
  totalFaturadoKz: number;
  totalRemuneracoesKz: number;
  margemBrutaKz: number;
  margemBrutaPercentual: number;
}

/**
 * Apura a margem bruta global em Kwanzas e percentual.
 * Margem Bruta = Total Faturado a Clientes - Total de Remuneração Liquidada aos Explicadores
 */
export function calcularMargemBrutaConsolidada(
  totalFaturadoKz: number,
  totalRemuneracoesKz: number
): ResultadoMargemBruta {
  const margemBrutaKz = totalFaturadoKz - totalRemuneracoesKz;
  const margemBrutaPercentual =
    totalFaturadoKz > 0
      ? Math.round((margemBrutaKz / totalFaturadoKz) * 1000) / 10
      : 0;

  return {
    totalFaturadoKz,
    totalRemuneracoesKz,
    margemBrutaKz,
    margemBrutaPercentual,
  };
}

export interface AulaParaElegibilidade {
  estado: EstadoAula;
  remuneracaoPagaKz: number;
}

/**
 * Identifica se uma aula lecionada é estritamente elegível para remuneração do explicador.
 * Regra TM-Educa:
 * Elegíveis = Realizada + Aluno_Ausente (sem aviso tempestivo)
 * Excluídas = Professor_Ausente (injustificada) e Canceladas com aviso prévio.
 */
export function verificarAulaElegivelParaRemuneracao(estado: EstadoAula): boolean {
  return estado === "Realizada" || estado === "Aluno_Ausente";
}

/**
 * Calcula o total de aulas elegíveis e o somatório de remuneração de um explicador no mês.
 */
export function apurarRemuneracaoDocente(aulas: AulaParaElegibilidade[]): {
  totalAulasElegiveis: number;
  totalAulasExcluidas: number;
  totalBrutoKz: number;
} {
  let totalAulasElegiveis = 0;
  let totalAulasExcluidas = 0;
  let totalBrutoKz = 0;

  for (const aula of aulas) {
    if (verificarAulaElegivelParaRemuneracao(aula.estado)) {
      totalAulasElegiveis += 1;
      totalBrutoKz += aula.remuneracaoPagaKz;
    } else {
      totalAulasExcluidas += 1;
    }
  }

  return {
    totalAulasElegiveis,
    totalAulasExcluidas,
    totalBrutoKz,
  };
}

/**
 * Formata um número sequencial de fatura no formato oficial TM-FAT-AAAA-XXXX.
 */
export function formatarNumeroFatura(ano: number, sequencial: number): string {
  return `TM-FAT-${ano}-${String(sequencial).padStart(4, "0")}`;
}

/**
 * Formata um número sequencial de folha de pagamento no formato oficial TM-REM-AAAA-XXXX.
 */
export function formatarCodigoFolhaRemuneracao(ano: number, sequencial: number): string {
  return `TM-REM-${ano}-${String(sequencial).padStart(4, "0")}`;
}
