import { describe, it, expect } from "vitest";
import { avaliarCancelamentoAula } from "@/regras/politica-cancelamento-reposicao";

describe("Política de Cancelamento, Reposição e Regra das 24 Horas", () => {
  const precoPadrao = 10000;
  const remuneracaoPadrao = 6500;

  it("deve permitir reposição sem custos quando encarregado avisa com mais de 24 horas", () => {
    const inicioAula = new Date("2026-11-10T15:00:00Z");
    const pedidoCancelamento = new Date("2026-11-09T10:00:00Z"); // 29 horas antes

    const avaliacao = avaliarCancelamentoAula(
      inicioAula,
      pedidoCancelamento,
      "ENCARREGADO",
      precoPadrao,
      remuneracaoPadrao,
      "Consulta médica do aluno"
    );

    expect(avaliacao.comAvisoPrevio).toBe(true);
    expect(avaliacao.requerReposicao).toBe(true);
    expect(avaliacao.precoCobradoFamiliaKz).toBe(0);
    expect(avaliacao.remuneracaoPagaProfessorKz).toBe(0);
    expect(avaliacao.novoEstadoAula).toBe("Cancelada");
  });

  it("deve faturar a aula e remunerar o professor quando o encarregado cancela com menos de 24 horas", () => {
    const inicioAula = new Date("2026-11-10T15:00:00Z");
    const pedidoCancelamento = new Date("2026-11-10T12:00:00Z"); // 3 horas antes (tardio)

    const avaliacao = avaliarCancelamentoAula(
      inicioAula,
      pedidoCancelamento,
      "ENCARREGADO",
      precoPadrao,
      remuneracaoPadrao,
      "Imprevisto de última hora"
    );

    expect(avaliacao.comAvisoPrevio).toBe(false);
    expect(avaliacao.requerReposicao).toBe(false);
    expect(avaliacao.precoCobradoFamiliaKz).toBe(precoPadrao);
    expect(avaliacao.remuneracaoPagaProfessorKz).toBe(remuneracaoPadrao);
    expect(avaliacao.novoEstadoAula).toBe("Aluno_Ausente");
  });

  it("deve obrigar a reposição e não pagar o professor se o próprio professor cancelar ou faltar", () => {
    const inicioAula = new Date("2026-11-10T15:00:00Z");
    const pedidoCancelamento = new Date("2026-11-10T11:00:00Z");

    const avaliacao = avaliarCancelamentoAula(
      inicioAula,
      pedidoCancelamento,
      "PROFESSOR",
      precoPadrao,
      remuneracaoPadrao,
      "Avaria na viatura"
    );

    expect(avaliacao.requerReposicao).toBe(true);
    expect(avaliacao.precoCobradoFamiliaKz).toBe(0);
    expect(avaliacao.remuneracaoPagaProfessorKz).toBe(0);
    expect(avaliacao.novoEstadoAula).toBe("Professor_Ausente");
  });
});
