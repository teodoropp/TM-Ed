"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  GraduationCap,
  Star,
  BookOpen,
  Award,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Sparkles,
  Calendar,
  Globe,
  Camera,
  ArrowLeft,
} from "lucide-react";
import { Cartao, CartaoConteudo } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";
import { FormularioPerfilDocente } from "./formulario-perfil-docente";

export interface DadosPerfilCompletoProfessor {
  id: string;
  fotoUrl?: string | null;
  biografia?: string | null;
  formacaoAcademica?: string | null;
  anosExperiencia: number;
  estado: string;
  avaliacaoMedia: number;
  totalAulasDadas: number;
  utilizador: {
    nomeCompleto: string;
    email: string;
    telefone?: string | null;
  };
  disponibilidades: Array<{
    diaSemana: string;
    horaInicio: string;
    horaFim: string;
    activo: boolean;
  }>;
  zonasAtendimento: Array<{
    id: string;
    municipio: string;
    bairro?: string | null;
  }>;
  disciplinasLecionadas: Array<{
    id: string;
    disciplinaId?: string;
    disciplina: {
      nome: string;
      descricao?: string | null;
    };
  }>;
}

interface PropsVisualizadorPerfilProfessor {
  perfil: DadosPerfilCompletoProfessor;
  disciplinasDisponiveis?: Array<{ id: string; nome: string }>;
}

export function VisualizadorPerfilProfessor({
  perfil,
  disciplinasDisponiveis = [],
}: PropsVisualizadorPerfilProfessor) {
  const [modoEdicao, setModoEdicao] = useState(false);

  const perfilInicialForm = {
    fotoUrl: perfil.fotoUrl,
    telefone: perfil.utilizador.telefone,
    formacaoAcademica: perfil.formacaoAcademica,
    anosExperiencia: perfil.anosExperiencia,
    biografia: perfil.biografia,
    zonasAtendimento: perfil.zonasAtendimento.map((z) => ({
      municipio: z.municipio,
    })),
    disciplinasIds: perfil.disciplinasLecionadas
      .map((d) => d.disciplinaId)
      .filter((id): id is string => Boolean(id)),
  };

  const diasAtivos = perfil.disponibilidades?.filter((d) => d.activo) || [];
  const zonas = perfil.zonasAtendimento?.map((z) => z.municipio) || [];
  const cobreTodaLuanda =
    zonas.some((z) => z.toLowerCase().includes("toda")) ||
    zonas.length >= 6 ||
    zonas.length === 0;

  if (modoEdicao) {
    return (
      <div className="space-y-6 portal-tipografia">
        <div className="flex items-center justify-between bg-white dark:bg-[#07182E] p-4 rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[5px] bg-[#FF2D75]/10 text-[#FF2D75] flex items-center justify-center">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-normal text-slate-900 dark:text-white">
                Editar Perfil Profissional
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Atualize a sua fotografia, contacto telefónico, habilitações e zonas de atendimento em Luanda.
              </p>
            </div>
          </div>

          <Botao
            variante="contorno"
            tamanho="sm"
            onClick={() => setModoEdicao(false)}
            className="rounded-[5px] text-xs h-9 px-4 font-normal gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Perfil
          </Botao>
        </div>

        <div className="bg-white dark:bg-[#07182E] p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <FormularioPerfilDocente
            perfilInicial={perfilInicialForm}
            disciplinasDisponiveis={disciplinasDisponiveis}
            aoConcluir={() => setModoEdicao(false)}
            aoCancelar={() => setModoEdicao(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 portal-tipografia">
      {/* BENTO GRID DE INFORMAÇÕES DO PROFESSOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* TILE 1: HERO DO PROFESSOR COM FOTOGRAFIA (Spans 3 cols on LG) */}
        <Cartao className="col-span-1 md:col-span-3 lg:col-span-3 rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Fotografia do Professor */}
                <div className="relative group shrink-0">
                  {perfil.fotoUrl ? (
                    <img
                      src={perfil.fotoUrl}
                      alt={perfil.utilizador.nomeCompleto}
                      className="h-20 w-20 rounded-[5px] object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-[5px] bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-normal shadow-sm">
                      {perfil.utilizador.nomeCompleto.charAt(0)}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#07182E]" title="Docente Ativo" />
                </div>

                {/* Nome e Contactos */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-normal text-slate-900 dark:text-white">
                      {perfil.utilizador.nomeCompleto}
                    </h2>
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-normal rounded-[5px] text-xs">
                      <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      {perfil.estado === "Activo" || perfil.estado === "Verificado"
                        ? "Professor Credenciado"
                        : perfil.estado}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                    {perfil.formacaoAcademica || "Docente e Explicador Particular da Rede TM-Educa"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 dark:text-slate-400 font-normal">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {perfil.utilizador.email}
                    </span>
                    {perfil.utilizador.telefone && (
                      <>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {perfil.utilizador.telefone}
                        </span>
                      </>
                    )}
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1.5 text-rose-500">
                      <MapPin className="h-3.5 w-3.5" />
                      Luanda, Angola
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Edição de Perfil */}
              <Botao
                onClick={() => setModoEdicao(true)}
                className="rounded-[5px] h-9 px-4 text-xs font-normal gap-1.5 bg-[#FF2D75] hover:bg-[#FF2D75]/90 text-white shrink-0 shadow-sm cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar Perfil
              </Botao>
            </div>
          </CartaoConteudo>
        </Cartao>

        {/* TILE 2: AVALIAÇÃO & REPUTAÇÃO (1 col) */}
        <Cartao className="col-span-1 rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm flex flex-col justify-between">
          <CartaoConteudo className="p-6 space-y-4">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-normal block">
              Reputação & Desempenho
            </span>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-[5px] bg-amber-500/10 border border-amber-500/20">
                <span className="text-xl font-normal text-amber-500 flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-amber-500" />
                  {perfil.avaliacaoMedia.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal block mt-0.5">
                  Classificação
                </span>
              </div>

              <div className="p-3 rounded-[5px] bg-sky-500/10 border border-sky-500/20">
                <span className="text-xl font-normal text-sky-500 block">
                  {perfil.totalAulasDadas}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal block mt-0.5">
                  Aulas Dadas
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-normal">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>100% de assiduidade confirmada</span>
            </div>
          </CartaoConteudo>
        </Cartao>

        {/* TILE 3: FORMAÇÃO ACADÉMICA & ANOS DE EXPERIÊNCIA (Spans 2 cols) */}
        <Cartao className="col-span-1 md:col-span-2 rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-[5px] bg-rose-500/10 text-rose-500">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-normal text-slate-900 dark:text-white">
                  Formação Académica & Experiência
                </h3>
                <span className="text-xs text-slate-400 font-normal">
                  Habilitações literárias e percurso pedagógico
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-[5px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-normal">Habilitação Literária</span>
                <p className="text-sm font-normal text-slate-800 dark:text-slate-200 mt-0.5">
                  {perfil.formacaoAcademica || "Ainda não indicada. Clique em 'Editar Perfil' para adicionar."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 rounded-[5px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block font-normal">Anos de Experiência</span>
                  <p className="text-sm font-normal text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-500" />
                    {perfil.anosExperiencia} {perfil.anosExperiencia === 1 ? "ano de docência" : "anos de docência"}
                  </p>
                </div>

                <div className="flex-1 p-3 rounded-[5px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block font-normal">Ciclos Preparados</span>
                  <p className="text-xs font-normal text-slate-800 dark:text-slate-200 mt-0.5">
                    Ensino Primário, I e II Ciclo
                  </p>
                </div>
              </div>
            </div>
          </CartaoConteudo>
        </Cartao>

        {/* TILE 4: DISCIPLINAS HABILITADAS (Spans 2 cols) */}
        <Cartao className="col-span-1 md:col-span-2 rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-[5px] bg-indigo-500/10 text-indigo-500">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-normal text-slate-900 dark:text-white">
                  Disciplinas Habilitadas
                </h3>
                <span className="text-xs text-slate-400 font-normal">
                  Matérias curriculares aptas para lecionar
                </span>
              </div>
            </div>

            {perfil.disciplinasLecionadas && perfil.disciplinasLecionadas.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {perfil.disciplinasLecionadas.map((item) => (
                  <Badge
                    key={item.id}
                    className="bg-slate-100 dark:bg-[#0A192F] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 font-normal text-xs py-1.5 px-3 rounded-[5px]"
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1.5 text-rose-500" />
                    {item.disciplina.nome}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-normal italic">
                Nenhuma disciplina atribuída pela administração.
              </p>
            )}
          </CartaoConteudo>
        </Cartao>

        {/* TILE 5: COBERTURA GEOGRÁFICA EM LUANDA & MODALIDADES (Spans 2 cols) */}
        <Cartao className="col-span-1 md:col-span-2 rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-[5px] bg-emerald-500/10 text-emerald-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-normal text-slate-900 dark:text-white">
                    Zonas de Atendimento Presencial & Online
                  </h3>
                  <span className="text-xs text-slate-400 font-normal">
                    Âmbito territorial na Província de Luanda
                  </span>
                </div>
              </div>

              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] rounded-[5px] font-normal">
                Toda a Província
              </Badge>
            </div>

            <div className="p-3.5 rounded-[5px] bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 font-normal space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-normal text-emerald-800 dark:text-emerald-200">
                  {cobreTodaLuanda
                    ? "Disponível em toda a Província de Luanda"
                    : "Zonas selecionadas em Luanda"}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Atendimento presencial ao domicílio em todos os bairros e municípios de Luanda (sem restrições), além de sessões Online.
              </p>
            </div>

            {zonas.length > 0 && (
              <div className="flex flex-wrap gap-1.5 text-xs">
                {zonas.map((m, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px] font-normal border border-slate-200 dark:border-slate-700/60"
                  >
                    <MapPin className="h-3 w-3 text-rose-500" />
                    {m}
                  </span>
                ))}
              </div>
            )}
          </CartaoConteudo>
        </Cartao>

        {/* TILE 6: BIOGRAFIA E APRESENTAÇÃO PEDAGÓGICA (Spans 2 cols) */}
        <Cartao className="col-span-1 md:col-span-2 rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-6 space-y-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-normal block">
              Biografia & Metodologia Pedagógica
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {perfil.biografia ||
                "Ainda não adicionou uma biografia de apresentação. Clique em 'Editar Perfil' para partilhar o seu método pedagógico com os pais e encarregados de educação."}
            </p>
          </CartaoConteudo>
        </Cartao>

        {/* TILE 7: DISPONIBILIDADE E AGENDA SEMANAL (Spans 4 cols on LG) */}
        <Cartao className="col-span-1 md:col-span-3 lg:col-span-4 rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-[5px] bg-sky-500/10 text-sky-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-normal text-slate-900 dark:text-white">
                    Grelha Semanal de Disponibilidade
                  </h3>
                  <span className="text-xs text-slate-400 font-normal">
                    Janelas horárias ativas para matching com novos alunos
                  </span>
                </div>
              </div>

              <Link
                href="/portal-professor/disponibilidade"
                className="text-xs text-[#FF2D75] dark:text-rose-400 hover:underline flex items-center gap-1 font-normal"
              >
                <Calendar className="h-3.5 w-3.5" />
                Gerir Disponibilidade Completa →
              </Link>
            </div>

            {diasAtivos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"].map((dia) => {
                  const disp = perfil.disponibilidades?.find((d) => d.diaSemana === dia && d.activo);
                  const nomesDias: Record<string, string> = {
                    Segunda: "Seg",
                    Terca: "Ter",
                    Quarta: "Qua",
                    Quinta: "Qui",
                    Sexta: "Sex",
                    Sabado: "Sáb",
                    Domingo: "Dom",
                  };
                  return (
                    <div
                      key={dia}
                      className={`p-2.5 rounded-[5px] border text-center transition-all ${
                        disp
                          ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60"
                          : "bg-slate-50/40 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 opacity-60"
                      }`}
                    >
                      <span className="text-xs font-normal text-slate-800 dark:text-slate-200 block">
                        {nomesDias[dia]}
                      </span>
                      {disp ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1 font-normal">
                          {disp.horaInicio} - {disp.horaFim}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 block mt-1 font-normal">
                          Folga
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-normal italic">
                Ainda não definiu horários na sua grelha semanal.
              </p>
            )}
          </CartaoConteudo>
        </Cartao>
      </div>
    </div>
  );
}
