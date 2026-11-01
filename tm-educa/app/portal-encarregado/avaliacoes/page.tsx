export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterAcompanhamentosParaAvaliar } from "@/modulos/qualidade/consultas";
import { CartaoAvaliacao } from "@/componentes/qualidade/CartaoAvaliacao";
import { FormularioAvaliarProfessor } from "@/componentes/qualidade/FormularioAvaliarProfessor";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { EstadoVazioPais } from "@/componentes/encarregados/EstadoVazioPais";
import { Star, Award, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Avaliações de Explicadores | Portal dos Pais",
};

export default async function PaginaAvaliacoesEncarregado() {
  const utilizador = await obterUtilizadorAutenticado();

  if (
    !utilizador ||
    utilizador.funcao !== "ENCARREGADO" ||
    !utilizador.perfilEncarregado
  ) {
    redirect("/entrar?callbackUrl=/portal-encarregado/avaliacoes");
  }

  const acompanhamentos = await obterAcompanhamentosParaAvaliar(
    utilizador.perfilEncarregado.id
  );

  const pendentesDeAvaliacao = acompanhamentos.filter(
    (ac) => ac.avaliacoes.length === 0
  );

  const avaliados = acompanhamentos.flatMap((ac) =>
    ac.avaliacoes.map((av) => ({
      ...av,
      aluno: ac.aluno,
      acompanhamento: { disciplina: ac.disciplina },
      professor: ac.professor ? { utilizador: ac.professor.utilizador } : undefined,
    }))
  );

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Avaliação dos Explicadores"
        descricao="Avalie o desempenho nas 5 dimensões pedagógicas e ajude-nos a manter a excelência educativa da rede."
        icone={Star}
        acoes={
          <Link href="/portal-encarregado/ocorrencias">
            <Botao variante="contorno" className="gap-2 text-xs">
              <AlertCircle className="h-4 w-4 text-rose-500" />
              Gestão de Ocorrências
            </Botao>
          </Link>
        }
      />

      {/* PENDENTES */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base text-slate-900 dark:text-white">
            <Award className="h-4 w-4 text-[#FF2D75]" />
            Por Avaliar
          </h2>
          <Badge variante={pendentesDeAvaliacao.length > 0 ? "aviso" : "sucesso"}>
            {pendentesDeAvaliacao.length} pendente
            {pendentesDeAvaliacao.length === 1 ? "" : "s"}
          </Badge>
        </div>

        {pendentesDeAvaliacao.length === 0 ? (
          <EstadoVazioPais
            icone={CheckCircle2}
            tom="sucesso"
            titulo="Não tem avaliações pendentes"
            descricao="Todos os seus explicadores já foram avaliados com sucesso. Obrigado por manter a qualidade da rede."
          />
        ) : (
          <div className="space-y-6">
            {pendentesDeAvaliacao.map((ac) => (
              <FormularioAvaliarProfessor
                key={ac.id}
                acompanhamentoId={ac.id}
                nomeProfessor={ac.professor?.utilizador.nomeCompleto || "Explicador"}
                nomeAluno={ac.aluno.nomeCompleto}
                disciplina={ac.disciplina.nome}
              />
            ))}
          </div>
        )}
      </section>

      {/* HISTÓRICO */}
      <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base text-slate-900 dark:text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Avaliações Realizadas
          </h2>
          <Badge variante="neutro">{avaliados.length} submetidas</Badge>
        </div>

        {avaliados.length === 0 ? (
          <EstadoVazioPais
            icone={Star}
            titulo="Ainda não submeteu avaliações"
            descricao="Assim que avaliar um explicador, o seu parecer fica registado aqui e ajuda outras famílias a decidir."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {avaliados.map((av) => (
              <CartaoAvaliacao
                key={av.id}
                avaliacao={av}
                mostrarProfessor={true}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
