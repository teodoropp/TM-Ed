"use client";

import React, { useState, useTransition } from "react";
import { CLAUSULAS_CONTRATO_PAIS, DADOS_INSTITUCIONAIS_EMPRESA } from "@/modulos/contratos/clausulas";
import { acaoSubmeterContratoPai } from "@/modulos/contratos/acoes";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Badge } from "@/componentes/ui/badge";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Upload,
  Eye,
  Download,
  AlertTriangle,
  User,
  GraduationCap,
  Calendar,
  Lock,
  Printer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PropsAssinadorContratoPais {
  nomePai: string;
  telefonePai: string;
  emailPai: string;
  estadoContrato: {
    temContrato: boolean;
    contratoId?: string;
    numeroContrato?: string;
    assinadoPeloPai: boolean;
    assinadoPeloAdmin: boolean;
    dataAssinaturaPai?: Date | null;
    dataAssinaturaAdmin?: Date | null;
    biNumero?: string | null;
    biAnexoUrl?: string | null;
    biAdminAnexoUrl?: string | null;
    prazoLimiteAssinatura: Date;
    diasRestantes: number;
    prazoExpirado: boolean;
    alunoNome?: string;
    alunoClasse?: string;
    alunoIdade?: string;
    morada?: string;
  };
}

export function AssinadorContratoPais({
  nomePai,
  telefonePai,
  emailPai,
  estadoContrato,
}: PropsAssinadorContratoPais) {
  const [pendente, iniciarTransicao] = useTransition();

  // Estados do Formulário
  const [biNumero, setBiNumero] = useState(estadoContrato.biNumero || "");
  const [morada, setMorada] = useState(estadoContrato.morada || "");
  const [alunoNome, setAlunoNome] = useState(estadoContrato.alunoNome || "");
  const [alunoClasseAno, setAlunoClasseAno] = useState(estadoContrato.alunoClasse || "");
  const [alunoIdade, setAlunoIdade] = useState(estadoContrato.alunoIdade || "");
  const [biAnexoUrl, setBiAnexoUrl] = useState<string>(estadoContrato.biAnexoUrl || "");
  const [nomeArquivoBi, setNomeArquivoBi] = useState<string>("");
  const [declaracaoAceite, setDeclaracaoAceite] = useState(false);

  // Mensagens e UI
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [clausulaExpandida, setClausulaExpandida] = useState<number | null>(null);
  const [modalBiAberto, setModalBiAberto] = useState(false);

  // Manipular upload do BI (conversão segura para Data URL)
  const handleUploadBi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("O ficheiro deve ter no máximo 5MB.");
      return;
    }

    setNomeArquivoBi(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setBiAnexoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmeter = (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    if (!biAnexoUrl) {
      setMensagem({
        tipo: "erro",
        texto: "Por favor, anexe a cópia do seu Bilhete de Identidade (BI).",
      });
      return;
    }

    iniciarTransicao(async () => {
      const res = await acaoSubmeterContratoPai({
        contratoId: estadoContrato.contratoId,
        biNumero,
        morada,
        alunoNome,
        alunoClasseAno,
        alunoIdade,
        biAnexoUrl,
        declaracaoAceite,
      });

      if (res.sucesso) {
        setMensagem({ tipo: "sucesso", texto: res.mensagem });
        window.location.reload();
      } else {
        setMensagem({ tipo: "erro", texto: res.mensagem });
      }
    });
  };

  // 1. CASO JÁ HOMOLOGADO PELA ADMINISTRAÇÃO E PELO PAI
  if (estadoContrato.assinadoPeloPai && estadoContrato.assinadoPeloAdmin) {
    return (
      <div className="space-y-6">
        {/* Banner de Contrato Homologado */}
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-teal-50/50 p-6 dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-transparent">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Contrato Homologado e Válido Juridicamente
                  </h3>
                  <Badge variante="sucesso" className="text-xs">
                    Ativo
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  N.º do Contrato: <strong>{estadoContrato.numeroContrato}</strong> · Celebrado entre{" "}
                  <strong>{DADOS_INSTITUCIONAIS_EMPRESA.nomeOficial}</strong> e <strong>{nomePai}</strong>.
                </p>
                <p className="text-[11px] text-slate-500">
                  Assinado pelo Encarregado em{" "}
                  {estadoContrato.dataAssinaturaPai
                    ? new Date(estadoContrato.dataAssinaturaPai).toLocaleDateString("pt-AO")
                    : "—"}{" "}
                  · Contra-assinado pela Direção em{" "}
                  {estadoContrato.dataAssinaturaAdmin
                    ? new Date(estadoContrato.dataAssinaturaAdmin).toLocaleDateString("pt-AO")
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Botao
                variante="primario"
                tamanho="sm"
                onClick={() => window.print()}
                className="gap-2 text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir / PDF
              </Botao>

              {estadoContrato.biAdminAnexoUrl && (
                <Botao
                  variante="contorno"
                  tamanho="sm"
                  onClick={() => window.open(estadoContrato.biAdminAnexoUrl!, "_blank")}
                  className="gap-2 text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver BI da Direção
                </Botao>
              )}
            </div>
          </div>
        </div>

        {/* Pré-visualização do Documento Completo Timbrado */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 text-center space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900 dark:text-white">
              {DADOS_INSTITUCIONAIS_EMPRESA.nomeOficial}
            </h2>
            <p className="text-xs font-semibold text-[#FF2D75] uppercase tracking-wider">
              {DADOS_INSTITUCIONAIS_EMPRESA.subtitulo}
            </p>
            <p className="text-xs text-slate-500">
              Contrato de Prestação de Serviços Educativos · N.º {estadoContrato.numeroContrato}
            </p>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl">
            <p>
              <strong>Entre:</strong> {DADOS_INSTITUCIONAIS_EMPRESA.nomeOficial}, representada pelo seu Diretor Geral{" "}
              <strong>{DADOS_INSTITUCIONAIS_EMPRESA.responsavelNome}</strong>, portador do BI n.º{" "}
              <strong>{DADOS_INSTITUCIONAIS_EMPRESA.responsavelBi}</strong>, doravante designada por Prestadora de Serviços;
            </p>
            <p>
              <strong>E:</strong> O(A) Encarregado(a) de Educação <strong>{nomePai}</strong>, portador(a) do BI n.º{" "}
              <strong>{estadoContrato.biNumero || "Conforme anexo"}</strong>, contacto{" "}
              <strong>{telefonePai}</strong>, morada <strong>{estadoContrato.morada || "Conforme cadastro"}</strong>, na
              qualidade de Encarregado(a) de Educação do(a) aluno(a) <strong>{estadoContrato.alunoNome}</strong> (Classe/Ano:{" "}
              <strong>{estadoContrato.alunoClasse}</strong>, Idade: <strong>{estadoContrato.alunoIdade || "—"}</strong> anos).
            </p>
          </div>

          {/* Cláusulas em Texto Legal */}
          <div className="space-y-4 pt-2">
            {CLAUSULAS_CONTRATO_PAIS.map((c) => (
              <div key={c.numero} className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                  {c.titulo}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {c.conteudo}
                </p>
              </div>
            ))}
          </div>

          {/* Área de Assinaturas e Carimbos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF2D75]">
                Pela Prestadora (TM-Educa)
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {DADOS_INSTITUCIONAIS_EMPRESA.responsavelNome}
              </p>
              <p className="text-[11px] text-slate-500">
                {DADOS_INSTITUCIONAIS_EMPRESA.responsavelCargo}
              </p>
              <div className="pt-2 text-[10px] text-emerald-600 font-semibold">
                ✓ Assinado e Homologado Digitalmente
              </div>
              <p className="text-[10px] text-slate-400">
                Data: {estadoContrato.dataAssinaturaAdmin ? new Date(estadoContrato.dataAssinaturaAdmin).toLocaleDateString("pt-AO") : "—"}
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Pelo Encarregado de Educação
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {nomePai}
              </p>
              <p className="text-[11px] text-slate-500">
                BI n.º {estadoContrato.biNumero}
              </p>
              <div className="pt-2 text-[10px] text-emerald-600 font-semibold">
                ✓ Assinado com Anexo de BI
              </div>
              <p className="text-[10px] text-slate-400">
                Data: {estadoContrato.dataAssinaturaPai ? new Date(estadoContrato.dataAssinaturaPai).toLocaleDateString("pt-AO") : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. CASO O PAI JÁ TENHA ASSINADO E ESTEJA A AGUARDAR HOMOLOGAÇÃO
  if (estadoContrato.assinadoPeloPai && !estadoContrato.assinadoPeloAdmin) {
    return (
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50 p-6 dark:border-amber-900/50 dark:from-amber-950/40 dark:to-transparent space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Contrato Assinado com Sucesso · A Aguardar Homologação
              </h3>
              <Badge variante="aviso" className="text-xs">
                Em Conferência
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Obrigado, <strong>{nomePai}</strong>. Os seus dados e a cópia do seu Bilhete de Identidade (BI n.º{" "}
              <strong>{estadoContrato.biNumero}</strong>) foram rececionados com sucesso.
            </p>
            <p className="text-xs text-slate-500 pt-1">
              A Direção da TM-Educa está a validar o processo e procederá à contra-assinatura formal com a inclusão do
              BI da Direção para sua total segurança jurídica. Receberá uma notificação assim que for concluído.
            </p>
          </div>
        </div>

        {estadoContrato.biAnexoUrl && (
          <div className="pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
            <span className="text-xs text-slate-500">Documento anexado: Cópia do Bilhete de Identidade</span>
            <Botao
              variante="contorno"
              tamanho="sm"
              onClick={() => window.open(estadoContrato.biAnexoUrl!, "_blank")}
              className="gap-2 text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Ver BI Anexado
            </Botao>
          </div>
        )}
      </div>
    );
  }

  // 3. CASO AINDA NÃO TENHA ASSINADO (FLUXO COMPLETO DE ASSINATURA)
  return (
    <div className="space-y-8">
      {/* Alerta de Boas-Vindas com o Prazo de 7 Dias */}
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Prazo Regulamentar de 7 Dias para Formalização
              </span>
              <Badge
                variante={estadoContrato.prazoExpirado ? "perigo" : "aviso"}
                className="text-xs"
              >
                {estadoContrato.prazoExpirado
                  ? "Prazo Expirado"
                  : `${estadoContrato.diasRestantes} dias restantes`}
              </Badge>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Bem-vindo à <strong>TM-Educa</strong>! Como novo encarregado de educação, dispõe de um prazo regulamentar
              de <strong>7 dias</strong> após o cadastro para formalizar o seu Contrato de Prestação de Serviços
              Educativos e anexar a cópia do seu Bilhete de Identidade.
            </p>
          </div>
        </div>
      </div>

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

      {/* SECÇÃO 1: LEITURA DAS 12 CLÁUSULAS OFICIAIS */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoCabecalho className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CartaoTitulo className="text-base font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF2D75]" />
                1. Cláusulas do Contrato de Prestação de Serviços
              </CartaoTitulo>
              <CartaoDescricao>
                Consulte as 12 cláusulas contratuais oficiais da Teomilara / TM-Educa.
              </CartaoDescricao>
            </div>
            <Botao
              variante="contorno"
              tamanho="sm"
              onClick={() => window.print()}
              className="gap-2 text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Ver Minuta
            </Botao>
          </div>
        </CartaoCabecalho>

        <CartaoConteudo className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {CLAUSULAS_CONTRATO_PAIS.map((clausula) => {
              const expandida = clausulaExpandida === clausula.numero;
              return (
                <div key={clausula.numero} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                  <button
                    type="button"
                    onClick={() => setClausulaExpandida(expandida ? null : clausula.numero)}
                    className="w-full flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      {clausula.titulo}
                    </span>
                    {expandida ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {expandida && (
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
                      {clausula.conteudo}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CartaoConteudo>
      </Cartao>

      {/* SECÇÃO 2: FORMULÁRIO DE INSCRIÇÃO E UPLOAD DO BI */}
      <form onSubmit={handleSubmeter}>
        <Cartao className="border-slate-200 dark:border-slate-800">
          <CartaoCabecalho className="border-b border-slate-200 dark:border-slate-800">
            <CartaoTitulo className="text-base font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              2. Dados do Encarregado, Educando e Cópia do BI
            </CartaoTitulo>
            <CartaoDescricao>
              Preencha os dados oficiais que constarão no contrato e anexe o comprovativo de identificação.
            </CartaoDescricao>
          </CartaoCabecalho>

          <CartaoConteudo className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nome do Encarregado de Educação
                </label>
                <input
                  type="text"
                  value={nomePai}
                  disabled
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  N.º do Bilhete de Identidade (BI) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: 006453174LA042"
                  value={biNumero}
                  onChange={(e) => setBiNumero(e.target.value.toUpperCase())}
                  required
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Telefone Principal
                </label>
                <input
                  type="text"
                  value={telefonePai}
                  disabled
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Morada de Residência <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Município, Bairro e Ponto de Referência"
                  value={morada}
                  onChange={(e) => setMorada(e.target.value)}
                  required
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Dados do Educando */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Dados do Aluno (Educando)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nome do Aluno <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={alunoNome}
                    onChange={(e) => setAlunoNome(e.target.value)}
                    required
                    placeholder="Nome completo do filho"
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Classe / Ano Escolar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={alunoClasseAno}
                    onChange={(e) => setAlunoClasseAno(e.target.value)}
                    required
                    placeholder="Ex: 7.ª Classe / 10.º Ano"
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Idade (Anos)
                  </label>
                  <input
                    type="text"
                    value={alunoIdade}
                    onChange={(e) => setAlunoIdade(e.target.value)}
                    placeholder="Ex: 12"
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* UPLOAD DA CÓPIA DO BI */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>
                  Cópia do Bilhete de Identidade (BI) do Encarregado <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">Foto nítida ou documento PDF (máx. 5MB)</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-all">
                  <Upload className="w-4 h-4" />
                  <span>{biAnexoUrl ? "Substituir Cópia do BI" : "Carregar Cópia do BI"}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleUploadBi}
                    className="hidden"
                  />
                </label>

                {biAnexoUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Documento anexado {nomeArquivoBi && `(${nomeArquivoBi})`}
                    </span>
                    <Botao
                      type="button"
                      variante="fantasma"
                      tamanho="sm"
                      onClick={() => window.open(biAnexoUrl, "_blank")}
                      className="text-xs h-7 text-blue-600"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Pré-visualizar
                    </Botao>
                  </div>
                )}
              </div>
            </div>

            {/* DECLARAÇÃO DE ACEITAÇÃO EXPRESSA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={declaracaoAceite}
                  onChange={(e) => setDeclaracaoAceite(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#FF2D75] focus:ring-[#FF2D75]"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Declaro que li, compreendi e aceito integralmente todas as <strong>12 cláusulas</strong> do presente
                  Contrato de Prestação de Serviços Educativos da <strong>Teomilara / TM-Educa</strong>, assumindo o
                  compromisso formal com a verdade dos dados fornecidos e a liquidação das mensalidades correspondentes.
                </span>
              </label>

              <div className="flex justify-end pt-2">
                <Botao
                  type="submit"
                  variante="primario"
                  tamanho="lg"
                  disabled={pendente || !declaracaoAceite || !biAnexoUrl}
                  className="w-full sm:w-auto gap-2 text-xs font-bold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {pendente ? "A Processar Assinatura..." : "Assinar e Submeter Contrato à TM-Educa"}
                </Botao>
              </div>
            </div>
          </CartaoConteudo>
        </Cartao>
      </form>
    </div>
  );
}

