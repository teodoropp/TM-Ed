export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { obterPerfilEncarregadoLogado } from "@/modulos/encarregados/consultas";
import { acaoAtualizarPerfilEncarregado } from "@/modulos/encarregados/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Input } from "@/componentes/ui/input";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { UserCheck, MapPin, Briefcase, FileText } from "lucide-react";

export const metadata = {
  title: "O Meu Perfil | Portal dos Pais",
};

export default async function PaginaPerfilEncarregado() {
  const perfil = await obterPerfilEncarregadoLogado();

  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-encarregado/perfil");
  }

  async function guardarPerfil(formData: FormData) {
    "use server";
    const nif = formData.get("nif") as string;
    const municipio = formData.get("municipio") as string;
    const bairro = formData.get("bairro") as string;
    const endereco = formData.get("endereco") as string;
    const profissao = formData.get("profissao") as string;

    await acaoAtualizarPerfilEncarregado({
      nif,
      municipio,
      bairro,
      endereco,
      profissao,
    });
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="O Meu Perfil"
        descricao="Mantenha a sua morada e contactos actualizados para o apoio ao domicílio e a emissão de contratos."
        icone={UserCheck}
      />

      <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-xs backdrop-blur-sm sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/90">
        <form action={guardarPerfil} className="space-y-8">
          {/* IDENTIFICAÇÃO */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
              <FileText className="h-4 w-4 text-[#FF2D75]" />
              Identificação
            </legend>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-normal">
                  Nome Completo
                </label>
                <Input value={perfil.utilizador.nomeCompleto} disabled className="bg-slate-50/80 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-normal">
                  Correio Eletrónico
                </label>
                <Input value={perfil.utilizador.email} disabled className="bg-slate-50/80 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-normal">
                  Telefone de Contacto
                </label>
                <Input value={perfil.utilizador.telefone} disabled className="bg-slate-50/80 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-normal">
                  NIF (Número de Identificação Fiscal)
                </label>
                <Input
                  name="nif"
                  defaultValue={perfil.nif || ""}
                  placeholder="Ex.: 541209384LA042"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500 font-normal">
                  <Briefcase className="h-3 w-3" />
                  Profissão
                </label>
                <Input
                  name="profissao"
                  defaultValue={perfil.profissao || ""}
                  placeholder="Ex.: Economista / Engenheiro"
                  className="rounded-xl"
                />
              </div>
            </div>
          </fieldset>

          {/* MORADA */}
          <fieldset className="space-y-4 border-t border-slate-100 pt-6 dark:border-slate-800">
            <legend className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
              <MapPin className="h-4 w-4 text-[#FF2D75]" />
              Morada e Local das Aulas ao Domicílio
            </legend>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-normal">
                  Município de Residência
                </label>
                <Input
                  name="municipio"
                  defaultValue={perfil.municipio || "Luanda"}
                  placeholder="Ex.: Luanda, Talatona, Belas..."
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-normal">
                  Bairro
                </label>
                <Input
                  name="bairro"
                  defaultValue={perfil.bairro || ""}
                  placeholder="Ex.: Alvalade, Miramar, Benfica..."
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-normal">
                  Endereço Detalhado / Pontos de Referência
                </label>
                <Input
                  name="endereco"
                  defaultValue={perfil.endereco || ""}
                  placeholder="Ex.: Rua Comandante Gika, Prédio 45, Apt 3B (junto ao Shopping)"
                  className="rounded-xl"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
            <Botao type="submit" className="min-w-44 shadow-sm rounded-xl transition-all hover:scale-102">
              Guardar Alterações
            </Botao>
          </div>
        </form>
      </div>
    </div>
  );
}
