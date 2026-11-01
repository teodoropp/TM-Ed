export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPerfilProfessorLogado } from "@/modulos/professores/consultas";
import { obterAulasProfessor } from "@/modulos/aulas/consultas";
import { CabecalhoPaginaProfessor } from "@/componentes/professores/CabecalhoPaginaProfessor";
import { VisualizadorAgendaProfessor } from "@/componentes/professores/VisualizadorAgendaProfessor";

export const metadata = {
  title: "Minha Agenda | TM-Educa",
};

export default async function PaginaAgendaProfessor() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor/agenda");
  }

  const perfil = await obterPerfilProfessorLogado();
  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-professor/agenda");
  }

  const aulas = await obterAulasProfessor(perfil.id);

  // Mapeia para o formato esperado pelo visualizador
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
      endereco: a.acompanhamento.endereco,
    },
  }));

  return (
    <div className="space-y-6 portal-tipografia">
      <CabecalhoPaginaProfessor
        titulo="Minha Agenda de Aulas"
        descricao="Consulte as suas sessões agendadas, navegue pelos dias da semana e faça a gestão rápida de sumários."
        icone={Calendar}
      />

      <VisualizadorAgendaProfessor aulas={aulasFormatadas} />
    </div>
  );
}
