export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterTodasAulasAdmin, obterEstatisticasAulasAdmin } from "@/modulos/aulas/consultas";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";
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
          {aulas.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Nenhuma aula encontrada na base de dados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 font-semibold text-slate-600 dark:text-slate-400">
                    <th className="p-3.5">Sessão</th>
                    <th className="p-3.5">Aluno & Ciclo</th>
                    <th className="p-3.5">Disciplina</th>
                    <th className="p-3.5">Explicador Titular</th>
                    <th className="p-3.5">Data & Horário</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5">Cobrado (Kz)</th>
                    <th className="p-3.5">Pago Prof (Kz)</th>
                    <th className="p-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {aulas.map((aula) => {
                    const inicio = new Date(aula.dataHoraInicio);
                    const fim = new Date(aula.dataHoraFim);

                    return (
                      <tr
                        key={aula.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          #{aula.numeroSessao}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {aula.acompanhamento.aluno.nomeCompleto}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {aula.acompanhamento.aluno.anoEscolar}
                          </div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap font-medium text-blue-700 dark:text-blue-300">
                          {aula.acompanhamento.disciplina.nome}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            Prof. {aula.acompanhamento.professor.utilizador.nomeCompleto}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {aula.acompanhamento.professor.utilizador.telefone}
                          </div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <div className="text-slate-800 dark:text-slate-200">
                            {inicio.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {inicio.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })} -{" "}
                            {fim.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <Badge
                            variante={
                              aula.estado === "Realizada"
                                ? "sucesso"
                                : aula.estado === "Agendada"
                                ? "info"
                                : aula.estado === "Aluno_Ausente" || aula.estado === "Professor_Ausente"
                                ? "aviso"
                                : "perigo"
                            }
                          >
                            {aula.estado}
                          </Badge>
                        </td>

                        <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900 dark:text-slate-100">
                          {aula.precoCobradoKz.toLocaleString("pt-PT")} Kz
                        </td>

                        <td className="p-3.5 whitespace-nowrap font-semibold text-emerald-700 dark:text-emerald-400">
                          {aula.remuneracaoPagaKz.toLocaleString("pt-PT")} Kz
                        </td>

                        <td className="p-3.5 whitespace-nowrap text-right">
                          <Link href={`/portal-encarregado/aulas/${aula.id}`}>
                            <Botao variante="contorno" tamanho="sm" className="text-xs h-7 px-2.5">
                              Ficha Pedagógica
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
