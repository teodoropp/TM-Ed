export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterMatrizFinanceiraAdmin } from "@/modulos/precos/consultas";
import { Cartao, CartaoCabecalho, CartaoTitulo, CartaoConteudo } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { EditorRemuneracaoAdmin } from "@/componentes/precos/editor-remuneracao-admin";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { formatarKz, calcularMargemBruta, calcularPercentualMargem } from "@/regras";
import { ShieldAlert, GraduationCap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Tabela de Remunerações e Margens | Administração TM-Educa",
};

export default async function PaginaAdminRemuneracoes() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/catalogo/remuneracoes");
  }

  const ciclos = await obterMatrizFinanceiraAdmin();

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Tabela de Remunerações dos Professores & Margens"
        descricao="Valores repassados aos explicadores por aula ministrada e análise de margem de intermediação pedagógica."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Catálogo", href: "/administracao/catalogo" },
          { rotulo: "Remunerações" },
        ]}
        acoes={
          <Link href="/administracao/catalogo/precos">
            <Botao variante="contorno">Ver Tabela de Preços</Botao>
          </Link>
        }
      />

      {/* Alerta de Confidencialidade e Regra de Negócio */}
      <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <p className="font-bold">Regra Fundamental de Confidencialidade:</p>
          <p>
            Os professores têm acesso exclusivo à remuneração que lhes é devida pelo seu trabalho pedagógico. Os valores comerciais cobrados aos pais e as margens brutas da plataforma são estritamente confidenciais e exclusivos da administração.
          </p>
        </div>
      </div>

      {/* Tabelas de Remuneração e Margem por Ciclo */}
      <div className="space-y-8">
        {ciclos.map((ciclo) => (
          <Cartao key={ciclo.id} className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CartaoCabecalho className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
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
                      <th className="py-3 px-5 text-center">1h (60m) - Remuneração</th>
                      <th className="py-3 px-5 text-center">1h - Margem TM-Educa</th>
                      <th className="py-3 px-5 text-center">1h30 (90m) - Remuneração</th>
                      <th className="py-3 px-5 text-center">1h30 - Margem TM-Educa</th>
                      <th className="py-3 px-5 text-center">2h (120m) - Remuneração</th>
                      <th className="py-3 px-5 text-center">2h - Margem TM-Educa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {ciclo.anos.map((ano) => {
                      const preco60 = ano.precos.find((p) => p.duracaoMinutos === 60)?.precoPorAulaKz || 0;
                      const remun60 = ano.remuneracoes.find((r) => r.duracaoMinutos === 60)?.remuneracaoPorAulaKz || 0;
                      const margem60 = calcularMargemBruta(preco60, remun60);
                      const pct60 = calcularPercentualMargem(preco60, remun60);

                      const preco90 = ano.precos.find((p) => p.duracaoMinutos === 90)?.precoPorAulaKz || 0;
                      const remun90 = ano.remuneracoes.find((r) => r.duracaoMinutos === 90)?.remuneracaoPorAulaKz || 0;
                      const margem90 = calcularMargemBruta(preco90, remun90);
                      const pct90 = calcularPercentualMargem(preco90, remun90);

                      const preco120 = ano.precos.find((p) => p.duracaoMinutos === 120)?.precoPorAulaKz || 0;
                      const remun120 = ano.remuneracoes.find((r) => r.duracaoMinutos === 120)?.remuneracaoPorAulaKz || 0;
                      const margem120 = calcularMargemBruta(preco120, remun120);
                      const pct120 = calcularPercentualMargem(preco120, remun120);

                      return (
                        <tr key={ano.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                            {ano.nome}
                          </td>

                          {/* 60m */}
                          <td className="py-3.5 px-5 text-center">
                            <EditorRemuneracaoAdmin
                              anoEscolarId={ano.id}
                              anoNome={ano.nome}
                              duracaoMinutos={60}
                              remuneracaoAtualKz={remun60}
                            />
                          </td>
                          <td className="py-3.5 px-5 text-center text-xs">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatarKz(margem60)} ({pct60}%)
                            </span>
                          </td>

                          {/* 90m */}
                          <td className="py-3.5 px-5 text-center">
                            <EditorRemuneracaoAdmin
                              anoEscolarId={ano.id}
                              anoNome={ano.nome}
                              duracaoMinutos={90}
                              remuneracaoAtualKz={remun90}
                            />
                          </td>
                          <td className="py-3.5 px-5 text-center text-xs">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatarKz(margem90)} ({pct90}%)
                            </span>
                          </td>

                          {/* 120m */}
                          <td className="py-3.5 px-5 text-center">
                            <EditorRemuneracaoAdmin
                              anoEscolarId={ano.id}
                              anoNome={ano.nome}
                              duracaoMinutos={120}
                              remuneracaoAtualKz={remun120}
                            />
                          </td>
                          <td className="py-3.5 px-5 text-center text-xs">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatarKz(margem120)} ({pct120}%)
                            </span>
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
    </AmbienteAdmin>
  );
}
