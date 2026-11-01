import React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Botao } from "@/componentes/ui/botao";

interface PropsEstadoVazioProfessor {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  acao?: {
    rotulo: string;
    href: string;
  };
}

export function EstadoVazioProfessor({
  icone: Icone,
  titulo,
  descricao,
  acao,
}: PropsEstadoVazioProfessor) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[5px] border border-dashed border-slate-200 bg-white/60 p-8 text-center sm:p-12 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex h-14 w-14 items-center justify-center rounded-[5px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 shadow-xs mb-4">
        <Icone className="h-7 w-7" />
      </div>
      <h3 className="text-base font-medium text-slate-900 dark:text-white">
        {titulo}
      </h3>
      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
        {descricao}
      </p>
      {acao && (
        <div className="mt-5">
          <Link href={acao.href}>
            <Botao className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs rounded-[5px] text-xs font-normal">
              {acao.rotulo}
            </Botao>
          </Link>
        </div>
      )}
    </div>
  );
}
