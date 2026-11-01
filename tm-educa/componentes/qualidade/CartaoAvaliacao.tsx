import React from "react";
import { Star, User, BookOpen, Calendar, Award } from "lucide-react";
import { Badge } from "@/componentes/ui/badge";

export interface DadosAvaliacaoDocente {
  id: string;
  notaMedia: number;
  qualidadePedagogica: number;
  pontualidade: number;
  comunicacao: number;
  adaptacaoAluno: number;
  profissionalismo: number;
  comentario?: string | null;
  criadoEm: Date | string;
  aluno?: {
    nomeCompleto: string;
  };
  acompanhamento?: {
    disciplina?: {
      nome: string;
    };
  };
  professor?: {
    utilizador?: {
      nomeCompleto: string;
    };
  };
  encarregado?: {
    utilizador?: {
      nomeCompleto: string;
    };
  };
}

interface CartaoAvaliacaoProps {
  avaliacao: DadosAvaliacaoDocente;
  mostrarProfessor?: boolean;
  mostrarEncarregado?: boolean;
}

export function CartaoAvaliacao({
  avaliacao,
  mostrarProfessor = false,
  mostrarEncarregado = false,
}: CartaoAvaliacaoProps) {
  const dataFormatada = new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
  }).format(new Date(avaliacao.criadoEm));

  const dimensoes = [
    { rotulo: "Qualidade Pedagógica", nota: avaliacao.qualidadePedagogica },
    { rotulo: "Pontualidade", nota: avaliacao.pontualidade },
    { rotulo: "Comunicação", nota: avaliacao.comunicacao },
    { rotulo: "Adaptação ao Aluno", nota: avaliacao.adaptacaoAluno },
    { rotulo: "Profissionalismo", nota: avaliacao.profissionalismo },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Cabeçalho do Cartão */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 font-bold text-lg border border-amber-200 dark:border-amber-800">
            {avaliacao.notaMedia.toFixed(1)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <Star
                  key={estrela}
                  className={`w-4 h-4 ${
                    estrela <= Math.round(avaliacao.notaMedia)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 dark:text-slate-700"
                  }`}
                />
              ))}
              <span className="ml-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                ({avaliacao.notaMedia.toFixed(1)}/5)
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              {dataFormatada}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {avaliacao.acompanhamento?.disciplina && (
            <Badge variante="info" className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {avaliacao.acompanhamento.disciplina.nome}
            </Badge>
          )}
          {avaliacao.aluno && (
            <Badge variante="neutro" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {avaliacao.aluno.nomeCompleto}
            </Badge>
          )}
        </div>
      </div>

      {/* Referências de intervenientes se solicitado */}
      {(mostrarProfessor || mostrarEncarregado) && (
        <div className="flex flex-wrap items-center gap-4 py-2 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
          {mostrarProfessor && avaliacao.professor?.utilizador && (
            <span>
              <strong>Explicador:</strong> {avaliacao.professor.utilizador.nomeCompleto}
            </span>
          )}
          {mostrarEncarregado && avaliacao.encarregado?.utilizador && (
            <span>
              <strong>Pais:</strong> {avaliacao.encarregado.utilizador.nomeCompleto}
            </span>
          )}
        </div>
      )}

      {/* Comentário dos Pais */}
      {avaliacao.comentario && (
        <div className="my-4 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <p className="text-sm italic text-slate-700 dark:text-slate-300">
            &ldquo;{avaliacao.comentario}&rdquo;
          </p>
        </div>
      )}

      {/* Grelha de 5 Dimensões Analíticas */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center">
        {dimensoes.map((dim) => (
          <div
            key={dim.rotulo}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800"
          >
            <p className="text-[11px] font-medium text-slate-500 truncate mb-1">
              {dim.rotulo}
            </p>
            <div className="flex items-center justify-center gap-0.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {dim.nota} / 5
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
