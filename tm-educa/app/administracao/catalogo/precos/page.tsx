export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterTabelaPrecosCompleta } from "@/modulos/precos/consultas";
import { Cartao, CartaoCabecalho, CartaoTitulo, CartaoConteudo } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { SimuladorPrecos } from "@/componentes/precos/simulador-precos";
import { EditorPrecoAdmin } from "@/componentes/precos/editor-preco-admin";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { Info, GraduationCap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Tabela Oficial de Preços | Administração TM-Educa",
};

export default async function PaginaAdminPrecos() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/catalogo/precos");
  }

  const ciclos = await obterTabelaPrecosCompleta();

  // Mapear dados para o simulador
  const anosParaSimulador = ciclos.flatMap((ciclo) =>
    ciclo.anos.map((ano) => ({
      id: ano.id,
      nome: ano.nome,
      ciclo: { nome: ciclo.nome },
      precos: ano.precos.map((p) => ({
        duracaoMinutos: p.duracaoMinutos,
        precoPorAulaKz: p.precoPorAulaKz,
      })),
    }))
  );

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Tabela Oficial de Preços aos Clientes"
        descricao="Preços oficiais cobrados aos pais por aula. Passe o cursor por cima de um valor para editar em linha."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Catálogo", href: "/administracao/catalogo" },
          { rotulo: "Preçário Oficial" },
        ]}
        acoes={
          <Link href="/administracao/catalogo/remuneracoes">
            <Botao variante="contorno" className="gap-2">
              Ver Remunerações
            </Botao>
          </Link>
        }
      />

      {/* Regra de Negócio Oficial */}
      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
          <p className="font-bold">Fórmula Contratual da Plataforma:</p>
          <p>
            <strong>Estimativa Mensal = Preço por Aula × Frequência Semanal × 4 Semanas.</strong> Os valores configurados nesta tabela refletem-se automaticamente nas estimativas dos pais e na geração das propostas de acompanhamento.
          </p>
        </div>
      </div>

      {/* Tabelas por Ciclo */}
      <div className="space-y-8">
        {ciclos.map((ciclo) => (
          <Cartao key={ciclo.id} className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CartaoCabecalho className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  <CartaoTitulo className="text-base font-bold text-slate-900 dark:text-white">
                    {ciclo.nome}
                  </CartaoTitulo>
                </div>
                <Badge variante="neutro" className="text-xs">
                  {ciclo.anos.length} Anos Curriculares
                </Badge>
              </div>
            </CartaoCabecalho>

            <CartaoConteudo className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-5">Ano Escolar</th>
                      <th className="py-3 px-5 text-center">1 Hora (60 min)</th>
                      <th className="py-3 px-5 text-center">1h30 (90 min)</th>
                      <th className="py-3 px-5 text-center">2 Horas (120 min)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {ciclo.anos.map((ano) => {
                      const preco60 = ano.precos.find((p) => p.duracaoMinutos === 60)?.precoPorAulaKz || 0;
                      const preco90 = ano.precos.find((p) => p.duracaoMinutos === 90)?.precoPorAulaKz || 0;
                      const preco120 = ano.precos.find((p) => p.duracaoMinutos === 120)?.precoPorAulaKz || 0;

                      return (
                        <tr key={ano.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                            {ano.nome}
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <EditorPrecoAdmin
                              anoEscolarId={ano.id}
                              anoNome={ano.nome}
                              duracaoMinutos={60}
                              precoAtualKz={preco60}
                            />
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <EditorPrecoAdmin
                              anoEscolarId={ano.id}
                              anoNome={ano.nome}
                              duracaoMinutos={90}
                              precoAtualKz={preco90}
                            />
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <EditorPrecoAdmin
                              anoEscolarId={ano.id}
                              anoNome={ano.nome}
                              duracaoMinutos={120}
                              precoAtualKz={preco120}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CartaoConteudo>
          </Cartao>
        ))}
      </div>

      {/* Simulador Interativo Embutido */}
      <div className="pt-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Simulação de Propostas Comerciais
        </h2>
        {anosParaSimulador.length > 0 && <SimuladorPrecos dadosAnos={anosParaSimulador} />}
      </div>
    </AmbienteAdmin>
  );
}
