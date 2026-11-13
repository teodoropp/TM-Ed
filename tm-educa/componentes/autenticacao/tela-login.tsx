"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { acaoEntrar, acaoAutenticarGoogle } from "@/modulos/autenticacao/acoes";
import { LogoTMEduca } from "@/componentes/ui/logo-tmeduca";
import {
  Eye,
  EyeOff,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  GraduationCap,
} from "lucide-react";

interface DiaSemanaItem {
  sigla: string;
  numero: number;
  data: Date;
  eHoje: boolean;
}

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function obterDiasDaSemana(dataReferencia: Date): DiaSemanaItem[] {
  const diaSemanaHoje = dataReferencia.getDay(); // 0 = Domingo, ..., 6 = Sábado
  const domingo = new Date(dataReferencia);
  domingo.setDate(dataReferencia.getDate() - diaSemanaHoje);
  domingo.setHours(0, 0, 0, 0);

  const siglas = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  return siglas.map((sigla, indice) => {
    const diaData = new Date(domingo);
    diaData.setDate(domingo.getDate() + indice);
    const eHoje =
      diaData.getFullYear() === dataReferencia.getFullYear() &&
      diaData.getMonth() === dataReferencia.getMonth() &&
      diaData.getDate() === dataReferencia.getDate();

    return {
      sigla,
      numero: diaData.getDate(),
      data: diaData,
      eHoje,
    };
  });
}

export function TelaLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;
  const senhaRecuperada = searchParams.get("recuperada") === "1";
  const avisoGoogle = searchParams.get("aviso_google");
  const erroParam = searchParams.get("erro");

  const [email, setEmail] = React.useState("");
  const [palavraPasse, setPalavraPasse] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);
  const [carregando, setCarregando] = React.useState(false);
  const [mensagemErro, setMensagemErro] = React.useState<string | null>(() => {
    if (erroParam === "google_cancelado") {
      return "A autenticação com o Google foi cancelada.";
    }
    if (erroParam === "google_token_invalido" || erroParam === "google_falha") {
      return "Não foi possível validar a conta Google. Tente novamente.";
    }
    if (erroParam === "google_sem_email") {
      return "A conta Google não forneceu um endereço de correio eletrónico válido.";
    }
    if (erroParam === "google_processamento") {
      return "Ocorreu um erro ao processar o acesso com a Google. Tente novamente.";
    }
    if (erroParam === "conta_inativa") {
      return "Esta conta encontra-se inativa. Contacte a administração da TM-Educa.";
    }
    return null;
  });

  // Estado para Modal de Autenticação / Registo com Google
  const [modalGoogleAberto, setModalGoogleAberto] = React.useState(() => {
    return avisoGoogle === "credenciais_ausentes";
  });
  const [emailGoogle, setEmailGoogle] = React.useState("teodorop990@gmail.com");
  const [nomeGoogle, setNomeGoogle] = React.useState("Teodoro Pedro");
  const [funcaoGoogle, setFuncaoGoogle] = React.useState<"ENCARREGADO" | "PROFESSOR">("ENCARREGADO");
  const [carregandoGoogle, setCarregandoGoogle] = React.useState(false);
  const [erroGoogle, setErroGoogle] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (avisoGoogle === "credenciais_ausentes") {
      setModalGoogleAberto(true);
    }
  }, [avisoGoogle]);

  const iniciarFluxoGoogle = () => {
    window.location.href = `/api/auth/google?funcao=ENCARREGADO&callbackUrl=${encodeURIComponent(callbackUrl || "")}&modo=entrar`;
  };

  // Gestão dinâmica da semana e seleção automática do dia de hoje
  const [dataAtual, setDataAtual] = React.useState<Date>(() => new Date());
  const [diaSelecionado, setDiaSelecionado] = React.useState<number>(
    () => new Date().getDate()
  );

  React.useEffect(() => {
    const agora = new Date();
    setDataAtual(agora);
    setDiaSelecionado(agora.getDate());
  }, []);

  const diasSemana = React.useMemo(
    () => obterDiasDaSemana(dataAtual),
    [dataAtual]
  );
  const diaHojeObj = diasSemana.find((d) => d.eHoje);
  const nomeMes = NOMES_MESES[dataAtual.getMonth()] || "Mês Atual";

  async function manipularSubmissao(e: React.FormEvent) {
    e.preventDefault();
    setMensagemErro(null);
    setCarregando(true);

    try {
      const resultado = await acaoEntrar(
        { email, palavraPasse },
        callbackUrl
      );

      if (!resultado.sucesso) {
        setMensagemErro(resultado.mensagem);
        setCarregando(false);
        return;
      }

      if (resultado.urlRedirecionamento) {
        router.push(resultado.urlRedirecionamento);
        router.refresh();
      }
    } catch {
      setMensagemErro(
        "Ocorreu um erro de rede. Verifique a sua ligação e tente novamente."
      );
      setCarregando(false);
    }
  }

  async function manipularAutenticacaoGoogle(e: React.FormEvent) {
    e.preventDefault();
    setErroGoogle(null);
    setCarregandoGoogle(true);

    try {
      const resultado = await acaoAutenticarGoogle(
        {
          email: emailGoogle,
          nomeCompleto: nomeGoogle,
          funcao: funcaoGoogle,
        },
        callbackUrl
      );

      if (!resultado.sucesso) {
        setErroGoogle(resultado.mensagem);
        setCarregandoGoogle(false);
        return;
      }

      if (resultado.urlRedirecionamento) {
        router.push(resultado.urlRedirecionamento);
        router.refresh();
      }
    } catch {
      setErroGoogle("Falha ao autenticar com o Google. Tente novamente.");
      setCarregandoGoogle(false);
    }
  }

  return (
    <div
      className="relative min-h-[100dvh] w-full bg-[#F8FAFC] flex items-center justify-center p-3 sm:p-5 font-normal selection:bg-[#FF2D75] selection:text-white lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden lg:p-6"
      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" }}
    >
      {/* LUZES AMBIENTAIS SUAVES NO FUNDO CLARO */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-[10px] bg-slate-200/50 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-[10px] bg-[#FF2D75]/5 blur-[150px] pointer-events-none" />

      {/* CARD PRINCIPAL FLUTUANTE EM AZUL ESCURO INSTITUCIONAL COM BORDAS DE 10PX */}
      <div className="relative w-full max-w-[960px] bg-[#0A192F] rounded-[10px] shadow-2xl shadow-[#0A192F]/20 border border-slate-800/80 overflow-hidden flex flex-col lg:h-[calc(100dvh-3rem)] lg:max-h-[720px]">
        
        {/* BOTÃO FECHAR GLOBAL (MOBILE / TOPO DIREITO) */}
        <Link
          href="/"
          aria-label="Voltar à página inicial"
          className="lg:hidden absolute top-4 right-4 z-30 h-9 w-9 rounded-[10px] bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm"
        >
          <X className="h-4 w-4" />
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:flex-1 lg:min-h-0">
          
          {/* COLUNA ESQUERDA: FORMULÁRIO DE LOGIN EM AZUL ESCURO */}
          <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between bg-[#0A192F] text-white lg:overflow-y-auto sem-barra">
            <div className="shrink-0">
              {/* CABEÇALHO DO CARD COM LOGO OFICIAL EM FUNDO ESCURO */}
              <div className="flex items-center justify-between mb-5">
                <Link
                  href="/"
                  className="group flex items-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <LogoTMEduca tamanho="sm" variante="horizontal" corTexto="claro" />
                </Link>
              </div>

              {/* TÍTULO E SUBTÍTULO EM SEGOE REGULAR */}
              <div className="space-y-1.5 mb-4">
                <h1 className="text-2xl sm:text-[28px] font-normal text-white tracking-normal">
                  Entrar na Conta
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-normal">
                  Aceda ao ecossistema de excelência pedagógica de Angola
                </p>
              </div>

              {/* FEEDBACK DE RECUPERAÇÃO DE SENHA */}
              {senhaRecuperada && !mensagemErro && (
                <div className="mb-4 flex items-center gap-2.5 rounded-[10px] border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-200 shadow-sm animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <p>Palavra-passe atualizada com sucesso! Inicie sessão com a sua nova senha.</p>
                </div>
              )}

              {/* FEEDBACK DE ERRO */}
              {mensagemErro && (
                <div className="mb-4 flex items-center gap-2.5 rounded-[10px] border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-200 shadow-sm animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <p>{mensagemErro}</p>
                </div>
              )}

              {/* FORMULÁRIO */}
              <form onSubmit={manipularSubmissao} className="space-y-3">
                {/* CAMPO: CORREIO ELETRÓNICO */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-[11px] sm:text-xs font-normal text-slate-300 tracking-normal"
                  >
                    Correio Eletrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="exemplo@tmeduca.ao"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={carregando}
                    className="w-full h-11 lg:h-10 px-4 rounded-[10px] bg-[#102A45]/70 hover:bg-[#102A45] focus:bg-[#102A45] text-sm text-white placeholder-slate-400 border border-slate-700/80 focus:border-[#FF2D75] focus:outline-none focus:ring-2 focus:ring-[#FF2D75]/30 transition-all font-normal shadow-inner"
                  />
                </div>

                {/* CAMPO: PALAVRA-PASSE */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="palavraPasse"
                      className="block text-[11px] sm:text-xs font-normal text-slate-300 tracking-normal"
                    >
                      Palavra-passe
                    </label>
                    <Link
                      href="/recuperar-senha"
                      className="text-[11px] text-[#FF2D75] hover:text-[#fb7185] font-normal hover:underline"
                    >
                      Esqueceu-se?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="palavraPasse"
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={palavraPasse}
                      onChange={(e) => setPalavraPasse(e.target.value)}
                      required
                      disabled={carregando}
                      className="w-full h-11 lg:h-10 pl-4 pr-11 rounded-[10px] bg-[#102A45]/70 hover:bg-[#102A45] focus:bg-[#102A45] text-sm text-white placeholder-slate-400 border border-slate-700/80 focus:border-[#FF2D75] focus:outline-none focus:ring-2 focus:ring-[#FF2D75]/30 transition-all font-normal shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                      aria-label={mostrarSenha ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                      tabIndex={-1}
                    >
                      {mostrarSenha ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ITENS DE VALIDAÇÃO ESTILO MOCKUP */}
                <div className="pt-0.5 pb-1 space-y-1 text-[11px] text-slate-300 font-normal">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#FF2D75]" />
                    <span>Mínimo de 6 caracteres</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#FF2D75]" />
                    <span>Acesso encriptado a dados e portais</span>
                  </div>
                </div>

                {/* BOTÃO PRINCIPAL (SUBMIT) COM BORDAS DE 10PX */}
                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full h-11 lg:h-10 rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] active:scale-[0.99] text-white font-normal text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-black/30 hover:shadow-black/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {carregando ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>A validar acesso...</span>
                    </>
                  ) : (
                    <span>INICIAR SESSÃO</span>
                  )}
                </button>
              </form>

              {/* SEPARADOR VISUAL */}
              <div className="my-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-[11px] text-slate-400 font-normal">ou aceda com</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              {/* APENAS O BOTÃO DA GOOGLE (SEM APPLE) COM ACESSO REAL E REGISTO */}
              <div>
                <button
                  type="button"
                  onClick={iniciarFluxoGoogle}
                  className="w-full h-11 lg:h-10 px-4 rounded-[10px] bg-[#102A45]/60 hover:bg-[#102A45] active:scale-[0.99] border border-slate-700/80 text-white text-xs font-normal flex items-center justify-center gap-3 transition-all shadow-sm hover:border-slate-600 cursor-pointer"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continuar com o Google</span>
                </button>
              </div>
            </div>

            {/* RODAPÉ DO FORMULÁRIO */}
            <div className="mt-5 pt-3 border-t border-slate-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-400 font-normal">
              <div>
                Ainda não tem conta?{" "}
                <Link
                  href="/registar"
                  className="font-normal text-[#FF2D75] hover:text-[#fb7185] hover:underline"
                >
                  Registar
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/sobre"
                  className="hover:underline text-slate-400 hover:text-white font-normal"
                >
                  Termos & Condições
                </Link>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: IMAGEM HERO COM WIDGETS FLUTUANTES (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-7 p-4 bg-[#0A192F] min-h-0">
            <div className="relative w-full h-full min-h-0 rounded-[10px] overflow-hidden shadow-xl border border-slate-800/80 bg-[#0A192F]">
              
              {/* IMAGEM DE EDUCAÇÃO REALISTA TM-EDUCA */}
              <Image
                src="/imagens/login-hero.jpg"
                alt="Acompanhamento escolar e tutoria pedagógica TM-Educa"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />

              {/* GRADIENTE SUAVE DE PROFUNDIDADE EM AZUL MARINHO TM-EDUCA */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/15 to-black/20 pointer-events-none" />

              {/* BOTÃO FECHAR (✕) NO TOPO DIREITO DO CARD DE IMAGEM */}
              <Link
                href="/"
                aria-label="Fechar e voltar à página inicial"
                className="absolute top-4 right-4 z-20 h-9 w-9 rounded-[10px] bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <X className="h-4 w-4" />
              </Link>

              {/* WIDGET FLUTUANTE: BARRA DE CALENDÁRIO REBAIXADA PARA LIBERTAR OS ROSTOS DA FOTO */}
              <div className="absolute inset-x-4 bottom-3 z-20 flex justify-center">
                
                {/* BARRA DE CALENDÁRIO COM MARCAÇÃO DO DIA DE HOJE (BORDAS 10PX, SEM PONTINHO, FONTE REGULAR) */}
                <div className="w-full max-w-[400px] bg-[#0A192F]/80 backdrop-blur-xl border border-white/20 rounded-[10px] p-3 sm:p-3.5 text-white shadow-2xl">
                  {/* CABEÇALHO DO CALENDÁRIO: TEXTO LIMPO, SEM BORDA, SEM FUNDO E SEM PONTO */}
                  <div className="flex items-center justify-between text-[11px] text-white/90 font-normal mb-2 px-0.5">
                    <span className="flex items-center gap-1.5 font-normal text-white">
                      <Calendar className="h-3.5 w-3.5 text-[#FF2D75]" />
                      <span>{nomeMes} • Semana Atual</span>
                    </span>
                    {diaHojeObj && (
                      <span className="text-[11px] font-normal text-white/90">
                        Hoje: {diaHojeObj.sigla} {diaHojeObj.numero}
                      </span>
                    )}
                  </div>

                  {/* CABEÇALHO DOS DIAS DA SEMANA */}
                  <div className="grid grid-cols-7 text-center text-[10px] uppercase font-normal text-white/70 tracking-wider mb-1.5">
                    {diasSemana.map((dia) => (
                      <span key={dia.sigla}>{dia.sigla}</span>
                    ))}
                  </div>

                  {/* NÚMEROS DOS DIAS COM HOJE SELECIONADO (SEM PONTINHO, CURVA 10PX) */}
                  <div className="grid grid-cols-7 text-center text-xs font-normal text-white/90 gap-1">
                    {diasSemana.map((dia) => {
                      const estaSelecionado = dia.numero === diaSelecionado;

                      if (estaSelecionado) {
                        return (
                          <button
                            key={dia.sigla}
                            type="button"
                            onClick={() => setDiaSelecionado(dia.numero)}
                            title={dia.eHoje ? "Dia de hoje (selecionado)" : `Dia ${dia.numero}`}
                            className="py-1.5 px-1 rounded-[10px] bg-white text-[#0A192F] font-normal shadow-md flex items-center justify-center transition-all scale-105"
                          >
                            <span>{dia.numero}</span>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={dia.sigla}
                          type="button"
                          onClick={() => setDiaSelecionado(dia.numero)}
                          title={dia.eHoje ? "Dia de hoje" : `Dia ${dia.numero}`}
                          className="py-1.5 px-1 rounded-[10px] text-white/80 font-normal hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                        >
                          <span>{dia.numero}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* MODAL DE AUTENTICAÇÃO E REGISTO COM CONTA GOOGLE (CURVAS DE 10PX, SEGOE REGULAR) */}
      {modalGoogleAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0A192F] text-white rounded-[10px] border border-slate-700 p-6 shadow-2xl">
            
            <button
              type="button"
              onClick={() => setModalGoogleAberto(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-[10px] bg-[#102A45] hover:bg-[#16385C] text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-[10px] bg-white flex items-center justify-center shadow-md">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base text-white font-normal">
                  Autenticação com o Google
                </h3>
                <p className="text-xs text-slate-400 font-normal">
                  {avisoGoogle === "credenciais_ausentes"
                    ? "Configuração de chaves Google no ficheiro .env"
                    : "Aceder ou registar nova conta na TM-Educa"}
                </p>
              </div>
            </div>

            {avisoGoogle === "credenciais_ausentes" && (
              <div className="mb-4 rounded-[10px] border border-amber-500/40 bg-amber-950/50 p-3.5 text-xs text-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>Para ativar o Login Real da Google:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Adicione as seguintes linhas ao seu ficheiro <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300 font-mono">.env</code>:
                </p>
                <div className="bg-black/70 p-2.5 rounded-[8px] font-mono text-[11px] text-emerald-400 select-all border border-slate-700/60 leading-relaxed">
                  GOOGLE_CLIENT_ID=&quot;seu_client_id.apps.googleusercontent.com&quot;<br />
                  GOOGLE_CLIENT_SECRET=&quot;seu_client_secret&quot;
                </div>
                <p className="text-[10px] text-slate-400">
                  URI de redirecionamento autorizada na Google Cloud Console:<br />
                  <span className="text-white font-mono select-all">http://localhost:3000/api/auth/callback/google</span>
                </p>
                <div className="pt-1 text-[11px] text-amber-300 font-semibold border-t border-amber-500/20">
                  Entretanto, pode testar o acesso imediato abaixo:
                </div>
              </div>
            )}

            {erroGoogle && (
              <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <p>{erroGoogle}</p>
              </div>
            )}

            <form onSubmit={manipularAutenticacaoGoogle} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs text-slate-300 font-normal">
                  Conta Google (Correio Eletrónico)
                </label>
                <input
                  type="email"
                  value={emailGoogle}
                  onChange={(e) => setEmailGoogle(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  required
                  className="w-full h-10 px-3.5 rounded-[10px] bg-[#102A45] border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#FF2D75] font-normal"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-slate-300 font-normal">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nomeGoogle}
                  onChange={(e) => setNomeGoogle(e.target.value)}
                  placeholder="O seu nome"
                  required
                  className="w-full h-10 px-3.5 rounded-[10px] bg-[#102A45] border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#FF2D75] font-normal"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-slate-300 font-normal">
                  Tipo de Perfil (em caso de novo registo)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFuncaoGoogle("ENCARREGADO")}
                    className={`h-9 px-3 rounded-[10px] text-xs font-normal flex items-center justify-center gap-1.5 border transition-all ${
                      funcaoGoogle === "ENCARREGADO"
                        ? "bg-[#E11D48] text-white border-[#E11D48]"
                        : "bg-[#102A45] text-slate-300 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    Pais
                  </button>

                  <button
                    type="button"
                    onClick={() => setFuncaoGoogle("PROFESSOR")}
                    className={`h-9 px-3 rounded-[10px] text-xs font-normal flex items-center justify-center gap-1.5 border transition-all ${
                      funcaoGoogle === "PROFESSOR"
                        ? "bg-[#E11D48] text-white border-[#E11D48]"
                        : "bg-[#102A45] text-slate-300 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    Professor
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={carregandoGoogle}
                  className="w-full h-11 rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] text-white text-xs uppercase tracking-wider font-normal flex items-center justify-center gap-2 shadow-lg shadow-black/30 cursor-pointer disabled:opacity-75"
                >
                  {carregandoGoogle ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>A processar com o Google...</span>
                    </>
                  ) : (
                    <span>Confirmar e Entrar com Google</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
