export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterTodosPedidosAdmin, obterEstatisticasPedidosAdmin } from "@/modulos/pedidos/consultas";
import { obterDetalheEstadoPedido } from "@/regras/maquina-estados-pedido";
import { formatarKz } from "@/regras/calculo-preco";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";
import { EstadoPedido } from "@prisma/client";
import {
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Gestão e Triagem de Pedidos | Administração TM-Educa",
};

interface PropsPaginaAdminPedidos {
  searchParams: Promise<{ estado?: string }>;
}

export default async function PaginaAdminPedidos({ searchParams }: PropsPaginaAdminPedidos) {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/pedidos");
  }

  const { estado: filtroEstadoStr } = await searchParams;
  const filtroEstado = filtroEstadoStr ? (filtroEstadoStr as EstadoPedido) : undefined;

  const [pedidos, estatisticas] = await Promise.all([
    obterTodosPedidosAdmin(filtroEstado),
    obterEstatisticasPedidosAdmin(),
  ]);

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Triagem e Atribuição de Pedidos"
        descricao="Gestão operacional dos pedidos recebidos, motor de recomendação pedagógica e atribuição de explicadores."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Pedidos" },
        ]}
      />

      {/* Cartões de Indicadores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <CartaoKpi
          rotulo="Em Análise"
          valor={estatisticas.emAnalise}
          detalhe="Recebidos pela direção pedagógica"
          tom="ambar"
          href="/administracao/pedidos?estado=EmAnalise"
          className={filtroEstado === "EmAnalise" ? "border-amber-500 ring-2 ring-amber-500/20" : undefined}
        />

        <CartaoKpi
          rotulo="A Procurar Explicador"
          valor={estatisticas.aProcurar}
          detalhe="Em triagem de explicadores credenciados"
          tom="azul"
          href="/administracao/pedidos?estado=AProcurarProfessor"
          className={filtroEstado === "AProcurarProfessor" ? "border-blue-500 ring-2 ring-blue-500/20" : undefined}
        />

        <CartaoKpi
          rotulo="Aguardando Explicador"
          valor={estatisticas.aAguardar}
          detalhe="Proposta formal submetida ao explicador"
          tom="roxo"
          href="/administracao/pedidos?estado=AAguardarConfirmacao"
          className={filtroEstado === "AAguardarConfirmacao" ? "border-purple-500 ring-2 ring-purple-500/20" : undefined}
        />

        <CartaoKpi
          rotulo="Confirmados"
          valor={estatisticas.confirmados}
          detalhe="Serviços ativos com explicador atribuído"
          tom="esmeralda"
          href="/administracao/pedidos?estado=Confirmado"
          className={filtroEstado === "Confirmado" ? "border-emerald-500 ring-2 ring-emerald-500/20" : undefined}
        />
      </div>

      {/* Tabela de Pedidos */}
      <Cartao className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <CartaoCabecalho className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 py-3.5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-600" />
            <CartaoTitulo className="text-base font-bold">
              Pedidos de Acompanhamento ({pedidos.length})
            </CartaoTitulo>
          </div>

          {filtroEstado && (
            <Link href="/administracao/pedidos" className="text-xs text-slate-500 hover:text-emerald-600 underline">
              Limpar Filtro
            </Link>
          )}
        </CartaoCabecalho>

        <CartaoConteudo className="p-0">
          {pedidos.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Nenhum pedido encontrado para o critério selecionado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-5">Aluno & Pais</th>
                    <th className="py-3 px-5">Disciplina & Ano</th>
                    <th className="py-3 px-5">Modalidade & Local</th>
                    <th className="py-3 px-5">Estimativa Mensal</th>
                    <th className="py-3 px-5">Estado</th>
                    <th className="py-3 px-5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {pedidos.map((ped) => {
                    const infoEstado = obterDetalheEstadoPedido(ped.estado);
                    return (
                      <tr key={ped.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {ped.aluno.nomeCompleto}
                          </p>
                          <p className="text-xs text-slate-500">
                            Pais: {ped.encarregado.utilizador.nomeCompleto} ({ped.encarregado.utilizador.telefone})
                          </p>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {ped.disciplina.nome}
                          </span>
                          <p className="text-xs text-slate-500">{ped.anoEscolar.nome}</p>
                        </td>

                        <td className="py-4 px-5 text-xs">
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {ped.modalidade}
                          </p>
                          <p className="text-slate-500">
                            {ped.municipio ? `${ped.municipio}, ${ped.bairro || ""}` : "Sessão Online"}
                          </p>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-bold text-emerald-600">
                            {formatarKz(ped.estimativaMensalKz)}
                          </span>
                          <p className="text-[11px] text-slate-400">
                            {ped.frequenciaSemanal}x/sem ({ped.duracaoMinutos}m)
                          </p>
                        </td>

                        <td className="py-4 px-5">
                          <Badge variante={infoEstado.variante} className="text-xs">
                            {infoEstado.rotulo}
                          </Badge>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <Link href={`/administracao/pedidos/${ped.id}`}>
                            <Botao variante="contorno" tamanho="sm" className="gap-1.5 text-xs">
                              Triagem & Atribuição
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Botao>
                          </Link>
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
    </AmbienteAdmin>
  );
}
