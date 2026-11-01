export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterCiclosComAnos, obterTodasDisciplinasAdmin } from "@/modulos/catalogo/consultas";
import { Cartao, CartaoCabecalho, CartaoTitulo, CartaoDescricao, CartaoConteudo } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";
import { BookOpen, DollarSign, Wallet, ArrowRight, Layers, GraduationCap, CheckCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Catálogo Escolar e Preçário | Administração TM-Educa",
};

export default async function PaginaAdminCatalogo() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/catalogo");
  }

  const ciclos = await obterCiclosComAnos();
  const disciplinas = await obterTodasDisciplinasAdmin();

  const totalAnos = ciclos.reduce((acc, c) => acc + c.anos.length, 0);
  const totalDisciplinasAtivas = disciplinas.filter((d) => d.activo).length;

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Catálogo Curricular e Política de Preços"
        descricao="Gestão da estrutura académica, disciplinas lecionadas, tabela oficial de preços aos encarregados e remunerações de professores."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Catálogo" },
        ]}
      />

      {/* Resumo em Cartões */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CartaoKpi
          rotulo="Ciclos e Anos Escolares"
          valor={`${ciclos.length} Ciclos (${totalAnos} Anos)`}
          detalhe="Do 1.º Ano ao 12.º Ano de Escolaridade"
          tom="esmeralda"
          icone={<Layers className="h-4 w-4" />}
        />

        <CartaoKpi
          rotulo="Disciplinas Curriculares"
          valor={`${disciplinas.length} Cadastradas`}
          detalhe={`${totalDisciplinasAtivas} disciplinas ativas para pedidos`}
          tom="azul"
          icone={<BookOpen className="h-4 w-4" />}
        />

        <CartaoKpi
          rotulo="Regulamentação Comercial"
          valor="100% Homologado"
          detalhe="Preçário oficial ativo em Kwanzas (Kz)"
          tom="neutro"
          icone={<CheckCircle className="h-4 w-4" />}
        />
      </div>

      {/* Áreas de Gestão Operacional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cartão 1: Tabela Oficial de Preços */}
        <Cartao className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <CartaoCabecalho>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
              <DollarSign className="w-6 h-6" />
            </div>
            <CartaoTitulo className="text-lg font-bold">Tabela de Preços (Clientes)</CartaoTitulo>
            <CartaoDescricao>
              Consulte e edite os valores cobrados aos pais por aula (1h, 1h30 e 2h) e teste simulações.
            </CartaoDescricao>
          </CartaoCabecalho>
          <CartaoConteudo className="pt-0">
            <Link href="/administracao/catalogo/precos">
              <Botao className="w-full gap-2">
                Gerir Preçário Oficial
                <ArrowRight className="w-4 h-4" />
              </Botao>
            </Link>
          </CartaoConteudo>
        </Cartao>

        {/* Cartão 2: Remunerações de Professores */}
        <Cartao className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <CartaoCabecalho>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3">
              <Wallet className="w-6 h-6" />
            </div>
            <CartaoTitulo className="text-lg font-bold">Remunerações & Margens</CartaoTitulo>
            <CartaoDescricao>
              Defina o valor pago aos explicadores por sessão, visualize margens brutas da plataforma e rentabilidade por ciclo.
            </CartaoDescricao>
          </CartaoCabecalho>
          <CartaoConteudo className="pt-0">
            <Link href="/administracao/catalogo/remuneracoes">
              <Botao variante="secundario" className="w-full gap-2">
                Gerir Remunerações
                <ArrowRight className="w-4 h-4" />
              </Botao>
            </Link>
          </CartaoConteudo>
        </Cartao>

        {/* Cartão 3: Disciplinas Curriculares */}
        <Cartao className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <CartaoCabecalho>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <CartaoTitulo className="text-lg font-bold">Disciplinas Curriculares</CartaoTitulo>
            <CartaoDescricao>
              Adicione novas disciplinas escolares, ative ou desative opções disponíveis para solicitação de explicações.
            </CartaoDescricao>
          </CartaoCabecalho>
          <CartaoConteudo className="pt-0">
            <Link href="/administracao/catalogo/disciplinas">
              <Botao variante="contorno" className="w-full gap-2">
                Gerir Disciplinas
                <ArrowRight className="w-4 h-4" />
              </Botao>
            </Link>
          </CartaoConteudo>
        </Cartao>
      </div>

      {/* Ciclos e Anos Cadastrados no Sistema */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoCabecalho>
          <CartaoTitulo className="text-base font-bold">Estrutura Curricular Homologada</CartaoTitulo>
          <CartaoDescricao>Ciclos do Sistema de Educação e Ensino de Angola</CartaoDescricao>
        </CartaoCabecalho>
        <CartaoConteudo>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ciclos.map((ciclo) => (
              <div key={ciclo.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{ciclo.nome}</h3>
                  <Badge variante="neutro" className="text-xs">{ciclo.anos.length} Anos</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ciclo.anos.map((ano) => (
                    <span
                      key={ano.id}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {ano.nome}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CartaoConteudo>
      </Cartao>
    </AmbienteAdmin>
  );
}
