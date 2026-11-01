export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Users,
  CheckCircle2,
  Inbox,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  UserCheck,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPerfilProfessorLogado } from "@/modulos/professores/consultas";
import { obterAulasProfessor } from "@/modulos/aulas/consultas";
import { obterPropostasProfessor } from "@/modulos/pedidos/consultas";
import { obterFolhasRemuneracaoProfessor } from "@/modulos/financeiro/consultas";
import { formatarKz } from "@/regras/calculo-preco";

import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { Cartao, CartaoCabecalho, CartaoTitulo, CartaoDescricao, CartaoConteudo } from "@/componentes/ui/cartao";
import { CabecalhoPaginaProfessor } from "@/componentes/professores/CabecalhoPaginaProfessor";

export const metadata = {
  title: "Painel do Professor | TM-Educa",
};

export default async function PaginaDashboardProfessor() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor");
  }

  const perfil = await obterPerfilProfessorLogado();
  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-professor");
  }

  const perfilId = perfil.id;

  const [aulas, propostas, folhas] = await Promise.all([
    obterAulasProfessor(perfilId),
    obterPropostasProfessor(),
    obterFolhasRemuneracaoProfessor(perfilId),
  ]);

  const agora = new Date();
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0);
  const fimHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59);

  // Aulas de hoje
  const aulasHoje = aulas.filter((a) => {
    const data = new Date(a.dataHoraInicio);
    return data >= inicioHoje && data <= fimHoje;
  });

  // Próximas aulas futuras
  const proximasAulas = aulas
    .filter((a) => new Date(a.dataHoraInicio) > fimHoje && a.estado === "Agendada")
    .slice(0, 5);

  // Propostas pendentes de resposta
  const propostasPendentes = propostas.filter((p) => p.estado === "Pendente");

  // Alunos únicos ativos
  const idsAlunos = new Set(
    aulas.map((a) => a.acompanhamento.aluno.id)
  );

  // Proventos acumulados pagos
  const totalRecebidoHistorico = folhas
    .filter((f) => f.estado === "Paga")
    .reduce((acc, f) => acc + f.valorLiquidoKz, 0);

  // Indicadores
  const indicadores = [
    {
      rotulo: "Aulas Hoje",
      valor: aulasHoje.length,
      detalhe: aulasHoje.length === 0 ? "Sem aulas hoje" : "Sessões marcadas",
      icone: Calendar,
      tom: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      href: "/portal-professor/agenda",
    },
    {
      rotulo: "Alunos Acompanhados",
      valor: idsAlunos.size,
      detalhe: "Estudantes ativos",
      icone: Users,
      tom: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      href: "/portal-professor/alunos",
    },
    {
      rotulo: "Novas Propostas",
      valor: propostasPendentes.length,
      detalhe: propostasPendentes.length > 0 ? "Aguardam sua resposta" : "Sem propostas pendentes",
      icone: Inbox,
      tom: propostasPendentes.length > 0 ? "bg-amber-500/15 text-amber-600" : "bg-slate-100 text-slate-500",
      href: "/portal-professor/propostas",
    },
    {
      rotulo: "Total Liquidado",
      valor: formatarKz(totalRecebidoHistorico),
      detalhe: "Folhas fechadas e pagas",
      icone: TrendingUp,
      tom: "bg-rose-500/10 text-[#FF2D75]",
      href: "/portal-professor/remuneracoes",
    },
  ];

  const primeiroNome = utilizador.nomeCompleto.split(" ")[0];

  return (
    <div className="space-y-6 portal-tipografia">
      {/* CABEÇALHO PADRONIZADO */}
      <CabecalhoPaginaProfessor
        titulo="Painel do Explicador"
        descricao="Acompanhe a sua agenda semanal, sumários de aulas, novas propostas de alunos e a evolução das suas remunerações."
        icone={LayoutDashboard}
        acoes={
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/portal-professor/agenda">
              <Botao className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-[5px] shadow-xs text-xs font-normal">
                <Calendar className="h-4 w-4" />
                Minha Agenda
              </Botao>
            </Link>
          </div>
        }
      />

      {/* BENTO GRID — HERO CARD + INDICADORES */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* HERO BANNER DO PROFESSOR */}
        <div className="relative overflow-hidden rounded-[5px] border border-slate-200/60 bg-gradient-to-br from-[#07182E] via-[#0A192F] to-[#122844] p-6 sm:p-8 lg:col-span-8 shadow-sm transition-all duration-300 dark:border-slate-800/80 text-white">
          {/* Efeitos de Iluminação Suave */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-[#FF2D75]/10 blur-3xl"
          />

          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] bg-white/10 px-3 py-1 text-[11px] font-normal uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/15">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  Corpo Docente TM-Educa
                </span>
                <Badge variante="sucesso" className="rounded-[5px] px-2.5 text-[11px] font-normal">
                  {perfil.estado === "Activo" ? "Explicador Ativo" : perfil.estado}
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Bem-vindo, {primeiroNome}!
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-normal">
                  Tem <strong>{aulasHoje.length} aula{aulasHoje.length === 1 ? "" : "s"}</strong> agendada{aulasHoje.length === 1 ? "" : "s"} para hoje e{" "}
                  <strong>{propostasPendentes.length} nova{propostasPendentes.length === 1 ? "" : "s"} proposta{propostasPendentes.length === 1 ? "" : "s"}</strong> de alunos aguardando a sua confirmação.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/portal-professor/aulas">
                <Botao className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md rounded-[5px] text-xs font-normal">
                  <GraduationCap className="h-4 w-4" />
                  Minhas Aulas
                </Botao>
              </Link>
              <Link
                href="/portal-professor/disponibilidade"
                className="inline-flex h-10 items-center gap-2 rounded-[5px] border border-white/20 bg-white/5 px-4 text-xs font-normal text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white/30"
              >
                <Clock className="h-4 w-4" />
                Definir Horários Livres
              </Link>
            </div>
          </div>
        </div>

        {/* 4 INDICADORES (COLUNA DIREITA 2×2) */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-4">
          {indicadores.map((ind) => {
            const Icone = ind.icone;
            return (
              <Link
                key={ind.rotulo}
                href={ind.href}
                className="group flex flex-col justify-between rounded-[5px] border border-slate-200/70 bg-white/90 p-4 shadow-xs backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/90"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-[5px] ${ind.tom} shadow-xs transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icone className="h-4 w-4" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-slate-500" />
                </div>

                <div className="mt-4 space-y-0.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {ind.valor}
                  </span>
                  <p className="text-xs font-normal text-slate-600 dark:text-slate-300">
                    {ind.rotulo}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                    {ind.detalhe}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PROPOSTAS DE MATCHING PENDENTES (SE HOUVER) */}
      {propostasPendentes.length > 0 && (
        <section className="rounded-[5px] border border-amber-200/70 bg-amber-500/10 p-5 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Tem {propostasPendentes.length} proposta{propostasPendentes.length > 1 ? "s" : ""} de novo aluno para aceitar!
              </h3>
            </div>
            <Link
              href="/portal-professor/propostas"
              className="text-xs font-medium text-amber-800 hover:text-amber-900 underline dark:text-amber-300"
            >
              Ver todas as propostas →
            </Link>
          </div>
          <p className="text-xs text-amber-800/80 dark:text-amber-300/80 font-normal">
            A coordenação pedagógica selecionou o seu perfil com base na compatibilidade curricular e zona de atendimento. Responda tempestivamente para garantir a atribuição.
          </p>
        </section>
      )}

      {/* LINHA 2: AULAS DE HOJE + PRÓXIMAS AULAS */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* AULAS DE HOJE */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              Aulas para Hoje ({aulasHoje.length})
            </h3>
            <Link
              href="/portal-professor/agenda"
              className="text-xs font-normal text-emerald-600 hover:text-emerald-700 transition-colors dark:text-emerald-400"
            >
              Ver calendário completo →
            </Link>
          </div>

          {aulasHoje.length === 0 ? (
            <div className="rounded-[5px] border border-dashed border-slate-200/80 bg-white/60 p-8 text-center dark:border-slate-800 dark:bg-slate-900/60">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Sem sessões previstas para hoje!
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
                Aproveite para preparar os planos curriculares e atualizar os sumários pendentes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {aulasHoje.map((aula) => {
                const hora = new Intl.DateTimeFormat("pt-AO", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(aula.dataHoraInicio));

                return (
                  <div
                    key={aula.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[5px] border border-slate-200/70 bg-white/90 shadow-xs dark:border-slate-800 dark:bg-slate-900/90"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {hora}
                        </span>
                        <span className="text-xs text-slate-400">· {aula.duracaoMinutos} min</span>
                        <Badge variante="sucesso" className="text-[10px] px-2 py-0.2 rounded-[5px]">
                          {aula.acompanhamento.modalidade}
                        </Badge>
                      </div>

                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {aula.acompanhamento.disciplina.nome} · Educando: {aula.acompanhamento.aluno.nomeCompleto}
                      </p>

                      {aula.acompanhamento.encarregado?.municipio && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 font-normal">
                          <MapPin className="h-3 w-3 text-emerald-600" />
                          {aula.acompanhamento.encarregado.municipio}
                          {aula.acompanhamento.encarregado.bairro ? `, ${aula.acompanhamento.encarregado.bairro}` : ""}
                        </p>
                      )}
                    </div>

                    {aula.estado === "Realizada" ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-normal rounded-[5px] text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Realizada
                      </Badge>
                    ) : (
                      <Link href={`/portal-professor/aulas`}>
                        <Botao tamanho="sm" className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-[5px] shadow-xs">
                          <BookOpen className="h-3.5 w-3.5" />
                          Sumário
                        </Botao>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PRÓXIMAS AULAS DA SEMANA */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              Próximas Sessões
            </h3>
            <Link
              href="/portal-professor/aulas"
              className="text-xs font-normal text-emerald-600 hover:text-emerald-700 transition-colors dark:text-emerald-400"
            >
              Ver todas as aulas →
            </Link>
          </div>

          {proximasAulas.length === 0 ? (
            <div className="rounded-[5px] border border-dashed border-slate-200/80 bg-white/60 p-8 text-center dark:border-slate-800 dark:bg-slate-900/60">
              <Calendar className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Nenhuma aula futura prevista
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
                Novas aulas surgirão assim que um contrato for formalizado ou reposição for marcada.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {proximasAulas.map((aula) => {
                const dataFormatada = new Intl.DateTimeFormat("pt-AO", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(aula.dataHoraInicio));

                return (
                  <div
                    key={aula.id}
                    className="flex items-center justify-between p-3.5 rounded-[5px] border border-slate-100 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/60 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {aula.acompanhamento.disciplina.nome} · {aula.acompanhamento.aluno.nomeCompleto}
                      </p>
                      <p className="text-slate-500 font-normal">
                        {dataFormatada} ({aula.duracaoMinutos} min) · {aula.acompanhamento.modalidade}
                      </p>
                    </div>

                    <Link href="/portal-professor/aulas">
                      <span className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                        Detalhes →
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
