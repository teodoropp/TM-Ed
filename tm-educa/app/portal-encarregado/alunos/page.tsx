export const dynamic = "force-dynamic";

import Link from "next/link";
import { obterMeusAlunos } from "@/modulos/alunos/consultas";
import { obterMeusAcompanhamentosEncarregado } from "@/modulos/contratos/consultas";
import { CartaoAluno } from "@/componentes/alunos/cartao-aluno";
import { Botao } from "@/componentes/ui/botao";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { EstadoVazioPais } from "@/componentes/encarregados/EstadoVazioPais";
import { PlusCircle, Users } from "lucide-react";

export const metadata = {
  title: "Os Meus Filhos | Portal dos Pais",
};

export default async function PaginaMeusAlunos() {
  const [alunos, acompanhamentos] = await Promise.all([
    obterMeusAlunos(),
    obterMeusAcompanhamentosEncarregado(),
  ]);

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Os Meus Filhos"
        descricao="Gerencie o percurso pedagógico dos filhos sob a sua responsabilidade familiar: ano escolar, escola, dificuldades e objectivos de aprendizagem."
        icone={Users}
        acoes={
          <Link href="/portal-encarregado/alunos/novo">
            <Botao className="gap-2 shadow-sm rounded-xl transition-all hover:scale-102">
              <PlusCircle className="h-4 w-4" />
              Adicionar Filho
            </Botao>
          </Link>
        }
      />

      {alunos.length === 0 ? (
        <EstadoVazioPais
          icone={Users}
          titulo="Nenhum filho registado"
          descricao="Registe o perfil escolar do seu filho para solicitar explicações ao domicílio ou em sessões online interativas."
          acao={{
            rotulo: "Registar Primeiro Filho",
            href: "/portal-encarregado/alunos/novo",
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {alunos.map((aluno) => {
            const acompAtivo = acompanhamentos.find(
              (a) => a.alunoId === aluno.id && a.estado === "Activo"
            );
            return (
              <CartaoAluno
                key={aluno.id}
                aluno={aluno}
                temExplicador={!!acompAtivo}
                detalheExplicador={
                  acompAtivo
                    ? `Prof. ${acompAtivo.professor?.utilizador.nomeCompleto.split(" ")[0]} · ${acompAtivo.disciplina.nome}`
                    : null
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
