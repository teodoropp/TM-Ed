export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  CreditCard,
  Star,
  ClipboardList,
  GraduationCap,
  PlusCircle,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calculator,
  LayoutDashboard,
  Pencil,
} from "lucide-react";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterMeusAlunos } from "@/modulos/alunos/consultas";
import { obterMeusPedidos } from "@/modulos/pedidos/consultas";
import { obterCobrancasEncarregado } from "@/modulos/financeiro/consultas";
import { obterAcompanhamentosParaAvaliar } from "@/modulos/qualidade/consultas";
import { obterAulasEncarregado } from "@/modulos/aulas/consultas";
import { obterMeusAcompanhamentosEncarregado } from "@/modulos/contratos/consultas";
import { obterDetalheEstadoPedido } from "@/regras/maquina-estados-pedido";
import { formatarKz } from "@/regras/calculo-preco";

import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";
import { Cartao } from "@/componentes/ui/cartao";
import { CartaoAluno } from "@/componentes/alunos/cartao-aluno";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";

export const metadata = {
  title: "Portal dos Pais | TM-Educa",
};

const formatarData = (data: Date | string) =>
  new Intl.DateTimeFormat("pt-PT", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(data));

const formatarHora = (data: Date | string) =>
  new Intl.DateTimeFormat("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data));

export default async function PaginaPortalEncarregado() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilEncarregado) {
    redirect("/entrar?callbackUrl=/portal-encarregado");
  }

  const perfilId = utilizador.perfilEncarregado.id;

  const [
    alunos,
    pedidos,
    cobrancas,
    acompanhamentosParaAvaliar,
    aulas,
    acompanhamentos,
  ] = await Promise.all([
    obterMeusAlunos(),
    obterMeusPedidos(),
    obterCobrancasEncarregado(perfilId),
    obterAcompanhamentosParaAvaliar(perfilId),
    obterAulasEncarregado(perfilId),
    obterMeusAcompanhamentosEncarregado(),
  ]);

  const agora = new Date();

  const proximasAulas = aulas
    .filter(
      (a) => new Date(a.dataHoraInicio) >= agora && a.estado === "Agendada"
    )
    .sort(
      (a, b) =>
        new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime()
    );

  const aulasRealizadas = aulas.filter((a) => a.estado === "Realizada").length;
  const totalAulas = aulas.filter((a) => a.estado !== "Agendada").length;

  const cobrancasPendentes = cobrancas.filter(
    (c) => c.estado === "Pendente" || c.estado === "EmAnalise"
  );
  const valorPendenteKz = cobrancasPendentes.reduce(
    (acc, c) => acc + c.valorKz,
    0
  );

  const pendentesAvaliacao = acompanhamentosParaAvaliar.filter(
    (a) => a.avaliacoes.length === 0
  );

  const pedidosEmCurso = pedidos.filter((p) =>
    ["EmAnalise", "AProcurarProfessor", "AAguardarConfirmacao"].includes(p.estado)
  );

  const taxaRealizacao =
    totalAulas > 0 ? Math.round((aulasRealizadas / totalAulas) * 100) : 0;

  const proximaAula = proximasAulas[0];

  /* Indicadores do topo — 2×2 que preenchem a coluna lateral do destaque. */
  const indicadores = [
    {
      rotulo: "Filhos",
      valor: alunos.length,
      detalhe: "perfilados",
      icone: GraduationCap,
      href: "/portal-encarregado/alunos",
      tom: "text-blue-600 bg-blue-500/10",
    },
    {
      rotulo: "Acompanhamentos",
      valor: acompanhamentos.length,
      detalhe: "ativos",
      icone: ClipboardList,
      href: "/portal-encarregado/acompanhamentos",
      tom: "text-violet-600 bg-violet-500/10",
    },
    {
      rotulo: "Aulas realizadas",
      valor: aulasRealizadas,
      detalhe: `${taxaRealizacao}% do total`,
      icone: CheckCircle2,
      href: "/portal-encarregado/acompanhamentos",
      tom: "text-emerald-600 bg-emerald-500/10",
    },
    {
      rotulo: "Pedidos em curso",
      valor: pedidosEmCurso.length,
      detalhe: "a aguardar resposta",
      icone: TrendingUp,
      href: "/portal-encarregado/pedidos",
      tom: "text-amber-600 bg-amber-500/10",
    },
  ];

  /* Ações rápidas — atalhos diretos para as tarefas mais frequentes. */
  const acoesRapidas = [
    {
      rotulo: "Solicitar apoio",
      descricao: "Pedir explicador",
      href: "/portal-encarregado/pedidos/novo",
      icone: Sparkles,
      tom: "text-[#FF2D75] bg-[#FF2D75]/10",
    },
    {
      rotulo: "Pagar mensalidade",
      descricao: "Enviar comprovativo",
      href: "/portal-encarregado/pagamentos",
      icone: CreditCard,
      tom: "text-emerald-600 bg-emerald-500/10",
    },
    {
      rotulo: "Avaliar explicador",
      descricao: "Dar o seu parecer",
      href: "/portal-encarregado/avaliacoes",
      icone: Star,
      tom: "text-amber-600 bg-amber-500/10",
    },
    {
      rotulo: "Simular custos",
      descricao: "Planeear mensalidade",
      href: "/portal-encarregado/precos",
      icone: Calculator,
      tom: "text-blue-600 bg-blue-500/10",
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* CABEÇALHO PADRONIZADO DA PÁGINA */}
      <CabecalhoPaginaPais
        titulo="Visão Geral"
        descricao="Acompanhe em tempo real a evolução académica dos seus filhos, o calendário das explicações e a liquidação das mensalidades."
        icone={LayoutDashboard}
      />

      {/* BENTO GRID — LINHA 0: BOAS-VINDAS + INDICADORES */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* HERO BANNER DE BOAS-VINDAS */}
        <div className="relative overflow-hidden rounded-[5px] border border-slate-200/60 bg-gradient-to-br from-[#07182E] via-[#0A192F] to-[#102A45] p-6 sm:p-8 lg:col-span-8 shadow-sm transition-all duration-300 dark:border-slate-800/80">
          {/* Efeitos de Iluminação Suave no Fundo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#FF2D75]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
          />

          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] bg-white/10 px-3 py-1 text-[11px] font-normal uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/15">
                  <Sparkles className="h-3 w-3 text-[#FF2D75]" />
                  Portal da Família
                </span>
                <Badge variante="sucesso" className="rounded-[5px] px-2.5 text-[11px]">
                  Conta Activa
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Olá, Sr.(a) {utilizador.nomeCompleto.split(" ")[0]}!
                </h2>
                <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300/90 font-normal">
                  Seja bem-vindo ao seu portal. Aceda rapidamente aos pedidos de explicação, avaliações pedagógicas e gestão financeira.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/portal-encarregado/pedidos/novo">
                <Botao className="gap-2 bg-gradient-to-r from-[#FF2D75] to-[#E11D48] text-white shadow-md hover:from-[#E11D48] hover:to-[#BE123C] rounded-[5px] px-4 py-2.5 font-normal transition-all duration-200">
                  <PlusCircle className="h-4 w-4" />
                  Solicitar Acompanhamento
                </Botao>
              </Link>
              <Link
                href="/portal-encarregado/alunos/novo"
                className="inline-flex h-10 items-center gap-2 rounded-[5px] border border-white/20 bg-white/5 px-4 text-xs sm:text-sm font-normal text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/30"
              >
                <GraduationCap className="h-4 w-4" />
                Adicionar Filho
              </Link>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL — 4 INDICADORES EM GRELHA 2×2 */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3.5 lg:col-span-4">
          {indicadores.map((indicador) => (
            <Link
              key={indicador.rotulo}
              href={indicador.href}
              className="group flex flex-col justify-between rounded-[5px] border border-slate-200/70 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF2D75]/40 hover:shadow-md dark:border-slate-800/80 dark:bg-[#07182E]"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-[5px] transition-transform duration-200 group-hover:scale-105 ${indicador.tom}`}
                >
                  <indicador.icone className="h-4 w-4" />
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover:text-[#FF2D75] dark:text-slate-600" />
              </div>

              <div className="mt-3">
                <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {indicador.valor}
                </p>
                <p className="text-xs font-normal text-slate-700 dark:text-slate-200 truncate mt-0.5">
                  {indicador.rotulo}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  {indicador.detalhe}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BENTO GRID — LINHA 1: PRÓXIMA AULA + PENDENTES */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* PRÓXIMA AULA */}
        <Cartao className="flex h-full flex-col rounded-[5px] border-slate-200/70 bg-white p-5 shadow-xs lg:col-span-7 dark:border-slate-800/80 dark:bg-[#07182E]">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800/70">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-[#FF2D75]" />
                Próxima Aula
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A sessão pedagógica mais próxima na agenda
              </p>
            </div>
            <Link
              href="/portal-encarregado/acompanhamentos"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#FF2D75] hover:underline"
            >
              Ver agenda <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {proximaAula ? (
            <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3.5 rounded-2xl bg-slate-50/80 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D75] to-[#E11D48] text-white shadow-xs">
                  <span className="text-lg font-bold leading-none">
                    {new Date(proximaAula.dataHoraInicio).getDate()}
                  </span>
                  <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    {new Intl.DateTimeFormat("pt-PT", { month: "short" }).format(
                      new Date(proximaAula.dataHoraInicio)
                    )}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                    {proximaAula.acompanhamento.disciplina.nome}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Aluno: <span className="font-medium text-slate-700 dark:text-slate-300">{proximaAula.acompanhamento.aluno.nomeCompleto}</span>
                  </p>
                </div>

                <Badge variante="sucesso" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatarHora(proximaAula.dataHoraInicio)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-white p-3 text-xs sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-900/60">
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Data</p>
                  <p className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200">
                    {formatarData(proximaAula.dataHoraInicio)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Duração</p>
                  <p className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200">
                    {proximaAula.duracaoMinutos} minutos
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Explicador</p>
                  <p className="mt-0.5 truncate font-semibold text-slate-800 dark:text-slate-200">
                    {proximaAula.acompanhamento.professor?.utilizador
                      .nomeCompleto ?? "A atribuir"}
                  </p>
                </div>
              </div>

              {proximasAulas.length > 1 && (
                <div className="border-t border-slate-100 pt-3 dark:border-slate-800/70">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Seguintes na Agenda
                  </p>
                  <div className="space-y-1.5">
                    {proximasAulas.slice(1, 3).map((aula) => (
                      <div
                        key={aula.id}
                        className="flex items-center justify-between gap-3 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                          {aula.acompanhamento.aluno.nomeCompleto} · {aula.acompanhamento.disciplina.nome}
                        </span>
                        <span className="shrink-0 text-slate-400 text-[11px]">
                          {formatarData(aula.dataHoraInicio)} · {formatarHora(aula.dataHoraInicio)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <CalendarClock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Sem aulas agendadas de momento
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Assim que um acompanhamento for formalizado, as sessões surgirão aqui.
                </p>
              </div>
              <Link
                href="/portal-encarregado/pedidos/novo"
                className="text-xs font-semibold text-[#FF2D75] hover:underline"
              >
                Solicitar acompanhamento →
              </Link>
            </div>
          )}
        </Cartao>

        {/* A PRECEDER O ENCARREGADO (PENDÊNCIAS) */}
        <Cartao className="flex h-full flex-col rounded-[5px] border-slate-200/70 bg-white p-5 shadow-xs lg:col-span-5 dark:border-slate-800/80 dark:bg-[#07182E]">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800/70">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                A Preceder o(a) Sr.(a) {utilizador.nomeCompleto.split(" ")[0]}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ações pendentes sob a sua responsabilidade
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-1 flex-col justify-center gap-3">
            {cobrancasPendentes.length > 0 && (
              <Link
                href="/portal-encarregado/pagamentos"
                className="group flex items-center gap-3.5 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-100/70 hover:shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20 dark:hover:bg-amber-950/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 transition-transform duration-200 group-hover:scale-110">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {cobrancasPendentes.length} mensalidade{cobrancasPendentes.length > 1 ? "s" : ""} por liquidar
                  </p>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                    {formatarKz(valorPendenteKz)} em aberto
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-amber-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}

            {pendentesAvaliacao.length > 0 && (
              <Link
                href="/portal-encarregado/avaliacoes"
                className="group flex items-center gap-3.5 rounded-2xl border border-violet-200/60 bg-violet-50/60 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-100/70 hover:shadow-xs dark:border-violet-900/40 dark:bg-violet-950/20 dark:hover:bg-violet-950/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600 transition-transform duration-200 group-hover:scale-110">
                  <Star className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {pendentesAvaliacao.length} avaliação{pendentesAvaliacao.length > 1 ? "ões" : ""} por concluir
                  </p>
                  <p className="text-[11px] text-violet-700/80 dark:text-violet-400/80">
                    O seu feedback pedagógico é fundamental
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-violet-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}

            {pedidosEmCurso.length > 0 && (
              <Link
                href="/portal-encarregado/pedidos"
                className="group flex items-center gap-3.5 rounded-2xl border border-blue-200/60 bg-blue-50/60 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100/70 hover:shadow-xs dark:border-blue-900/40 dark:bg-blue-950/20 dark:hover:bg-blue-950/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 transition-transform duration-200 group-hover:scale-110">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {pedidosEmCurso.length} pedido{pedidosEmCurso.length > 1 ? "s" : ""} em processamento
                  </p>
                  <p className="text-[11px] text-blue-700/80 dark:text-blue-400/80">
                    A equipa pedagógica está a validar o explicador ideal
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}

            {cobrancasPendentes.length === 0 &&
              pendentesAvaliacao.length === 0 &&
              pedidosEmCurso.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 ring-4 ring-emerald-500/10 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Tudo em dia!
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                      Não existem pendências financeiras nem avaliações por preencher.
                    </p>
                  </div>
                </div>
              )}
          </div>
        </Cartao>
      </section>

      {/* BENTO GRID — LINHA 2: FILHOS + ACÇÕES RÁPIDAS */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* OS MEUS FILHOS */}
        <Cartao className="flex h-full flex-col rounded-[5px] border-slate-200/70 bg-white p-5 shadow-xs lg:col-span-8 dark:border-slate-800/80 dark:bg-[#07182E]">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800/70">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#FF2D75]" />
                Os Meus Filhos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Perfis escolares e acompanhamento pedagógico
              </p>
            </div>
            <Link
              href="/portal-encarregado/alunos"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#FF2D75] hover:underline"
            >
              Gerir todos ({alunos.length}) <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {alunos.length === 0 ? (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Ainda não registou nenhum filho
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Registe o perfil escolar do seu filho para solicitar explicações ao domicílio ou online.
                </p>
              </div>
              <Link
                href="/portal-encarregado/alunos/novo"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#FF2D75] px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#E11D48] hover:scale-102"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Adicionar Filho
              </Link>
            </div>
          ) : alunos.length > 4 ? (
            /* Mais de 4 filhos: Apresentação em Lista Compacta conforme solicitado */
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              {alunos.map((aluno) => {
                const acompAtivo = acompanhamentos.find(
                  (a) => a.alunoId === aluno.id && a.estado === "Activo"
                );
                const temExplicador = !!acompAtivo;
                const detalheExplicador = acompAtivo
                  ? `Prof. ${acompAtivo.professor?.utilizador.nomeCompleto.split(" ")[0]} · ${acompAtivo.disciplina.nome}`
                  : null;

                return (
                  <div
                    key={aluno.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-white dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF2D75]/10 text-[#FF2D75]">
                        <GraduationCap className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {aluno.nomeCompleto}
                          </p>
                          <Badge variante="info" className="text-[10px] py-0 px-2">
                            {aluno.anoEscolar}
                          </Badge>
                          {temExplicador && (
                            <Badge variante="sucesso" className="text-[10px] py-0 px-2 gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {detalheExplicador || "Explicador Ativo"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {aluno.escola || "Escola não especificada"} · {aluno.sistemaEnsino}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link href={`/portal-encarregado/alunos/${aluno.id}`}>
                        <Botao variante="fantasma" tamanho="sm" className="h-8 px-2.5 text-xs">
                          <Pencil className="h-3 w-3 mr-1" />
                          Editar
                        </Botao>
                      </Link>

                      {temExplicador ? (
                        <Link href="/portal-encarregado/acompanhamentos">
                          <Botao
                            variante="contorno"
                            tamanho="sm"
                            className="h-8 px-3 text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                            Apoio Ativo
                          </Botao>
                        </Link>
                      ) : (
                        <Link href={`/portal-encarregado/pedidos/novo?alunoId=${aluno.id}`}>
                          <Botao tamanho="sm" className="h-8 px-3 text-xs bg-[#FF2D75] hover:bg-[#E11D48] text-white">
                            Solicitar Apoio →
                          </Botao>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Até 4 filhos: Apresentação em Grelha de Cartões */
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {alunos.map((aluno) => {
                const acompAtivo = acompanhamentos.find(
                  (a) => a.alunoId === aluno.id && a.estado === "Activo"
                );
                return (
                  <CartaoAluno
                    key={aluno.id}
                    aluno={aluno}
                    temExplicador={!!acompAtivo}
                    detalheExplicador={
                      acompAtivo
                        ? `Prof. ${acompAtivo.professor?.utilizador.nomeCompleto.split(" ")[0]} · ${acompAtivo.disciplina.nome}`
                        : null
                    }
                  />
                );
              })}
            </div>
          )}
        </Cartao>

        {/* ACÇÕES RÁPIDAS */}
        <Cartao className="flex h-full flex-col rounded-[5px] border-slate-200/70 bg-white p-5 shadow-xs lg:col-span-4 dark:border-slate-800/80 dark:bg-[#07182E]">
          <div className="border-b border-slate-100 pb-3.5 dark:border-slate-800/70">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF2D75]" />
              Acções Rápidas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tarefas frequentes com 1 clique
            </p>
          </div>

          <div className="mt-4 grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {acoesRapidas.map((acao) => (
              <Link
                key={acao.href + acao.rotulo}
                href={acao.href}
                className="group flex items-center gap-3.5 rounded-[5px] border border-slate-200/70 bg-slate-50/50 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF2D75]/40 hover:bg-white hover:shadow-xs dark:border-slate-800 dark:bg-[#0A192F]/60 dark:hover:bg-[#102A45]/70"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] transition-transform duration-200 group-hover:scale-105 ${acao.tom}`}
                >
                  <acao.icone className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-900 dark:text-white">
                    {acao.rotulo}
                  </span>
                  <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {acao.descricao}
                  </span>
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF2D75] dark:text-slate-600" />
              </Link>
            ))}
          </div>
        </Cartao>
      </section>

      {/* BENTO GRID — LINHA 3: PEDIDOS RECENTES + ÚLTIMAS AVALIAÇÕES */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* PEDIDOS RECENTES */}
        <Cartao className="flex h-full flex-col overflow-hidden rounded-[5px] border-slate-200/70 bg-white shadow-xs lg:col-span-7 dark:border-slate-800/80 dark:bg-[#07182E]">
          <div className="flex items-start justify-between gap-3 p-5 pb-3.5 border-b border-slate-100 dark:border-slate-800/70">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[#FF2D75]" />
                Pedidos Recentes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Últimas solicitações de acompanhamento submetidas
              </p>
            </div>
            <Link
              href="/portal-encarregado/pedidos"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#FF2D75] hover:underline"
            >
              Ver todos ({pedidos.length}) <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex-1 divide-y divide-slate-100 p-2 dark:divide-slate-800/70">
            {pedidos.length === 0 && (
              <p className="px-5 py-10 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Ainda não submeteu nenhum pedido de explicador.
              </p>
            )}

            {pedidos.slice(0, 4).map((pedido) => {
              const detalhe = obterDetalheEstadoPedido(pedido.estado);

              return (
                <Link
                  key={pedido.id}
                  href={`/portal-encarregado/pedidos/${pedido.id}`}
                  className="flex items-center gap-3.5 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <ClipboardList className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {pedido.disciplina.nome} · {pedido.anoEscolar.nome}
                    </p>
                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {pedido.aluno.nomeCompleto} · {formatarKz(pedido.estimativaMensalKz)}/mês
                    </p>
                  </div>

                  <Badge variante={detalhe.variante} className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold shrink-0">
                    {detalhe.rotulo}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </Cartao>

        {/* ÚLTIMAS AVALIAÇÕES */}
        <Cartao className="flex h-full flex-col rounded-[5px] border-slate-200/70 bg-white p-5 shadow-xs lg:col-span-5 dark:border-slate-800/80 dark:bg-[#07182E]">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800/70">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                As Minhas Avaliações
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pareceres pedagógicos sobre os explicadores
              </p>
            </div>
            <Link
              href="/portal-encarregado/avaliacoes"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#FF2D75] hover:underline"
            >
              Ver todas <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 flex-1">
            {pendentesAvaliacao.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Todas as avaliações feitas
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                    Muito obrigado pelo seu contributo na qualidade de ensino dos nossos docentes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendentesAvaliacao.slice(0, 3).map((ac) => (
                  <Link
                    key={ac.id}
                    href="/portal-encarregado/avaliacoes"
                    className="flex items-center gap-3 rounded-2xl border border-violet-200/60 bg-violet-50/50 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-100/60 dark:border-violet-900/40 dark:bg-violet-950/20 dark:hover:bg-violet-950/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
                      <Star className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                        {ac.professor?.utilizador.nomeCompleto ?? "Explicador"}
                      </p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {ac.disciplina.nome} · {ac.aluno.nomeCompleto}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-violet-600 dark:text-violet-400">
                      Avaliar →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Cartao>
      </section>
    </div>
  );
}
