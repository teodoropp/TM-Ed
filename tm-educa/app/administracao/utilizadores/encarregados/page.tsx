export const dynamic = "force-dynamic";

import { obterTodosPaissAdmin } from "@/modulos/encarregados/consultas";
import { Badge } from "@/componentes/ui/badge";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Pais | Administração",
};

export default async function PaginaAdminPaiss() {
  const encarregados = await obterTodosPaissAdmin();

  return (
    <AmbienteAdmin>
      <CabecalhoPagina
        titulo={`Pais Registados (${encarregados.length})`}
        descricao="Listagem global de famílias registadas e respetivos filhos tutelados."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Utilizadores", href: "/administracao/utilizadores" },
          { rotulo: "Paiss" },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="p-4">Pais</th>
                <th className="p-4">Contactos</th>
                <th className="p-4">Localização</th>
                <th className="p-4">Filhos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {encarregados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Nenhum pai registado até ao momento.
                  </td>
                </tr>
              ) : (
                encarregados.map((enc) => (
                  <tr key={enc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      {enc.utilizador.nomeCompleto}
                      {enc.profissao && (
                        <div className="text-xs text-slate-400 font-normal">
                          {enc.profissao}
                        </div>
                      )}
                    </td>
                    <td className="p-4 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{enc.utilizador.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{enc.utilizador.telefone}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {enc.municipio || "Não indicado"}
                          {enc.bairro ? `, ${enc.bairro}` : ""}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {enc.alunos.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">0 alunos</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {enc.alunos.map((a) => (
                            <Badge key={a.id} variante="info" className="text-[11px]">
                              {a.nomeCompleto} ({a.anoEscolar})
                            </Badge>
                          ))}
                        </div>
                      )}
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
