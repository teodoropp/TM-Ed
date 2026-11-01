export const dynamic = "force-dynamic";

import { obterTodosAlunosAdmin } from "@/modulos/alunos/consultas";
import { Badge } from "@/componentes/ui/badge";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { User } from "lucide-react";

export const metadata = {
  title: "Alunos Registados | Administração",
};

export default async function PaginaAdminAlunos() {
  const alunos = await obterTodosAlunosAdmin();

  return (
    <AmbienteAdmin>
      <CabecalhoPagina
        titulo={`Alunos Registados na Plataforma (${alunos.length})`}
        descricao="Catálogo geral de alunos tutelados no ecossistema TM-Educa."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Utilizadores", href: "/administracao/utilizadores" },
          { rotulo: "Alunos" },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="p-4">Aluno</th>
                <th className="p-4">Ano Escolar / Sistema</th>
                <th className="p-4">Escola</th>
                <th className="p-4">Pais Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {alunos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Nenhum aluno registado até ao momento.
                  </td>
                </tr>
              ) : (
                alunos.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      {a.nomeCompleto}
                    </td>
                    <td className="p-4 text-xs space-y-1">
                      <Badge variante="info">{a.anoEscolar}</Badge>
                      <div className="text-[11px] text-slate-400">{a.sistemaEnsino}</div>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                      {a.escola || "Não indicada"}
                    </td>
                    <td className="p-4 text-xs space-y-1">
                      <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {a.encarregado.utilizador.nomeCompleto}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {a.encarregado.utilizador.telefone}
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
