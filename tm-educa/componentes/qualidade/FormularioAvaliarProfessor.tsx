"use client";

import React, { useState } from "react";
import { Star, Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Botao } from "@/componentes/ui/botao";
import { acaoSubmeterAvaliacaoProfessor } from "@/modulos/qualidade/acoes";

interface FormularioAvaliarProfessorProps {
  acompanhamentoId: string;
  nomeProfessor: string;
  nomeAluno: string;
  disciplina: string;
  aoSucesso?: () => void;
}

export function FormularioAvaliarProfessor({
  acompanhamentoId,
  nomeProfessor,
  nomeAluno,
  disciplina,
  aoSucesso,
}: FormularioAvaliarProfessorProps) {
  const [qualidadePedagogica, setQualidadePedagogica] = useState(5);
  const [pontualidade, setPontualidade] = useState(5);
  const [comunicacao, setComunicacao] = useState(5);
  const [adaptacaoAluno, setAdaptacaoAluno] = useState(5);
  const [profissionalismo, setProfissionalismo] = useState(5);
  const [comentario, setComentario] = useState("");
  const [visivelPublicamente, setVisivelPublicamente] = useState(true);

  const [aSubmeter, setASubmeter] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const mediaAtual = (
    (qualidadePedagogica + pontualidade + comunicacao + adaptacaoAluno + profissionalismo) /
    5
  ).toFixed(1);

  const dimensoes = [
    {
      id: "qualidadePedagogica",
      titulo: "Qualidade Pedagógica e Domínio da Matéria",
      descricao: "Clareza na explicação dos conceitos e eficácia dos métodos de estudo.",
      valor: qualidadePedagogica,
      setValor: setQualidadePedagogica,
    },
    {
      id: "pontualidade",
      titulo: "Pontualidade e Assiduidade",
      descricao: "Cumprimento rigoroso do horário agendado e duração da sessão de apoio.",
      valor: pontualidade,
      setValor: setPontualidade,
    },
    {
      id: "comunicacao",
      titulo: "Comunicação e Relacionamento",
      descricao: "Transparência no contacto com a família e partilha da evolução do aluno.",
      valor: comunicacao,
      setValor: setComunicacao,
    },
    {
      id: "adaptacaoAluno",
      titulo: "Adaptação ao Ritmo e Dificuldades do Aluno",
      descricao: "Paciência, personalização pedagógica e estímulo da autoconfiança escolar.",
      valor: adaptacaoAluno,
      setValor: setAdaptacaoAluno,
    },
    {
      id: "profissionalismo",
      titulo: "Profissionalismo e Postura Ética",
      descricao: "Conduta respeitosa, compromisso deontológico e responsabilidade no centro ou domicílio.",
      valor: profissionalismo,
      setValor: setProfissionalismo,
    },
  ];

  async function manipularSubmissao(e: React.FormEvent) {
    e.preventDefault();
    setASubmeter(true);
    setMensagemSucesso(null);
    setMensagemErro(null);

    try {
      const resposta = await acaoSubmeterAvaliacaoProfessor({
        acompanhamentoId,
        notas: {
          qualidadePedagogica,
          pontualidade,
          comunicacao,
          adaptacaoAluno,
          profissionalismo,
        },
        comentario,
        visivelPublicamente,
      });

      if (resposta.sucesso) {
        setMensagemSucesso(resposta.mensagem);
        if (aoSucesso) aoSucesso();
      } else {
        setMensagemErro(resposta.mensagem);
      }
    } catch {
      setMensagemErro("Ocorreu um erro inesperado ao submeter a avaliação.");
    } finally {
      setASubmeter(false);
    }
  }

  if (mensagemSucesso) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
          Avaliação Concluída!
        </h4>
        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
          {mensagemSucesso}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={manipularSubmissao}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6"
    >
      {/* Resumo do Acompanhamento */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Avaliação de Desempenho do Explicador
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Explicador: <strong>{nomeProfessor}</strong> • Disciplina: <strong>{disciplina}</strong> • Aluno: <strong>{nomeAluno}</strong>
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              Média: {mediaAtual} / 5.0
            </span>
          </div>
        </div>
      </div>

      {mensagemErro && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{mensagemErro}</span>
        </div>
      )}

      {/* 5 Dimensões Analíticas */}
      <div className="space-y-4">
        {dimensoes.map((dim) => (
          <div
            key={dim.id}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {dim.titulo}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{dim.descricao}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  type="button"
                  onClick={() => dim.setValor(estrela)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  title={`${estrela} estrela${estrela > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      estrela <= dim.valor
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 dark:text-slate-700 hover:text-amber-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold w-4 text-center text-slate-700 dark:text-slate-300">
                {dim.valor}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Comentário qualitativo */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Comentário e Testemunho Pedagógico (Opcional)
        </label>
        <textarea
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Partilhe a experiência da sua família com este explicador, os pontos fortes ou áreas em que o aluno demonstrou maior evolução..."
          className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Opção de visibilidade */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`visivel-${acompanhamentoId}`}
          checked={visivelPublicamente}
          onChange={(e) => setVisivelPublicamente(e.target.checked)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
        />
        <label
          htmlFor={`visivel-${acompanhamentoId}`}
          className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
        >
          Tornar este testemunho público e visível no perfil do explicador
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <Botao
          type="submit"
          variante="primario"
          disabled={aSubmeter}
          className="flex items-center gap-2 px-6"
        >
          <Send className="w-4 h-4" />
          {aSubmeter ? "A submeter avaliação..." : "Gravar e Submeter Avaliação"}
        </Botao>
      </div>
    </form>
  );
}
