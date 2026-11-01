"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  Send,
  UserCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";

export interface ItemComunicacaoAluno {
  id: string;
  codigo: string;
  modalidade: string;
  disciplina: string;
  diasSemana: string;
  horario: string;
  municipio?: string | null;
  bairro?: string | null;
  aluno: {
    nome: string;
    anoEscolar: string;
    escola?: string | null;
  };
  encarregado: {
    nome: string;
    email: string;
    telefone: string;
  };
}

interface PropsVisualizadorComunicacao {
  alunos: ItemComunicacaoAluno[];
  nomeProfessor: string;
}

export function VisualizadorComunicacaoProfessor({
  alunos,
  nomeProfessor,
}: PropsVisualizadorComunicacao) {
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<string>(
    alunos[0]?.id || ""
  );
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState("");
  const [copiado, setCopiado] = useState(false);

  const alunoAtual = alunos.find((a) => a.id === alunoSelecionadoId) || alunos[0];

  function formatarTelefoneWhatsApp(telefone: string) {
    let limpo = telefone.replace(/\D/g, "");
    if (!limpo.startsWith("244")) {
      limpo = `244${limpo}`;
    }
    return limpo;
  }

  function gerarMensagemWhatsApp(tipo: "apresentacao" | "lembrete" | "sumario" | "personalizada") {
    if (!alunoAtual) return "";
    const enc = alunoAtual.encarregado.nome;
    const al = alunoAtual.aluno.nome;
    const disc = alunoAtual.disciplina;

    switch (tipo) {
      case "apresentacao":
        return `Olá, prezado(a) Sr(a). ${enc}! Sou o professor ${nomeProfessor}, explicador da TM-Educa atribuído para o acompanhamento pedagógico do(a) ${al} em ${disc}. Fico ao seu dispor para coordenarmos as sessões de tutoria.`;
      case "lembrete":
        return `Olá, Sr(a). ${enc}! Recordo que temos aula agendada de ${disc} com o(a) ${al} nos horários habituais (${alunoAtual.diasSemana} - ${alunoAtual.horario}). Caso haja alguma alteração, por favor avise com antecedência. Grato, Prof. ${nomeProfessor}.`;
      case "sumario":
        return `Olá, Sr(a). ${enc}! Concluímos a sessão de tutoria de ${disc} com o(a) ${al}. O sumário pedagógico detalhado já foi registado no portal TM-Educa. O estudante demonstrou bom empenho. Atenciosamente, Prof. ${nomeProfessor}.`;
      case "personalizada":
        return mensagemPersonalizada;
    }
  }

  function abrirWhatsApp(texto: string) {
    if (!alunoAtual || !alunoAtual.encarregado.telefone) return;
    const num = formatarTelefoneWhatsApp(alunoAtual.encarregado.telefone);
    const link = `https://wa.me/${num}?text=${encodeURIComponent(texto)}`;
    window.open(link, "_blank");
  }

  function copiarTexto(texto: string) {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="space-y-6 portal-tipografia">
      {alunos.length === 0 ? (
        <Cartao className="rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] p-8 text-center">
          <CartaoConteudo className="space-y-3">
            <div className="w-12 h-12 rounded-[5px] bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-normal text-slate-800 dark:text-white">
              Nenhum canal ativo de comunicação no momento
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-normal">
              Assim que aceitar uma nova proposta de aluno, os contactos diretos dos encarregados de educação (WhatsApp, chamadas e avisos) ficarão imediatamente disponíveis aqui.
            </p>
          </CartaoConteudo>
        </Cartao>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Lista de Alunos / Contactos */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-400">
              Encarregados & Alunos Ativos ({alunos.length})
            </h3>

            <div className="space-y-2">
              {alunos.map((item) => {
                const ativo = item.id === alunoAtual?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setAlunoSelecionadoId(item.id)}
                    className={`p-3.5 rounded-[5px] border cursor-pointer transition-all ${
                      ativo
                        ? "bg-[#0A192F] text-white border-rose-500/50 shadow-sm"
                        : "bg-white dark:bg-[#07182E] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <strong className="text-xs font-normal block">
                          {item.aluno.nome}
                        </strong>
                        <span className={`text-[11px] block mt-0.5 ${ativo ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                          Encarregado(a): {item.encarregado.nome}
                        </span>
                      </div>
                      <Badge className="rounded-[5px] text-[10px] font-normal bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        {item.disciplina}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/20 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        {item.encarregado.telefone}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Suporte da TM-Educa */}
            <div className="p-4 rounded-[5px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-normal flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                Coordenação Pedagógica TM-Educa
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">
                Necessita de suporte ou mediação institucional com a família?
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://wa.me/244955916711?text=Olá,%20sou%20professor%20da%20TM-Educa%20e%20solicito%20apoio%20pedagógico."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-normal cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp da Coordenação (+244 955 916 711)
                </a>
              </div>
            </div>
          </div>

          {/* Coluna 2 e 3: Painel de Comunicação com o Encarregado Selecionado */}
          {alunoAtual && (
            <div className="lg:col-span-2 space-y-4">
              <Cartao className="rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
                <CartaoCabecalho className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[5px] bg-[#FF2D75]/10 text-[#FF2D75] flex items-center justify-center">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <CartaoTitulo className="text-base font-normal text-slate-900 dark:text-white">
                          Comunicação com Encarregado(a) {alunoAtual.encarregado.nome}
                        </CartaoTitulo>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                          Aluno: <strong>{alunoAtual.aluno.nome}</strong> ({alunoAtual.aluno.anoEscolar} · {alunoAtual.disciplina})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${alunoAtual.encarregado.telefone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 text-xs font-normal border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-500" />
                        Ligar
                      </a>
                      <button
                        type="button"
                        onClick={() => abrirWhatsApp(gerarMensagemWhatsApp("apresentacao"))}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[5px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-normal shadow-sm cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </CartaoCabecalho>

                <CartaoConteudo className="p-5 space-y-5">
                  {/* Modelos Prontos de Comunicação */}
                  <div className="space-y-3">
                    <span className="text-xs font-normal uppercase tracking-wider text-slate-400 block">
                      Modelos de Mensagens Rápidas (1-Clique WhatsApp)
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-[5px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <strong className="text-xs font-normal text-slate-900 dark:text-white block">
                            Apresentação Inicial
                          </strong>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 font-normal">
                            Apresente-se aos pais como o explicador oficial e confirme as primeiras aulas.
                          </p>
                        </div>
                        <Botao
                          tamanho="sm"
                          onClick={() => abrirWhatsApp(gerarMensagemWhatsApp("apresentacao"))}
                          className="rounded-[5px] text-xs h-7 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-normal"
                        >
                          Enviar Apresentação
                        </Botao>
                      </div>

                      <div className="p-3 rounded-[5px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <strong className="text-xs font-normal text-slate-900 dark:text-white block">
                            Lembrete de Horário
                          </strong>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 font-normal">
                            Avise o encarregado sobre a sessão prevista para hoje nos horários agendados.
                          </p>
                        </div>
                        <Botao
                          tamanho="sm"
                          onClick={() => abrirWhatsApp(gerarMensagemWhatsApp("lembrete"))}
                          className="rounded-[5px] text-xs h-7 w-full bg-sky-600 hover:bg-sky-700 text-white font-normal"
                        >
                          Enviar Lembrete
                        </Botao>
                      </div>

                      <div className="p-3 rounded-[5px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <strong className="text-xs font-normal text-slate-900 dark:text-white block">
                            Conclusão de Aula
                          </strong>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 font-normal">
                            Notifique a família de que a aula foi dada e que o sumário foi preenchido.
                          </p>
                        </div>
                        <Botao
                          tamanho="sm"
                          onClick={() => abrirWhatsApp(gerarMensagemWhatsApp("sumario"))}
                          className="rounded-[5px] text-xs h-7 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-normal"
                        >
                          Avisar Aula Dada
                        </Botao>
                      </div>
                    </div>
                  </div>

                  {/* Redigir Mensagem Personalizada */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-normal uppercase tracking-wider text-slate-400 block">
                      Escrever Mensagem Personalizada
                    </span>
                    <textarea
                      rows={3}
                      value={mensagemPersonalizada}
                      onChange={(e) => setMensagemPersonalizada(e.target.value)}
                      placeholder={`Escreva uma mensagem ou recomendação pedagógica para o encarregado de ${alunoAtual.aluno.nome}...`}
                      className="w-full p-3 rounded-[5px] border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF2D75] font-normal"
                    />

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => copiarTexto(mensagemPersonalizada)}
                        disabled={!mensagemPersonalizada.trim()}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-normal cursor-pointer disabled:opacity-50"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiado ? "Copiado!" : "Copiar Texto"}
                      </button>

                      <Botao
                        disabled={!mensagemPersonalizada.trim()}
                        onClick={() => abrirWhatsApp(mensagemPersonalizada)}
                        className="rounded-[5px] text-xs h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-normal gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Enviar via WhatsApp
                      </Botao>
                    </div>
                  </div>
                </CartaoConteudo>
              </Cartao>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
