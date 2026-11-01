import { FormularioAluno } from "@/componentes/alunos/formulario-aluno";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { UserPlus } from "lucide-react";

export const metadata = {
  title: "Registar Filho | Portal dos Pais",
};

export default function PaginaNovoAluno() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Registar Novo Filho"
        descricao="Introduza as informações escolares e as necessidades pedagógicas do seu filho. Estes dados são usados para encontrar o explicador ideal."
        icone={UserPlus}
        caminho={[
          { rotulo: "Os Meus Filhos", href: "/portal-encarregado/alunos" },
          { rotulo: "Registar Filho" },
        ]}
      />

      <div className="rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
        <FormularioAluno />
      </div>
    </div>
  );
}
