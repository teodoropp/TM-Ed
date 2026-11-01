export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterTodosContratosAdmin } from "@/modulos/contratos/consultas";
import { formatarKz } from "@/regras/calculo-preco";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";
import { BotaoModalEmitirCobranca } from "@/componentes/financeiro/ModalEmitirCobranca";
import { FileText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Contratos Comerciais | Administração TM-Educa",
};

export default async function PaginaAdminContratos() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/contratos");
  }

  const contratos = await obterTodosContratosAdmin();
  const volumeTotalMensal = contratos.reduce((acc, c) => acc + c.valorMensalKz, 0);

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Gestão de Contratos de Clientes"
        descricao="Supervisão jurídica e financeira dos contratos formalizados com os pais."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Contratos" },
        ]}
        acoes={
          <Link href="/administracao/acompanhamentos">
            <Botao variante="contorno">Ver Serviços Ativos</Botao>
          </Link>
        }
      />

      {/* Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CartaoKpi
          rotulo="Total de Contratos"
          valor={contratos.length}
          detalhe="Formalizados na plataforma"
          tom="neutro"
        />

        <CartaoKpi
          rotulo="Faturação Mensal Ativa"
          valor={formatarKz(volumeTotalMensal)}
          detalhe="Volume contratado mensal"
          tom="esmeralda"
        />

        <CartaoKpi
          rotulo="Validade Jurídica"
          valor="100%"
          detalhe="Regulamentação TM-Educa homologada"
          tom="azul"
        />
      </div>

      {/* Tabela de Contratos */}
      <Cartao className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <CartaoCabecalho className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 py-3.5">
          <CartaoTitulo className="text-base font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Contratos em Vigor ({contratos.length})
          </CartaoTitulo>
        </CartaoCabecalho>

        <CartaoConteudo className="p-0">
          {contratos.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Nenhum contrato formalizado até ao momento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-5">N.º de Contrato</th>
                    <th className="py-3 px-5">Cliente / Pai</th>
                    <th className="py-3 px-5">Valor Mensal</th>
                    <th className="py-3 px-5">Preço / Aula</th>
                    <th className="py-3 px-5">Data de Início</th>
                    <th className="py-3 px-5">Estado</th>
                    <th className="py-3 px-5 text-right">Faturação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {contratos.map((ctr) => (
                    <tr key={ctr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                        {ctr.numeroContrato}
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {ctr.utilizador.nomeCompleto}
                        </p>
                        <p className="text-xs text-slate-500">
                          {ctr.utilizador.email} · {ctr.utilizador.telefone}
                        </p>
                      </td>

                      <td className="py-4 px-5 font-bold text-emerald-600">
                        {formatarKz(ctr.valorMensalKz)}
                      </td>

                      <td className="py-4 px-5 text-slate-700 dark:text-slate-300">
                        {formatarKz(ctr.valorPorAulaKz)}
                      </td>

                      <td className="py-4 px-5 text-xs text-slate-500">
                        {new Date(ctr.dataInicio).toLocaleDateString("pt-AO")}
                      </td>

                      <td className="py-4 px-5">
                        <Badge
                          variante={
                            ctr.estado === "Activo"
                              ? "sucesso"
                              : ctr.estado === "Suspenso"
                              ? "perigo"
                              : "neutro"
                          }
                          className="text-xs"
                        >
                          {ctr.estado}
                        </Badge>
                      </td>

                      <td className="py-4 px-5 text-right">
                        {ctr.estado === "Activo" && (
                          <BotaoModalEmitirCobranca
                            contratoId={ctr.id}
                            numeroContrato={ctr.numeroContrato}
                            clienteNome={ctr.utilizador.nomeCompleto}
                            valorMensalKz={ctr.valorMensalKz}
                          />
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
