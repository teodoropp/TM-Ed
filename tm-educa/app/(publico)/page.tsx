import type { Metadata } from "next";
import { SeccaoHero } from "@/componentes/hero/seccao-hero";
import { SeccaoQuemSomos } from "@/componentes/inicio/seccao-quem-somos";
import { SeccaoComoFunciona } from "@/componentes/inicio/seccao-como-funciona";
import { SeccaoSolucoes } from "@/componentes/inicio/seccao-solucoes";
import { SeccaoRedeProfessores } from "@/componentes/inicio/seccao-rede-professores";
import { SeccaoPorQueTmEduca } from "@/componentes/inicio/seccao-por-que-tmeduca";
import { SeccaoResultadosNumeros } from "@/componentes/inicio/seccao-resultados-numeros";
import { SeccaoTestemunhos } from "@/componentes/inicio/seccao-testemunhos";
import { SeccaoPerguntasFrequentes } from "@/componentes/inicio/seccao-perguntas-frequentes";
import { SeccaoCtaFinal } from "@/componentes/inicio/seccao-cta-final";

export const metadata: Metadata = {
  title: "TM-Educa — Acompanhamento Escolar & Explicações em Luanda",
  description:
    "A Excelência do Saber no Conforto do Teu Lar. Acompanhamento escolar de alta performance em Angola com explicadores auditados ao domicílio e online.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TM-Educa — Acompanhamento Escolar & Explicações em Luanda",
    description:
      "A Excelência do Saber no Conforto do Teu Lar. Acompanhamento escolar de alta performance em Angola com explicadores auditados ao domicílio e online.",
    url: "/",
  },
};

export default async function PaginaInicial() {
  return (
    <div
      className="font-normal"
      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" }}
    >
      {/* 1. HERO — Encontre o acompanhamento certo para cada aluno */}
      <SeccaoHero />

      {/* 2. MAIS DO QUE EXPLICAÇÕES — Acompanhamento de verdade */}
      <div className="mt-4 sm:mt-6 md:mt-8 mb-12 sm:mb-16 md:mb-20">
        <SeccaoQuemSomos />
      </div>

      <div className="space-y-16 sm:space-y-20 md:space-y-24">
        {/* 3. COMO FUNCIONA */}
        <SeccaoComoFunciona />

        {/* 4. SOLUÇÕES (Modalidades & Ciclos Curriculares) */}
        <SeccaoSolucoes />

        {/* 5. CORPO DE EXPLICADORES SELECIONADO */}
        <SeccaoRedeProfessores />

        {/* 6. POR QUE A TM-EDUCA */}
        <SeccaoPorQueTmEduca />

        {/* 7. RESULTADOS / NÚMEROS */}
        <SeccaoResultadosNumeros />

        {/* 8. TESTEMUNHOS */}
        <SeccaoTestemunhos />

        {/* 9. PERGUNTAS FREQUENTES */}
        <SeccaoPerguntasFrequentes />

        {/* 10. CTA FINAL */}
        <SeccaoCtaFinal />
      </div>
    </div>
  );
}
