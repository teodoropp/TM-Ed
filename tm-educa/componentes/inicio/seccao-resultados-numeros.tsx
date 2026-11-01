import React from "react";

/**
 * Secção 7: Resultados / Números
 * Barra horizontal minimalista e limpa com os 4 indicadores institucionais.
 * Fundo no azul oficial da marca (#07182E — --brand-navy), nunca no #0a192f.
 */
export function SeccaoResultadosNumeros() {
  const metricas = [
    {
      numero: "+500",
      rotulo: "FAMÍLIAS ACOMPANHADAS",
    },
    {
      numero: "+150",
      rotulo: "EXPLICADORES AUDITADOS",
    },
    {
      numero: "98%",
      rotulo: "TAXA DE SUCESSO ESCOLAR",
    },
    {
      numero: "+12.000",
      rotulo: "HORAS DE EXPLICAÇÃO",
    },
  ];

  return (
    <section
      id="numeros"
      className="w-full bg-[#07182E] py-12 sm:py-16 border-y-2 border-[#102A45] text-white font-normal scroll-mt-20"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 items-center text-center">
          {metricas.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center space-y-2 sm:space-y-2.5"
            >
              <span className="text-3xl sm:text-4xl lg:text-[46px] font-normal text-white tracking-tight leading-none">
                {item.numero}
              </span>
              <span className="text-[11px] sm:text-xs font-normal text-white uppercase tracking-widest">
                {item.rotulo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
