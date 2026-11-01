export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { obterAlunoPorId } from "@/modulos/alunos/consultas";
import { FormularioAluno } from "@/componentes/alunos/formulario-aluno";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { UserCheck, Trash2 } from "lucide-react";
import { acaoRemoverAluno } from "@/modulos/alunos/acoes";
import { Botao } from "@/componentes/ui/botao";

export const metadata = {
  title: "Editar Perfil do Filho",
};

interface ParametrosPagina {
  params: Promise<{ id: string }>;
}

export default async function PaginaDetalhesAluno({ params }: ParametrosPagina) {
  const { id } = await params;
  const aluno = await obterAlunoPorId(id);

  if (!aluno) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo={`Editar: ${aluno.nomeCompleto}`}
        descricao="Actualize as informações de ano escolar, escola, dificuldades e objectivos de aprendizagem."
        icone={UserCheck}
        caminho={[
          { rotulo: "Os Meus Filhos", href: "/portal-encarregado/alunos" },
          { rotulo: "Editar Perfil" },
        ]}
        acoes={
          <form
            action={async () => {
              "use server";
              await acaoRemoverAluno(id);
            }}
          >
            <Botao
              type="submit"
              variante="fantasma"
              className="gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-4 w-4" />
              Remover Filho
            </Botao>
          </form>
        }
      />

      <div className="rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
        <FormularioAluno
          alunoInicial={{
            id: aluno.id,
            nomeCompleto: aluno.nomeCompleto,
            dataNascimento: aluno.dataNascimento,
            sexo: aluno.sexo,
            anoEscolar: aluno.anoEscolar,
            sistemaEnsino: aluno.sistemaEnsino,
            escola: aluno.escola,
            dificuldades: aluno.dificuldades,
            objectivos: aluno.objectivos,
            observacoes: aluno.observacoes,
          }}
        />
      </div>
    </div>
  );
}
