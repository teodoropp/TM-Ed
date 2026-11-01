export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterTodosAcompanhamentosAdmin } from "@/modulos/contratos/consultas";
import { obterProfessoresAtivosParaSubstituicao } from "@/modulos/professores/consultas";
import { ModalSubstituirProfessor } from "@/componentes/aulas/ModalSubstituirProfessor";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { BookOpen, UserCheck, Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Serviços e Acompanhamentos Ativos | Administração TM-Educa",
};

export default async function PaginaAdminAcompanhamentos() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/acompanhamentos");
  }

  const [acompanhamentos, professoresAtivos] = await Promise.all([
    obterTodosAcompanhamentosAdmin(),
    obterProfessoresAtivosParaSubstituicao(),
  ]);

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Supervisão de Acompanhamentos Escolares"
        descricao="Gestão operacional dos serviços ativos, alocações de explicadores e cronograma de sessões."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Acompanhamentos" },
        ]}
        acoes={
          <>
            <Link href="/administracao/aulas">
              <Botao className="gap-2">
                <Calendar className="w-4 h-4" />
                Supervisão Geral de Aulas
              </Botao>
            </Link>
            <Link href="/administracao/contratos">
              <Botao variante="contorno">Ver Contratos</Botao>
            </Link>
          </>
        }
      />

      {/* Tabela de Acompanhamentos */}
      <Cartao className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <CartaoCabecalho className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 py-3.5">
          <CartaoTitulo className="text-base font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Serviços em Execução ({acompanhamentos.length})
          </CartaoTitulo>
        </CartaoCabecalho>

        <CartaoConteudo className="p-0">
          {acompanhamentos.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Nenhum serviço de acompanhamento em execução no momento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-5">Código / Serviço</th>
                    <th className="py-3 px-5">Aluno & Disciplina</th>
                    <th className="py-3 px-5">Explicador Atribuído</th>
                    <th className="py-3 px-5">Ritmo / Modalidade</th>
                    <th className="py-3 px-5">Aulas no Calendário</th>
                    <th className="py-3 px-5">Estado</th>
                    <th className="py-3 px-5 text-right">Substituição do Explicador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {acompanhamentos.map((acomp) => (
                    <tr key={acomp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {acomp.codigo}
                        </p>
                        {acomp.contrato && (
                          <p className="text-xs text-slate-400">
                            CTR: {acomp.contrato.numeroContrato}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {acomp.aluno.nomeCompleto}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium">
                          {acomp.disciplina.nome}
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          {acomp.professor.utilizador.nomeCompleto}
                        </p>
                        <p className="text-xs text-slate-500">
                          {acomp.professor.utilizador.telefone}
                        </p>
                      </td>

                      <td className="py-4 px-5 text-xs">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {acomp.frequenciaSemanal}x/sem ({acomp.duracaoMinutos}m)
                        </p>
                        <p className="text-slate-500">{acomp.modalidade}</p>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {acomp.aulas.length} Aulas
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {acomp.aulas.filter((a) => a.estado === "Realizada").length} realizadas
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        <Badge
                          variante={
                            acomp.estado === "Activo"
                              ? "sucesso"
                              : acomp.estado === "Suspenso"
                              ? "perigo"
                              : "neutro"
                          }
                          className="text-xs"
                        >
                          {acomp.estado}
                        </Badge>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <ModalSubstituirProfessor
                          acompanhamentoId={acomp.id}
                          codigoAcompanhamento={acomp.codigo}
                          professorAtualNome={acomp.professor.utilizador.nomeCompleto}
                          professoresDisponiveis={professoresAtivos}
                        />
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
