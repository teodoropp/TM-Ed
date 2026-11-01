import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck, Lock, Eye, UserCheck, Database, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade e Proteção de Dados",
  description:
    "Política de Privacidade, confidencialidade e proteção de dados pessoais de encarregados, alunos e professores na plataforma TM-Educa.",
  alternates: {
    canonical: "/privacidade",
  },
  openGraph: {
    title: "Política de Privacidade e Proteção de Dados | TM-Educa",
    description:
      "Política de Privacidade, confidencialidade e proteção de dados pessoais de encarregados, alunos e professores na plataforma TM-Educa.",
    url: "/privacidade",
  },
};

export default function PaginaPoliticaPrivacidade() {
  return (
    <div
      className="min-h-screen bg-white dark:bg-[#060a12] py-16 sm:py-24 font-normal"
      style={{
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#FF2D75] hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar à página inicial
          </Link>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-[2px] bg-[#FF2D75] rounded-full" />
            <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-semibold">
              PROTEÇÃO DE DADOS & CONFIDENCIALIDADE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#0A192F] dark:text-white">
            Política de Privacidade
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Compromisso da TM-Educa com a segurança, sigilo e tratamento responsável dos dados pessoais de famílias, alunos e explicadores em Angola.
          </p>
        </div>

        <div className="space-y-6">
          <section className="p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A192F] space-y-3">
            <h2 className="text-lg font-medium text-[#0A192F] dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#FF2D75]" />
              1. Dados Recolhidos e Finalidade Pedagógica
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A TM-Educa recolhe apenas os dados estritamente necessários para a prestação do acompanhamento escolar: identificação e contactos do encarregado de educação, ano de escolaridade e necessidades pedagógicas do educando, morada de atendimento (para sessões ao domicílio em Luanda) e credenciais académicas dos explicadores.
            </p>
          </section>

          <section className="p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A192F] space-y-3">
            <h2 className="text-lg font-medium text-[#0A192F] dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#FF2D75]" />
              2. Proteção Especial dos Dados de Menores
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Os perfis de educandos são criados e geridos exclusivamente pelos seus Pais ou Encarregados de Educação autenticados. As informações escolares, sumários de aulas e observações pedagógicas são confidenciais e acessíveis apenas ao encarregado titular, ao professor atribuído e à coordenação pedagógica da TM-Educa.
            </p>
          </section>

          <section className="p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A192F] space-y-3">
            <h2 className="text-lg font-medium text-[#0A192F] dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#FF2D75]" />
              3. Segurança Técnica e Controlo de Acessos
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Todas as palavras-passe são armazenadas com encriptação criptográfica irreversível e as sessões utilizam tokens assinados (`HTTP-only`). A plataforma aplica controlo de acesso estrito por função (`ENCARREGADO`, `PROFESSOR` e `ADMINISTRADOR`), impedindo qualquer consulta não autorizada entre utilizadores.
            </p>
          </section>

          <section className="p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A192F] space-y-3">
            <h2 className="text-lg font-medium text-[#0A192F] dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#FF2D75]" />
              4. Partilha Restrita e Direitos dos Titulares
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A TM-Educa não comercializa nem cede dados pessoais a terceiros. O contacto e endereço da família são partilhados unicamente com o professor credenciado designado para o acompanhamento ativo. Os titulares podem a qualquer momento atualizar os seus dados no respetivo portal ou solicitar a retificação/eliminação junto de{" "}
              <a href="mailto:tmeduca99@gmail.com" className="text-[#FF2D75] underline">
                tmeduca99@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

