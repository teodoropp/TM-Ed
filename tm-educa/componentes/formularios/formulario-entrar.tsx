"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { acaoEntrar } from "@/modulos/autenticacao/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Input } from "@/componentes/ui/input";
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export function FormularioEntrar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  const [email, setEmail] = React.useState("");
  const [palavraPasse, setPalavraPasse] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);
  const [carregando, setCarregando] = React.useState(false);
  const [mensagemErro, setMensagemErro] = React.useState<string | null>(null);

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
      setMensagemErro("Ocorreu um erro de rede. Verifique a sua ligação e tente novamente.");
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={manipularSubmissao} className="space-y-5">
      {mensagemErro && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <p>{mensagemErro}</p>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          Correio Eletrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            id="email"
            type="email"
            placeholder="exemplo@tmeduca.ao"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-9"
            disabled={carregando}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="palavraPasse"
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Palavra-passe
          </label>
          <Link
            href="/recuperar-senha"
            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            Esqueceu-se da palavra-passe?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            id="palavraPasse"
            type={mostrarSenha ? "text" : "password"}
            placeholder="••••••••"
            value={palavraPasse}
            onChange={(e) => setPalavraPasse(e.target.value)}
            required
            className="pl-9 pr-10"
            disabled={carregando}
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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

      <Botao
        type="submit"
        variante="primario"
        className="w-full h-11 text-base font-semibold shadow-md shadow-blue-600/20"
        disabled={carregando}
      >
        {carregando ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            A validar acesso...
          </>
        ) : (
          "Iniciar Sessão"
        )}
      </Botao>
    </form>
  );
}
