export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ClipboardList,
  Wallet,
  TrendingUp,
  GraduationCap,
  ArrowUpRight,
  FileText,
  CalendarClock,
  ShieldAlert,
  Star,
  BookOpen,
  Users,
  School,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import {
  obterEstatisticasPedidosAdmin,
  obterTodosPedidosAdmin,
} from "@/modulos/pedidos/consultas";
import { obterEstatisticasAulasAdmin } from "@/modulos/aulas/consultas";
import { obterResumoFinanceiroAdmin } from "@/modulos/financeiro/consultas";
import { obterEstatisticasQualidadeAdmin } from "@/modulos/qualidade/consultas";
import { obterContagemAlunosAdmin } from "@/modulos/alunos/consultas";
import { obterContagemProfessoresAdmin } from "@/modulos/professores/consultas";
import { formatarKz } from "@/regras/calculo-preco";
import { obterDetalheEstadoPedido } from "@/regras/maquina-estados-pedido";
import { consultaComRecurso } from "@/lib/consulta-com-recurso";
import { Cartao } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import {
  AnelProgresso,
  BarraProgresso,
  GraficoBarras,
} from "@/componentes/admin/graficos-admin";

export const metadata = {
  title: "Painel Administrativo | TM-Educa",
};

const ATALHOS = [
  {
    rotulo: "Triagem de pedidos",
    descricao: "Atribuir explicadores",
    href: "/administracao/pedidos",
    icone: ClipboardList,
    tom: "text-[#FF2D75] bg-[#FF2D75]/10",
  },
  {
    rotulo: "Contratos",
    descricao: "Acompanhamentos ativos",
    href: "/administracao/contratos",
    icone: FileText,
    tom: "text-blue-600 bg-blue-500/10",
  },
  {
    rotulo: "Agenda de aulas",
    descricao: "Supervisão de sessões",
    href: "/administracao/aulas",
    icone: CalendarClock,
    tom: "text-emerald-600 bg-emerald-500/10",
  },
  {
    rotulo: "Finanças",
    descricao: "Cobranças e margens",
    href: "/administracao/financeiro",
    icone: Wallet,
    tom: "text-amber-600 bg-amber-500/10",
  },
  {
    rotulo: "Ocorrências",
    descricao: "Qualidade e auditoria",
    href: "/administracao/ocorrencias",
    icone: ShieldAlert,
    tom: "text-rose-600 bg-rose-500/10",
  },
  {
    rotulo: "Preçário",
    descricao: "Catálogo oficial",
    href: "/administracao/catalogo",
    icone: BookOpen,
    tom: "text-purple-600 bg-purple-500/10",
  },
  {
    rotulo: "Avaliações",
    descricao: "Desempenho do explicador",
    href: "/administracao/avaliacoes",
    icone: Star,
    tom: "text-amber-600 bg-amber-500/10",
  },
  {
    rotulo: "Utilizadores",
    descricao: "Contas e permissões",
    href: "/administracao/utilizadores",
    icone: Users,
    tom: "text-slate-600 bg-slate-500/10",
  },
];

export default async function PaginaAdministracao() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao");
  }

  const [
    estatisticasPedidos,
    estatisticasAulas,
    resumoFinanceiro,
    qualidade,
    pedidos,
    totalAlunos,
    totalProfessores,
  ] = await Promise.all([
    consultaComRecurso(obterEstatisticasPedidosAdmin, {
      total: 0,
      emAnalise: 0,
      aProcurar: 0,
      aAguardar: 0,
      confirmados: 0,
    }),
    consultaComRecurso(obterEstatisticasAulasAdmin, {
      total: 0,
      agendadas: 0,
      realizadas: 0,
      faltasAluno: 0,
      faltasProfessor: 0,
      canceladas: 0,
    }),
    consultaComRecurso(obterResumoFinanceiroAdmin, {
      totalFaturadoPagoKz: 0,
      totalPendenteReceberKz: 0,
      totalEmAnaliseKz: 0,
      totalEmAnaliseContagem: 0,
      totalRemuneracoesPagasKz: 0,
      margemBrutaKz: 0,
      margemBrutaPercentual: 0,
    }),
    consultaComRecurso(obterEstatisticasQualidadeAdmin, {
      totalAvaliacoes: 0,
      mediaGlobal: 0,
      totalOcorrencias: 0,
      ocorrenciasAbertas: 0,
      ocorrenciasUrgentes: 0,
      taxaResolucao: 0,
    }),
    consultaComRecurso(() => obterTodosPedidosAdmin(), []),
    consultaComRecurso(obterContagemAlunosAdmin, 0),
    consultaComRecurso(obterContagemProfessoresAdmin, 0),
  ]);

  const pedidosEmAberto =
    estatisticasPedidos.emAnalise +
    estatisticasPedidos.aProcurar +
    estatisticasPedidos.aAguardar;

  const pedidosRecentes = pedidos.slice(0, 8);

  const totalFaltas =
    estatisticasAulas.faltasAluno + estatisticasAulas.faltasProfessor;

  const graficoAulas = [
    { rotulo: "Agendadas", valor: estatisticasAulas.agendadas, cor: "#60a5fa" },
    { rotulo: "Realizadas", valor: estatisticasAulas.realizadas, cor: "#FF2D75" },
    { rotulo: "Faltas Aluno", valor: estatisticasAulas.faltasAluno, cor: "#f59e0b" },
    {
      rotulo: "Faltas Prof.",
      valor: estatisticasAulas.faltasProfessor,
      cor: "#a855f7",
    },
    { rotulo: "Canceladas", valor: estatisticasAulas.canceladas, cor: "#94a3b8" },
  ];

  /* Indicadores rápidos do topo (ocupam a coluna lateral do destaque). */
  const indicadoresTopo = [
    {
      rotulo: "Alunos",
      valor: totalAlunos,
      detalhe: "em acompanhamento",
      icone: Users,
      href: "/administracao/utilizadores/alunos",
      tom: "text-[#FF2D75] bg-[#FF2D75]/10",
    },
    {
      rotulo: "Explicadores",
      valor: totalProfessores,
      detalhe: "credenciados",
      icone: School,
      href: "/administracao/utilizadores/professores",
      tom: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
    },
    {
      rotulo: "Avaliações",
      valor: qualidade.totalAvaliacoes,
      detalhe: `média ${qualidade.mediaGlobal.toFixed(1)}`,
      icone: Star,
      href: "/administracao/avaliacoes",
      tom: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
    },
    {
      rotulo: "Ocorrências",
      valor: qualidade.ocorrenciasAbertas,
      detalhe: "em aberto",
      icone: ShieldAlert,
      href: "/administracao/ocorrencias",
      tom: "text-rose-600 bg-rose-500/10 dark:text-rose-400",
    },
  ];

  /* Sinais operacionais de rodapé (complementam os KPIs superiores). */
  const sinaisOperacionais = [
    {
      rotulo: "Acompanhamentos confirmados",
      valor: estatisticasPedidos.confirmados,
      detalhe: "Serviços ativos com explicador atribuído",
      icone: CheckCircle2,
      cor: "text-emerald-500",
      href: "/administracao/contratos",
    },
    {
      rotulo: "Aulas agendadas",
      valor: estatisticasAulas.agendadas,
      detalhe: "Sessões por realizar em toda a rede",
      icone: Clock,
      cor: "text-amber-500",
      href: "/administracao/aulas",
    },
    {
      rotulo: "Ocorrências urgentes",
      valor: qualidade.ocorrenciasUrgentes,
      detalhe: "Incidentes por resolver com prioridade máxima",
      icone: AlertTriangle,
      cor: "text-rose-500",
      href: "/administracao/ocorrencias",
    },
  ];

  return (
    <AmbienteAdmin>
      <CabecalhoPagina
        titulo={`Olá, ${utilizador.nomeCompleto.split(" ")[0]}`}
        descricao="Painel executivo da TM-Educa. Acompanhe a operação, o desempenho pedagógico e a saúde financeira do ecossistema."
        caminho={[{ rotulo: "Administração", href: "/administracao" }, { rotulo: "Painel Geral" }]}
        acoes={
          <Link
            href="/administracao/pedidos"
            className="inline-flex h-10 items-center gap-2 rounded-[5px] bg-[#E11D48] px-4 text-sm text-white shadow-sm shadow-black/20 transition-colors hover:bg-[#BE123C]"
          >
            <ClipboardList className="h-4 w-4" />
            Triagem de pedidos
          </Link>
        }
      />

      {/* BENTO GRID — LINHA 0: DESTAQUE + INDICADORES RÁPIDOS */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* CARD DE DESTAQUE COM IMAGEM DE ALUNO */}
        <div className="group relative overflow-hidden rounded-[5px] border border-slate-200/80 bg-[#0A192F] shadow-sm transition-all duration-300 hover:shadow-xl lg:col-span-8 dark:border-slate-800">
          <Image
            src="/imagens/hero/estudante-concentrado.png"
            alt="Aluno da rede TM-Educa a estudar com acompanhamento pedagógico"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover object-right transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {/* Sobreposição para legibilidade do texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/85 to-[#0A192F]/10" />

          <div className="relative flex h-full flex-col justify-center gap-3 p-6 sm:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-[5px] bg-[#FF2D75]/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#ff7aa8]">
              <Sparkles className="h-3 w-3" />
              Acompanhamento Escolar
            </span>

            <h2 className="max-w-md text-xl leading-tight text-white sm:text-2xl">
              O aluno certo, o professor certo, no momento decisivo.
            </h2>

            <p className="max-w-md text-[13px] leading-relaxed text-slate-300">
              {totalAlunos} filhos em acompanhamento e{" "}
              {totalProfessores} explicadores credenciados em Luanda. Acompanhe
              toda a operação a partir de um único painel.
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Link
                href="/administracao/utilizadores/alunos"
                className="inline-flex h-9 items-center gap-2 rounded-[5px] bg-[#E11D48] px-3.5 text-[13px] text-white transition-colors hover:bg-[#BE123C]"
              >
                <Users className="h-3.5 w-3.5" />
                Ver alunos
              </Link>
              <Link
                href="/administracao/acompanhamentos"
                className="inline-flex h-9 items-center gap-2 rounded-[5px] border border-white/25 px-3.5 text-[13px] text-white transition-colors hover:bg-white/10"
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Ver acompanhamentos
              </Link>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL — 4 INDICADORES EM GRELHA 2×2 (preenche toda a altura do destaque) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 lg:col-span-4">
          {indicadoresTopo.map((indicador) => (
            <Link
              key={indicador.rotulo}
              href={indicador.href}
              className="group flex flex-col justify-between gap-2 rounded-[5px] border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:border-[#FF2D75]/40 hover:shadow-md dark:border-slate-800/80 dark:bg-[#07182E]"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-[5px] ${indicador.tom}`}
              >
                <indicador.icone className="h-4 w-4" />
              </span>

              <div>
                <p className="text-2xl font-semibold leading-none text-slate-900 dark:text-white">
                  {indicador.valor}
                </p>
                <p className="mt-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  {indicador.rotulo}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {indicador.detalhe}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BENTO GRID — LINHA 1: INDICADORES EXECUTIVOS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        <CartaoKpi
          rotulo="Pedidos em aberto"
          valor={pedidosEmAberto}
          detalhe={`${estatisticasPedidos.emAnalise} em análise · ${estatisticasPedidos.aProcurar} a procurar explicador`}
          icone={<ClipboardList className="h-4 w-4" />}
          tom="rosa"
          href="/administracao/pedidos"
          className="lg:col-span-3"
        />

        <CartaoKpi
          rotulo="Receita liquidada"
          valor={formatarKz(resumoFinanceiro.totalFaturadoPagoKz)}
          detalhe={`${formatarKz(resumoFinanceiro.totalPendenteReceberKz)} por receber`}
          icone={<Wallet className="h-4 w-4" />}
          tom="esmeralda"
          href="/administracao/financeiro"
          className="lg:col-span-3"
        />

        <CartaoKpi
          rotulo="Margem bruta"
          valor={`${resumoFinanceiro.margemBrutaPercentual}%`}
          detalhe={formatarKz(resumoFinanceiro.margemBrutaKz)}
          icone={<TrendingUp className="h-4 w-4" />}
          tom="azul"
          href="/administracao/financeiro"
          className="lg:col-span-3"
        />

        <CartaoKpi
          rotulo="Taxa de resolução"
          valor={`${qualidade.taxaResolucao}%`}
          detalhe={`${qualidade.ocorrenciasAbertas} ocorrências em aberto`}
          icone={<ShieldAlert className="h-4 w-4" />}
          tom="ambar"
          href="/administracao/ocorrencias"
          className="lg:col-span-3"
        />
      </section>

      {/* BENTO GRID — LINHA 2: ANÁLISE (3 CARTÕES COM A MESMA ALTURA) */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* FUNIL DE PEDIDOS */}
        <Cartao className="flex h-full flex-col p-4 lg:col-span-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] text-slate-900 dark:text-white">
                Funil de pedidos
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Distribuição dos {estatisticasPedidos.total} pedidos registados
              </p>
            </div>
            <Link
              href="/administracao/pedidos"
              className="inline-flex items-center gap-1 text-[11px] text-[#FF2D75] hover:underline"
            >
              Ver todos <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-3">
            <BarraProgresso
              rotulo="Em análise"
              valor={estatisticasPedidos.emAnalise}
              total={estatisticasPedidos.total}
              cor="#f59e0b"
            />
            <BarraProgresso
              rotulo="A procurar professor"
              valor={estatisticasPedidos.aProcurar}
              total={estatisticasPedidos.total}
              cor="#3b82f6"
            />
            <BarraProgresso
              rotulo="A aguardar confirmação"
              valor={estatisticasPedidos.aAguardar}
              total={estatisticasPedidos.total}
              cor="#a855f7"
            />
            <BarraProgresso
              rotulo="Confirmados"
              valor={estatisticasPedidos.confirmados}
              total={estatisticasPedidos.total}
              cor="#10b981"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="rounded-[10px] bg-slate-50 p-2.5 dark:bg-slate-800/50">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Em aberto
              </p>
              <p className="text-base text-slate-900 dark:text-white">
                {pedidosEmAberto}
              </p>
            </div>
            <div className="rounded-[10px] bg-slate-50 p-2.5 dark:bg-slate-800/50">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Taxa de conversão
              </p>
              <p className="text-base text-slate-900 dark:text-white">
                {estatisticasPedidos.total > 0
                  ? `${Math.round(
                      (estatisticasPedidos.confirmados / estatisticasPedidos.total) *
                        100
                    )}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </Cartao>

        {/* DESEMPENHO DAS AULAS */}
        <Cartao className="flex h-full flex-col p-4 lg:col-span-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] text-slate-900 dark:text-white">
                Desempenho das aulas
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {estatisticasAulas.total} sessões registadas
              </p>
            </div>
            <Link
              href="/administracao/aulas"
              className="inline-flex items-center gap-1 text-[11px] text-[#FF2D75] hover:underline"
            >
              Detalhe <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-3">
            <div className="flex justify-center">
              <AnelProgresso
                percentagem={
                  estatisticasAulas.total > 0
                    ? (estatisticasAulas.realizadas / estatisticasAulas.total) * 100
                    : 0
                }
                rotulo={`${estatisticasAulas.realizadas}`}
                subRotulo="realizadas"
                tamanho={92}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[10px] bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Agendadas
                </p>
                <p className="text-base text-slate-900 dark:text-white">
                  {estatisticasAulas.agendadas}
                </p>
              </div>
              <div className="rounded-[10px] bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Faltas / Cancel.
                </p>
                <p className="text-base text-slate-900 dark:text-white">
                  {totalFaltas + estatisticasAulas.canceladas}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <GraficoBarras dados={graficoAulas} altura={68} />
          </div>
        </Cartao>

        {/* SAÚDE FINANCEIRA */}
        <Cartao className="flex h-full flex-col p-4 lg:col-span-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] text-slate-900 dark:text-white">
                Saúde financeira
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Consolidação de receitas
              </p>
            </div>
            <Link
              href="/administracao/financeiro"
              className="inline-flex items-center gap-1 text-[11px] text-[#FF2D75] hover:underline"
            >
              Abrir <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex flex-1 items-center">
            <GraficoBarras
              dados={[
                {
                  rotulo: "Receita",
                  valor: resumoFinanceiro.totalFaturadoPagoKz,
                  cor: "#10b981",
                },
                {
                  rotulo: "Remunerações",
                  valor: resumoFinanceiro.totalRemuneracoesPagasKz,
                  cor: "#a855f7",
                },
                {
                  rotulo: "Pendente",
                  valor: resumoFinanceiro.totalPendenteReceberKz,
                  cor: "#f59e0b",
                },
              ]}
              altura={92}
              formatador={(valor) => formatarKz(valor)}
            />
          </div>

          <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Em análise
              </span>
              <span className="text-slate-900 dark:text-white">
                {resumoFinanceiro.totalEmAnaliseContagem} cobranças ·{" "}
                {formatarKz(resumoFinanceiro.totalEmAnaliseKz)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Margem bruta
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {resumoFinanceiro.margemBrutaPercentual}%
              </span>
            </div>
          </div>
        </Cartao>
      </section>

      {/* BENTO GRID — LINHA 3: ATALHOS OPERACIONAIS */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base text-slate-900 dark:text-white">
              Atalhos operacionais
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Acesso directo às áreas de gestão mais utilizadas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ATALHOS.map((atalho) => (
            <Link
              key={atalho.href}
              href={atalho.href}
              className="group flex items-center gap-3 rounded-[5px] border border-slate-200/80 bg-white p-3.5 shadow-xs transition-all hover:border-[#FF2D75]/40 hover:shadow-md dark:border-slate-800/80 dark:bg-[#07182E]"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] ${atalho.tom}`}
              >
                <atalho.icone className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-slate-900 dark:text-white">
                  {atalho.rotulo}
                </span>
                <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {atalho.descricao}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* BENTO GRID — LINHA 4: ATIVIDADE + SINAIS OPERACIONAIS */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* PEDIDOS RECENTES */}
        <Cartao className="flex h-full flex-col overflow-hidden lg:col-span-8">
          <div className="flex items-start justify-between gap-3 p-5 pb-4">
            <div>
              <h2 className="text-base text-slate-900 dark:text-white">
                Pedidos recentes
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Últimas entradas no funil operacional
              </p>
            </div>
            <Link
              href="/administracao/pedidos"
              className="inline-flex items-center gap-1 text-[11px] text-[#FF2D75] hover:underline"
            >
              Ver todos <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800/80">
            {pedidosRecentes.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                Ainda não existem pedidos registados.
              </p>
            )}

            {pedidosRecentes.map((pedido) => {
              const detalhe = obterDetalheEstadoPedido(pedido.estado);

              return (
                <Link
                  key={pedido.id}
                  href={`/administracao/pedidos/${pedido.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-900 dark:text-white">
                      {pedido.aluno?.nomeCompleto ?? "Pedido sem filho"}
                    </p>
                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {pedido.disciplina?.nome ?? "Disciplina por definir"} ·{" "}
                      {pedido.anoEscolar?.nome ?? "Ano por definir"}
                    </p>
                  </div>

                  <Badge variante={detalhe.variante}>{detalhe.rotulo}</Badge>
                </Link>
              );
            })}
          </div>
        </Cartao>

        {/* SINAIS OPERACIONAIS */}
        <Cartao className="flex h-full flex-col p-5 lg:col-span-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base text-slate-900 dark:text-white">
                Sinais operacionais
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Estado da rede em tempo real
              </p>
            </div>
            <Link
              href="/administracao/acompanhamentos"
              className="inline-flex items-center gap-1 text-[11px] text-[#FF2D75] hover:underline"
            >
              Acompanhamentos <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {sinaisOperacionais.map((sinal) => (
              <Link
                key={sinal.rotulo}
                href={sinal.href}
                className="flex flex-1 items-center gap-3 rounded-[10px] bg-slate-50 p-3.5 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800"
              >
                <sinal.icone className={`h-5 w-5 shrink-0 ${sinal.cor}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
                    {sinal.rotulo}
                  </p>
                  <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                    {sinal.detalhe}
                  </p>
                </div>
                <span className="text-xl leading-none text-slate-900 dark:text-white">
                  {sinal.valor}
                </span>
              </Link>
            ))}
          </div>
        </Cartao>
      </section>
    </AmbienteAdmin>
  );
}
