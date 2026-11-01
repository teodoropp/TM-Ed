import { describe, it, expect } from "vitest";
import {
  calcularMediaAvaliacao,
  recalcularAvaliacaoMediaProfessor,
  formatarNumeroOcorrencia,
} from "@/regras/sistema-qualidade";

describe("Motor do Sistema de Qualidade e Avaliações", () => {
  it("deve calcular a média das 5 dimensões analíticas com arredondamento a 1 casa decimal", () => {
    const notas = {
      qualidadePedagogica: 5,
      pontualidade: 4,
      comunicacao: 5,
      adaptacaoAluno: 4,
      profissionalismo: 5,
    }; // Soma = 23 / 5 = 4.6

    const media = calcularMediaAvaliacao(notas);
    expect(media).toBe(4.6);
  });

  it("deve recalcular a reputação média acumulada do professor", () => {
    const notasAnteriores = [5.0, 4.0, 4.5]; // Soma = 13.5
    const novaNota = 5.0; // Total = 18.5 / 4 = 4.625 -> 4.6

    const novaMedia = recalcularAvaliacaoMediaProfessor(notasAnteriores, novaNota);
    expect(novaMedia).toBe(4.6);
  });

  it("deve formatar o código oficial da ocorrência no padrão TM-OCO-AAAA-XXXX", () => {
    expect(formatarNumeroOcorrencia(2026, 1)).toBe("TM-OCO-2026-0001");
    expect(formatarNumeroOcorrencia(2026, 42)).toBe("TM-OCO-2026-0042");
    expect(formatarNumeroOcorrencia(2026, 9999)).toBe("TM-OCO-2026-9999");
  });
});
