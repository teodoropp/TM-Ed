import React from "react";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { formatarKz } from "@/regras/calculo-preco";
import { GraduationCap, Clock, Award } from "lucide-react";

export interface DadosCicloVisual {
  id: string;
  nome: string;
  ordem: number;
  anos: {
    id: string;
    nome: string;
    ordem: number;
    precos: {
      duracaoMinutos: number;
      precoPorAulaKz: number;
      activo: boolean;
    }[];
  }[];
}

interface PropsTabelaPrecosVisual {
  ciclos: DadosCicloVisual[];
}

export function TabelaPrecosVisual({ ciclos }: PropsTabelaPrecosVisual) {
  return (
    <div className="space-y-10">
      {ciclos.map((ciclo) => (
        <Cartao key={ciclo.id} className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <CartaoCabecalho className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <CartaoTitulo className="text-lg font-bold text-slate-900 dark:text-white">
                    {ciclo.nome}
                  </CartaoTitulo>
                  <CartaoDescricao className="text-xs text-slate-500 dark:text-slate-400">
                    {ciclo.anos.length} Anos Curriculares Abrangidos
                  </CartaoDescricao>
                </div>
              </div>
              <Badge variante="neutro" className="text-xs bg-white dark:bg-slate-900 w-fit">
                Tabela Oficial TM-Educa
              </Badge>
            </div>
          </CartaoCabecalho>

          <CartaoConteudo className="p-0">
            {/* VISTA MOBILE: Layout em cartões individuais por ano para visualização perfeita em telemóveis */}
            <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800/80 p-3 space-y-3">
              {ciclo.anos.map((ano) => {
                const preco60 = ano.precos.find((p) => p.duracaoMinutos === 60)?.precoPorAulaKz || 0;
                const preco90 = ano.precos.find((p) => p.duracaoMinutos === 90)?.precoPorAulaKz || 0;
                const preco120 = ano.precos.find((p) => p.duracaoMinutos === 120)?.precoPorAulaKz || 0;

                return (
                  <div key={ano.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {ano.nome}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">por aula</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* 60 min */}
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">1 Hora</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 whitespace-nowrap">
                          {formatarKz(preco60)}
                        </span>
                      </div>

                      {/* 90 min - Recomendado */}
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/40 relative">
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">1h30</span>
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5 whitespace-nowrap">
                          {formatarKz(preco90)}
                        </span>
                      </div>

                      {/* 120 min */}
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">2 Horas</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 whitespace-nowrap">
                          {formatarKz(preco120)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VISTA DESKTOP E TABLET: Tabela tradicional ampla com scroll suave */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[580px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-5">Ano de Escolaridade</th>
                    <th className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>1 Hora (60 min)</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>1h30 (90 min)</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>2 Horas (120 min)</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {ciclo.anos.map((ano) => {
                    const preco60 = ano.precos.find((p) => p.duracaoMinutos === 60)?.precoPorAulaKz || 0;
                    const preco90 = ano.precos.find((p) => p.duracaoMinutos === 90)?.precoPorAulaKz || 0;
                    const preco120 = ano.precos.find((p) => p.duracaoMinutos === 120)?.precoPorAulaKz || 0;

                    return (
                      <tr key={ano.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-900 dark:text-white flex items-center gap-2 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {ano.nome}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap inline-block">
                            {formatarKz(preco60)}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 whitespace-nowrap inline-block">
                            {formatarKz(preco90)}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap inline-block">
                            {formatarKz(preco120)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CartaoConteudo>
        </Cartao>
      ))}

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
        <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <span>
          <strong>Nota Institucional:</strong> Os valores indicados são por aula/sessão individual. As sessões realizam-se no domicílio do aluno (em Luanda) ou através de sessões online interativas.
        </span>
      </div>
    </div>
  );
}
