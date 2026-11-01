export const dynamic = "force-dynamic";

import { obterTodosProfessoresAdmin } from "@/modulos/professores/consultas";
import { acaoAlterarEstadoProfessorAdmin } from "@/modulos/professores/acoes";
import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { Phone, Mail, MapPin, CheckCircle, ShieldAlert } from "lucide-react";
import { EstadoProfessor } from "@/tipos";

export const metadata = {
  title: "Rede de Professores | Administração",
};

export default async function PaginaAdminProfessores() {
  const professores = await obterTodosProfessoresAdmin();

  return (
    <AmbienteAdmin>
      <CabecalhoPagina
        titulo={`Rede de Professores e Triagem (${professores.length})`}
        descricao="Validação pedagógica, análise de disponibilidade e aprovação de explicadores da TM-Educa."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Utilizadores", href: "/administracao/utilizadores" },
          { rotulo: "Professores" },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="p-4">Professor</th>
                <th className="p-4">Formação / Experiência</th>
                <th className="p-4">Zonas Atendidas</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Ação Administrativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {professores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Nenhum professor registado até ao momento.
                  </td>
                </tr>
              ) : (
                professores.map((prof) => (
                  <tr key={prof.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      {prof.utilizador.nomeCompleto}
                      <div className="text-xs text-slate-400 font-normal space-y-0.5 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{prof.utilizador.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{prof.utilizador.telefone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs space-y-1">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {prof.formacaoAcademica || "Formação não especificada"}
                      </div>
                      <div className="text-slate-400">
                        {prof.anosExperiencia} {prof.anosExperiencia === 1 ? "ano" : "anos"} de experiência
                      </div>
                    </td>
                    <td className="p-4 text-xs">
                      {prof.zonasAtendimento.length === 0 ? (
                        <span className="text-slate-400 italic">Não especificadas</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {prof.zonasAtendimento.map((z) => (
                            <span
                              key={z.id}
                              className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[11px]"
                            >
                              <MapPin className="h-2.5 w-2.5 text-blue-500" />
                              {z.municipio}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variante={
                          prof.estado === "Activo"
                            ? "sucesso"
                            : prof.estado === "Pendente"
                            ? "aviso"
                            : prof.estado === "Suspenso"
                            ? "perigo"
                            : "info"
                        }
                      >
                        {prof.estado}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {prof.estado !== "Activo" && (
                          <form
                            action={async () => {
                              "use server";
                              await acaoAlterarEstadoProfessorAdmin(prof.id, "Activo" as EstadoProfessor);
                            }}
                          >
                            <Botao
                              type="submit"
                              variante="primario"
                              tamanho="sm"
                              className="text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Aprovar / Ativar
                            </Botao>
                          </form>
                        )}
                        {prof.estado === "Activo" && (
                          <form
                            action={async () => {
                              "use server";
                              await acaoAlterarEstadoProfessorAdmin(prof.id, "Suspenso" as EstadoProfessor);
                            }}
                          >
                            <Botao
                              type="submit"
                              variante="fantasma"
                              tamanho="sm"
                              className="text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                              Suspender
                            </Botao>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AmbienteAdmin>
  );
}
