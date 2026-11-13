/** @format */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Laptop,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Users,
  Target,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SimuladorPrecos } from "@/componentes/precos/simulador-precos";
import { RevelarAoRolar } from "@/componentes/animacao/revelar-ao-rolar";

interface SlideBannerInformativo {
  id: string;
  tag: string;
  titulo: string;
  descricao: string;
  imagem: string;
  altImagem: string;
  linkAcao: string;
  rotuloAcao: string;
}

const SLIDES_BANNER_INFORMATIVO: SlideBannerInformativo[] = [
  {
    id: "seguranca-rigor",
    tag: "SEGURANÇA EM PRIMEIRO LUGAR",
    titulo: "PROFESSORES AUDITADOS — A TRANQUILIDADE DA SUA FAMÍLIA",
    descricao:
      "Na TM-Educa, nenhum explicador inicia o acompanhamento sem verificação criteriosa de competências pedagógicas, identidade e idoneidade. A segurança e a evolução do seu filho são a nossa prioridade absoluta em cada sessão.",
    imagem: "/imagens/hero/tutoria-fundo-amarelo.png",
    altImagem: "Sessão de tutoria presencial acolhedora e segura",
    linkAcao: "/portal-encarregado/pedidos/novo",
    rotuloAcao: "Solicitar explicador auditado",
  },
  {
    id: "foco-resultados",
    tag: "METODOLOGIA DE EXCELÊNCIA",
    titulo: "O PROFESSOR CERTO PODE MUDAR A FORMA DE APRENDER",
    descricao:
      "Com método estruturado, paciência e acompanhamento contínuo, os alunos vencem bloqueios na Matemática, Física e Línguas, ganhando autonomia e gosto sustentável pelo estudo diário.",
    imagem: "/imagens/hero/mentoria-foco-inspiracao.png",
    altImagem: "Orientação cuidadosa com foco no raciocínio e motivação",
    linkAcao: "/portal-encarregado/pedidos/novo",
    rotuloAcao: "Encontrar o explicador certo",
  },
  {
    id: "exames-admissao",
    tag: "RUMO AO ENSINO SUPERIOR",
    titulo: "PREPARAÇÃO INTENSIVA PARA OS EXAMES MAIS CONCORRIDOS",
    descricao:
      "Treino rigoroso com resolução comentada e cronometrada de Exames Nacionais oficiais do IAVE e Provas Finais. Método estruturado e foco nas aprendizagens essenciais para maximizar a nota de candidatura e garantir a vaga no Ensino Superior.",
    imagem: "/imagens/exames.jpg",
    altImagem: "Estudante dedicado na preparação intensiva para provas",
    linkAcao: "/preparacao-exames",
    rotuloAcao: "Preparar exames nacionais",
  },
];

interface ItemAnoSimulador {
  id: string;
  nome: string;
  ciclo: { nome: string };
  precos: {
    duracaoMinutos: number;
    precoPorAulaKz: number;
  }[];
}

interface SeccaoSolucoesProps {
  dadosAnos?: ItemAnoSimulador[];
}

interface ServicoEducativo {
  id: string;
  numero: string;
  tag: string;
  titulo: string;
  subtitulo: string;
  descricaoCurta: string;
  visaoGeral: string;
  icone: React.ElementType;
  imagem: string;
  altImagem: string;
  destaques: string[];
  formato: string;
  linkAcao: string;
  rotuloAcao: string;
}

const SERVICOS_EDUCATIVOS: ServicoEducativo[] = [
  {
    id: "explicacoes-individuais",
    numero: "",
    tag: "",
    titulo: "Explicações individuais",
    subtitulo: "Acompanhamento personalizado ao ritmo de cada aluno",
    descricaoCurta:
      "Acompanhamento personalizado, adaptado às necessidades, às dificuldades e ao ritmo de aprendizagem de cada aluno.",
    visaoGeral:
      "O explicador identifica exatamente onde surgem as dúvidas e bloqueios do estudante, aplicando métodos pedagógicos dedicados para consolidar a matéria com total segurança e confiança.",
    icone: GraduationCap,
    imagem: "/imagens/servicos/explicacoes-individuais.jpg",
    altImagem:
      "Explicador atencioso a orientar individualmente uma aluna com exercícios práticos no caderno.",
    destaques: [
      "Diagnóstico inicial das principais lacunas de aprendizagem",
      "Atenção 100% focada nas dúvidas reais da matéria",
      "Plano de estudo individualizado por disciplina prioritária",
      "Relatórios de progresso regulares para o pai",
    ],
    formato: "Presencial ao Domicílio ou Aulas Online Interativas",
    linkAcao: "/portal-encarregado/pedidos/novo",
    rotuloAcao: "Solicitar explicador individual",
  },
  {
    id: "explicacoes-grupo",
    numero: "",
    tag: "",
    titulo: "Explicações em grupo",
    subtitulo: "Aprendizagem colaborativa com dinamismo e partilha",
    descricaoCurta:
      "Aprendizagem colaborativa em pequenos grupos, com orientação dedicada e esclarecimento constante de dúvidas.",
    visaoGeral:
      "O estudo em pequenos grupos (2 a 4 alunos do mesmo ano escolar) estimula a partilha de raciocínios, desperta a curiosidade e consolida os conhecimentos através da resolução conjunta de exercícios práticos.",
    icone: Users,
    imagem: "/imagens/servicos/explicacoes-grupo.jpg",
    altImagem:
      "Pequeno grupo de estudantes a trabalhar de forma colaborativa com orientação de uma explicadora.",
    destaques: [
      "Ambiente motivador de cooperação e debate saudável",
      "Discussão guiada de problemas e raciocínio crítico",
      "Excelente relação entre qualidade pedagógica e investimento familiar",
      "Acompanhamento individual dentro do ritmo coletivo da turma",
    ],
    formato: "Sessões ao domicílio (grupo combinado) ou salas virtuais",
    linkAcao: "/portal-encarregado/pedidos/novo",
    rotuloAcao: "Solicitar explicações em grupo",
  },
  {
    id: "apoio-trabalhos-casa",
    numero: "",
    tag: "",
    titulo: "Apoio nos trabalhos de casa",
    subtitulo: "Organização diária e métodos sustentáveis de estudo",
    descricaoCurta:
      "Apoio na compreensão das tarefas escolares, resolução metódica de exercícios e desenvolvimento da autonomia.",
    visaoGeral:
      "Muito além de apenas preencher os cadernos, este serviço ensina o aluno a organizar as suas rotinas, a interpretar enunciados com atenção e a desenvolver autonomia, garantindo tranquilidade às famílias no final do dia.",
    icone: BookOpen,
    imagem: "/imagens/servicos/apoio-trabalhos-casa.jpg",
    altImagem:
      "Estudante focado e autónomo a realizar tarefas escolares e exercícios no seu espaço de estudo.",
    destaques: [
      "Acompanhamento sistemático das tarefas diárias da escola (TPC)",
      "Esclarecimento prévio de dúvidas antes das aulas do dia seguinte",
      "Organização de cadernos diários, apontamentos e materiais",
      "Construção de hábitos saudáveis e independência intelectual",
    ],
    formato: "Acompanhamento pós-escolar ao domicílio ou online",
    linkAcao: "/portal-encarregado/pedidos/novo",
    rotuloAcao: "Solicitar apoio nos trabalhos de casa",
  },
  {
    id: "preparacao-avaliacoes",
    numero: "",
    tag: "",
    titulo: "Preparação para avaliações",
    subtitulo: "Revisão focada e método rigoroso para notas de topo",
    descricaoCurta:
      "Revisão das matérias, exercícios práticos e preparação organizada para testes sumativos, provas finais e exames nacionais.",
    visaoGeral:
      "Preparação intensiva para momentos decisivos: testes sumativos, provas de equivalência à frequência, provas finais de ciclo e Exames Nacionais do Ensino Secundário (IAVE / DGES).",
    icone: Target,
    imagem: "/imagens/servicos/preparacao-avaliacoes.jpg",
    altImagem:
      "Estudante e orientador a rever intensivamente conteúdos e exames anteriores num ambiente focado.",
    destaques: [
      "Resolução cronometrada de provas e exames oficiais de anos anteriores",
      "Técnicas de gestão de tempo e controlo da ansiedade em prova",
      "Revisão profunda dos temas com maior ponderação curricular",
      "Foco específico nas aprendizagens essenciais e critérios oficiais do IAVE",
    ],
    formato: "Módulos intensivos ao domicílio ou online por disciplina",
    linkAcao: "/portal-encarregado/pedidos/novo",
    rotuloAcao: "Solicitar preparação para avaliações",
  },
];

/**
 * Secção 4: Serviços TM-Educa em Linhas Alternadas Zig-Zag:
 * - Cada serviço ocupa uma linha ampla com texto de um lado e fotografia realista do outro.
 * - Os lados alternam em cada linha (Linha 1: Texto à esq. / Foto à dir.; Linha 2: Foto à esq. / Texto à dir.; etc.).
 * - Alinhado à estética existente da TM-Educa (Segoe UI, #0A192F, #FF2D75, bordas suaves e botões com transições elegantes).
 * - Preserva modalidades de ensino, cobertura curricular e simulador de mensalidades.
 */
interface CicloCurricular {
  numero: string;
  faixa: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  lema: string;
  disciplinas: string[];
  destaques: string[];
  seloDestaque: string;
}

const CICLOS_CURRICULARES: CicloCurricular[] = [
  {
    numero: "01",
    faixa: "1.º ao 4.º Ano",
    titulo: "1.º Ciclo do Ensino Básico",
    subtitulo: "Fundação da Leitura, Escrita e Cálculo Elementar",
    descricao:
      "A fase inicial e decisiva onde se constroem os alicerces escolares. Consolidamos a leitura fluida, ortografia, caligrafia, cálculo mental e autonomia nos trabalhos de casa (TPC) sem ansiedade.",
    lema: "Acompanhamento próximo, lúdico e paciente para que a criança ganhe gosto pelo estudo desde os primeiros anos.",
    disciplinas: [
      "Português",
      "Matemática",
      "Estudo do Meio",
      "Inglês (Iniciação)",
      "Expressões Artísticas",
    ],
    destaques: [
      "Consolidação da leitura compreensiva e ortografia da língua portuguesa",
      "Desenvolvimento do raciocínio lógico e cálculo mental sem memorização mecânica",
      "Criação de rotinas diárias e hábitos saudáveis de organização escolar",
    ],
    seloDestaque: "Acompanhamento Lúdico e Paciente",
  },
  {
    numero: "02",
    faixa: "5.º e 6.º Ano",
    titulo: "2.º Ciclo do Ensino Básico",
    subtitulo: "Transição Multidisciplinar e Métodos de Estudo",
    descricao:
      "Apoio estruturado na transição para o regime de múltiplos explicadores. Desenvolvemos métodos eficazes de síntese, esquemas de estudo e rigor na resolução de exercícios e testes de avaliação.",
    lema: "Adaptação segura e método organizado para responder com confiança a um ritmo escolar mais exigente.",
    disciplinas: [
      "Português",
      "Matemática",
      "História e Geografia de Portugal (HGP)",
      "Ciências Naturais",
      "Inglês",
      "Educação Visual",
    ],
    destaques: [
      "Organização metódica do caderno diário, apontamentos e prazos de entrega",
      "Supervisão rigorosa na resolução de fichas de trabalho e problemas matemáticos",
      "Preparação antecipada para as provas de avaliação e testes sumativos",
    ],
    seloDestaque: "Métodos de Raciocínio e Organização",
  },
  {
    numero: "03",
    faixa: "7.º ao 9.º Ano",
    titulo: "3.º Ciclo do Ensino Básico",
    subtitulo: "Físico-Química, Álgebra e Provas Finais de Ciclo",
    descricao:
      "Aprofundamento rigoroso nas ciências experimentais e na matemática abstrata. Preparação intensiva para testes de avaliação e Provas Finais de Ciclo, assegurando bases sólidas para a escolha do Secundário.",
    lema: "Rigor conceptual e treino prático intensivo para garantir uma transição de sucesso para o Secundário.",
    disciplinas: [
      "Matemática (Álgebra & Funções)",
      "Físico-Química (FQ)",
      "Ciências Naturais",
      "Português",
      "Francês / Espanhol",
      "História",
      "Geografia",
    ],
    destaques: [
      "Domínio claro e prático das fórmulas e problemas de Físico-Química e Álgebra",
      "Resolução comentada de provas-modelo e exames de anos letivos anteriores",
      "Reforço nas disciplinas determinantes para o curso a frequentar no Secundário",
    ],
    seloDestaque: "Preparação Rigorosa de Ciclo",
  },
  {
    numero: "04",
    faixa: "10.º ao 12.º Ano",
    titulo: "Ensino Secundário & Exames",
    subtitulo: "Cursos Científico-Humanísticos e Acesso ao Superior",
    descricao:
      "Acompanhamento especializado para Ciências e Tecnologias, Ciências Socioeconómicas e Línguas e Humanidades. Foco rigoroso em médias elevadas e na preparação para os Exames Nacionais do IAVE (DGES).",
    lema: "Estratégia, rigor analítico e treino com critérios oficiais do IAVE para assegurar a entrada no curso desejado.",
    disciplinas: [
      "Matemática A / B / MACS",
      "Física e Química A (FQA)",
      "Biologia e Geologia (BG)",
      "Português (12.º ano)",
      "Filosofia",
      "Economia A",
      "Geometria Descritiva A",
    ],
    destaques: [
      "Treino exaustivo com critérios oficiais de correção dos Exames Nacionais (IAVE)",
      "Estratégia de resolução cronometrada de itens de desenvolvimento e escolha múltipla",
      "Acompanhamento focado para maximizar a classificação e a nota de candidatura",
    ],
    seloDestaque: "Foco nas Médias e Exames Nacionais",
  },
];

export function SeccaoSolucoes({ dadosAnos = [] }: SeccaoSolucoesProps) {
  const [slideBannerAtivo, setSlideBannerAtivo] = useState(0);
  const [pausadoBanner, setPausadoBanner] = useState(false);
  const [cicloAtivoIndex, setCicloAtivoIndex] = useState(0);

  // Rotação automática suave do banner a cada 6 segundos
  useEffect(() => {
    if (pausadoBanner) return;
    const timer = setInterval(() => {
      setSlideBannerAtivo(
        (prev) => (prev + 1) % SLIDES_BANNER_INFORMATIVO.length,
      );
    }, 6000);
    return () => clearInterval(timer);
  }, [pausadoBanner]);

  return (
    <section
      id="servicos"
      className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-normal scroll-mt-20"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}>
      {/* =========================================================================
          CABEÇALHO DA SECÇÃO: Título e Subtítulo Solicitados
         ========================================================================= */}
      <RevelarAoRolar animacao="fade-up" duracaoMs={700}>
        <div className="max-w-3xl mb-12 sm:mb-16 md:mb-20 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 sm:w-8 h-[2px] bg-[#FF2D75] rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-normal">
              SERVIÇOS EDUCATIVOS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[35px] font-normal text-[#0A192F] dark:text-white tracking-normal leading-[1.15]">
            Soluções educativas para{" "}
            <span className="text-[#FF2D75]">cada necessidade.</span>
          </h2>
        </div>
      </RevelarAoRolar>

      {/* =========================================================================
          LINHAS ZIG-ZAG ALTERNADAS (FEATURE LIST AS ALTERNATING ZIGZAG ROWS)
         ========================================================================= */}
      <div className="space-y-16 sm:space-y-24 lg:space-y-28 mb-24">
        {SERVICOS_EDUCATIVOS.map((servico, index) => {
          const Icone = servico.icone;
          // Índice par: Texto à esquerda, Imagem à direita
          // Índice ímpar: Imagem à esquerda, Texto à direita
          const inverterLados = index % 2 === 1;

          return (
            <RevelarAoRolar
              key={servico.id}
              animacao={inverterLados ? "fade-left" : "fade-right"}
              duracaoMs={800}
            >
              <div
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
                {/* LADO DO TEXTO */}
                <div
                  className={`lg:col-span-6 space-y-5 sm:space-y-6 ${
                    inverterLados ? "lg:order-2" : "lg:order-1"
                  }`}>
                {/* Título & Subtítulo */}
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-normal text-[#0A192F] dark:text-white tracking-normal leading-tight">
                    {servico.titulo}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#FF2D75]">
                    {servico.subtitulo}
                  </p>
                </div>

                {/* Descrição Concisa e Sem Rodeios */}
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                  {servico.visaoGeral}
                </p>

                {/* Lista de Entregáveis / Checkmarks */}
                <div className="space-y-2.5 pt-1">
                  {servico.destaques.map((destaque, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF2D75] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-[13.5px] text-slate-700 dark:text-slate-200 leading-snug font-normal">
                        {destaque}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Formato de Atendimento */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-normal pt-1">
                  <CalendarCheck className="w-4 h-4 text-[#FF2D75] shrink-0" />
                  <span>
                    <strong>Formato:</strong> {servico.formato}
                  </span>
                </div>

                {/* Botão de Solicitação do Serviço */}
                <div className="pt-2">
                  <Link
                    href={servico.linkAcao}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[5px] bg-[#0A192F] hover:bg-[#FF2D75] text-white text-xs sm:text-sm font-normal transition-colors duration-200 shadow-sm hover:shadow-md group">
                    <span>{servico.rotuloAcao}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* LADO DA IMAGEM REALISTA */}
              <div
                className={`lg:col-span-6 ${
                  inverterLados ? "lg:order-1" : "lg:order-2"
                }`}>
                <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full rounded-[5px] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-800 shadow-xl group">
                  <Image
                    src={servico.imagem}
                    alt={servico.altImagem}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Ícone Flutuante Elegante */}
                  <div className="absolute top-4 right-4 w-11 h-11 rounded-[5px] bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-md text-[#FF2D75] flex items-center justify-center shadow-md border border-slate-200/50 dark:border-slate-700/50">
                    <Icone className="w-5 h-5" />
                  </div>

                  {/* Legenda Discreta no Canto Inferior */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90">
                    <span className="text-xs font-normal drop-shadow-sm bg-black/40 backdrop-blur-sm px-3 py-1 rounded-[5px]">
                      TM-Educa • {servico.titulo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RevelarAoRolar>
          );
        })}
      </div>

      {/* =========================================================================
          2. AS DUAS MODALIDADES DE ENSINO (Fundo Branco, Cards Alinhados e Pequenos)
         ========================================================================= */}
      <div className="mb-16 p-6 sm:p-8 md:p-10 rounded-[5px] bg-white dark:bg-[#07182E] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="max-w-2xl space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#FF2D75] rounded-full" />
            <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-semibold">
              MODALIDADES DE ENSINO
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-normal text-[#0A192F] dark:text-white">
            Flexibilidade total para a rotina da sua família
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
            Escolha entre o conforto do apoio presencial no lar ou a
            conveniência tecnológica das aulas online em tempo real.
          </p>
        </div>

        {/* Cards Alinhados e Compactos com rounded-[5px] e animação tridimensional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Modalidade 1: Apoio ao Domicílio */}
          <div className="p-5 sm:p-6 rounded-[8px] bg-slate-50/70 dark:bg-[#0A192F]/60 border border-slate-200/80 dark:border-slate-800/80 card-hover-lift hover:border-[#FF2D75]/50 hover:bg-white dark:hover:bg-[#0A192F] transition-all duration-300 flex flex-col justify-between group shadow-sm">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 text-[#FF2D75] flex items-center justify-center transition-transform group-hover:scale-110">
                  <Home className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-normal text-[#0A192F] dark:text-white group-hover:text-[#FF2D75] transition-colors">
                  Apoio ao Domicílio
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-normal">
                  O explicador credenciado desloca-se diretamente à sua
                  residência com pontualidade. Aulas no conforto do lar com
                  acompanhamento próximo dos pais.
                </p>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-normal">
                    Conforto absoluto no lar sem perdas de tempo em deslocações
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-normal">
                    Horários flexíveis adaptados à rotina de segunda a sábado
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-normal">
                    Supervisão presencial direta dos cadernos e tarefas
                    escolares
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-3.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <Link
                href="/portal-encarregado/pedidos/novo"
                className="text-xs font-medium text-[#FF2D75] hover:text-[#E11D48] flex items-center gap-1 transition-colors group-hover:translate-x-1">
                <span>Solicitar explicador ao domicílio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Modalidade 2: Aulas Online Interativas */}
          <div className="p-5 sm:p-6 rounded-[8px] bg-slate-50/70 dark:bg-[#0A192F]/60 border border-slate-200/80 dark:border-slate-800/80 card-hover-lift hover:border-[#FF2D75]/50 hover:bg-white dark:hover:bg-[#0A192F] transition-all duration-300 flex flex-col justify-between group shadow-sm">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 text-[#FF2D75] flex items-center justify-center transition-transform group-hover:scale-110">
                  <Laptop className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-normal text-[#0A192F] dark:text-white group-hover:text-[#FF2D75] transition-colors">
                  Aulas Online Interativas
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-normal">
                  Sessões virtuais dinâmicas com quadro digital interactivo,
                  partilha de ecrã e gravação das explicações para revisão antes
                  dos testes.
                </p>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-normal">
                    Acesso a explicadores de topo independentemente da sua localização
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-normal">
                    Quadro interativo e ferramentas digitais de aprendizagem ativa
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-normal">
                    Gravação e sumários imediatos das aulas disponíveis no portal
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-3.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <Link
                href="/portal-encarregado/pedidos/novo"
                className="text-xs font-medium text-[#FF2D75] hover:text-[#E11D48] flex items-center gap-1 transition-colors group-hover:translate-x-1">
                <span>Solicitar explicações online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BANNER INFORMATIVO (CARROSSEL COM LADO ESCURO E FOTO REALISTA)
         ========================================================================= */}
      <div
        className="relative w-[1355px] left-[-70px] rounded-[5px] overflow-hidden bg-[#061427] shadow-2xl mb-16 h-[400px] sm:h-[430px] md:h-[450px] flex items-center group/banner"
        onMouseEnter={() => setPausadoBanner(true)}
        onMouseLeave={() => setPausadoBanner(false)}>
        {SLIDES_BANNER_INFORMATIVO.map((slide, index) => {
          const estaAtivo = index === slideBannerAtivo;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out flex items-center ${
                estaAtivo
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}>
              {/* Lado Direito: Fotografia Realista de Alta Resolução */}
              <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[65%] lg:w-[58%] h-full overflow-hidden">
                <Image
                  src={slide.imagem}
                  alt={slide.altImagem}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover object-top select-none"
                  priority={index === 0}
                />
              </div>

              {/* Degradê Transversal: Lado Esquerdo Escuro e Fade Suave para a Imagem */}
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#061427] via-[#061427] via-55% sm:via-48% lg:via-42% to-transparent z-10 pointer-events-none" />

              {/* Lado Esquerdo: Conteúdo Textual com Tipografia da Identidade */}
              <div className="relative z-20 max-w-xl p-6 sm:p-10 lg:p-12 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-[2px] bg-[#FF2D75] rounded-full" />
                  <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-semibold">
                    {slide.tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-[30px] font-normal text-white uppercase tracking-tight leading-[1.2]">
                  {slide.titulo}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal line-clamp-4">
                  {slide.descricao}
                </p>

                <div className="pt-2"></div>
              </div>
            </div>
          );
        })}

        {/* Controlos do Carrossel (Setas e Indicadores de Navegação) */}
        <div className="absolute bottom-5 right-5 sm:right-8 z-30 flex items-center gap-3">
          {/* Indicadores de Slide */}
          <div className="flex items-center gap-1.5 mr-2">
            {SLIDES_BANNER_INFORMATIVO.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSlideBannerAtivo(idx)}
                aria-label={`Ir para o slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  idx === slideBannerAtivo
                    ? "w-6 bg-[#FF2D75]"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Seta Anterior */}
          <button
            type="button"
            onClick={() =>
              setSlideBannerAtivo((prev) =>
                prev === 0 ? SLIDES_BANNER_INFORMATIVO.length - 1 : prev - 1,
              )
            }
            aria-label="Slide anterior"
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#FF2D75] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Seta Seguinte */}
          <button
            type="button"
            onClick={() =>
              setSlideBannerAtivo(
                (prev) => (prev + 1) % SLIDES_BANNER_INFORMATIVO.length,
              )
            }
            aria-label="Próximo slide"
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#FF2D75] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. TRAJETÓRIA CURRICULAR INTERATIVA (DA ALFABETIZAÇÃO À UNIVERSIDADE)
         ========================================================================= */}
      <div className="space-y-8 mb-20 pt-4">
        {/* Cabeçalho da Trajetória Curricular */}
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#FF2D75] rounded-full" />
            <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-semibold">
              COBERTURA CURRICULAR
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-normal text-[#0A192F] dark:text-white">
            Do 1.º ao 12.º ano: acompanhamento curricular completo
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
            Selecione uma das 4 etapas do ensino básico e secundário para
            conhecer as disciplinas, metodologia e objetivos pedagógicos no
            sistema de ensino português.
          </p>
        </div>

        {/* Trilha de Navegação Interativa (Stepper / Timeline dos 4 Ciclos) */}
        <div className="relative">
          {/* Linha Conectora de Fundo */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-[2px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

          {/* Os 4 Marcos Interativos com Bordas de 5px */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {CICLOS_CURRICULARES.map((ciclo, idx) => {
              const estaAtivo = idx === cicloAtivoIndex;

              return (
                <button
                  key={ciclo.titulo}
                  type="button"
                  onClick={() => setCicloAtivoIndex(idx)}
                  className={`text-left p-4 sm:p-5 rounded-[5px] transition-all duration-200 flex flex-col justify-between cursor-pointer border ${
                    estaAtivo
                      ? "bg-white dark:bg-[#0A192F] border-2 border-[#FF2D75] shadow-md shadow-[#FF2D75]/10"
                      : "bg-white/80 dark:bg-[#0A192F]/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-[#0A192F]"
                  }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[5px] ${
                        estaAtivo
                          ? "bg-[#FFF1F5] dark:bg-[#FF2D75]/15 text-[#FF2D75]"
                          : "text-slate-500 dark:text-slate-400"
                      }`}>
                      {ciclo.faixa}
                    </span>
                  </div>

                  <div>
                    <h4
                      className={`text-base font-normal leading-snug transition-colors ${
                        estaAtivo
                          ? "text-[#0A192F] dark:text-white"
                          : "text-slate-700 dark:text-slate-300"
                      }`}>
                      {ciclo.titulo}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-1 font-normal">
                      {ciclo.subtitulo}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Showcase Aberto e Dinâmico do Ciclo Selecionado com Bordas de 5px */}
        {(() => {
          const cicloAtivo = CICLOS_CURRICULARES[cicloAtivoIndex];

          return (
            <div className="relative rounded-[5px] bg-white dark:bg-[#0A192F] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden transition-all duration-300">
              {/* Cabeçalho do Painel */}
              <div className="relative z-10 space-y-2 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#0A192F] text-white">
                    {cicloAtivo.faixa}
                  </span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-normal text-[#0A192F] dark:text-white">
                  {cicloAtivo.titulo} —{" "}
                  <span className="text-slate-500 dark:text-slate-400 font-normal">
                    {cicloAtivo.subtitulo}
                  </span>
                </h4>

                <p className="text-xs sm:text-sm text-[#FF2D75] font-medium italic">
                  “{cicloAtivo.lema}”
                </p>
              </div>

              {/* Interior em 2 Colunas */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Coluna Esquerda: Descrição Pedagógica e Ações */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-3">
                    <h5 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
                      Objetivo Pedagógico da Fase
                    </h5>
                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                      {cicloAtivo.descricao}
                    </p>
                  </div>

                  {/* Botão de Ação Direta */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href="/portal-encarregado/pedidos/novo"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-[5px] bg-[#0A192F] hover:bg-[#FF2D75] text-white text-xs sm:text-sm font-normal transition-colors shadow-sm group">
                      <span>Solicitar explicador</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Coluna Direita: Disciplinas Oficiais em Chips Visuais com rounded-[5px] */}
                <div className="lg:col-span-5 p-5 sm:p-6 rounded-[5px] bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-[#0A192F] dark:text-white font-semibold block">
                      Disciplinas do Currículo Português
                    </span>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Apoio especializado com recursos e exercícios alinhados às
                      aprendizagens essenciais:
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cicloAtivo.disciplinas.map((disciplina, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1.5 rounded-[5px] text-xs font-normal bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 shadow-xs hover:border-[#FF2D75]/40 transition-colors">
                        {disciplina}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                    Preparação orientada pelas metas curriculares oficiais da
                    DGE e critérios oficiais de classificação do IAVE para
                    testes e Exames Nacionais.
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
