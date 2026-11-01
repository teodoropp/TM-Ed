export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPerfilProfessorLogado, obterAcompanhamentosProfessor } from "@/modulos/professores/consultas";
import { CabecalhoPaginaProfessor } from "@/componentes/professores/CabecalhoPaginaProfessor";
import { VisualizadorAlunosProfessor } from "@/componentes/professores/VisualizadorAlunosProfessor";

export const metadata = {
  title: "Os Meus Alunos | TM-Educa",
};

export default async function PaginaAlunosProfessor() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor/alunos");
  }

  const perfil = await obterPerfilProfessorLogado();
  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-professor/alunos");
  }

  const acompanhamentos = await obterAcompanhamentosProfessor(perfil.id);

  const acompanhamentosFormatados = acompanhamentos.map((acomp) => ({
    id: acomp.id,
    codigo: acomp.codigo,
    modalidade: acomp.modalidade,
    duracaoMinutos: acomp.duracaoMinutos,
    frequenciaSemanal: acomp.frequenciaSemanal,
    diasSemana: acomp.diasSemana,
    horarioPreferencial: acomp.horarioPreferencial,
    municipio: acomp.municipio,
    bairro: acomp.bairro,
    endereco: acomp.endereco,
    estado: acomp.estado,
    aluno: {
      id: acomp.aluno.id,
      nomeCompleto: acomp.aluno.nomeCompleto,
      anoEscolar: acomp.aluno.anoEscolar,
      escola: acomp.aluno.escola,
      dificuldades: acomp.aluno.dificuldades,
      observacoes: acomp.aluno.observacoes,
    },
    disciplina: {
      id: acomp.disciplina.id,
      nome: acomp.disciplina.nome,
    },
    encarregado: {
      utilizador: {
        nomeCompleto: acomp.encarregado.utilizador.nomeCompleto,
        email: acomp.encarregado.utilizador.email,
        telefone: acomp.encarregado.utilizador.telefone,
      },
    },
    aulas: acomp.aulas.map((aula) => ({
      id: aula.id,
      estado: aula.estado,
      dataHoraInicio: aula.dataHoraInicio,
    })),
  }));

  return (
    <div className="space-y-6 portal-tipografia">
      <CabecalhoPaginaProfessor
        titulo="Os Meus Alunos"
        descricao="Consulte os estudantes que acompanha, horários estabelecidos e canais diretos de contacto com os encarregados de educação."
        icone={Users}
      />

      <VisualizadorAlunosProfessor acompanhamentos={acompanhamentosFormatados} />
    </div>
  );
}
