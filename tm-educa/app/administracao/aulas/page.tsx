export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterTodasAulasAdmin, obterEstatisticasAulasAdmin } from "@/modulos/aulas/consultas";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";
import { TabelaSupervisaoAulas } from "@/componentes/admin/tabela-supervisao-aulas";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Supervisão Geral de Aulas e Presenças | Administração TM-Educa",
};

export default async function PaginaSupervisaoAulasAdmin() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/aulas");
  }

  const [aulas, stats] = await Promise.all([
    obterTodasAulasAdmin(),
    obterEstatisticasAulasAdmin(),
  ]);

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Supervisão Geral de Aulas e Presenças"
        descricao="Monitorização central de sessões agendadas, validação de sumários curriculares, cancelamentos e reposições."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Aulas" },
        ]}
        acoes={
          <Link href="/administracao/acompanhamentos">
            <Botao variante="contorno" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              Ver Acompanhamentos Ativos
            </Botao>
          </Link>
        }
      />

      {/* Cartões de Indicadores Gerais */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <CartaoKpi rotulo="Total de Sessões" valor={stats.total} tom="neutro" />
        <CartaoKpi rotulo="Agendadas" valor={stats.agendadas} tom="azul" />
        <CartaoKpi rotulo="Realizadas" valor={stats.realizadas} tom="esmeralda" />
        <CartaoKpi rotulo="Falta Aluno" valor={stats.faltasAluno} tom="ambar" />
        <CartaoKpi rotulo="Falta Professor" valor={stats.faltasProfessor} tom="rosa" />
        <CartaoKpi rotulo="Canceladas" valor={stats.canceladas} tom="roxo" />
      </div>

      {/* Tabela de Supervisão */}
      <Cartao>
        <CartaoCabecalho>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CartaoTitulo className="text-lg">Registo de Sessões Operacionais</CartaoTitulo>
              <CartaoDescricao>
                Histórico detalhado das 100 sessões mais recentes com valores faturados e remunerações auditadas.
              </CartaoDescricao>
            </div>
            <Badge variante="info">{aulas.length} Aulas Carregadas</Badge>
          </div>
        </CartaoCabecalho>

        <CartaoConteudo className="p-0">
          <TabelaSupervisaoAulas aulas={aulas as any} />
        </CartaoConteudo>
      </Cartao>
    </AmbienteAdmin>
  );
}
