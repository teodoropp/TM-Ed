"use client";

import React, { useState } from "react";
import { acaoCriarDisciplina, acaoAlternarEstadoDisciplina } from "@/modulos/catalogo/acoes";
import { Cartao, CartaoCabecalho, CartaoTitulo, CartaoConteudo } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Input } from "@/componentes/ui/input";
import { Badge } from "@/componentes/ui/badge";
import { PlusCircle, CheckCircle2, XCircle, Loader2, BookOpen } from "lucide-react";

export interface ItemDisciplinaAdmin {
  id: string;
  nome: string;
  descricao: string | null;
  activo: boolean;
  criadoEm: Date;
}

interface PropsGestorDisciplinas {
  disciplinasIniciais: ItemDisciplinaAdmin[];
}

export function GestorDisciplinas({ disciplinasIniciais }: PropsGestorDisciplinas) {
  const [disciplinas, setDisciplinas] = useState<ItemDisciplinaAdmin[]>(disciplinasIniciais);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [aSubmeter, setASubmeter] = useState(false);
  const [carregandoId, setCarregandoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;

    setASubmeter(true);
    setMensagem(null);

    const res = await acaoCriarDisciplina(nome, descricao);
    setASubmeter(false);

    if (res.sucesso) {
      setMensagem({ tipo: "sucesso", texto: res.mensagem });
      setNome("");
      setDescricao("");
      // Recarregar a página para atualizar o estado do servidor
      window.location.reload();
    } else {
      setMensagem({ tipo: "erro", texto: res.mensagem });
    }
  }

  async function handleAlternarEstado(id: string, estadoAtual: boolean) {
    setCarregandoId(id);
    const novoEstado = !estadoAtual;
    const res = await acaoAlternarEstadoDisciplina(id, novoEstado);
    setCarregandoId(null);

    if (res.sucesso) {
      setDisciplinas((prev) =>
        prev.map((d) => (d.id === id ? { ...d, activo: novoEstado } : d))
      );
    } else {
      alert(res.mensagem);
    }
  }

  return (
    <div className="space-y-8">
      {/* Formulário de Nova Disciplina */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoCabecalho className="pb-4">
          <CartaoTitulo className="text-base font-bold flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            Adicionar Nova Disciplina Curricular
          </CartaoTitulo>
        </CartaoCabecalho>
        <CartaoConteudo>
          <form onSubmit={handleCriar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nome da Disciplina *
                </label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Filosofia, Geometria Descritiva, Francês..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Descrição Curricular ou Foco Pedagógico (Opcional)
                </label>
                <Input
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Introdução ao raciocínio lógico e ética..."
                />
              </div>
            </div>

            {mensagem && (
              <div
                className={`p-3 rounded-lg text-xs font-medium ${
                  mensagem.tipo === "sucesso"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {mensagem.texto}
              </div>
            )}

            <div className="flex justify-end">
              <Botao type="submit" disabled={aSubmeter} className="gap-2">
                {aSubmeter ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    A Registar...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Registar Disciplina
                  </>
                )}
              </Botao>
            </div>
          </form>
        </CartaoConteudo>
      </Cartao>

      {/* Lista de Disciplinas */}
      <Cartao className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <CartaoCabecalho className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <CartaoTitulo className="text-base font-bold">
                Disciplinas Curriculares do Catálogo ({disciplinas.length})
              </CartaoTitulo>
            </div>
            <span className="text-xs text-slate-500">
              {disciplinas.filter((d) => d.activo).length} ativas
            </span>
          </div>
        </CartaoCabecalho>

        <CartaoConteudo className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {disciplinas.map((disc) => (
              <div
                key={disc.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {disc.nome}
                    </span>
                    <Badge variante={disc.activo ? "sucesso" : "neutro"}>
                      {disc.activo ? "Ativa" : "Desativada"}
                    </Badge>
                  </div>
                  {disc.descricao && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {disc.descricao}
                    </p>
                  )}
                </div>

                <div>
                  <Botao
                    variante={disc.activo ? "contorno" : "secundario"}
                    tamanho="sm"
                    disabled={carregandoId === disc.id}
                    onClick={() => handleAlternarEstado(disc.id, disc.activo)}
                    className="gap-2 text-xs"
                  >
                    {carregandoId === disc.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : disc.activo ? (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Ativar
                      </>
                    )}
                  </Botao>
                </div>
              </div>
            ))}
          </div>
        </CartaoConteudo>
      </Cartao>
    </div>
  );
}
