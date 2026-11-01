import { describe, it, expect } from "vitest";
import { validarTransicaoEstado } from "@/regras/maquina-estados-pedido";
import { EstadoPedido } from "@prisma/client";

describe("Máquina de Estados de Pedidos de Acompanhamento", () => {
  it("deve permitir transição válida de EmAnalise para AProcurarProfessor", () => {
    expect(
      validarTransicaoEstado(EstadoPedido.EmAnalise, EstadoPedido.AProcurarProfessor)
    ).toBe(true);
  });

  it("deve bloquear salto ilegal direto de EmAnalise para Activo", () => {
    expect(
      validarTransicaoEstado(EstadoPedido.EmAnalise, EstadoPedido.Activo)
    ).toBe(false);
  });

  it("deve permitir transição de Confirmado para Activo", () => {
    expect(
      validarTransicaoEstado(EstadoPedido.Confirmado, EstadoPedido.Activo)
    ).toBe(true);
  });

  it("deve permitir cancelamento a partir de estados intermédios", () => {
    expect(
      validarTransicaoEstado(EstadoPedido.EmAnalise, EstadoPedido.Cancelado)
    ).toBe(true);
    expect(
      validarTransicaoEstado(EstadoPedido.AProcurarProfessor, EstadoPedido.Cancelado)
    ).toBe(true);
  });

  it("não deve permitir transições a partir de Concluido ou Cancelado", () => {
    expect(
      validarTransicaoEstado(EstadoPedido.Cancelado, EstadoPedido.Activo)
    ).toBe(false);
    expect(
      validarTransicaoEstado(EstadoPedido.Concluido, EstadoPedido.Activo)
    ).toBe(false);
  });
});
