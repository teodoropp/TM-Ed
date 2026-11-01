import { describe, it, expect } from "vitest";
import {
  formatarKz,
  calcularEstimativaMensal,
  calcularEstimativaDetalhada,
} from "@/regras/calculo-preco";

describe("Motor de Cálculo de Preços e Estimativa Mensal", () => {
  it("deve formatar valores em Kwanzas com sufixo Kz e separador numérico", () => {
    // Normalizar qualquer espaço (incluindo non-breaking space do Intl pt-AO)
    expect(formatarKz(138000).replace(/\s/g, " ")).toBe("138 000 Kz");
    expect(formatarKz(8500).replace(/\s/g, " ")).toBe("8 500 Kz");
    expect(formatarKz(0)).toBe("0 Kz");
  });

  it("deve calcular a estimativa mensal baseada na regra oficial de 4 semanas", () => {
    // Exemplo: 10.º ano, 11.500 Kz/aula, 3x por semana × 4 semanas = 138.000 Kz
    const resultado = calcularEstimativaMensal(11500, 3, 4);
    expect(resultado).toBe(138000);
  });

  it("deve calcular a estimativa mensal para 2x por semana (8 sessões)", () => {
    // Exemplo: 5.º ano, 8.500 Kz/aula, 2x por semana × 4 semanas = 68.000 Kz
    const resultado = calcularEstimativaMensal(8500, 2, 4);
    expect(resultado).toBe(68000);
  });

  it("deve calcular a estimativa detalhada com quantidade de alunos e texto de aviso", () => {
    const detalhe = calcularEstimativaDetalhada(10000, 3, 2, 4);
    // 10.000 * 3 * 4 * 2 = 240.000 Kz, 12 aulas
    expect(detalhe.totalEstimadoMensalKz).toBe(240000);
    expect(detalhe.totalAulasEstimadasMes).toBe(12);
    expect(detalhe.avisoEstimativa.replace(/\s/g, " ")).toContain("240 000 Kz");
    expect(detalhe.avisoEstimativa).toContain("baseada em 4 semanas");
  });
});
