"use client";

import React, { useState } from "react";
import { acaoResponderPropostaMatching } from "@/modulos/pedidos/acoes";
import { formatarKz } from "@/regras/calculo-preco";
import {
  Cartao,
  CartaoConteudo,
  CartaoCabecalho,
  CartaoTitulo,
  CartaoDescricao,
} from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Eye,
  School,
  BookOpen,
  Target,
  Sparkles,
  Info,
  X,
  UserCheck,
} from "lucide-react";

export interface ItemPropostaProfessor {
  id: string;
  pontuacaoMatching: number;
  remuneracaoPorAulaKz: number;
  estado: string;
  motivoRecusa?: string | null;
  expiraEm?: Date | null;
  criadoEm: Date;
  pedido: {
    id: string;
    modalidade: string;
    duracaoMinutos: number;
    frequenciaSemanal: number;
    diasSemana: string;
    horarioPreferencial: string;
    municipio?: string | null;
    bairro?: string | null;
    endereco?: string | null;
    pontoReferencia?: string | null;
    disciplinasAdicionais?: string | null;
    observacoes?: string | null;
    aluno: {
      id?: string;
      nomeCompleto: string;
      anoEscolar: string;
      sistemaEnsino?: string;
      escola?: string;
      dificuldades?: string;
      objectivos?: string;
      observacoes?: string | null;
    };
    disciplina: {
      nome: string;
    };
  };
}

interface PropsCartaoPropostaProfessor {
  proposta: ItemPropostaProfessor;
}

export function CartaoPropostaProfessor({ proposta }: PropsCartaoPropostaProfessor) {
  const [aSubmeter, setASubmeter] = useState(false);
  const [mostrarModalRecusa, setMostrarModalRecusa] = useState(false);
  const [mostrarModalDetalhes, setMostrarModalDetalhes] = useState(false);
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const ped = proposta.pedido;
  const aluno = ped.aluno;
  const pendente = proposta.estado === "Pendente";

  async function handleResposta(resposta: "ACEITAR" | "RECUSAR") {
    if (resposta === "RECUSAR" && motivoRecusa.trim().length < 5) {
      alert("Por favor, descreva o motivo da recusa (mínimo 5 caracteres).");
      return;
    }

    setASubmeter(true);
    setMensagem(null);

    const res = await acaoResponderPropostaMatching(
      proposta.id,
      resposta,
      resposta === "RECUSAR" ? motivoRecusa : undefined
    );

    setASubmeter(false);

    if (res.sucesso) {
      setMensagem({ tipo: "sucesso", texto: res.mensagem });
      setMostrarModalRecusa(false);
      setMostrarModalDetalhes(false);
      window.location.reload();
    } else {
      setMensagem({ tipo: "erro", texto: res.mensagem });
    }
  }

  return (
    <>
      <Cartao className="rounded-[5px] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-[#07182E] transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <CartaoCabecalho className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[5px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <CartaoTitulo className="text-sm sm:text-base font-normal text-slate-900 dark:text-white">
                  {ped.disciplina.nome} · {aluno.anoEscolar}
                </CartaoTitulo>
                <CartaoDescricao className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                  Aluno: <strong className="font-normal text-slate-800 dark:text-slate-200">{aluno.nomeCompleto}</strong>
                  {aluno.escola && aluno.escola !== "Não informada" && ` (${aluno.escola})`}
                </CartaoDescricao>
              </div>
            </div>

            <Badge
              className={`rounded-[5px] font-normal text-xs px-2.5 py-0.5 shrink-0 ${
                proposta.estado === "Aceite"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : proposta.estado === "Recusada" || proposta.estado === "Rejeitada"
                  ? "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
              }`}
            >
              {proposta.estado === "Pendente" ? "Aguardando a Sua Resposta" : proposta.estado}
            </Badge>
          </div>
        </CartaoCabecalho>

        <CartaoConteudo className="p-4 sm:p-5 space-y-4">
          {/* Informações Resumidas da Aula */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1 p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-normal">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Modalidade
              </span>
              <p className="font-normal text-slate-900 dark:text-white">
                {ped.modalidade === "Domicilio" ? "Presencial (Domicílio)" : ped.modalidade}
              </p>
            </div>

            <div className="space-y-1 p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-normal">
                <Clock className="w-3.5 h-3.5 text-sky-500" /> Duração & Frequência
              </span>
              <p className="font-normal text-slate-900 dark:text-white">
                {ped.duracaoMinutos} min · {ped.frequenciaSemanal}x por semana
              </p>
            </div>

            <div className="space-y-1 p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-normal">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Dias e Horário
              </span>
              <p className="font-normal text-slate-900 dark:text-white truncate" title={`${ped.diasSemana} · ${ped.horarioPreferencial}`}>
                {ped.diasSemana} · {ped.horarioPreferencial}
              </p>
            </div>

            <div className="space-y-1 p-2.5 rounded-[5px] bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-emerald-700 dark:text-emerald-400 font-normal">Sua Remuneração</span>
              <p className="font-normal text-emerald-600 dark:text-emerald-400 text-sm">
                {formatarKz(proposta.remuneracaoPorAulaKz)}{" "}
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">/ aula</span>
              </p>
            </div>
          </div>

          {mensagem && (
            <div
              className={`p-3 rounded-[5px] text-xs font-normal border ${
                mensagem.tipo === "sucesso"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
              }`}
            >
              {mensagem.texto}
            </div>
          )}

          {/* Modal / Formulário Interno de Recusa */}
          {mostrarModalRecusa && pendente && (
            <div className="p-3.5 rounded-[5px] bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs font-normal">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Indique o motivo da indisponibilidade para esta tutoria:</span>
              </div>
              <textarea
                rows={2}
                value={motivoRecusa}
                onChange={(e) => setMotivoRecusa(e.target.value)}
                placeholder="Ex.: Indisponibilidade de horário ou conflito de agenda no turno indicado..."
                className="w-full p-2.5 rounded-[5px] border border-rose-300 dark:border-rose-800 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-normal"
                required
              />
              <div className="flex justify-end gap-2">
                <Botao
                  variante="contorno"
                  tamanho="sm"
                  type="button"
                  onClick={() => setMostrarModalRecusa(false)}
                  className="rounded-[5px] text-xs h-8 px-3 font-normal"
                >
                  Cancelar
                </Botao>
                <Botao
                  tamanho="sm"
                  disabled={aSubmeter}
                  type="button"
                  onClick={() => handleResposta("RECUSAR")}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-[5px] text-xs h-8 px-3 font-normal"
                >
                  {aSubmeter ? "A Registar..." : "Confirmar Recusa"}
                </Botao>
              </div>
            </div>
          )}

          {/* Barra de Ações: Detalhes do Aluno + Recusar + Aceitar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setMostrarModalDetalhes(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#FF2D75] dark:text-rose-400 hover:underline cursor-pointer font-normal w-fit"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Detalhes do Aluno</span>
            </button>

            {pendente && !mostrarModalRecusa && (
              <div className="flex items-center gap-2">
                <Botao
                  variante="contorno"
                  tamanho="sm"
                  disabled={aSubmeter}
                  type="button"
                  onClick={() => setMostrarModalRecusa(true)}
                  className="rounded-[5px] h-8 px-3 text-xs gap-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900 font-normal"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Recusar
                </Botao>

                <Botao
                  tamanho="sm"
                  disabled={aSubmeter}
                  type="button"
                  onClick={() => handleResposta("ACEITAR")}
                  className="rounded-[5px] h-8 px-4 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-normal shadow-sm"
                >
                  {aSubmeter ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      A Aceitar...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aceitar
                    </>
                  )}
                </Botao>
              </div>
            )}
          </div>

          {proposta.estado === "Recusada" && proposta.motivoRecusa && (
            <p className="text-xs text-slate-500 italic font-normal">
              Motivo indicado: &ldquo;{proposta.motivoRecusa}&rdquo;
            </p>
          )}
        </CartaoConteudo>
      </Cartao>

      {/* MODAL DETALHES COMPLETOS DO ALUNO E PEDIDO */}
      {mostrarModalDetalhes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#07182E] rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-8">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[5px] bg-[#FF2D75]/10 text-[#FF2D75] flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-normal text-slate-900 dark:text-white">
                    Ficha Pedagógica do Aluno
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                    Informações completas para avaliação antes de aceitar a proposta
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMostrarModalDetalhes(false)}
                className="p-1.5 rounded-[5px] text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo com Bento de Detalhes */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Bloco 1: Identificação Escolar */}
              <div className="p-4 rounded-[5px] bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <span className="text-xs uppercase tracking-wider font-normal text-slate-400 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-rose-500" />
                  Identificação do Aluno & Percurso Escolar
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-normal">Nome do Estudante</span>
                    <strong className="text-sm font-normal text-slate-900 dark:text-white">
                      {aluno.nomeCompleto}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Ano / Classe</span>
                    <strong className="text-sm font-normal text-slate-900 dark:text-white">
                      {aluno.anoEscolar}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Sistema / Currículo</span>
                    <span className="text-slate-800 dark:text-slate-200 font-normal">
                      {aluno.sistemaEnsino || "Currículo Geral Angolano"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Colégio / Escola Atual</span>
                    <span className="text-slate-800 dark:text-slate-200 font-normal">
                      {aluno.escola || "Não especificado"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco 2: Necessidades & Objetivos Pedagógicos */}
              <div className="p-4 rounded-[5px] bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <span className="text-xs uppercase tracking-wider font-normal text-slate-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Diagnóstico de Necessidades & Metas Pedagógicas
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-normal">Dificuldades Diagnósticas:</span>
                    <p className="p-2.5 rounded-[5px] bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-normal mt-1">
                      {aluno.dificuldades || "Reforço e consolidação das matérias do plano curricular."}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Objetivos do Acompanhamento:</span>
                    <p className="p-2.5 rounded-[5px] bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-normal mt-1">
                      {aluno.objectivos || "Elevação do rendimento escolar, autonomia no estudo e preparação para exames."}
                    </p>
                  </div>
                  {ped.disciplinasAdicionais && (
                    <div>
                      <span className="text-slate-400 block font-normal">Disciplinas Adicionais Solicitadas:</span>
                      <p className="text-slate-700 dark:text-slate-300 font-normal mt-0.5">
                        {ped.disciplinasAdicionais}
                      </p>
                    </div>
                  )}
                  {aluno.observacoes && (
                    <div>
                      <span className="text-slate-400 block font-normal">Observações do Encarregado:</span>
                      <p className="text-slate-600 dark:text-slate-400 font-normal italic mt-0.5">
                        &ldquo;{aluno.observacoes}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bloco 3: Localização em Luanda & Logística */}
              <div className="p-4 rounded-[5px] bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <span className="text-xs uppercase tracking-wider font-normal text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  Localização & Logística da Aula
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-normal">Modalidade</span>
                    <strong className="font-normal text-slate-900 dark:text-white">{ped.modalidade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Município & Bairro</span>
                    <span className="font-normal text-slate-800 dark:text-slate-200">
                      {ped.municipio || "Luanda"} {ped.bairro ? `· ${ped.bairro}` : ""}
                    </span>
                  </div>
                  {ped.endereco && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block font-normal">Endereço / Rua</span>
                      <span className="font-normal text-slate-800 dark:text-slate-200">{ped.endereco}</span>
                    </div>
                  )}
                  {ped.pontoReferencia && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block font-normal">Ponto de Referência</span>
                      <span className="font-normal text-slate-800 dark:text-slate-200">{ped.pontoReferencia}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bloco 4: Horários e Remuneração */}
              <div className="p-4 rounded-[5px] bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-emerald-700 dark:text-emerald-400 block font-normal">
                    Frequência & Horário de Aulas
                  </span>
                  <p className="font-normal text-slate-900 dark:text-white mt-0.5">
                    {ped.frequenciaSemanal}x por semana ({ped.duracaoMinutos} min) · {ped.diasSemana} ({ped.horarioPreferencial})
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-emerald-700 dark:text-emerald-400 block font-normal">
                    Remuneração por Aula
                  </span>
                  <p className="text-base font-normal text-emerald-600 dark:text-emerald-400">
                    {formatarKz(proposta.remuneracaoPorAulaKz)} <span className="text-xs text-slate-500 font-normal">/ aula</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <Botao
                variante="contorno"
                tamanho="sm"
                type="button"
                onClick={() => setMostrarModalDetalhes(false)}
                className="rounded-[5px] text-xs h-9 px-4 font-normal"
              >
                Fechar
              </Botao>

              {pendente && (
                <div className="flex items-center gap-2">
                  <Botao
                    variante="contorno"
                    tamanho="sm"
                    disabled={aSubmeter}
                    type="button"
                    onClick={() => {
                      setMostrarModalDetalhes(false);
                      setMostrarModalRecusa(true);
                    }}
                    className="rounded-[5px] text-xs h-9 px-3 text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-50 font-normal"
                  >
                    Recusar
                  </Botao>
                  <Botao
                    tamanho="sm"
                    disabled={aSubmeter}
                    type="button"
                    onClick={() => handleResposta("ACEITAR")}
                    className="rounded-[5px] text-xs h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-normal"
                  >
                    {aSubmeter ? "A Aceitar..." : "Aceitar"}
                  </Botao>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
