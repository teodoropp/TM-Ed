"use client";

import React, { useState, useTransition } from "react";
import { acaoHomologarContratoAdmin } from "@/modulos/contratos/acoes";
import { DADOS_INSTITUCIONAIS_EMPRESA } from "@/modulos/contratos/clausulas";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import {
  ShieldCheck,
  Eye,
  Upload,
  CheckCircle2,
  X,
  FileSignature,
  FileText,
} from "lucide-react";

interface PropsModalHomologarContratoAdmin {
  contratoId: string;
  numeroContrato: string;
  clienteNome: string;
  biNumero?: string | null;
  biAnexoUrl?: string | null;
  assinadoPorUtilizador: boolean;
  assinadoPorAdmin: boolean;
  biAdminAnexoUrl?: string | null;
}

export function ModalHomologarContratoAdmin({
  contratoId,
  numeroContrato,
  clienteNome,
  biNumero,
  biAnexoUrl,
  assinadoPorUtilizador,
  assinadoPorAdmin,
  biAdminAnexoUrl,
}: PropsModalHomologarContratoAdmin) {
  const [aberto, setAberto] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();

  const [nomeSignatario, setNomeSignatario] = useState(DADOS_INSTITUCIONAIS_EMPRESA.responsavelNome);
  const [cargoSignatario, setCargoSignatario] = useState(DADOS_INSTITUCIONAIS_EMPRESA.responsavelCargo);
  const [biAdminUrl, setBiAdminUrl] = useState<string>(biAdminAnexoUrl || "");
  const [nomeArquivoBi, setNomeArquivoBi] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const handleUploadBiAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("O ficheiro deve ter no máximo 5MB.");
      return;
    }

    setNomeArquivoBi(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setBiAdminUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleHomologar = (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    iniciarTransicao(async () => {
      const res = await acaoHomologarContratoAdmin({
        contratoId,
        nomeAdminSignatario: nomeSignatario,
        cargoAdminSignatario: cargoSignatario,
        biAdminAnexoUrl: biAdminUrl || undefined,
      });

      if (res.sucesso) {
        setMensagem({ tipo: "sucesso", texto: res.mensagem });
        setTimeout(() => {
          setAberto(false);
          window.location.reload();
        }, 1500);
      } else {
        setMensagem({ tipo: "erro", texto: res.mensagem });
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-1.5 justify-end">
        {biAnexoUrl && (
          <Botao
            type="button"
            variante="fantasma"
            tamanho="sm"
            onClick={() => window.open(biAnexoUrl, "_blank")}
            className="text-xs h-7 text-blue-600 gap-1 px-2"
            title="Abrir cópia do BI do cliente"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver BI Pai
          </Botao>
        )}

        {assinadoPorAdmin ? (
          <Badge variante="sucesso" className="text-[11px] gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Homologado
          </Badge>
        ) : (
          <Botao
            type="button"
            variante="primario"
            tamanho="sm"
            onClick={() => setAberto(true)}
            className="text-xs h-7 gap-1 font-semibold"
          >
            <FileSignature className="w-3.5 h-3.5" />
            Homologar
          </Botao>
        )}
      </div>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Homologação Contratual da TM-Educa
                </h3>
                <p className="text-xs text-slate-500">
                  Contrato: <strong>{numeroContrato}</strong> · Cliente: <strong>{clienteNome}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAberto(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verificação do BI do Encarregado */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                1. Verificação da Identificação do Cliente:
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                BI n.º: <strong>{biNumero || "Não informado"}</strong>
              </p>
              {biAnexoUrl ? (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => window.open(biAnexoUrl, "_blank")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Abrir e Conferir Documento do BI Anexado pelo Pai
                  </button>
                </div>
              ) : (
                <p className="text-rose-500 italic">O pai ainda não anexou a cópia do BI.</p>
              )}
            </div>

            {/* Formulário de Contra-Assinatura da TM-Educa */}
            <form onSubmit={handleHomologar} className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  2. Dados de Contra-Assinatura da Entidade:
                </span>
                <p className="text-[11px] text-slate-500">
                  A homologação confere validade jurídica e permite anexar o BI do responsável para dar segurança mútua aos pais.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Responsável Signatário
                  </label>
                  <input
                    type="text"
                    value={nomeSignatario}
                    onChange={(e) => setNomeSignatario(e.target.value)}
                    required
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={cargoSignatario}
                    onChange={(e) => setCargoSignatario(e.target.value)}
                    required
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Upload da Cópia do BI da Direção */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Anexar BI do Diretor TM-Educa (Segurança aos Pais)</span>
                  <span className="text-[10px] text-slate-400">Opcional se já cadastrado</span>
                </label>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{biAdminUrl ? "Alterar BI da Direção" : "Anexar BI"}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleUploadBiAdmin}
                      className="hidden"
                    />
                  </label>

                  {biAdminUrl && (
                    <span className="text-[11px] text-emerald-600 font-medium">
                      ✓ BI da Direção pronto para o contrato
                    </span>
                  )}
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

              <div className="flex justify-end gap-2 pt-2">
                <Botao
                  type="button"
                  variante="contorno"
                  tamanho="sm"
                  onClick={() => setAberto(false)}
                  className="text-xs"
                >
                  Cancelar
                </Botao>
                <Botao
                  type="submit"
                  variante="primario"
                  tamanho="sm"
                  disabled={pendente}
                  className="gap-2 text-xs font-bold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {pendente ? "A Homologar..." : "Homologar & Contra-Assinar"}
                </Botao>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

