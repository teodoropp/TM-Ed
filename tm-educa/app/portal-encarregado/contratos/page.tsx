export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterEstadoContratualEncarregado } from "@/modulos/contratos/consultas";
import { AssinadorContratoPais } from "@/componentes/contratos/AssinadorContratoPais";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { FileSignature } from "lucide-react";

export const metadata = {
  title: "Contrato de Prestação de Serviços | Portal dos Pais TM-Educa",
};

export default async function PaginaContratoEncarregado() {
  const utilizador = await obterUtilizadorAutenticado();

  if (
    !utilizador ||
    utilizador.funcao !== "ENCARREGADO" ||
    !utilizador.perfilEncarregado
  ) {
    redirect("/entrar?callbackUrl=/portal-encarregado/contratos");
  }

  const estadoContrato = await obterEstadoContratualEncarregado();

  if (!estadoContrato) {
    redirect("/portal-encarregado");
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Contrato de Prestação de Serviços Educativos"
        descricao="Consulte as cláusulas oficiais da Teomilara, anexe a cópia do seu Bilhete de Identidade e formalize a assinatura digital."
        icone={FileSignature}
      />

      <AssinadorContratoPais
        nomePai={utilizador.nomeCompleto}
        telefonePai={utilizador.telefone}
        emailPai={utilizador.email}
        estadoContrato={estadoContrato}
      />
    </div>
  );
}

