export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import {
  Building2,
  Megaphone,
  Phone,
  Mail,
  MapPin,
  Palette,
  Camera,
  Globe,
  Coins,
  ShieldCheck,
} from "lucide-react";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { configuracaoSite } from "@/configuracao/site";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";

export const metadata = {
  title: "Definições da Plataforma | Administração TM-Educa",
};

const CORES = [
  { nome: "Azul Institucional", hex: configuracaoSite.cores.azulReal, uso: "Estrutura e cabeçalhos" },
  { nome: "Rosa TM-Educa", hex: configuracaoSite.cores.rosaVibrante, uso: "Acções e destaques" },
  { nome: "Azul Secundário", hex: configuracaoSite.cores.azulSecundario, uso: "Cartões e superfícies" },
];

export default async function PaginaAdminConfiguracoes() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/configuracoes");
  }

  return (
    <AmbienteAdmin>
      <CabecalhoPagina
        titulo="Definições da Plataforma"
        descricao="Identidade institucional, contactos oficiais e parâmetros de apresentação do ecossistema TM-Educa."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Definições" },
        ]}
      />

      {/* IDENTIDADE INSTITUCIONAL */}
      <CartaoKpi
        rotulo="Identidade Institucional"
        valor={configuracaoSite.nome}
        detalhe={configuracaoSite.subtitulo}
        icone={<Building2 className="h-4 w-4" />}
        tom="rosa"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* DADOS INSTITUCIONAIS */}
        <section className="lg:col-span-7 rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-[#FF2D75]" />
            <h2 className="text-base text-slate-900 dark:text-white">
              Dados Institucionais
            </h2>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <dt className="text-xs text-slate-500 dark:text-slate-400">Nome</dt>
              <dd className="text-slate-900 dark:text-white">
                {configuracaoSite.nome}
              </dd>
            </div>

            <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <dt className="text-xs text-slate-500 dark:text-slate-400">Slogan</dt>
              <dd className="text-right text-slate-900 dark:text-white">
                {configuracaoSite.slogan}
              </dd>
            </div>

            <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <dt className="text-xs text-slate-500 dark:text-slate-400">
                Slogan curto
              </dt>
              <dd className="text-right text-slate-900 dark:text-white">
                {configuracaoSite.sloganCurto}
              </dd>
            </div>

            <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <dt className="text-xs text-slate-500 dark:text-slate-400">
                Moeda em uso
              </dt>
              <dd className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                <Coins className="h-3.5 w-3.5 text-slate-400" />
                {configuracaoSite.moeda}
              </dd>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-xs text-slate-500 dark:text-slate-400">
                Localização
              </dt>
              <dd className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {configuracaoSite.localizacao.cidade}, {configuracaoSite.localizacao.pais}
              </dd>
            </div>
          </dl>

          <p className="mt-4 rounded-[10px] bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
            {configuracaoSite.descricao}
          </p>
        </section>

        {/* CONTACTOS E REDES */}
        <section className="lg:col-span-5 rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#FF2D75]" />
            <h2 className="text-base text-slate-900 dark:text-white">
              Contactos e Redes
            </h2>
          </div>

          <div className="space-y-2">
            <a
              href={`mailto:${configuracaoSite.contacto.email}`}
              className="flex items-center gap-3 rounded-[10px] border border-slate-200/80 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-[#FF2D75]/40 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/40"
            >
              <Mail className="h-4 w-4 shrink-0 text-slate-400" />
              {configuracaoSite.contacto.email}
            </a>

            <a
              href={`tel:${configuracaoSite.contacto.telefone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 rounded-[10px] border border-slate-200/80 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-[#FF2D75]/40 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/40"
            >
              <Phone className="h-4 w-4 shrink-0 text-slate-400" />
              {configuracaoSite.contacto.telefone}
            </a>

            <a
              href={configuracaoSite.contacto.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-[10px] border border-slate-200/80 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-[#FF2D75]/40 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/40"
            >
              <Phone className="h-4 w-4 shrink-0 text-emerald-500" />
              WhatsApp Oficial ({configuracaoSite.contacto.whatsapp})
            </a>

            <a
              href={configuracaoSite.redesSociais.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-[10px] border border-slate-200/80 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-[#FF2D75]/40 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/40"
            >
              <Camera className="h-4 w-4 shrink-0 text-slate-400" />
              Instagram
            </a>

            <a
              href={configuracaoSite.redesSociais.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-[10px] border border-slate-200/80 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-[#FF2D75]/40 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/40"
            >
              <Globe className="h-4 w-4 shrink-0 text-slate-400" />
              Facebook
            </a>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-[10px] bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Configuração carregada de <code>configuracao/site.ts</code>
          </div>
        </section>
      </div>

      {/* PALETA DA MARCA */}
      <section className="rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4 text-[#FF2D75]" />
          <h2 className="text-base text-slate-900 dark:text-white">
            Paleta da Marca
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CORES.map((cor) => (
            <div
              key={cor.hex}
              className="overflow-hidden rounded-[10px] border border-slate-200/80 dark:border-slate-800"
            >
              <div
                className="h-16 w-full"
                style={{ backgroundColor: cor.hex }}
                aria-hidden="true"
              />
              <div className="p-3">
                <p className="text-xs text-slate-900 dark:text-white">{cor.nome}</p>
                <p className="mt-0.5 font-mono text-[11px] uppercase text-slate-500 dark:text-slate-400">
                  {cor.hex}
                </p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {cor.uso}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AmbienteAdmin>
  );
}
