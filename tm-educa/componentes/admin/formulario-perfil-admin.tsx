"use client";

import * as React from "react";
import Image from "next/image";
import {
  acaoAtualizarPerfilAdmin,
  acaoCarregarFotoAdmin,
  acaoRemoverFotoAdmin,
} from "@/modulos/administradores/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Input } from "@/componentes/ui/input";
import { Loader2, CheckCircle2, AlertCircle, Camera, Trash2, User } from "lucide-react";

interface PropriedadesFormularioPerfilAdmin {
  perfilInicial: {
    nomeCompleto: string;
    email: string;
    telefone: string;
    departamento?: string | null;
    cargo?: string | null;
    fotoUrl?: string | null;
  };
}

export function FormularioPerfilAdmin({
  perfilInicial,
}: PropriedadesFormularioPerfilAdmin) {
  const [nomeCompleto, setNomeCompleto] = React.useState(
    perfilInicial.nomeCompleto
  );
  const [telefone, setTelefone] = React.useState(perfilInicial.telefone);
  const [departamento, setDepartamento] = React.useState(
    perfilInicial.departamento || ""
  );
  const [cargo, setCargo] = React.useState(perfilInicial.cargo || "");

  const [fotoUrl, setFotoUrl] = React.useState<string | null>(
    perfilInicial.fotoUrl || null
  );
  const [preVisualizacao, setPreVisualizacao] = React.useState<string | null>(
    null
  );

  const [carregando, setCarregando] = React.useState(false);
  const [carregandoFoto, setCarregandoFoto] = React.useState(false);
  const [mensagemSucesso, setMensagemSucesso] = React.useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = React.useState<string | null>(null);

  const campoFotoRef = React.useRef<HTMLInputElement>(null);
  const iniciais = nomeCompleto
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");

  async function guardar(evento: React.FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setMensagemSucesso(null);
    setMensagemErro(null);

    try {
      const resposta = await acaoAtualizarPerfilAdmin({
        nomeCompleto,
        telefone,
        departamento,
        cargo,
      });

      if (!resposta.sucesso) {
        setMensagemErro(resposta.mensagem);
        setCarregando(false);
        return;
      }

      setMensagemSucesso(resposta.mensagem);
    } catch {
      setMensagemErro("Ocorreu um erro de rede ao guardar o perfil.");
    } finally {
      setCarregando(false);
    }
  }

  async function carregarFoto(evento: React.ChangeEvent<HTMLInputElement>) {
    const ficheiro = evento.target.files?.[0];
    if (!ficheiro) return;

    setCarregandoFoto(true);
    setMensagemSucesso(null);
    setMensagemErro(null);

    try {
      const resposta = await acaoCarregarFotoAdmin(ficheiro);

      if (!resposta.sucesso) {
        setMensagemErro(resposta.mensagem);
        return;
      }

      setFotoUrl(resposta.url ?? null);
      setPreVisualizacao(null);
      setMensagemSucesso(resposta.mensagem);
    } catch {
      setMensagemErro("Ocorreu um erro de rede ao carregar a fotografia.");
    } finally {
      setCarregandoFoto(false);
      if (campoFotoRef.current) campoFotoRef.current.value = "";
    }
  }

  async function removerFoto() {
    setCarregandoFoto(true);
    setMensagemSucesso(null);
    setMensagemErro(null);

    try {
      const resposta = await acaoRemoverFotoAdmin();

      if (!resposta.sucesso) {
        setMensagemErro(resposta.mensagem);
        return;
      }

      setFotoUrl(null);
      setMensagemSucesso(resposta.mensagem);
    } catch {
      setMensagemErro("Ocorreu um erro de rede ao remover a fotografia.");
    } finally {
      setCarregandoFoto(false);
    }
  }

  const imagemAtual = preVisualizacao ?? fotoUrl;

  return (
    <form onSubmit={guardar} className="space-y-5">
      {mensagemErro && (
        <div className="flex items-center gap-2.5 rounded-[10px] border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <p>{mensagemErro}</p>
        </div>
      )}

      {mensagemSucesso && (
        <div className="flex items-center gap-2.5 rounded-[10px] border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <p>{mensagemSucesso}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* FOTOGRAFIA */}
        <div className="lg:col-span-4">
          <div className="rounded-[10px] border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
              Fotografia de perfil
            </p>

            <div className="mt-4 flex flex-col items-center gap-3">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                {imagemAtual ? (
                  <Image
                    src={imagemAtual}
                    alt="Fotografia do administrador"
                    fill
                    sizes="112px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-2xl text-slate-400">
                    {iniciais || <User className="h-8 w-8" />}
                  </span>
                )}
              </div>

              <input
                ref={campoFotoRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={carregarFoto}
                className="hidden"
                id="fotoAdministrador"
              />

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Botao
                  type="button"
                  variante="contorno"
                  tamanho="sm"
                  onClick={() => campoFotoRef.current?.click()}
                  disabled={carregandoFoto}
                  className="gap-1.5"
                >
                  {carregandoFoto ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Camera className="h-3.5 w-3.5" />
                  )}
                  {fotoUrl ? "Substituir foto" : "Carregar foto"}
                </Botao>

                {fotoUrl && (
                  <Botao
                    type="button"
                    variante="fantasma"
                    tamanho="sm"
                    onClick={removerFoto}
                    disabled={carregandoFoto}
                    className="gap-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </Botao>
                )}
              </div>

              <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                PNG, JPG ou WEBP · máximo 2 MB
              </p>
            </div>
          </div>
        </div>

        {/* DADOS */}
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-[10px] border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="nomeCompletoAdmin"
                  className="block text-[11px] text-slate-500 dark:text-slate-400"
                >
                  Nome completo
                </label>
                <Input
                  id="nomeCompletoAdmin"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  required
                  disabled={carregando}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="emailAdmin"
                  className="block text-[11px] text-slate-500 dark:text-slate-400"
                >
                  E-mail (inalterável)
                </label>
                <Input
                  id="emailAdmin"
                  value={perfilInicial.email}
                  disabled
                  readOnly
                  className="opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="telefoneAdmin"
                  className="block text-[11px] text-slate-500 dark:text-slate-400"
                >
                  Telefone
                </label>
                <Input
                  id="telefoneAdmin"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  disabled={carregando}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="departamentoAdmin"
                  className="block text-[11px] text-slate-500 dark:text-slate-400"
                >
                  Departamento
                </label>
                <Input
                  id="departamentoAdmin"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  placeholder="Direção Pedagógica"
                  disabled={carregando}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="cargoAdmin"
                  className="block text-[11px] text-slate-500 dark:text-slate-400"
                >
                  Cargo
                </label>
                <Input
                  id="cargoAdmin"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Administrador Master"
                  disabled={carregando}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Botao type="submit" disabled={carregando} className="gap-2">
              {carregando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A guardar...
                </>
              ) : (
                "Guardar perfil"
              )}
            </Botao>
          </div>
        </div>
      </div>
    </form>
  );
}
