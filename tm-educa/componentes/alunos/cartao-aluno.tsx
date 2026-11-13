import Link from "next/link";
import { Cartao, CartaoCabecalho, CartaoTitulo, CartaoConteudo, CartaoRodape } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";
import { GraduationCap, School, BookOpen, AlertCircle, Target, ArrowRight, Pencil, CheckCircle2, UserCheck } from "lucide-react";

export interface PropriedadesCartaoAluno {
  aluno: {
    id: string;
    nomeCompleto: string;
    anoEscolar: string;
    sistemaEnsino: string;
    escola: string | null;
    dificuldades: string | null;
    objectivos: string | null;
  };
  temExplicador?: boolean;
  detalheExplicador?: string | null;
}

export function CartaoAluno({ aluno, temExplicador = false, detalheExplicador }: PropriedadesCartaoAluno) {
  return (
    <Cartao className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF2D75]/40 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/90">
      <CartaoCabecalho className="space-y-3 p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF2D75]/15 to-[#FF2D75]/5 text-[#FF2D75] ring-1 ring-[#FF2D75]/20 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CartaoTitulo className="truncate text-base font-semibold text-slate-900 dark:text-white">
                {aluno.nomeCompleto}
              </CartaoTitulo>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <School className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{aluno.escola || "Escola não especificada"}</span>
              </div>
            </div>
          </div>
          <Badge variante="info" className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
            {aluno.anoEscolar}
          </Badge>
        </div>
      </CartaoCabecalho>

      <CartaoConteudo className="flex-1 space-y-2.5 px-5 pb-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2">
          <BookOpen className="h-4 w-4 shrink-0 text-slate-400" />
          <span>
            Sistema:{" "}
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">
              {aluno.sistemaEnsino}
            </strong>
          </span>
        </div>

        {temExplicador && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 p-2 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] font-medium">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {detalheExplicador || "Acompanhamento ativo com explicador"}
            </span>
          </div>
        )}

        {aluno.dificuldades && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50/80 p-2.5 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 border border-amber-100 dark:border-amber-900/40">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span className="line-clamp-2 leading-relaxed">
              <strong>Dificuldades:</strong> {aluno.dificuldades}
            </span>
          </div>
        )}

        {aluno.objectivos && (
          <div className="flex items-start gap-2 rounded-xl bg-blue-50/80 p-2.5 text-blue-900 dark:bg-blue-950/30 dark:text-blue-200 border border-blue-100 dark:border-blue-900/40">
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
            <span className="line-clamp-2 leading-relaxed">
              <strong>Objectivos:</strong> {aluno.objectivos}
            </span>
          </div>
        )}
      </CartaoConteudo>

      <CartaoRodape className="flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80 px-5 py-3.5">
        <Link href={`/portal-encarregado/alunos/${aluno.id}`}>
          <Botao variante="fantasma" tamanho="sm" className="gap-1.5 rounded-xl text-xs hover:text-slate-900 dark:hover:text-white">
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Botao>
        </Link>

        {temExplicador ? (
          <Link href="/portal-encarregado/acompanhamentos">
            <Botao
              variante="contorno"
              tamanho="sm"
              className="gap-1.5 text-xs rounded-xl border-emerald-500/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 transition-all"
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Apoio Ativo
            </Botao>
          </Link>
        ) : (
          <Link href={`/portal-encarregado/pedidos/novo?alunoId=${aluno.id}`}>
            <Botao tamanho="sm" className="gap-1.5 text-xs rounded-xl shadow-sm transition-all hover:scale-102 bg-[#FF2D75] hover:bg-[#E11D48] text-white">
              Solicitar Apoio <ArrowRight className="h-3 w-3" />
            </Botao>
          </Link>
        )}
      </CartaoRodape>
    </Cartao>
  );
}
