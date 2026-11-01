/**
 * Regras Comerciais e Pedagógicas de Cancelamento, Reposição e Substituição
 * Plataforma TM-Educa — Ecossistema de Educação e Acompanhamento Escolar
 *
 * Em estrita conformidade com a documentação oficial:
 * 04-contratos-acompanhamentos-e-aulas.md
 */

import { EstadoAula } from "@prisma/client";

/**
 * Antecedência mínima oficial (em horas) para cancelamento com aviso prévio.
 * Cancelamentos pelo encarregado com menos de 24 horas são considerados tardios (no-show).
 */
export const ANTECEDENCIA_MINIMA_CANCELAMENTO_HORAS = 24;

export type TipoResponsavelCancelamento = "PROFESSOR" | "ENCARREGADO" | "ADMINISTRACAO";

export interface ResultadoAvaliacaoCancelamento {
  antecedenciaHoras: number;
  comAvisoPrevio: boolean;
  requerReposicao: boolean;
  precoCobradoFamiliaKz: number;
  remuneracaoPagaProfessorKz: number;
  novoEstadoAula: EstadoAula;
  justificacaoAuditoria: string;
}

/**
 * Avalia o impacto financeiro e operacional do cancelamento de uma aula
 * calculando com rigor a diferença horária face ao início previsto da sessão.
 */
export function avaliarCancelamentoAula(
  dataHoraInicioAula: Date,
  dataHoraPedidoCancelamento: Date,
  responsavel: TipoResponsavelCancelamento,
  precoPadraoAulaKz: number,
  remuneracaoPadraoAulaKz: number,
  motivo: string
): ResultadoAvaliacaoCancelamento {
  const milissegundosDiferenca = dataHoraInicioAula.getTime() - dataHoraPedidoCancelamento.getTime();
  const diferencaHoras = milissegundosDiferenca / (1000 * 60 * 60);
  const comAvisoPrevio = diferencaHoras >= ANTECEDENCIA_MINIMA_CANCELAMENTO_HORAS;

  // 1. Cancelamento pelo Professor (ou Falta do Professor)
  if (responsavel === "PROFESSOR") {
    return {
      antecedenciaHoras: Math.round(diferencaHoras * 10) / 10,
      comAvisoPrevio,
      requerReposicao: true,
      precoCobradoFamiliaKz: 0,
      remuneracaoPagaProfessorKz: 0,
      novoEstadoAula: "Professor_Ausente",
      justificacaoAuditoria: `Cancelado pelo explicador (${diferencaHoras.toFixed(1)}h de antecedência). Sem remuneração do explicador e reposição obrigatória. Motivo: ${motivo}`,
    };
  }

  // 2. Cancelamento pelo Pai / Aluno
  if (responsavel === "ENCARREGADO") {
    if (comAvisoPrevio) {
      // Aviso prévio >= 24h: Gera crédito de reposição e família não é debitada
      return {
        antecedenciaHoras: Math.round(diferencaHoras * 10) / 10,
        comAvisoPrevio: true,
        requerReposicao: true,
        precoCobradoFamiliaKz: 0,
        remuneracaoPagaProfessorKz: 0,
        novoEstadoAula: "Cancelada",
        justificacaoAuditoria: `Cancelado pelo encarregado com aviso prévio tempestivo (${diferencaHoras.toFixed(1)}h >= 24h). Sessão reagendável sem custos. Motivo: ${motivo}`,
      };
    } else {
      // Cancelamento tardio (< 24h) ou No-Show: Aula é faturada e professor recebe
      return {
        antecedenciaHoras: Math.round(diferencaHoras * 10) / 10,
        comAvisoPrevio: false,
        requerReposicao: false,
        precoCobradoFamiliaKz: precoPadraoAulaKz,
        remuneracaoPagaProfessorKz: remuneracaoPadraoAulaKz,
        novoEstadoAula: "Aluno_Ausente",
        justificacaoAuditoria: `Cancelamento tardio / falta do aluno com apenas ${Math.max(0, diferencaHoras).toFixed(1)}h de antecedência (< 24h). Aula contabilizada e remuneração mantida para compensar reserva de agenda. Motivo: ${motivo}`,
      };
    }
  }

  // 3. Cancelamento Administrativo Excecional
  return {
    antecedenciaHoras: Math.round(diferencaHoras * 10) / 10,
    comAvisoPrevio: true,
    requerReposicao: true,
    precoCobradoFamiliaKz: 0,
    remuneracaoPagaProfessorKz: 0,
    novoEstadoAula: "Cancelada",
    justificacaoAuditoria: `Intervenção administrativa extraordinária. Reposição garantida. Motivo: ${motivo}`,
  };
}

/**
 * Validação dos requisitos pedagógicos para submissão do sumário da aula.
 */
export function validarSubmissaoSumario(dados: {
  estado: EstadoAula;
  sumario?: string | null;
  trabalhosDeCasa?: string | null;
  observacoesPedagogicas?: string | null;
}): { valido: boolean; erro?: string } {
  if (dados.estado === "Realizada") {
    if (!dados.sumario || dados.sumario.trim().length < 10) {
      return {
        valido: false,
        erro: "Para aulas lecionadas (Realizada), o sumário curricular é obrigatório e deve ter pelo menos 10 caracteres.",
      };
    }
  }

  if (dados.estado === "Aluno_Ausente" || dados.estado === "Professor_Ausente") {
    if (!dados.observacoesPedagogicas || dados.observacoesPedagogicas.trim().length < 5) {
      return {
        valido: false,
        erro: "Em caso de ausência ou falta, é obrigatório indicar uma nota explicativa nas observações pedagógicas.",
      };
    }
  }

  return { valido: true };
}
