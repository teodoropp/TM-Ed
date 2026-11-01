import { describe, it, expect } from "vitest";
import {
  calcularRemuneracaoTotal,
  calcularMargemBruta,
  calcularPercentualMargem,
} from "@/regras/calculo-remuneracao";
import { calcularMargemBrutaConsolidada } from "@/regras/calculo-financeiro";

describe("Motor de Remunerações e Margem Bruta", () => {
  it("deve calcular a remuneração total do professor para aulas elegíveis", () => {
    // 12 aulas lecionadas a 7.000 Kz/aula = 84.000 Kz
    const total = calcularRemuneracaoTotal(12, 7000);
    expect(total).toBe(84000);
  });

  it("deve lançar erro se os valores de remuneração forem negativos", () => {
    expect(() => calcularRemuneracaoTotal(-1, 7000)).toThrow();
    expect(() => calcularRemuneracaoTotal(5, -500)).toThrow();
  });

  it("deve calcular a margem bruta nominal em Kwanzas", () => {
    // Preço cobrado: 11.500 Kz, Remuneração paga: 7.500 Kz -> Margem: 4.000 Kz
    const margem = calcularMargemBruta(11500, 7500);
    expect(margem).toBe(4000);
  });

  it("deve calcular a margem bruta percentual com uma casa decimal", () => {
    // 4.000 / 11.500 = 34.78% -> 34.8%
    const percentual = calcularPercentualMargem(11500, 7500);
    expect(percentual).toBe(34.8);
  });

  it("deve calcular a margem bruta consolidada com segurança", () => {
    const consolidado = calcularMargemBrutaConsolidada(500000, 320000);
    expect(consolidado.margemBrutaKz).toBe(180000);
    expect(consolidado.margemBrutaPercentual).toBe(36.0);
  });
});
