import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import {
  Brain,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Preparação para Exames Nacionais e Acesso Universitário",
  description:
    "Módulos intensivos de preparação para os Exames Nacionais da 9.ª e 12.ª classe e Exames de Acesso às Universidades em Angola (UAN, ISPTEC, UCAN).",
  alternates: {
    canonical: "/preparacao-exames",
  },
  openGraph: {
    title: "Preparação para Exames Nacionais e Acesso Universitário | TM-Educa",
    description:
      "Módulos intensivos de preparação para os Exames Nacionais da 9.ª e 12.ª classe e Exames de Acesso às Universidades em Angola (UAN, ISPTEC, UCAN).",
    url: "/preparacao-exames",
  },
};

export default function PaginaPreparacaoExames() {
  const modulos = [
    {
      titulo: "Exames Nacionais da 9.ª Classe",
      descricao:
        "Consolidação profunda em Língua Portuguesa, Matemática, Física e Química para conclusão com distinção do I Ciclo do Ensino Secundário.",
      foco: "Revisão e Provas Tipo MED",
    },
    {
      titulo: "Exames Nacionais da 12.ª / 13.ª Classe",
      descricao:
        "Preparação intensiva nas disciplinas nucleares de cada curso (Ciências Físicas e Biológicas, Ciências Económico-Jurídicas e Cursos Politécnicos).",
      foco: "Média de Conclusão de Ensino Médio",
    },
    {
      titulo: "Exames de Acesso à Universidade Agostinho Neto (UAN)",
      descricao:
        "Treino direcionado aos enunciados e critérios de avaliação das faculdades de Medicina, Engenharia, Economia e Direito da UAN.",
      foco: "Resolução de Exames de Anos Anteriores",
    },
    {
      titulo: "Exames de Acesso à Universidade Católica (UCAN) e Privadas",
      descricao:
        "Simulações cronometradas com testes psicotécnicos, raciocínio lógico, cultura geral e provas específicas de admissão.",
      foco: "Estratégia de Resolução Rápida",
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Cabeçalho */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variante="perigo" className="px-3.5 py-1 text-xs">Foco Total em Resultados</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Preparação Rigorosa para Exames e Acesso ao Ensino Superior
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          O momento decisivo do percurso escolar exige estratégia, método e treino intensivo. Os nossos explicadores preparam os estudantes para vencer.
        </p>
      </div>

      {/* Imagem de Destaque Autêntica */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-[16/9] w-full">
        <Image
          src="/imagens/exames.jpg"
          alt="Estudantes angolanos em sessão intensiva de estudo para exames da UAN e exames nacionais"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Taxa de Aprovação de 94.8%
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">Acesso à UAN, ISPTEC e Faculdades de Referência</h3>
          </div>
          <Link href="/portal-encarregado/pedidos/novo">
            <Botao variante="primario" tamanho="md" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">
              Garantir Vaga
            </Botao>
          </Link>
        </div>
      </div>

      {/* Módulos de Preparação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modulos.map((m) => (
          <div
            key={m.titulo}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                {m.foco}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {m.titulo}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {m.descricao}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/portal-encarregado/pedidos/novo"
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                Garantir vaga neste módulo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Como Funcionam os Cursos Intensivos */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Diferenciais do Método TM-Educa nos Exames
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Banco de Provas Reais
            </h4>
            <p>Acesso a mais de 10 anos de provas de exames anteriores de instituições angolanas com resoluções comentadas passo a passo.</p>
          </div>
          <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Simulacros com Cronómetro
            </h4>
            <p>Treino sob as mesmas condições de pressão e tempo limite que o aluno enfrentará na sala oficial de exame.</p>
          </div>
          <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Gestão Emocional e Foco
            </h4>
            <p>Técnicas de concentração, interpretação cuidada dos enunciados e priorização das perguntas de maior cotação.</p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="text-center pt-4">
        <Link href="/portal-encarregado/pedidos/novo">
          <Botao variante="primario" tamanho="lg" className="shadow-xl bg-blue-600 hover:bg-blue-700 font-bold px-8 py-3.5 rounded-2xl gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Inscrever o Meu Filho no Módulo de Exames
          </Botao>
        </Link>
      </div>
    </div>
  );
}
