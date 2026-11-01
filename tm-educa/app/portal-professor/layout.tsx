import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShellPortalProfessor } from "@/componentes/professores/ShellPortalProfessor";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { acaoTerminarSessao } from "@/modulos/autenticacao/acoes";
import { baseDados } from "@/servicos/base-dados";

export const metadata: Metadata = {
  title: "Portal do Professor",
  description: "Área exclusiva de explicadores e docentes credenciados da TM-Educa",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function LayoutPortalProfessor({
  children,
}: {
  children: React.ReactNode;
}) {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor");
  }

  const perfilId = utilizador.perfilProfessor.id;

  const agora = new Date();
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0);
  const fimHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59);

  /* Contadores em tempo real para os badges da navegação */
  const [propostasPendentes, aulasHoje] = await Promise.all([
    baseDados.propostaMatching.count({
      where: {
        professorId: perfilId,
        estado: "Pendente",
      },
    }),
    baseDados.aula.count({
      where: {
        acompanhamento: {
          professorId: perfilId,
        },
        dataHoraInicio: {
          gte: inicioHoje,
          lte: fimHoje,
        },
        estado: {
          in: ["Agendada"],
        },
      },
    }),
  ]);

  const contadores = {
    propostas: propostasPendentes,
    aulasHoje,
  };

  return (
    <ShellPortalProfessor
      nomeUtilizador={utilizador.nomeCompleto}
      emailUtilizador={utilizador.email}
      contadores={contadores}
      aoTerminarSessao={acaoTerminarSessao}
    >
      {children}
    </ShellPortalProfessor>
  );
}
