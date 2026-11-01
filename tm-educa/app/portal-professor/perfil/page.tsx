export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { UserCheck } from "lucide-react";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPerfilProfessorLogado } from "@/modulos/professores/consultas";
import { obterDisciplinasAtivas } from "@/modulos/catalogo/consultas";
import { CabecalhoPaginaProfessor } from "@/componentes/professores/CabecalhoPaginaProfessor";
import { VisualizadorPerfilProfessor } from "@/componentes/professores/VisualizadorPerfilProfessor";

export const metadata = {
  title: "Perfil Profissional | TM-Educa",
};

export default async function PaginaPerfilProfessor() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor/perfil");
  }

  const [perfil, disciplinasCatalogo] = await Promise.all([
    obterPerfilProfessorLogado(),
    obterDisciplinasAtivas(),
  ]);
  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-professor/perfil");
  }

  const disciplinasDisponiveis = disciplinasCatalogo.map((d) => ({
    id: d.id,
    nome: d.nome,
  }));

  const dadosPerfil = {
    id: perfil.id,
    fotoUrl: perfil.fotoUrl,
    biografia: perfil.biografia,
    formacaoAcademica: perfil.formacaoAcademica,
    anosExperiencia: perfil.anosExperiencia,
    estado: perfil.estado,
    avaliacaoMedia: perfil.avaliacaoMedia,
    totalAulasDadas: perfil.totalAulasDadas,
    utilizador: {
      nomeCompleto: perfil.utilizador.nomeCompleto,
      email: perfil.utilizador.email,
      telefone: perfil.utilizador.telefone,
    },
    disponibilidades: (perfil.disponibilidades || []).map((d) => ({
      diaSemana: d.diaSemana,
      horaInicio: d.horaInicio,
      horaFim: d.horaFim,
      activo: d.activo,
    })),
    zonasAtendimento: (perfil.zonasAtendimento || []).map((z) => ({
      id: z.id,
      municipio: z.municipio,
      bairro: z.bairro,
    })),
    disciplinasLecionadas: (perfil.disciplinasLecionadas || []).map((dl) => ({
      id: dl.id,
      disciplinaId: dl.disciplinaId,
      disciplina: {
        nome: dl.disciplina.nome,
        descricao: dl.disciplina.descricao,
      },
    })),
  };

  return (
    <div className="space-y-6 portal-tipografia">
      <CabecalhoPaginaProfessor
        titulo="Perfil Profissional & Credenciação"
        descricao="Gerencie a sua apresentação aos encarregados, formação académica, disciplinas habilitadas e a cobertura de atendimento em Luanda."
        icone={UserCheck}
      />

      <VisualizadorPerfilProfessor
        perfil={dadosPerfil}
        disciplinasDisponiveis={disciplinasDisponiveis}
      />
    </div>
  );
}
