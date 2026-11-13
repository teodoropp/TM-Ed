export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterEstadoContratualEncarregado } from "@/modulos/contratos/consultas";
import { DADOS_INSTITUCIONAIS_EMPRESA } from "@/modulos/contratos/clausulas";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { Cartao, CartaoConteudo } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { Botao } from "@/componentes/ui/botao";
import {
  FolderArchive,
  FileText,
  ShieldCheck,
  Eye,
  Download,
  AlertCircle,
  FileCheck2,
  Building,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Os Meus Documentos | Portal dos Pais TM-Educa",
};

export default async function PaginaDocumentosEncarregado() {
  const utilizador = await obterUtilizadorAutenticado();

  if (
    !utilizador ||
    utilizador.funcao !== "ENCARREGADO" ||
    !utilizador.perfilEncarregado
  ) {
    redirect("/entrar?callbackUrl=/portal-encarregado/documentos");
  }

  const estadoContrato = await obterEstadoContratualEncarregado();

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Os Meus Documentos"
        descricao="Aceda aos seus contratos homologados, termos legais assinados e documentos institucionais da TM-Educa."
        icone={FolderArchive}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cartão do Contrato de Prestação de Serviços */}
        <Cartao className="border-slate-200 dark:border-slate-800">
          <CartaoConteudo className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <FileSignatureIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Contrato de Prestação de Serviços
                  </h3>
                  <p className="text-xs text-slate-500">
                    {estadoContrato?.numeroContrato || "Minuta Contratual"}
                  </p>
                </div>
              </div>

              {estadoContrato?.assinadoPeloAdmin && estadoContrato?.assinadoPeloPai ? (
                <Badge variante="sucesso" className="text-xs">
                  Homologado
                </Badge>
              ) : estadoContrato?.assinadoPeloPai ? (
                <Badge variante="aviso" className="text-xs">
                  Em Análise
                </Badge>
              ) : (
                <Badge variante="perigo" className="text-xs">
                  Pendente
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Documento formal regulador da prestação de explicações ao domicílio, regras de reposição, pagamentos e
              direitos das partes.
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {estadoContrato?.assinadoPeloPai ? "Assinado pelo encarregado" : "Aguardando assinatura"}
              </span>

              <Link href="/portal-encarregado/contratos">
                <Botao variante="contorno" tamanho="sm" className="text-xs gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {estadoContrato?.assinadoPeloAdmin ? "Ver Contrato" : "Aceder / Assinar"}
                </Botao>
              </Link>
            </div>
          </CartaoConteudo>
        </Cartao>

        {/* Cartão de Identificação Institucional da TM-Educa */}
        <Cartao className="border-slate-200 dark:border-slate-800">
          <CartaoConteudo className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Identificação da Direção TM-Educa
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparência e Segurança Mútua
                  </p>
                </div>
              </div>

              <Badge variante="info" className="text-xs">
                Oficial
              </Badge>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
              <p>
                <strong>Entidade:</strong> {DADOS_INSTITUCIONAIS_EMPRESA.nomeOficial}
              </p>
              <p>
                <strong>Representante:</strong> {DADOS_INSTITUCIONAIS_EMPRESA.responsavelNome} (BI n.º{" "}
                {DADOS_INSTITUCIONAIS_EMPRESA.responsavelBi})
              </p>
              <p>
                <strong>Cargo:</strong> {DADOS_INSTITUCIONAIS_EMPRESA.responsavelCargo}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Disponibilizado a todos os pais contratantes
              </span>

              {estadoContrato?.biAdminAnexoUrl ? (
                <Botao
                  variante="contorno"
                  tamanho="sm"
                  onClick={() => window.open(estadoContrato.biAdminAnexoUrl!, "_blank")}
                  className="text-xs gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver Cópia do BI
                </Botao>
              ) : (
                <span className="text-[11px] text-slate-500 italic">Anexado no contrato homologado</span>
              )}
            </div>
          </CartaoConteudo>
        </Cartao>
      </div>
    </div>
  );
}

function FileSignatureIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8.5L20 7.5V11" />
      <path d="M14 2v6h6" />
      <path d="M18.4 13.6a2.12 2.12 0 1 1 3 3L16 22l-4 1 1-4Z" />
    </svg>
  );
}

