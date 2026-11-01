"use client";

import React, { useState } from "react";
import { acaoEnviarPropostaMatching, acaoAtualizarEstadoPedido } from "@/modulos/pedidos/acoes";
import { ResultadoAvaliacaoDocente } from "@/regras/motor-matching";
import { obterDetalheEstadoPedido } from "@/regras/maquina-estados-pedido";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import { EstadoPedido } from "@prisma/client";
import {
  Award,
  Star,
  MapPin,
  Clock,
  UserCheck,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  History,
} from "lucide-react";

interface PropsPainelMatchingAdmin {
  pedidoId: string;
  estadoAtual: EstadoPedido;
  candidatos: ResultadoAvaliacaoDocente[];
}

export function PainelMatchingAdmin({
  pedidoId,
  estadoAtual,
  candidatos,
}: PropsPainelMatchingAdmin) {
  const [enviandoId, setEnviandoId] = useState<string | null>(null);
  const [alterandoEstado, setAlterandoEstado] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const detalheEstado = obterDetalheEstadoPedido(estadoAtual);

  async function handleEnviarProposta(professorId: string, pontuacao: number) {
    if (!confirm(`Deseja enviar formalmente a proposta de matching a este professor (${pontuacao}% de compatibilidade)?`)) {
      return;
    }

    setEnviandoId(professorId);
    setMensagem(null);

    const res = await acaoEnviarPropostaMatching(pedidoId, professorId, pontuacao);
    setEnviandoId(null);

    if (res.sucesso) {
      setMensagem({ tipo: "sucesso", texto: res.mensagem });
      window.location.reload();
    } else {
      setMensagem({ tipo: "erro", texto: res.mensagem });
    }
  }

  async function handleMudarEstado(novoEstado: EstadoPedido) {
    const motivo = prompt(`Indique a justificativa para alterar o estado para "${novoEstado}":`);
    if (motivo === null) return;

    setAlterandoEstado(true);
    setMensagem(null);

    const res = await acaoAtualizarEstadoPedido(pedidoId, novoEstado, motivo || undefined);
    setAlterandoEstado(false);

    if (res.sucesso) {
      setMensagem({ tipo: "sucesso", texto: res.mensagem });
      window.location.reload();
    } else {
      setMensagem({ tipo: "erro", texto: res.mensagem });
    }
  }

  return (
    <div className="space-y-8">
      {/* Barra de Controlo de Estado */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoConteudo className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Estado Operacional:
            </span>
            <Badge variante={detalheEstado.variante} className="text-xs px-3 py-1">
              {detalheEstado.rotulo}
            </Badge>
            <span className="text-xs text-slate-500 hidden md:inline">
              {detalheEstado.descricao}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {estadoAtual === "EmAnalise" && (
              <Botao
                variante="primario"
                tamanho="sm"
                disabled={alterandoEstado}
                onClick={() => handleMudarEstado(EstadoPedido.AProcurarProfessor)}
              >
                Iniciar Triagem
              </Botao>
            )}

            {estadoAtual === "AProcurarProfessor" && (
              <Botao
                variante="contorno"
                tamanho="sm"
                disabled={alterandoEstado}
                onClick={() => handleMudarEstado(EstadoPedido.SemProfessorDisponivel)}
              >
                Marcar Sem Vaga
              </Botao>
            )}

            {["EmAnalise", "AProcurarProfessor", "SemProfessorDisponivel"].includes(estadoAtual) && (
              <Botao
                variante="fantasma"
                tamanho="sm"
                className="text-rose-600 hover:bg-rose-50"
                disabled={alterandoEstado}
                onClick={() => handleMudarEstado(EstadoPedido.Cancelado)}
              >
                Cancelar Pedido
              </Botao>
            )}
          </div>
        </CartaoConteudo>
      </Cartao>

      {mensagem && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border ${
            mensagem.tipo === "sucesso"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      {/* Lista de Candidatos Ranqueados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ranking de Compatibilidade de Explicadores ({candidatos.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Ordenados pela pontuação do algoritmo TM-Educa (0-100 pts)
          </span>
        </div>

        {candidatos.length === 0 ? (
          <Cartao className="border-slate-200 dark:border-slate-800">
            <CartaoConteudo className="py-12 text-center text-slate-500 text-sm">
              Nenhum explicador ativo cadastrado no sistema no momento.
            </CartaoConteudo>
          </Cartao>
        ) : (
          <div className="space-y-4">
            {candidatos.map((cand, index) => {
              const prof = cand.professor;
              return (
                <Cartao
                  key={prof.perfilId}
                  className={`border transition-all ${
                    cand.apto
                      ? "hover:shadow-md border-slate-200 dark:border-slate-800"
                      : "opacity-60 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <CartaoConteudo className="p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Perfil e Score */}
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black text-lg">
                          #{index + 1}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <h4 className="font-bold text-base text-slate-900 dark:text-white">
                              {prof.nomeCompleto}
                            </h4>
                            {cand.apto ? (
                              <Badge
                                variante={
                                  cand.pontuacaoTotal >= 80
                                    ? "sucesso"
                                    : cand.pontuacaoTotal >= 60
                                    ? "info"
                                    : "aviso"
                                }
                                className="text-xs"
                              >
                                {cand.pontuacaoTotal}% Compatível
                              </Badge>
                            ) : (
                              <Badge variante="perigo" className="text-xs">
                                Inapto
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {prof.formacaoAcademica || "Formação Superior"} · {prof.anosExperiencia} anos de experiência
                          </p>
                          <p className="text-xs text-slate-500">
                            {prof.email} · {prof.telefone}
                          </p>
                        </div>
                      </div>

                      {/* Botão de Enviar Proposta */}
                      <div>
                        {cand.apto ? (
                          <Botao
                            tamanho="sm"
                            disabled={enviandoId === prof.perfilId || estadoAtual === "Confirmado"}
                            onClick={() => handleEnviarProposta(prof.perfilId, cand.pontuacaoTotal)}
                            className="gap-2 text-xs w-full sm:w-auto"
                          >
                            {enviandoId === prof.perfilId ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                A Enviar...
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                Submeter Proposta
                              </>
                            )}
                          </Botao>
                        ) : (
                          <span className="text-xs text-rose-500 font-medium">
                            {cand.motivoInaptidao}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Breakdown de Pontuação se Apto */}
                    {cand.apto && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                        <div className="space-y-0.5">
                          <span className="text-slate-400">Avaliação:</span>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {cand.detalhePontuacao.avaliacaoHistorica}/30 pts ({prof.avaliacaoMedia.toFixed(1)} ★)
                          </p>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-slate-400">Proximidade:</span>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {cand.detalhePontuacao.proximidadeGeografica}/25 pts
                          </p>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-slate-400">Experiência:</span>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {cand.detalhePontuacao.experienciaEFormacao}/20 pts
                          </p>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-slate-400">Disponibilidade:</span>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {cand.detalhePontuacao.capacidadeAgenda}/15 pts ({prof.totalAlunosAtivos} alunos)
                          </p>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-slate-400">Assiduidade:</span>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {cand.detalhePontuacao.assiduidadeEHistorico}/10 pts ({prof.totalAulasDadas} aulas)
                          </p>
                        </div>
                      </div>
                    )}
                  </CartaoConteudo>
                </Cartao>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
