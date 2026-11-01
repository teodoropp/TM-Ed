import { EstadoPedido } from "@prisma/client";

/**
 * Matriz oficial de transições válidas de estados do pedido de acompanhamento TM-Educa.
 */
export const TRANSIÇÕES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  EmAnalise: [EstadoPedido.AProcurarProfessor, EstadoPedido.Cancelado],
  AProcurarProfessor: [
    EstadoPedido.SemProfessorDisponivel,
    EstadoPedido.ProfessorEncontrado,
    EstadoPedido.AAguardarConfirmacao,
    EstadoPedido.Cancelado,
  ],
  SemProfessorDisponivel: [
    EstadoPedido.AProcurarProfessor,
    EstadoPedido.Cancelado,
  ],
  ProfessorEncontrado: [
    EstadoPedido.AAguardarConfirmacao,
    EstadoPedido.AProcurarProfessor,
    EstadoPedido.Cancelado,
  ],
  AAguardarConfirmacao: [
    EstadoPedido.Confirmado,
    EstadoPedido.AProcurarProfessor,
    EstadoPedido.Cancelado,
  ],
  Confirmado: [EstadoPedido.Activo, EstadoPedido.Cancelado],
  Activo: [
    EstadoPedido.Suspenso,
    EstadoPedido.Concluido,
    EstadoPedido.Cancelado,
  ],
  Suspenso: [EstadoPedido.Activo, EstadoPedido.Cancelado],
  Concluido: [],
  Cancelado: [],
};

/**
 * Valida se uma transição entre estados é permitida pelo motor de fluxos.
 */
export function validarTransicaoEstado(
  estadoAtual: EstadoPedido,
  novoEstado: EstadoPedido
): boolean {
  if (estadoAtual === novoEstado) return true;
  const transicoesPermitidas = TRANSIÇÕES_VALIDAS[estadoAtual] || [];
  return transicoesPermitidas.includes(novoEstado);
}

export interface DetalheEstado {
  rotulo: string;
  descricao: string;
  variante: "sucesso" | "aviso" | "info" | "perigo" | "neutro";
}

/**
 * Retorna os metadados visuais de um estado para exibição amigável ao utilizador.
 */
export function obterDetalheEstadoPedido(estado: EstadoPedido): DetalheEstado {
  switch (estado) {
    case EstadoPedido.EmAnalise:
      return {
        rotulo: "Em Análise",
        descricao: "Pedido recebido pela direção pedagógica TM-Educa.",
        variante: "aviso",
      };
    case EstadoPedido.AProcurarProfessor:
      return {
        rotulo: "A Procurar Professor",
        descricao: "Triagem de explicadores credenciados em curso.",
        variante: "info",
      };
    case EstadoPedido.SemProfessorDisponivel:
      return {
        rotulo: "Sem Professor Disponível",
        descricao: "Aguardando ajuste de horários ou abertura de vagas na zona.",
        variante: "perigo",
      };
    case EstadoPedido.ProfessorEncontrado:
      return {
        rotulo: "Professor Identificado",
        descricao: "Explicador selecionado pelo algoritmo de correspondÃªncia.",
        variante: "info",
      };
    case EstadoPedido.AAguardarConfirmacao:
      return {
        rotulo: "A Aguardar Confirmação",
        descricao: "Proposta formal submetida ao explicador.",
        variante: "aviso",
      };
    case EstadoPedido.Confirmado:
      return {
        rotulo: "Confirmado",
        descricao: "Professor aceitou a atribuição pedagógica.",
        variante: "sucesso",
      };
    case EstadoPedido.Activo:
      return {
        rotulo: "Ativo",
        descricao: "Acompanhamento contratado e aulas em curso.",
        variante: "sucesso",
      };
    case EstadoPedido.Suspenso:
      return {
        rotulo: "Suspenso",
        descricao: "Serviço temporariamente pausado.",
        variante: "perigo",
      };
    case EstadoPedido.Concluido:
      return {
        rotulo: "Concluído",
        descricao: "Ciclo de acompanhamento letivo finalizado com sucesso.",
        variante: "neutro",
      };
    case EstadoPedido.Cancelado:
      return {
        rotulo: "Cancelado",
        descricao: "Solicitação cancelada ou rescindida.",
        variante: "neutro",
      };
    default:
      return {
        rotulo: estado,
        descricao: "",
        variante: "neutro",
      };
  }
}
