export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPerfilProfessorLogado } from "@/modulos/professores/consultas";
import { baseDados } from "@/servicos/base-dados";
import { CabecalhoPaginaProfessor } from "@/componentes/professores/CabecalhoPaginaProfessor";
import { VisualizadorComunicacaoProfessor } from "@/componentes/professores/VisualizadorComunicacaoProfessor";

export const metadata = {
  title: "Comunicação com Encarregados | TM-Educa",
};

export default async function PaginaComunicacaoProfessor() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor/comunicacao");
  }

  const perfil = await obterPerfilProfessorLogado();
  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-professor/comunicacao");
  }

  const acompanhamentos = await baseDados.acompanhamentoServico.findMany({
    where: { professorId: perfil.id },
    include: {
      aluno: true,
      disciplina: true,
      encarregado: {
        include: { utilizador: true },
      },
    },
    orderBy: { criadoEm: "desc" },
  });

  const alunosFormatados = acompanhamentos.map((acomp) => ({
    id: acomp.id,
    codigo: acomp.codigo,
    modalidade: acomp.modalidade,
    disciplina: acomp.disciplina.nome,
    diasSemana: acomp.diasSemana,
    horario: acomp.horarioPreferencial,
    municipio: acomp.municipio,
    bairro: acomp.bairro,
    aluno: {
      nome: acomp.aluno.nomeCompleto,
      anoEscolar: acomp.aluno.anoEscolar,
      escola: acomp.aluno.escola,
    },
    encarregado: {
      nome: acomp.encarregado.utilizador.nomeCompleto,
      email: acomp.encarregado.utilizador.email,
      telefone: acomp.encarregado.utilizador.telefone || "Não informado",
    },
  }));

  return (
    <div className="space-y-6 portal-tipografia">
      <CabecalhoPaginaProfessor
        titulo="Central de Comunicação & Contactos"
        descricao="Comunique diretamente com os encarregados de educação via WhatsApp e chamadas telefónicas e coordene o acompanhamento pedagógico."
        icone={MessageSquare}
      />

      <VisualizadorComunicacaoProfessor
        alunos={alunosFormatados}
        nomeProfessor={perfil.utilizador.nomeCompleto}
      />
    </div>
  );
}
