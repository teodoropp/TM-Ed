export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterMeusPedidos } from "@/modulos/pedidos/consultas";
import { obterDetalheEstadoPedido } from "@/regras/maquina-estados-pedido";
import { formatarKz } from "@/regras/calculo-preco";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { EstadoVazioPais } from "@/componentes/encarregados/EstadoVazioPais";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  ArrowRight,
  ClipboardList,
  UserCheck,
} from "lucide-react";

export const metadata = {
  title: "Pedidos de Apoio | Portal dos Pais",
};

export default async function PaginaMeusPedidos() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ENCARREGADO") {
    redirect("/entrar?callbackUrl=/portal-encarregado/pedidos");
  }

  const pedidos = await obterMeusPedidos();

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Pedidos de Apoio"
        descricao="Acompanhe o estado de cada solicitação e o explicador atribuído a cada acompanhamento dos seus filhos."
        icone={ClipboardList}
        acoes={
          <Link href="/portal-encarregado/pedidos/novo">
            <Botao className="gap-2 shadow-sm">
              <PlusCircle className="h-4 w-4" />
              Novo Pedido
            </Botao>
          </Link>
        }
      />

      {pedidos.length === 0 ? (
        <EstadoVazioPais
          icone={ClipboardList}
          titulo="Nenhum pedido registado"
          descricao="Ainda não solicitou apoio para os seus filhos. Submeta uma solicitação e receba uma proposta personalizada em menos de 24 horas úteis."
          acao={{
            rotulo: "Solicitar Acompanhamento",
            href: "/portal-encarregado/pedidos/novo",
          }}
        />
      ) : (
        <div className="space-y-4">
          {pedidos.map((ped) => {
            const detalhe = obterDetalheEstadoPedido(ped.estado);
            return (
              <Cartao
                key={ped.id}
                className="overflow-hidden rounded-2xl border-slate-200/70 bg-white/90 shadow-xs backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/90"
              >
                <CartaoCabecalho className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-800/70 dark:bg-slate-800/30">
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D75]/15 to-[#FF2D75]/5 text-[#FF2D75] ring-1 ring-[#FF2D75]/20 shadow-xs">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <CartaoTitulo className="text-base font-semibold text-slate-900 dark:text-white">
                          {ped.disciplina.nome} · {ped.anoEscolar.nome}
                          {ped.disciplinasAdicionais && (
                            <span className="block text-xs font-normal text-amber-600 dark:text-amber-400">
                              + {ped.disciplinasAdicionais}
                            </span>
                          )}
                        </CartaoTitulo>
                        <CartaoDescricao className="text-xs text-slate-500 dark:text-slate-400">
                          Filho: <span className="font-medium text-slate-700 dark:text-slate-300">{ped.aluno.nomeCompleto}</span>
                        </CartaoDescricao>
                      </div>
                    </div>

                    <Badge variante={detalhe.variante} className="rounded-full px-3 py-1 text-xs font-semibold">
                      {detalhe.rotulo}
                    </Badge>
                  </div>
                </CartaoCabecalho>

                <CartaoConteudo className="space-y-4 px-5 pt-4 pb-5">
                  <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-0.5">
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                        <MapPin className="h-3.5 w-3.5 text-[#FF2D75]" /> Modalidade
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {ped.modalidade} {ped.municipio && `(${ped.municipio})`}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                        <Clock className="h-3.5 w-3.5 text-[#FF2D75]" /> Duração & Frequência
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {ped.duracaoMinutos} min · {ped.frequenciaSemanal}x por semana
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                        <Calendar className="h-3.5 w-3.5 text-[#FF2D75]" /> Horário
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {ped.horarioPreferencial}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-slate-400 text-[11px] font-medium">Estimativa Mensal</span>
                      <p className="text-sm font-bold text-[#FF2D75]">
                        {formatarKz(ped.estimativaMensalKz)}
                      </p>
                    </div>
                  </div>

                  {ped.professorAtribuido && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/70 p-3.5 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-2.5">
                        <UserCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-slate-700 dark:text-slate-300">
                          <strong>Explicador Atribuído:</strong>{" "}
                          {ped.professorAtribuido.utilizador.nomeCompleto}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
                    <Link href={`/portal-encarregado/pedidos/${ped.id}`}>
                      <Botao variante="contorno" tamanho="sm" className="gap-1.5 text-xs rounded-xl transition-all hover:border-[#FF2D75]/40 hover:text-[#FF2D75]">
                        Ver Detalhes
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Botao>
                    </Link>
                  </div>
                </CartaoConteudo>
              </Cartao>
            );
          })}
        </div>
      )}
    </div>
  );
}
