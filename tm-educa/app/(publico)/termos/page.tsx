import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck, FileText, Clock, CreditCard, RefreshCw, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Prestação de Serviço",
  description:
    "Termos e condições oficiais de prestação de serviços de acompanhamento escolar e explicações da TM-Educa em Angola.",
  alternates: {
    canonical: "/termos",
  },
  openGraph: {
    title: "Termos de Prestação de Serviço | TM-Educa",
    description:
      "Termos e condições oficiais de prestação de serviços de acompanhamento escolar e explicações da TM-Educa em Angola.",
    url: "/termos",
  },
};

export default function PaginaTermosServico() {
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
              REGULAMENTO CONTRATUAL
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#0A192F] dark:text-white">
            Termos de Prestação de Serviço
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Condições gerais aplicáveis aos contratos de acompanhamento escolar ao domicílio e online celebrados na plataforma TM-Educa em Angola.
          </p>
        </div>

        <div className="space-y-6">
          <section className="p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A192F] space-y-3">
            <h2 className="text-lg font-medium text-[#0A192F] dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF2D75]" />
              1. Objeto do Serviço e Credenciação Docente
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A TM-Educa presta serviços de gestão pedagógica, seleção e atribuição de explicadores credenciados para apoio escolar personalizado do Ensino Primário ao Ensino Secundário, tanto na modalidade presencial ao domicílio (Província de Luanda) como na modalidade Online Nacional.
            </p>
          </section>

          <section className="p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A192F] space-y-3">
            <h2 className="text-lg font-medium text-[#0A192F] dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#FF2D75]" />
              2. Tabela Oficial de Preços e Estimativa Mensal
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Os valores das sessões são determinados de forma transparente pela Tabela Oficial de Preços da TM-Educa em Kwanzas (Kz), de acordo com o ciclo de ensino e a duração da sessão (60, 90 ou 120 minutos). A estimativa mensal contratual é calculada na base de 4 (quatro) semanas por mês:
            </p>
            <div className="p-3 rounded-[5px] bg-white dark:bg-[#07182E] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono">
              Valor Mensal Estimado = Preço por Aula × Aulas por Semana × 4 Semanas
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              O pagamento das faturas mensais é efetuado por transferência bancária (IBAN oficial da TM-Educa) ou Multicaixa Express, com submissão do comprovativo através do Portal do Encarregado.
            </p>
          </section>

          <section className="p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A192F] space-y-3">
            <h2 className="text-lg font-medium text-[#0A192F] dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FF2D75]" />
              3. Política Estrita de Cancelamento e Regra das 24 Horas
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Para salvaguardar a organização horária das famílias e a disponibilidade exclusiva dos explicadores:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <strong>Cancelamento com 24 horas ou mais de antecedência:</strong> A aula não é consumida nem cobrada, conferindo direito automático ao agendamento de uma sessão oficial de reposição sem custos adicionais.
              </li>
              <li>
                <strong>Cancelamento com menos de 24 horas de antecedência ou falta sem aviso do aluno:</strong> A aula é considerada realizada para efeitos contratuais e de compensação da deslocação/reserva de agenda do professor.
              </li>
              <li>
                <strong>Ausência ou impedimento do professor:</strong> A família nunca é penalizada financeiramente e tem direito imediato a reposição da aula ou substituição de docente.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A192F] space-y-3">
            <h2 className="text-lg font-medium text-[#0A192F] dark:text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#FF2D75]" />
              4. Registo de Sumários e Garantia de Substituição Docente
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Todas as aulas realizadas incluem registo obrigatório de sumário curricular, presenças e trabalhos de casa (TPC) auditados no Portal do Encarregado. Caso a família solicite a mudança de explicador por motivos de adaptação pedagógica, a TM-Educa garante a substituição do professor titular sem qualquer custo adicional e mantendo o histórico académico do aluno intacto.
            </p>
          </section>

          <section className="p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A192F] space-y-3">
            <h2 className="text-lg font-medium text-[#0A192F] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF2D75]" />
              5. Segurança e Conduta nas Sessões ao Domicílio
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Para as aulas presenciais ao domicílio em Luanda, recomenda-se a presença de um adulto responsável na residência durante a sessão e a disponibilização de um local tranquilo e adequado ao estudo.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

