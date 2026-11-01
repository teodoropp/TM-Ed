import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import {
  GraduationCap,
  ShieldCheck,
  DollarSign,
  Calendar,
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  Briefcase,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Candidaturas e Rede de Professores",
  description:
    "Junte-se à equipa de explicadores credenciados da TM-Educa em Luanda. Remunerações justas, pontualidade de pagamento e prestígio profissional.",
  alternates: {
    canonical: "/professores",
  },
  openGraph: {
    title: "Candidaturas e Rede de Professores | TM-Educa",
    description:
      "Junte-se à equipa de explicadores credenciados da TM-Educa em Luanda. Remunerações justas, pontualidade de pagamento e prestígio profissional.",
    url: "/professores",
  },
};

export default function PaginaProfessores() {
  const criterios = [
    {
      titulo: "Qualificação Académica Verificada",
      descricao: "Licenciatura, mestrado ou frequência avançada em cursos de docência, ciências exatas, engenharias ou letras.",
    },
    {
      titulo: "Vocação Didática & Paciência",
      descricao: "Capacidade comprovada de explicar conceitos complexos de forma simples e adaptar-se ao ritmo de cada estudante.",
    },
    {
      titulo: "Idoneidade Moral & Rigor",
      descricao: "Apresentação obrigatória de registo criminal limpo e referências académicas ou profissionais auditadas.",
    },
    {
      titulo: "Pontualidade e Assiduidade Rigorosa",
      descricao: "Cumprimento escrupuloso dos horários de sessões marcadas com as famílias ao domicílio ou online.",
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Cabeçalho */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variante="sucesso">Corpo de Explicadores de Elite</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          A Comunidade de Professores Mais Respeitada de Angola
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Valorizamos quem ensina. Na TM-Educa, os explicadores têm remunerações justas e atempadas, suporte pedagógico e o respeito que a carreira de explicador merece.
        </p>
      </div>

      {/* Vantagens para o Professor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Pagamentos Pontuais e Transparentes
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Folhas de remuneração oficiais com valores calculados com base estrita nas aulas lecionadas. Liquidação bancária direta para o seu IBAN no início de cada mês.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Flexibilidade de Horários
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            É o professor quem define a sua grelha semanal de disponibilidade e zonas de atendimento em Luanda (Talatona, Camama, Kilamba, Maianga, etc.).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Reputação e Reconhecimento
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Construa o seu perfil oficial com avaliações de 5 estrelas e testemunhos das famílias, aumentando a sua procura e prioridade de matching para novos alunos.
          </p>
        </div>
      </div>

      {/* Critérios de Recrutamento */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Badge variante="aviso">Processo de Admissão</Badge>
          <h2 className="text-2xl font-bold">O Que Procuramos nos Nossos Candidatos</h2>
          <p className="text-xs text-slate-400">
            Apenas os melhores profissionais integram o corpo de explicadores da TM-Educa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {criterios.map((criterio) => (
            <div
              key={criterio.titulo}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5"
            >
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {criterio.titulo}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {criterio.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA de Candidatura */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Deseja Fazer Parte da Equipa Pedagógica?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Crie a sua conta de explicador, preencha as suas habilitações literárias e disponibilidade. A nossa coordenação entrará em contacto para entrevista e aula-teste.
        </p>
        <div className="pt-2">
          <Link href="/registar">
            <Botao variante="primario" tamanho="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg px-8 gap-2">
              <Briefcase className="w-4 h-4" />
              Submeter Candidatura de Explicador
            </Botao>
          </Link>
        </div>
      </div>
    </div>
  );
}
