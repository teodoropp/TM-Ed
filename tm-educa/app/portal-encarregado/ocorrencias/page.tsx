export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterOcorrenciasPorAutor, obterAcompanhamentosParaAvaliar } from "@/modulos/qualidade/consultas";
import { CartaoOcorrencia } from "@/componentes/qualidade/CartaoOcorrencia";
import { ModalAbrirOcorrencia } from "@/componentes/qualidade/ModalAbrirOcorrencia";
import { Badge } from "@/componentes/ui/badge";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { EstadoVazioPais } from "@/componentes/encarregados/EstadoVazioPais";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Gestão de Ocorrências | Portal dos Pais",
};

export default async function PaginaOcorrenciasEncarregado() {
  const utilizador = await obterUtilizadorAutenticado();

  if (
    !utilizador ||
    utilizador.funcao !== "ENCARREGADO" ||
    !utilizador.perfilEncarregado
  ) {
    redirect("/entrar?callbackUrl=/portal-encarregado/ocorrencias");
  }

  const [ocorrencias, acompanhamentos] = await Promise.all([
    obterOcorrenciasPorAutor(utilizador.id),
    obterAcompanhamentosParaAvaliar(utilizador.perfilEncarregado.id),
  ]);

  const acompanhamentosFormatados = acompanhamentos.map((ac) => ({
    id: ac.id,
    aluno: { nomeCompleto: ac.aluno.nomeCompleto },
    disciplina: { nome: ac.disciplina.nome },
  }));

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Ocorrências e Suporte"
        descricao="Comunique formalmente faltas, incidentes ou contestações directamente à equipa gestora da TM-Educa."
        icone={AlertTriangle}
        acoes={<ModalAbrirOcorrencia acompanhamentos={acompanhamentosFormatados} />}
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base text-slate-900 dark:text-white">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            Minhas Ocorrências
          </h2>
          <Badge variante="neutro">{ocorrencias.length} registadas</Badge>
        </div>

        {ocorrencias.length === 0 ? (
          <EstadoVazioPais
            icone={ShieldAlert}
            tom="sucesso"
            titulo="Nenhuma ocorrência registada"
            descricao="Está tudo em ordem. Caso surja alguma irregularidade, ausência imprevista ou contestação durante as aulas, utilize o botão acima para abrir um processo formal auditado."
          />
        ) : (
          <div className="space-y-4">
            {ocorrencias.map((oco) => (
              <CartaoOcorrencia
                key={oco.id}
                ocorrencia={{
                  ...oco,
                  autor: {
                    nomeCompleto: utilizador.nomeCompleto,
                    funcao: "Pais",
                  },
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
