export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { obterPerfilAdminLogado } from "@/modulos/administradores/consultas";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { FormularioPerfilAdmin } from "@/componentes/admin/formulario-perfil-admin";

export const metadata = {
  title: "O Meu Perfil | Administração TM-Educa",
};

export default async function PaginaAdminPerfil() {
  const perfil = await obterPerfilAdminLogado();

  if (!perfil) {
    redirect("/entrar?callbackUrl=/administracao/perfil");
  }

  return (
    <AmbienteAdmin>
      <CabecalhoPagina
        titulo="O Meu Perfil"
        descricao="Actualize os seus dados de conta e carregue a fotografia apresentada no menu lateral."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "O Meu Perfil" },
        ]}
      />

      <FormularioPerfilAdmin
        perfilInicial={{
          nomeCompleto: perfil.nomeCompleto,
          email: perfil.email,
          telefone: perfil.telefone,
          departamento: perfil.perfilAdmin?.departamento ?? null,
          cargo: perfil.perfilAdmin?.cargo ?? null,
          fotoUrl: perfil.perfilAdmin?.fotoUrl ?? null,
        }}
      />
    </AmbienteAdmin>
  );
}
