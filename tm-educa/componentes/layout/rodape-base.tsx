import Link from "next/link";
import { MapPin, Mail, Phone, ShieldCheck, Clock, Award, Sparkles } from "lucide-react";
import { configuracaoSite } from "@/configuracao/site";
import { LogoTMEduca } from "@/componentes/ui/logo-tmeduca";

export function RodapeBase() {
  const anoAtual = 2026;

  return (
    <footer className="relative border-t border-slate-800 bg-[#07101c] text-slate-300 overflow-hidden font-normal text-xs">
      {/* Linha de luz sutil no topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-[#ff2d75]/40 to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 items-start">
          {/* Coluna 1: Marca & Resumo (2 colunas em telas grandes) */}
          <div className="space-y-3 lg:col-span-2">
            <Link href="/" className="inline-block">
              <LogoTMEduca tamanho="md" corTexto="claro" />
            </Link>

            <p className="text-xs font-medium text-[#ff2d75]">
              &ldquo;{configuracaoSite.slogan}&rdquo;
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Acompanhamento escolar de referência em Angola. Explicadores credenciados
              ao domicílio em Luanda e sessões online interativas para todo o país.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#ff2d75] shrink-0" />
                Docentes auditados
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                Luanda & Online
              </span>
            </div>
          </div>

          {/* Coluna 2: Programas & Serviços */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
              Programas & Serviços
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-normal">
              <li>
                <Link href="/#servicos" className="hover:text-[#ff2d75] transition-colors">
                  Apoio ao Domicílio
                </Link>
              </li>
              <li>
                <Link href="/#servicos" className="hover:text-[#ff2d75] transition-colors">
                  Aulas Online Interativas
                </Link>
              </li>
              <li>
                <Link href="/#metodologia" className="hover:text-[#ff2d75] transition-colors">
                  Metodologia de Estudo
                </Link>
              </li>
              <li>
                <Link href="/#servicos" className="hover:text-[#ff2d75] transition-colors">
                  Trajetória (1.º ao 12.º ano)
                </Link>
              </li>
              <li>
                <Link href="/#quem-somos" className="hover:text-[#ff2d75] transition-colors">
                  Sobre a TM-Educa
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Portais */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
              Portais do Ecossistema
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-normal">
              <li>
                <Link href="/portal-encarregado" className="hover:text-[#ff2d75] transition-colors">
                  Portal dos Pais
                </Link>
              </li>
              <li>
                <Link href="/portal-professor" className="hover:text-[#ff2d75] transition-colors">
                  Portal do Professor
                </Link>
              </li>
              <li>
                <Link href="/administracao" className="hover:text-[#ff2d75] transition-colors">
                  Gestão Administrativa
                </Link>
              </li>
              <li>
                <Link href="/professores" className="hover:text-[#ff2d75] transition-colors">
                  Candidatura Docente
                </Link>
              </li>
              <li>
                <Link href="/perguntas-frequentes" className="hover:text-[#ff2d75] transition-colors">
                  Perguntas Frequentes (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Atendimento & Contactos */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
              Linha de Atendimento
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#ff2d75] shrink-0" />
                <a
                  href={`tel:${configuracaoSite.contacto.telefone.replace(/\s/g, "")}`}
                  className="font-medium text-white hover:text-[#ff2d75] transition-colors"
                >
                  {configuracaoSite.contacto.telefone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${configuracaoSite.contacto.email}`}
                  className="text-white hover:text-[#ff2d75] transition-colors truncate max-w-[190px]"
                >
                  {configuracaoSite.contacto.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <a
                  href={configuracaoSite.contacto.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-white hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: (+244) 955 916 711
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior Compacta com Direitos e Links Legais */}
        <div className="mt-8 border-t border-slate-800/70 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            &copy; {anoAtual} {configuracaoSite.nome}. Todos os direitos reservados. Ecossistema de Educação em Angola.
          </p>

          <div className="flex items-center space-x-4">
            <Link href="/termos" className="hover:text-slate-300 transition-colors">
              Termos
            </Link>
            <span>•</span>
            <Link href="/privacidade" className="hover:text-slate-300 transition-colors">
              Privacidade
            </Link>
            <span>•</span>
            <Link href="/contactos" className="hover:text-slate-300 transition-colors">
              Apoio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
