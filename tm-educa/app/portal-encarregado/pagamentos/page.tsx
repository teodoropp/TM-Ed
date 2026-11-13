export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterCobrancasEncarregado } from "@/modulos/financeiro/consultas";
import { CONTAS_BANCARIAS_TM_EDUCA } from "@/regras/calculo-financeiro";
import { ModalSubmeterComprovativo } from "@/componentes/financeiro/ModalSubmeterComprovativo";
import { ModalFaturaOficialPDF } from "@/componentes/financeiro/ModalFaturaOficialPDF";
import { Cartao, CartaoConteudo } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { EstadoVazioPais } from "@/componentes/encarregados/EstadoVazioPais";
import {
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "Pagamentos e Faturas | Portal dos Pais TM-Educa",
};

function EtiquetaEstado({ estado }: { estado: string }) {
  if (estado === "Pago") return <Badge variante="sucesso">Pago</Badge>;
  if (estado === "EmAnalise")
    return <Badge variante="aviso">Em Análise</Badge>;
  if (estado === "Pendente") return <Badge variante="info">Pendente</Badge>;
  if (estado === "Falhado") return <Badge variante="perigo">Rejeitado</Badge>;
  return <Badge variante="neutro">{estado}</Badge>;
}

export default async function PaginaPagamentosEncarregado() {
  const utilizador = await obterUtilizadorAutenticado();
  if (
    !utilizador ||
    utilizador.funcao !== "ENCARREGADO" ||
    !utilizador.perfilEncarregado
  ) {
    redirect("/entrar?callbackUrl=/portal-encarregado/pagamentos");
  }

  const perfilEncarregado = utilizador.perfilEncarregado;
  const cobrancas = await obterCobrancasEncarregado(perfilEncarregado.id);

  const totalPendente = cobrancas
    .filter((c) => c.estado === "Pendente" || c.estado === "EmAnalise")
    .reduce((acc, c) => acc + c.valorKz, 0);

  const totalPago = cobrancas
    .filter((c) => c.estado === "Pago")
    .reduce((acc, c) => acc + c.valorKz, 0);

  const pendentes = cobrancas.filter(
    (c) => c.estado === "Pendente" || c.estado === "EmAnalise"
  );
  const liquidadas = cobrancas.filter((c) => c.estado === "Pago");

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Pagamentos e Mensalidades"
        descricao="Consulte as faturas dos seus filhos, faça as transferências e envie os comprovativos de liquidação."
        icone={CreditCard}
      />

      {/* RESUMO FINANCEIRO */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Cartao className="rounded-2xl border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-amber-50/30 dark:border-amber-900/50 dark:from-amber-950/20 dark:to-transparent backdrop-blur-sm shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <CartaoConteudo className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                A Liquidar
              </p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {totalPendente.toLocaleString("pt-PT")} Kz
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {pendentes.length} fatura{pendentes.length === 1 ? "" : "s"} em aberto
              </p>
            </div>
          </CartaoConteudo>
        </Cartao>

        <Cartao className="rounded-2xl border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-emerald-50/30 dark:border-emerald-900/50 dark:from-emerald-950/20 dark:to-transparent backdrop-blur-sm shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <CartaoConteudo className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Total Liquidado
              </p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {totalPago.toLocaleString("pt-PT")} Kz
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {liquidadas.length} fatura{liquidadas.length === 1 ? "" : "s"} paga{liquidadas.length === 1 ? "" : "s"}
              </p>
            </div>
          </CartaoConteudo>
        </Cartao>
      </section>

      {/* COORDENADAS BANCÁRIAS */}
      <Cartao className="rounded-2xl border-slate-200/70 bg-white/90 p-5 shadow-xs backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/90">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <Building className="h-4 w-4 text-[#FF2D75]" />
          Coordenadas Bancárias Oficiais
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Efectue a transferência para uma destas contas e anexe o comprovativo na fatura correspondente.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {CONTAS_BANCARIAS_TM_EDUCA.map((conta) => (
            <div
              key={conta.sigla}
              className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {conta.banco}
              </p>
              <p className="mt-1.5 select-all break-all font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                IBAN: {conta.iban}
              </p>
              {conta.numeroConta && (
                <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-400">
                  N.º Conta: <span className="font-semibold select-all text-slate-800 dark:text-slate-200">{conta.numeroConta}</span>
                </p>
              )}
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Titular: <span className="font-medium text-slate-700 dark:text-slate-300">{conta.titular}</span>
              </p>
            </div>
          ))}
        </div>
      </Cartao>

      {/* FATURAS POR LIQUIDAR */}
      {pendentes.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-base text-slate-900 dark:text-white">
            <Clock className="h-4 w-4 text-amber-500" />
            Por Liquidar ({pendentes.length})
          </h2>

          <div className="space-y-3">
            {pendentes.map((cobranca) => {
              const primeiroAcomp = cobranca.contrato.acompanhamentos[0];

              return (
                <Cartao
                  key={cobranca.id}
                  className="overflow-hidden rounded-2xl border-amber-200/80 bg-white/90 shadow-xs backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-amber-900/50 dark:bg-slate-900/90"
                >
                  <CartaoConteudo className="space-y-4 p-5">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {cobranca.numeroFatura}
                          </p>
                          <EtiquetaEstado estado={cobranca.estado} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {cobranca.mesReferencia} · Vence a{" "}
                          {new Date(cobranca.dataVencimento).toLocaleDateString("pt-PT")}
                        </p>
                        {primeiroAcomp && (
                          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                            {primeiroAcomp.aluno.nomeCompleto} ·{" "}
                            {primeiroAcomp.disciplina.nome}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:gap-3 flex-wrap justify-end">
                        <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mr-2">
                          {cobranca.valorKz.toLocaleString("pt-PT")} Kz
                        </p>

                        <ModalFaturaOficialPDF
                          cobrancaId={cobranca.id}
                          numeroFatura={cobranca.numeroFatura}
                          clienteNome={utilizador.nomeCompleto}
                          clienteBi={perfilEncarregado.nif}
                          alunoNome={primeiroAcomp?.aluno.nomeCompleto}
                          disciplinaNome={primeiroAcomp?.disciplina.nome}
                          mesReferencia={cobranca.mesReferencia}
                          valorKz={cobranca.valorKz}
                          estado={cobranca.estado}
                          dataVencimento={cobranca.dataVencimento}
                        />

                        {cobranca.estado === "Pendente" || cobranca.estado === "Falhado" ? (
                          <ModalSubmeterComprovativo
                            cobrancaId={cobranca.id}
                            numeroFatura={cobranca.numeroFatura}
                            valorKz={cobranca.valorKz}
                            mesReferencia={cobranca.mesReferencia}
                          />
                        ) : (
                          <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200/50 dark:border-amber-900/40">
                            Comprovativo em conferência
                          </span>
                        )}
                      </div>
                    </div>
                  </CartaoConteudo>
                </Cartao>
              );
            })}
          </div>
        </section>
      )}

      {/* HISTÓRICO */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <FileText className="h-4 w-4 text-[#FF2D75]" />
          Histórico de Faturas
        </h2>

        {liquidadas.length === 0 ? (
          <EstadoVazioPais
            icone={FileText}
            titulo="Ainda não existem faturas liquidadas"
            descricao="Os avisos de cobrança são gerados mensalmente para os acompanhamentos ativos. Assim que liquidar, o comprovativo fica registado aqui."
          />
        ) : (
          <Cartao className="overflow-hidden rounded-2xl border-slate-200/70 bg-white/90 shadow-xs backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {liquidadas.map((cobranca) => {
                const primeiroAcomp = cobranca.contrato.acompanhamentos[0];

                return (
                  <div
                    key={cobranca.id}
                    className="flex flex-col items-start justify-between gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center dark:hover:bg-slate-800/40"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {cobranca.numeroFatura}
                        </p>
                        <EtiquetaEstado estado={cobranca.estado} />
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {cobranca.mesReferencia}
                        {primeiroAcomp &&
                          ` · ${primeiroAcomp.aluno.nomeCompleto} · ${primeiroAcomp.disciplina.nome}`}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3 flex-wrap justify-end">
                      <p className="text-sm font-bold text-slate-900 dark:text-white mr-1">
                        {cobranca.valorKz.toLocaleString("pt-PT")} Kz
                      </p>

                      <ModalFaturaOficialPDF
                        cobrancaId={cobranca.id}
                        numeroFatura={cobranca.numeroFatura}
                        clienteNome={utilizador.nomeCompleto}
                        clienteBi={perfilEncarregado.nif}
                        alunoNome={primeiroAcomp?.aluno.nomeCompleto}
                        disciplinaNome={primeiroAcomp?.disciplina.nome}
                        mesReferencia={cobranca.mesReferencia}
                        valorKz={cobranca.valorKz}
                        estado={cobranca.estado}
                        dataPagamento={cobranca.dataPagamento}
                        referenciaBancaria={cobranca.referenciaBancaria}
                      />

                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                        {cobranca.dataPagamento
                          ? `Pago a ${new Date(cobranca.dataPagamento).toLocaleDateString("pt-PT")}`
                          : "Liquidado"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Cartao>
        )}
      </section>
    </div>
  );
}
