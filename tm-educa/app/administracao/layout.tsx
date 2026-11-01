import React from "react";
import type { Metadata } from "next";
import { obterPerfilAdminLogado } from "@/modulos/administradores/consultas";
import { acaoTerminarSessao } from "@/modulos/autenticacao/acoes";
import { ShellAdministracao } from "@/componentes/layout/ShellAdministracao";

export const metadata: Metadata = {
  title: "Administração",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function LayoutAdministracao({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await obterPerfilAdminLogado();

  return (
    <ShellAdministracao
      nomeUtilizador={perfil?.nomeCompleto ?? null}
      emailUtilizador={perfil?.email ?? null}
      fotoUrl={perfil?.perfilAdmin?.fotoUrl ?? null}
      aoTerminarSessao={acaoTerminarSessao}
    >
      {children}
    </ShellAdministracao>
  );
}
