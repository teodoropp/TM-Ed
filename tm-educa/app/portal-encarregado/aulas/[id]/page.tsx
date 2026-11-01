export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterAulaPorId } from "@/modulos/aulas/consultas";
import { FichaAulaPedagogica } from "@/componentes/aulas/FichaAulaPedagogica";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Ficha Pedagógica da Aula | Portal dos Pais TM-Educa",
};

interface PaginaParametros {
  params: Promise<{ id: string }>;
}

export default async function PaginaDetalheAulaEncarregado({ params }: PaginaParametros) {
  const { id } = await params;
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || (utilizador.funcao !== "ENCARREGADO" && utilizador.funcao !== "ADMINISTRADOR")) {
    redirect(`/entrar?callbackUrl=/portal-encarregado/aulas/${id}`);
  }

  const aula = await obterAulaPorId(id);
  if (!aula) {
    notFound();
  }

  // Validação: apenas o encarregado responsável pelo filho ou o administrador podem aceder
  if (
    utilizador.funcao === "ENCARREGADO" &&
    aula.acompanhamento.encarregado.utilizadorId !== utilizador.id
  ) {
    redirect("/portal-encarregado/acompanhamentos");
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <FichaAulaPedagogica aula={aula} />
    </div>
  );
}
