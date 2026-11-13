export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import {
  obterResumoFinanceiroAdmin,
  obterTodasCobrancasAdmin,
  obterTodasFolhasAdmin,
} from "@/modulos/financeiro/consultas";
import { obterProfessoresAtivosParaSubstituicao } from "@/modulos/professores/consultas";
import { BotaoValidarPagamento } from "@/componentes/financeiro/BotaoValidarPagamento";
import { ModalProcessarFolha } from "@/componentes/financeiro/ModalProcessarFolha";
import { ModalLiquidarFolha } from "@/componentes/financeiro/ModalLiquidarFolha";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Gestão Financeira e Margem Bruta | Administração TM-Educa",
};

export default async function PaginaFinanceiraAdmin() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/financeiro");
  }

  const [resumo, cobrancas, folhas, professores] = await Promise.all([
    obterResumoFinanceiroAdmin(),
    obterTodasCobrancasAdmin(),
    obterTodasFolhasAdmin(),
    obterProfessoresAtivosParaSubstituicao(),
  ]);

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Gestão Financeira e Margem Comercial"
        descricao="Controlo consolidado de receitas faturadas, conciliação bancária, folhas de remuneração dos explicadores e rentabilidade líquida da rede TM-Educa."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Finanças & Margens" },
        ]}
        acoes={<ModalProcessarFolha professores={professores} />}
      />

      {/* Cartões Executivos de Finanças (KPIs Centrais) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Faturada Paga */}
        <CartaoKpi
          rotulo="Receita Liquidada (Clientes)"
          valor={`${resumo.totalFaturadoPagoKz.toLocaleString("pt-PT")} Kz`}
          detalhe="Cobranças de clientes com estado Pago"
          tom="esmeralda"
          icone={<DollarSign className="h-4 w-4" />}
        />

        {/* Custos dos Explicadores Pagos */}
        <CartaoKpi
          rotulo="Remunerações Pagas"
          valor={`${resumo.totalRemuneracoesPagasKz.toLocaleString("pt-PT")} Kz`}
          detalhe="Folhas de remuneração liquidadas"
          tom="azul"
          icone={<CreditCard className="h-4 w-4" />}
        />

        {/* Margem Bruta Consolidada */}
        <CartaoKpi
          rotulo={`Margem Bruta (${resumo.margemBrutaPercentual}%)`}
          valor={`${resumo.margemBrutaKz.toLocaleString("pt-PT")} Kz`}
          detalhe="Rentabilidade líquida da rede"
          tom="roxo"
          icone={<TrendingUp className="h-4 w-4" />}
        />

        {/* Valores a Receber / Em Análise */}
        <CartaoKpi
          rotulo={`Por Validar (${resumo.totalEmAnaliseContagem} pendentes)`}
          valor={`${resumo.totalEmAnaliseKz.toLocaleString("pt-PT")} Kz`}
          detalhe="Cobranças aguardando validação"
          tom="ambar"
          icone={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Secção 1: Cobranças e Faturas a Clientes */}
      <Cartao>
        <CartaoCabecalho>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CartaoTitulo className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Faturação e Cobranças a Clientes ({cobrancas.length})
              </CartaoTitulo>
              <CartaoDescricao>
                Avisos de cobrança emitidos, comprovativos submetidos pelos pais e conferência bancária.
              </CartaoDescricao>
            </div>
            <Link href="/administracao/contratos">
              <Botao variante="contorno" tamanho="sm">
                Ver Contratos Ativos
              </Botao>
            </Link>
          </div>
        </CartaoCabecalho>

        <CartaoConteudo className="p-0">
          {cobrancas.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Nenhuma fatura emitida no sistema.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 font-semibold text-slate-600 dark:text-slate-400">
                    <th className="p-3.5">Fatura</th>
                    <th className="p-3.5">Pai / Aluno</th>
                    <th className="p-3.5">Mês</th>
                    <th className="p-3.5">Montante (Kz)</th>
                    <th className="p-3.5">Vencimento</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5">Dados da Transferência</th>
                    <th className="p-3.5 text-right">Ação de Validação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cobrancas.map((c) => {
                    const primeiroAcomp = c.contrato.acompanhamentos[0];

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {c.numeroFatura}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {c.encarregado.utilizador.nomeCompleto}
                          </div>
                          {primeiroAcomp && (
                            <div className="text-[11px] text-slate-500">
                              Aluno: {primeiroAcomp.aluno.nomeCompleto} ({primeiroAcomp.disciplina.nome})
                            </div>
                          )}
                        </td>

                        <td className="p-3.5 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                          {c.mesReferencia}
                        </td>

                        <td className="p-3.5 whitespace-nowrap font-bold text-slate-900 dark:text-white text-sm">
                          {c.valorKz.toLocaleString("pt-PT")} Kz
                        </td>

                        <td className="p-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {new Date(c.dataVencimento).toLocaleDateString("pt-PT")}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <Badge
                            variante={
                              c.estado === "Pago"
                                ? "sucesso"
                                : c.estado === "EmAnalise"
                                ? "aviso"
                                : c.estado === "Pendente"
                                ? "info"
                                : "perigo"
                            }
                          >
                            {c.estado === "Pago" && "✓ Pago"}
                            {c.estado === "EmAnalise" && "⏳ Em Análise"}
                            {c.estado === "Pendente" && "Pendente"}
                            {c.estado === "Falhado" && "Rejeitado"}
                            {c.estado === "Cancelado" && "Cancelado"}
                          </Badge>
                        </td>

                        <td className="p-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {c.referenciaBancaria ? (
                            <div>
                              <span className="font-mono font-semibold text-blue-700 dark:text-blue-400">
                                {c.referenciaBancaria}
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                Banco: {c.bancoOrigem || "N/A"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Sem comprovativo</span>
                          )}
                        </td>

                        <td className="p-3.5 whitespace-nowrap text-right">
                          {c.estado === "EmAnalise" ? (
                            <BotaoValidarPagamento
                              cobrancaId={c.id}
                              numeroFatura={c.numeroFatura}
                            />
                          ) : c.estado === "Pago" ? (
                            <span className="text-xs font-semibold text-emerald-600">
                              ✓ Validado
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Aguardando</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CartaoConteudo>
      </Cartao>

      {/* Secção 2: Folhas de Remuneração dos Explicadores */}
      <Cartao>
        <CartaoCabecalho>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CartaoTitulo className="text-lg flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Folhas de Remuneração dos Explicadores ({folhas.length})
              </CartaoTitulo>
              <CartaoDescricao>
                Processamento e liquidação de pagamentos baseados estritamente em aulas elegíveis validadas.
              </CartaoDescricao>
            </div>
          </div>
        </CartaoCabecalho>

        <CartaoConteudo className="p-0">
          {folhas.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Nenhuma folha de pagamento processada até ao momento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 font-semibold text-slate-600 dark:text-slate-400">
                    <th className="p-3.5">Código da Folha</th>
                    <th className="p-3.5">Explicador Titular</th>
                    <th className="p-3.5">Mês</th>
                    <th className="p-3.5">Aulas Elegíveis</th>
                    <th className="p-3.5">Valor Bruto</th>
                    <th className="p-3.5">Descontos</th>
                    <th className="p-3.5">Valor Líquido</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Ação de Liquidação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {folhas.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {f.codigoFolha}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          Prof. {f.professor.utilizador.nomeCompleto}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {f.professor.utilizador.telefone}
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                        {f.mesReferencia}
                      </td>

                      <td className="p-3.5 whitespace-nowrap font-bold text-blue-700 dark:text-blue-300">
                        {f.totalAulasElegiveis} sessões
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {f.valorBrutoKz.toLocaleString("pt-PT")} Kz
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-rose-600">
                        {f.descontosKz > 0 ? `-${f.descontosKz.toLocaleString("pt-PT")} Kz` : "0 Kz"}
                      </td>

                      <td className="p-3.5 whitespace-nowrap font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                        {f.valorLiquidoKz.toLocaleString("pt-PT")} Kz
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <Badge
                          variante={
                            f.estado === "Paga"
                              ? "sucesso"
                              : f.estado === "Aprovada"
                              ? "info"
                              : "aviso"
                          }
                        >
                          {f.estado === "Paga" && "✓ Liquidada"}
                          {f.estado === "Aprovada" && "Aprovada"}
                          {f.estado === "Rascunho" && "Rascunho"}
                        </Badge>
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-right">
                        {f.estado === "Aprovada" ? (
                          <ModalLiquidarFolha
                            folhaId={f.id}
                            codigoFolha={f.codigoFolha}
                            valorLiquidoKz={f.valorLiquidoKz}
                            professorNome={f.professor.utilizador.nomeCompleto}
                          />
                        ) : f.estado === "Paga" ? (
                          <div className="text-right">
                            <span className="text-xs font-semibold text-emerald-600 block">
                              ✓ Liquidada
                            </span>
                            {f.ibanDestino && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                IBAN: {f.ibanDestino.slice(0, 10)}...
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Rascunho</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CartaoConteudo>
      </Cartao>
    </AmbienteAdmin>
  );
}
