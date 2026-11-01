export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPerfilProfessorLogado } from "@/modulos/professores/consultas";
import { obterAulasProfessor } from "@/modulos/aulas/consultas";
import { CabecalhoPaginaProfessor } from "@/componentes/professores/CabecalhoPaginaProfessor";
import { VisualizadorAulasProfessor } from "@/componentes/professores/VisualizadorAulasProfessor";

export const metadata = {
  title: "Minhas Aulas | TM-Educa",
};

export default async function PaginaAulasProfessor() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor/aulas");
  }

  const perfil = await obterPerfilProfessorLogado();
  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-professor/aulas");
  }

  const aulas = await obterAulasProfessor(perfil.id);

  const aulasFormatadas = aulas.map((a) => ({
    id: a.id,
    dataHoraInicio: a.dataHoraInicio,
    dataHoraFim: a.dataHoraFim,
    duracaoMinutos: a.duracaoMinutos,
    modalidade: a.modalidade,
    estado: a.estado,
    sumario: a.sumario,
    trabalhosDeCasa: a.trabalhosDeCasa,
    observacoesPedagogicas: a.observacoesPedagogicas,
    remuneracaoPagaKz: a.remuneracaoPagaKz,
    acompanhamento: {
      id: a.acompanhamento.id,
      aluno: {
        id: a.acompanhamento.aluno.id,
        nomeCompleto: a.acompanhamento.aluno.nomeCompleto,
        anoEscolar: a.acompanhamento.aluno.anoEscolar,
      },
      disciplina: {
        id: a.acompanhamento.disciplina.id,
        nome: a.acompanhamento.disciplina.nome,
      },
      encarregado: {
        utilizador: {
          nomeCompleto: a.acompanhamento.encarregado.utilizador.nomeCompleto,
          telefone: a.acompanhamento.encarregado.utilizador.telefone,
        },
      },
      municipio: a.acompanhamento.municipio,
      bairro: a.acompanhamento.bairro,
    },
  }));

  return (
    <div className="space-y-6 portal-tipografia">
      <CabecalhoPaginaProfessor
        titulo="Minhas Aulas & Sumários"
        descricao="Acompanhe o histórico de todas as sessões, filtre por pendências de sumário e registe os conteúdos pedagógicos lecionados."
        icone={BookOpen}
      />

      <VisualizadorAulasProfessor aulas={aulasFormatadas} />
    </div>
  );
}
