export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterMeusAcompanhamentosEncarregado } from "@/modulos/contratos/consultas";
import { GrelhaAgendaAulas } from "@/componentes/calendario/grelha-agenda-aulas";
import { formatarKz } from "@/regras/calculo-preco";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { EstadoVazioPais } from "@/componentes/encarregados/EstadoVazioPais";
import {
  BookOpen,
  GraduationCap,
  Clock,
  MapPin,
  UserCheck,
  Sparkles,
  CalendarClock,
} from "lucide-react";

export const metadata = {
  title: "Acompanhamentos & Aulas | Portal dos Pais",
};

export default async function PaginaAcompanhamentosEncarregado() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ENCARREGADO") {
    redirect("/entrar?callbackUrl=/portal-encarregado/acompanhamentos");
  }

  const acompanhamentos = await obterMeusAcompanhamentosEncarregado();

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Acompanhamentos e Aulas"
        descricao="Consulte os planos de tutoria ativos, os dados dos explicadores e o calendário oficial de sessões dos seus filhos."
        icone={CalendarClock}
        acoes={
          <Link href="/portal-encarregado/pedidos/novo">
            <Botao className="gap-2 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Novo Acompanhamento
            </Botao>
          </Link>
        }
      />

      {acompanhamentos.length === 0 ? (
        <EstadoVazioPais
          icone={BookOpen}
          tom="aviso"
          titulo="Nenhum acompanhamento ativo"
          descricao="Assim que um pedido de apoio for confirmado e o contrato formalizado, o plano e o calendário oficial das aulas surgirão aqui."
          acao={{
            rotulo: "Ver Pedidos em Curso",
            href: "/portal-encarregado/pedidos",
          }}
        />
      ) : (
        <div className="space-y-6">
          {acompanhamentos.map((acomp) => (
            <div key={acomp.id} className="space-y-4">
              {/* CARTÃO DO SERVIÇO */}
              <Cartao className="overflow-hidden rounded-2xl border-slate-200/70 bg-white/90 shadow-xs backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/90">
                <CartaoCabecalho className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-800/70 dark:bg-slate-800/30">
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D75]/15 to-[#FF2D75]/5 text-[#FF2D75] ring-1 ring-[#FF2D75]/20 shadow-xs">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <CartaoTitulo className="text-base font-semibold text-slate-900 dark:text-white">
                          {acomp.disciplina.nome} · {acomp.aluno.nomeCompleto}
                        </CartaoTitulo>
                        <CartaoDescricao className="text-xs text-slate-500 dark:text-slate-400">
                          Código: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{acomp.codigo}</span>
                          {acomp.contrato && ` · Contrato: ${acomp.contrato.numeroContrato}`}
                        </CartaoDescricao>
                      </div>
                    </div>

                    <Badge variante="sucesso" className="rounded-full px-3 py-1 text-xs font-semibold">
                      {acomp.estado}
                    </Badge>
                  </div>
                </CartaoCabecalho>

                <CartaoConteudo className="space-y-4 px-5 pt-4 pb-5">
                  <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                        <UserCheck className="h-3.5 w-3.5 text-[#FF2D75]" /> Explicador Titular
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {acomp.professor.utilizador.nomeCompleto}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {acomp.professor.utilizador.telefone}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                        <Clock className="h-3.5 w-3.5 text-[#FF2D75]" /> Ritmo de Aulas
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {acomp.frequenciaSemanal}x/semana · {acomp.duracaoMinutos} min
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {acomp.horarioPreferencial}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                        <MapPin className="h-3.5 w-3.5 text-[#FF2D75]" /> Modalidade
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {acomp.modalidade}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {acomp.municipio
                          ? `${acomp.municipio}, ${acomp.bairro || ""}`
                          : "Sessão Online"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px] font-medium">Mensalidade Contratada</span>
                      <p className="text-base font-bold text-[#FF2D75]">
                        {formatarKz(acomp.estimativaMensalKz)}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {formatarKz(acomp.precoPorAulaKz)} por sessão
                      </p>
                    </div>
                  </div>
                </CartaoConteudo>
              </Cartao>

              {/* AGENDA DE AULAS */}
              <GrelhaAgendaAulas
                aulas={acomp.aulas.map((aula) => ({
                  id: aula.id,
                  numeroSessao: aula.numeroSessao,
                  dataHoraInicio: aula.dataHoraInicio,
                  dataHoraFim: aula.dataHoraFim,
                  duracaoMinutos: aula.duracaoMinutos,
                  modalidade: aula.modalidade,
                  estado: aula.estado,
                  sumario: aula.sumario,
                }))}
                titulo={`Agenda (${acomp.disciplina.nome} — ${acomp.aluno.nomeCompleto})`}
                tipoPortal="ENCARREGADO"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
