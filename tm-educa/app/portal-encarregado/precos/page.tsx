export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterTabelaPrecosCompleta } from "@/modulos/precos/consultas";
import { SimuladorPrecos } from "@/componentes/precos/simulador-precos";
import { TabelaPrecosVisual } from "@/componentes/precos/tabela-precos-visual";
import { Botao } from "@/componentes/ui/botao";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { ShieldCheck, Calculator } from "lucide-react";

export const metadata = {
  title: "Preçário e Simulador | Portal dos Pais TM-Educa",
};

export default async function PaginaPrecosEncarregado() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador) {
    redirect("/entrar?callbackUrl=/portal-encarregado/precos");
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
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Preçário e Simulador"
        descricao="Transparência absoluta. Conheça as taxas regulamentadas por aula e simule o investimento mensal para o acompanhamento escolar dos seus filhos."
        icone={Calculator}
        acoes={
          <Link href="/portal-encarregado/alunos">
            <Botao variante="contorno">Ver Meus Filhos</Botao>
          </Link>
        }
      />

      {/* SIMULADOR INTERATIVO */}
      {anosParaSimulador.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-base text-slate-900 dark:text-white">
            <Calculator className="h-4 w-4 text-[#FF2D75]" />
            Simular a Minha Mensalidade
          </h2>
          <SimuladorPrecos dadosAnos={anosParaSimulador} />
        </section>
      )}

      {/* TABELA OFICIAL */}
      <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
        <div>
          <h2 className="flex items-center gap-2 text-base text-slate-900 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Tabela Oficial de Preços por Ciclo de Ensino
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Valores unitários por aula individual no domicílio ou em sessões
            online interativas.
          </p>
        </div>

        <TabelaPrecosVisual ciclos={ciclos} />
      </section>
    </div>
  );
}
