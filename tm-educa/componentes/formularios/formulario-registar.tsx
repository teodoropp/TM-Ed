"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { acaoRegistar, acaoAutenticarGoogle } from "@/modulos/autenticacao/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Input } from "@/componentes/ui/input";
import {
  Users,
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FormularioRegistar() {
  const router = useRouter();

  const [funcao, setFuncao] = React.useState<"ENCARREGADO" | "PROFESSOR">(
    "ENCARREGADO"
  );
  const [nomeCompleto, setNomeCompleto] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [palavraPasse, setPalavraPasse] = React.useState("");
  const [confirmarPalavraPasse, setConfirmarPalavraPasse] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const [carregando, setCarregando] = React.useState(false);
  const [mensagemErro, setMensagemErro] = React.useState<string | null>(null);

  const [modalGoogleAberto, setModalGoogleAberto] = React.useState(false);
  const [emailGoogle, setEmailGoogle] = React.useState("");
  const [nomeGoogle, setNomeGoogle] = React.useState("");
  const [carregandoGoogle, setCarregandoGoogle] = React.useState(false);

  const iniciarFluxoGoogle = () => {
    window.location.href = `/api/auth/google?funcao=${funcao || "ENCARREGADO"}&modo=registar`;
  };

  async function manipularRegistoGoogle(e: React.FormEvent) {
    e.preventDefault();
    setMensagemErro(null);
    setCarregandoGoogle(true);

    try {
      const resultado = await acaoAutenticarGoogle({
        email: emailGoogle,
        nomeCompleto: nomeGoogle,
        funcao,
      });

      if (!resultado.sucesso) {
        setMensagemErro(resultado.mensagem);
        setCarregandoGoogle(false);
        return;
      }

      if (resultado.urlRedirecionamento) {
        router.push(resultado.urlRedirecionamento);
        router.refresh();
      }
    } catch {
      setMensagemErro("Erro ao registar com o Google. Tente novamente.");
      setCarregandoGoogle(false);
    }
  }

  async function manipularSubmissao(e: React.FormEvent) {
    e.preventDefault();
    setMensagemErro(null);

    if (palavraPasse !== confirmarPalavraPasse) {
      setMensagemErro("As palavras-passe introduzidas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      const resultado = await acaoRegistar({
        nomeCompleto,
        email,
        telefone,
        palavraPasse,
        funcao,
      });

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
      setMensagemErro("Ocorreu um erro de comunicação. Por favor, tente novamente.");
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={manipularSubmissao} className="space-y-6">
      {mensagemErro && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <p>{mensagemErro}</p>
        </div>
      )}

      {/* Seleção Interativa do Tipo de Conta */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
          Tipo de Utilizador
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFuncao("ENCARREGADO")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all text-center gap-2 cursor-pointer",
              funcao === "ENCARREGADO"
                ? "border-blue-600 bg-blue-50/70 text-blue-900 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-500 shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            )}
          >
            <div
              className={cn(
                "p-2.5 rounded-xl transition-colors",
                funcao === "ENCARREGADO"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              )}
            >
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Pais</div>
              <div className="text-[11px] opacity-75">Para os meus filhos</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFuncao("PROFESSOR")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all text-center gap-2 cursor-pointer",
              funcao === "PROFESSOR"
                ? "border-amber-500 bg-amber-50/70 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-400 shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            )}
          >
            <div
              className={cn(
                "p-2.5 rounded-xl transition-colors",
                funcao === "PROFESSOR"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              )}
            >
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Professor</div>
              <div className="text-[11px] opacity-75">Quero lecionar</div>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Nome Completo */}
        <div className="space-y-1.5">
          <label
            htmlFor="nomeCompleto"
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="nomeCompleto"
              type="text"
              placeholder="Ex.: Manuel António Silva"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
              className="pl-9"
              disabled={carregando}
            />
          </div>
        </div>

        {/* Correio Eletrónico */}
        <div className="space-y-1.5">
          <label
            htmlFor="emailRegisto"
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Correio Eletrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="emailRegisto"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-9"
              disabled={carregando}
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="space-y-1.5">
          <label
            htmlFor="telefone"
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Telefone de Contacto
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="telefone"
              type="tel"
              placeholder="923 000 000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              className="pl-9"
              disabled={carregando}
            />
          </div>
        </div>

        {/* Palavra-passe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="palavraPasseRegisto"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Palavra-passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="palavraPasseRegisto"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={palavraPasse}
                onChange={(e) => setPalavraPasse(e.target.value)}
                required
                className="pl-9 pr-9"
                disabled={carregando}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmarSenha"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Confirmar Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="confirmarSenha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Repita a palavra-passe"
                value={confirmarPalavraPasse}
                onChange={(e) => setConfirmarPalavraPasse(e.target.value)}
                required
                className="pl-9 pr-9"
                disabled={carregando}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
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
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 text-xs text-slate-500 flex items-start gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
        <p>
          Ao criar conta, concorda com os Termos de Prestação de Serviços da TM-Educa e a Política de Privacidade de dados dos filhos.
        </p>
      </div>

      <Botao
        type="submit"
        variante={funcao === "ENCARREGADO" ? "primario" : "destaque"}
        className="w-full h-11 text-base font-semibold shadow-md rounded-[10px]"
        disabled={carregando}
      >
        {carregando ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            A criar conta...
          </>
        ) : (
          `Registar como ${funcao === "ENCARREGADO" ? "Pais" : "Professor"}`
        )}
      </Botao>

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
        <span className="relative bg-white px-3 text-xs text-slate-400 dark:bg-slate-900">ou registe-se com</span>
      </div>

      <button
        type="button"
        onClick={iniciarFluxoGoogle}
        className="w-full h-11 px-4 rounded-[10px] bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-xs font-normal flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer"
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
        <span>Registar rapidamente com o Google</span>
      </button>

      {/* Modal de Registo com Google */}
      {modalGoogleAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-[10px] border border-slate-200 dark:border-slate-700 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setModalGoogleAberto(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-[#102A45] dark:hover:bg-[#16385C] text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors"
            >
              <EyeOff className="h-4 w-4 hidden" />
              <span>✕</span>
            </button>

            <h3 className="text-base font-normal mb-1">Registar com a Google</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-normal">
              Crie a sua conta como {funcao === "ENCARREGADO" ? "Pais" : "Professor"} num clique.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-normal mb-1 text-slate-700 dark:text-slate-300">
                  Correio Eletrónico Google
                </label>
                <Input
                  type="email"
                  value={emailGoogle}
                  onChange={(e) => setEmailGoogle(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  required
                  className="rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-xs font-normal mb-1 text-slate-700 dark:text-slate-300">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  value={nomeGoogle}
                  onChange={(e) => setNomeGoogle(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="rounded-[10px]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={manipularRegistoGoogle}
                  disabled={carregandoGoogle || !emailGoogle}
                  className="w-full h-11 rounded-[10px] bg-gradient-to-r from-[#FF2D75] to-[#E11D48] hover:from-[#E11D48] hover:to-[#BE123C] text-white text-xs uppercase tracking-wider font-normal flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-75"
                >
                  {carregandoGoogle ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>A criar conta com o Google...</span>
                    </>
                  ) : (
                    <span>Confirmar Registo Google</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
