/**
 * Executa uma consulta à base de dados devolvendo um valor de recurso quando a
 * consulta falha (por exemplo, quando uma tabela ainda não foi criada pela
 * migração). Permite que os painéis do painel de administração continuem
 * a ser renderizados em vez de falharem por inteiro.
 */
export async function consultaComRecurso<T>(
  consulta: () => Promise<T>,
  recurso: T
): Promise<T> {
  try {
    return await consulta();
  } catch (erro) {
    console.error(
      "[consultaComRecurso] Falha ao obter dados; a usar valores de recurso.",
      erro instanceof Error ? erro.message : erro
    );
    return recurso;
  }
}
