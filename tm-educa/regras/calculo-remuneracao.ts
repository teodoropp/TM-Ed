/**
 * Regras financeiras para remuneração de professores e cálculo de margem bruta da TM-Educa.
 */

/**
 * Calcula a remuneração devida ao professor com base no volume de aulas elegíveis lecionadas.
 */
export function calcularRemuneracaoTotal(
  totalAulasElegiveis: number,
  remuneracaoPorAulaKz: number
): number {
  if (totalAulasElegiveis < 0 || remuneracaoPorAulaKz < 0) {
    throw new Error("Os valores para cálculo de remuneração devem ser positivos.");
  }
  return totalAulasElegiveis * remuneracaoPorAulaKz;
}

/**
 * Calcula a Margem Bruta Nominal (Kz) auferida pela TM-Educa por aula ou período.
 * Margem Bruta = Preço Comercial Recebido - Remuneração Paga ao Explicador
 */
export function calcularMargemBruta(
  precoComercialKz: number,
  remuneracaoProfessorKz: number
): number {
  return precoComercialKz - remuneracaoProfessorKz;
}

/**
 * Calcula a Margem Bruta Percentual (%) auferida sobre o preço comercial contratado.
 */
export function calcularPercentualMargem(
  precoComercialKz: number,
  remuneracaoProfessorKz: number
): number {
  if (precoComercialKz <= 0) return 0;
  const margemNominal = calcularMargemBruta(precoComercialKz, remuneracaoProfessorKz);
  return Number(((margemNominal / precoComercialKz) * 100).toFixed(1));
}
