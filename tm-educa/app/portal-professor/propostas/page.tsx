export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPerfilProfessorLogado } from "@/modulos/professores/consultas";
import { obterPropostasProfessor } from "@/modulos/pedidos/consultas";
import { CabecalhoPaginaProfessor } from "@/componentes/professores/CabecalhoPaginaProfessor";
import { ListaPropostasProfessor } from "@/componentes/professores/ListaPropostasProfessor";

export const metadata = {
  title: "Propostas de Alunos | TM-Educa",
};

export default async function PaginaPropostasProfessor() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor/propostas");
  }

  const perfil = await obterPerfilProfessorLogado();
  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-professor/propostas");
  }

  const propostas = await obterPropostasProfessor();

  const propostasFormatadas = propostas.map((p) => ({
    id: p.id,
    pontuacaoMatching: p.pontuacaoMatching,
    remuneracaoPorAulaKz: p.remuneracaoPorAulaKz,
    estado: p.estado,
    motivoRecusa: p.motivoRecusa,
    expiraEm: p.expiraEm,
    criadoEm: p.criadoEm,
    pedido: {
      id: p.pedido.id,
      modalidade: p.pedido.modalidade,
      duracaoMinutos: p.pedido.duracaoMinutos,
      frequenciaSemanal: p.pedido.frequenciaSemanal,
      diasSemana: p.pedido.diasSemana,
      horarioPreferencial: p.pedido.horarioPreferencial,
      municipio: p.pedido.municipio,
      bairro: p.pedido.bairro,
      endereco: p.pedido.endereco,
      pontoReferencia: p.pedido.pontoReferencia,
      disciplinasAdicionais: p.pedido.disciplinasAdicionais,
      observacoes: p.pedido.observacoes,
      aluno: {
        id: p.pedido.aluno.id,
        nomeCompleto: p.pedido.aluno.nomeCompleto,
        anoEscolar: p.pedido.anoEscolar?.nome || p.pedido.aluno.anoEscolar || "Ensino Geral",
        sistemaEnsino: p.pedido.aluno.sistemaEnsino || "Geral Angolano",
        escola: p.pedido.aluno.escola || "Não informada",
        dificuldades: p.pedido.aluno.dificuldades || "Acompanhamento geral de reforço escolar",
        objectivos: p.pedido.aluno.objectivos || "Consolidação e melhoria de notas",
        observacoes: p.pedido.aluno.observacoes,
      },
      disciplina: {
        nome: p.pedido.disciplina?.nome || "Geral",
      },
    },
  }));

  return (
    <div className="space-y-6 portal-tipografia">
      <CabecalhoPaginaProfessor
        titulo="Propostas de Novos Alunos"
        descricao="Analise as oportunidades de tutoria recomendadas pelo algoritmo de compatibilidade e aceite novos acompanhamentos."
        icone={Sparkles}
      />

      <ListaPropostasProfessor propostas={propostasFormatadas} />
    </div>
  );
}
