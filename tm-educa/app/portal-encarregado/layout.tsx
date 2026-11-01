import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShellPortalPais } from "@/componentes/encarregados/ShellPortalPais";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterCobrancasEncarregado } from "@/modulos/financeiro/consultas";
import { obterAcompanhamentosParaAvaliar } from "@/modulos/qualidade/consultas";
import { acaoTerminarSessao } from "@/modulos/autenticacao/acoes";

export const metadata: Metadata = {
  title: "Portal dos Pais",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function LayoutPortalEncarregado({
  children,
}: {
  children: React.ReactNode;
}) {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilEncarregado) {
    redirect("/entrar?callbackUrl=/portal-encarregado");
  }

  const perfilId = utilizador.perfilEncarregado.id;

  /* Contadores de pendências exibidos no menu lateral. */
  const [cobrancas, acompanhamentos] = await Promise.all([
    obterCobrancasEncarregado(perfilId),
    obterAcompanhamentosParaAvaliar(perfilId),
  ]);

  const contadores = {
    pagamentos: cobrancas.filter(
      (c) => c.estado === "Pendente" || c.estado === "EmAnalise"
    ).length,
    avaliacoes: acompanhamentos.filter((a) => a.avaliacoes.length === 0).length,
  };

  return (
    <ShellPortalPais
      nomeUtilizador={utilizador.nomeCompleto}
      emailUtilizador={utilizador.email}
      contadores={contadores}
      aoTerminarSessao={acaoTerminarSessao}
    >
      {children}
    </ShellPortalPais>
  );
}
