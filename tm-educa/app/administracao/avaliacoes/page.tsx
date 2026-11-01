export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import {
  obterTodasAvaliacoesAdmin,
  obterEstatisticasQualidadeAdmin,
} from "@/modulos/qualidade/consultas";
import { CartaoAvaliacao } from "@/componentes/qualidade/CartaoAvaliacao";
import { Botao } from "@/componentes/ui/botao";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";
import { Star, Award, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Auditoria Pedagógica e Avaliações | Administração",
};

export default async function PaginaAdminAvaliacoes() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/avaliacoes");
  }

  const [estatisticas, avaliacoes] = await Promise.all([
    obterEstatisticasQualidadeAdmin(),
    obterTodasAvaliacoesAdmin(),
  ]);

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Auditoria Pedagógica & Avaliações de Explicadores"
        descricao="Monitorização contínua das 5 dimensões pedagógicas e nível de satisfação das famílias acompanhadas."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Avaliações de Explicadores" },
        ]}
        acoes={
          <Link href="/administracao/ocorrencias">
            <Botao variante="contorno" className="gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Gestão de Ocorrências
            </Botao>
          </Link>
        }
      />

      {/* Cartões Executivos */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[10px] bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-100 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Índice Médio Global de Qualidade
            </p>
            <p className="text-4xl mt-2">
              {estatisticas.mediaGlobal.toFixed(1)} / 5.0
            </p>
            <p className="text-xs text-amber-100 mt-1">Média consolidada de todas as dimensões</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-[10px] flex items-center justify-center">
            <Star className="w-8 h-8 fill-white text-white" />
          </div>
        </div>

        <CartaoKpi
          rotulo="Volume Total de Avaliações"
          valor={estatisticas.totalAvaliacoes}
          detalhe="Submissões pelos pais"
          tom="azul"
          icone={<Award className="h-4 w-4" />}
        />

        <CartaoKpi
          rotulo="Taxa de Resolução de Casos"
          valor={`${estatisticas.taxaResolucao}%`}
          detalhe="Conformidade e resposta rápida"
          tom="esmeralda"
          icone={<Sparkles className="h-4 w-4" />}
        />
      </section>

      {/* Lista de Avaliações */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Todas as Avaliações Registadas ({avaliacoes.length})
          </h2>
        </div>

        {avaliacoes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <Star className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Ainda não existem avaliações submetidas no sistema.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {avaliacoes.map((av) => (
              <CartaoAvaliacao
                key={av.id}
                avaliacao={av}
                mostrarProfessor={true}
                mostrarEncarregado={true}
              />
            ))}
          </div>
        )}
      </section>
    </AmbienteAdmin>
  );
}
