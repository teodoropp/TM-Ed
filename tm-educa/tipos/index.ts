/**
 * Definições de tipos centrais para a plataforma TM-Educa.
 */

export type FuncaoUtilizador = "ADMINISTRADOR" | "ENCARREGADO" | "PROFESSOR";

export type EstadoProfessor =
  | "Pendente"
  | "Em_analise"
  | "Verificado"
  | "Activo"
  | "Suspenso"
  | "Inactivo";

export type DiaSemana =
  | "Segunda"
  | "Terca"
  | "Quarta"
  | "Quinta"
  | "Sexta"
  | "Sabado"
  | "Domingo";

export type ModalidadeAula = "Domicilio" | "Online" | "Centro";

export type DuracaoAulaMinutos = 60 | 90 | 120;

export type FrequenciaSemanal = 2 | 3 | 4;

export type EstadoPedido =
  | "Em analise"
  | "A procurar professor"
  | "Professor encontrado"
  | "A aguardar confirmacao"
  | "Confirmado"
  | "Activo"
  | "Suspenso"
  | "Cancelado"
  | "Concluido"
  | "Sem professor disponivel";

export type EstadoAula =
  | "Agendada"
  | "Realizada"
  | "Aluno ausente"
  | "Professor ausente"
  | "Cancelada"
  | "Reagendada"
  | "Substituida";

export type EstadoPagamento =
  | "Pendente"
  | "Em analise"
  | "Pago"
  | "Falhado"
  | "Cancelado"
  | "Reembolsado";
