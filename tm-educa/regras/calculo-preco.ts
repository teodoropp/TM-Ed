/**
 * Motor oficial de cálculo de preços e estimativa mensal da TM-Educa.
 *
 * REGRA COMERCIAL OFICIAL:
 * A tabela comercial da TM-Educa representa o preço por aula individual.
 * A estimativa mensal contratada é calculada estritamente através da fórmula:
 *   Estimativa Mensal = Preço por Aula × Aulas por Semana × 4 Semanas
 */

export interface ItemServicoCalculo {
  precoPorAulaKz: number;
  aulasPorSemana: number;
  disciplinaNome?: string;
}

export interface ResultadoEstimativaMultipla {
  itens: Array<{
    disciplinaNome: string;
    precoPorAulaKz: number;
    aulasPorSemana: number;
    subtotalMensalKz: number;
  }>;
  totalGeralMensalKz: number;
  semanasBase: number;
}

export interface DetalheEstimativaMensal {
  totalEstimadoMensalKz: number;
  totalAulasEstimadasMes: number;
  avisoEstimativa: string;
}

/**
 * Calcula a estimativa mensal oficial com detalhes pedagógicos e texto contratual obrigatório.
 */
export function calcularEstimativaDetalhada(
  precoPorAulaKz: number,
  aulasPorSemana: number,
  quantidadeAlunos: number = 1,
  semanasBase: number = 4
): DetalheEstimativaMensal {
  const totalAulasEstimadasMes = aulasPorSemana * semanasBase;
  const totalEstimadoMensalKz = precoPorAulaKz * aulasPorSemana * semanasBase * quantidadeAlunos;
  const avisoEstimativa = `Estimativa mensal: ${formatarKz(totalEstimadoMensalKz)} (baseada em ${semanasBase} semanas)`;

  return {
    totalEstimadoMensalKz,
    totalAulasEstimadasMes,
    avisoEstimativa,
  };
}

/**
 * Calcula a estimativa mensal oficial para um único serviço de acompanhamento.
 */
export function calcularEstimativaMensal(
  precoPorAulaKz: number,
  aulasPorSemana: number,
  semanasBase: number = 4
): number {
  if (precoPorAulaKz < 0 || aulasPorSemana < 0 || semanasBase < 0) {
    throw new Error("Os valores para cálculo de estimativa mensal devem ser positivos.");
  }
  return precoPorAulaKz * aulasPorSemana * semanasBase;
}

/**
 * Calcula a estimativa mensal combinada quando um aluno contrata múltiplas disciplinas.
 * Exemplo oficial:
 *   Matemática (11.500 Kz × 3 × 4 = 138.000 Kz)
 *   Física (11.500 Kz × 2 × 4 = 92.000 Kz)
 *   Total Estimado: 230.000 Kz
 */
export function calcularEstimativaMultiplosServicos(
  servicos: ItemServicoCalculo[],
  semanasBase: number = 4
): ResultadoEstimativaMultipla {
  let totalGeralMensalKz = 0;

  const itens = servicos.map((s, index) => {
    const subtotal = calcularEstimativaMensal(
      s.precoPorAulaKz,
      s.aulasPorSemana,
      semanasBase
    );
    totalGeralMensalKz += subtotal;

    return {
      disciplinaNome: s.disciplinaNome || `Serviço ${index + 1}`,
      precoPorAulaKz: s.precoPorAulaKz,
      aulasPorSemana: s.aulasPorSemana,
      subtotalMensalKz: subtotal,
    };
  });

  return {
    itens,
    totalGeralMensalKz,
    semanasBase,
  };
}

/**
 * Formata um montante numérico no padrão de moeda oficial de Angola (Kwanzas - Kz).
 */
export function formatarKz(valor: number): string {
  return (
    new Intl.NumberFormat("pt-AO", {
      maximumFractionDigits: 0,
    }).format(valor) + " Kz"
  );
}
