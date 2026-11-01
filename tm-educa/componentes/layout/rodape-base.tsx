import Link from "next/link";
import { MapPin, Mail, Phone, ShieldCheck, Clock, Award, Sparkles } from "lucide-react";
import { configuracaoSite } from "@/configuracao/site";
import { LogoTMEduca } from "@/componentes/ui/logo-tmeduca";

export function RodapeBase() {
  const anoAtual = 2026;

  return (
    <footer className="relative border-t border-slate-800 bg-[#07101c] text-slate-300 overflow-hidden">
      {/* Luz ambiente de fundo rosa e azul */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[#ff2d75]/50 to-transparent" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#ff2d75]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Coluna 1: Marca & Confiança (2 colunas de largura em lg) */}
          <div className="space-y-5 lg:col-span-2">
            <Link href="/" className="inline-block">
              <LogoTMEduca tamanho="lg" corTexto="claro" />
            </Link>

            <p className="text-sm font-semibold text-[#ff2d75]">
              &ldquo;{configuracaoSite.slogan}&rdquo;
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A TM-Educa é a referência em Angola para acompanhamento escolar de elite.
              Conectamos famílias a professores rigorosamente avaliados para explicações de
              excelência ao domicílio em Luanda e sessões online interativas para todo o país.
            </p>

            <div className="pt-2 flex flex-col space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#ff2d75] shrink-0" />
                <span>Professores com registo criminal e qualificações auditadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-white shrink-0" />
                <span>Metodologia pedagógica estruturada e sumários semanais</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Presença ativa em Luanda: Talatona, Kilamba, Maianga, Miramar, Belas e Viana</span>
              </div>
            </div>
          </div>

          {/* Coluna 2: Programas & Serviços */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Programas & Serviços
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
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
                  Trajetória Curricular (1.º ao 12.º ano)
                </Link>
              </li>
              <li>
                <Link href="/#metodologia" className="hover:text-[#ff2d75] transition-colors">
                  Como Funciona o Acompanhamento
                </Link>
              </li>
              <li>
                <Link href="/#quem-somos" className="hover:text-[#ff2d75] transition-colors">
                  Sobre a TM-Educa
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Portais Dedicados */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Portais do Ecossistema
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
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
                  Painel de Gestão Administrativa
                </Link>
              </li>
              <li>
                <Link href="/professores" className="hover:text-[#ff2d75] transition-colors">
                  Recrutamento de Professores
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
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Linha de Atendimento
            </h4>
            <div className="space-y-3.5 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#ff2d75] shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`tel:${configuracaoSite.contacto.telefone.replace(/\s/g, "")}`}
                    className="font-bold text-white hover:text-[#ff2d75] transition-colors"
                  >
                    {configuracaoSite.contacto.telefone}
                  </a>
                  <p className="text-xs text-slate-500">Segunda a Sábado, das 07h30 às 19h00</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`mailto:${configuracaoSite.contacto.email}`}
                    className="font-bold text-white hover:text-[#ff2d75] transition-colors break-all"
                  >
                    {configuracaoSite.contacto.email}
                  </a>
                  <p className="text-xs text-slate-500">Apoio a pais e explicadores</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href={configuracaoSite.contacto.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    WhatsApp ({configuracaoSite.contacto.whatsapp})
                  </a>
                  <p className="text-xs text-slate-500">Atendimento rápido em minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior com Direitos e Links Legais */}
        <div className="mt-16 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {anoAtual} {configuracaoSite.nome}. Todos os direitos reservados. Ecossistema de Educação em Angola.
          </p>

          <div className="flex items-center space-x-6 font-medium">
            <Link href="/termos" className="hover:text-slate-300 transition-colors">
              Termos de Prestação de Serviço
            </Link>
            <Link href="/privacidade" className="hover:text-slate-300 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/contactos" className="hover:text-slate-300 transition-colors">
              Apoio ao Cliente
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
