export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Banknote } from "lucide-react";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPerfilProfessorLogado } from "@/modulos/professores/consultas";
import { obterFolhasRemuneracaoProfessor } from "@/modulos/financeiro/consultas";
import { obterAulasProfessor } from "@/modulos/aulas/consultas";
import { CabecalhoPaginaProfessor } from "@/componentes/professores/CabecalhoPaginaProfessor";
import {
  VisualizadorRemuneracoesProfessor,
  FolhaRemuneracaoItem,
} from "@/componentes/professores/VisualizadorRemuneracoesProfessor";

export const metadata = {
  title: "Remunerações & Folhas | TM-Educa",
};

export default async function PaginaRemuneracoesProfessor() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor/remuneracoes");
  }

  const perfil = await obterPerfilProfessorLogado();
  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-professor/remuneracoes");
  }

  const [folhas, aulas] = await Promise.all([
    obterFolhasRemuneracaoProfessor(perfil.id),
    obterAulasProfessor(perfil.id),
  ]);

  const folhasFormatadas: FolhaRemuneracaoItem[] = folhas.map((f) => ({
    id: f.id,
    codigoFolha: f.codigoFolha,
    mesReferencia: f.mesReferencia,
    totalAulasElegiveis: f.totalAulasElegiveis,
    valorBrutoKz: f.valorBrutoKz,
    valorLiquidoKz: f.valorLiquidoKz,
    estado: f.estado,
    dataLiquidacao: f.dataLiquidacao,
    observacoes: f.observacoes,
  }));

  const aulasFormatadas = aulas.map((a) => ({
    id: a.id,
    dataHoraInicio: a.dataHoraInicio,
    duracaoMinutos: a.duracaoMinutos,
    estado: a.estado,
    remuneracaoPagaKz: a.remuneracaoPagaKz,
    acompanhamento: {
      aluno: {
        nomeCompleto: a.acompanhamento.aluno.nomeCompleto,
        anoEscolar: a.acompanhamento.aluno.anoEscolar,
      },
      disciplina: {
        nome: a.acompanhamento.disciplina.nome,
      },
    },
  }));

  return (
    <div className="space-y-6 portal-tipografia">
      <CabecalhoPaginaProfessor
        titulo="Remunerações & Folhas de Pagamento"
        descricao="Consulte os seus proventos acumulados, recibos mensais fechados pela contabilidade e o extrato detalhado por cada sessão ministrada."
        icone={Banknote}
      />

      <VisualizadorRemuneracoesProfessor folhas={folhasFormatadas} aulas={aulasFormatadas} />
    </div>
  );
}
