import React from "react";

interface PropsLogoTMEduca {
  className?: string;
  tamanho?: "sm" | "md" | "lg" | "xl";
  variante?: "completo" | "simbolo" | "horizontal";
  corTexto?: "escuro" | "claro" | "auto";
}

export function LogoTMEduca({
  className = "",
  tamanho = "sm",
  variante = "completo",
  corTexto = "auto",
}: PropsLogoTMEduca) {
  // Ícone aumentado proporcionalmente para maior destaque e presença visual
  const tamanhosIcone = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const tamanhosTexto = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  };

  const corTextoClasse =
    corTexto === "claro"
      ? "text-white"
      : corTexto === "escuro"
      ? "text-[#0A192F]"
      : "text-[#0A192F] dark:text-white";

  const corSimboloClaro = corTexto === "claro";
  const corCapelo = corSimboloClaro ? "#FFFFFF" : "#0A192F";

  // Ícone Vetorial Oficial (Transparente, sem fundo e sem borda)
  const IconeSimbolo = (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${tamanhosIcone[tamanho]} shrink-0 transition-transform duration-200`}
    >
      <defs>
        <linearGradient id="tmPinkGradComponent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF2D75" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
      </defs>

      {/* 1. Capelo Académico */}
      <polygon
        points="100,20 170,50 100,80 30,50"
        fill={corCapelo}
        className="dark:fill-white"
      />
      <path
        d="M 58,61 Q 100,86 142,61 L 142,71 Q 100,96 58,71 Z"
        fill={corCapelo}
        className="dark:fill-slate-200"
      />

      {/* Borla e Cordão (Lado Esquerdo) */}
      <path
        d="M 42,55 Q 38,70 36,86"
        stroke={corSimboloClaro ? "#FF2D75" : "#0A192F"}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        className="dark:stroke-[#FF2D75]"
      />
      <circle cx="36" cy="88" r="3" fill={corSimboloClaro ? "#FF2D75" : "#0A192F"} className="dark:fill-[#FF2D75]" />
      <path
        d="M 33,90 L 39,90 L 41,106 L 31,106 Z"
        fill={corSimboloClaro ? "#FF2D75" : "#0A192F"}
        className="dark:fill-[#FF2D75]"
      />

      {/* 2. Livro Aberto Contínuo e Elegante (Sem Falhas no Topo) */}
      <path
        d="M 34,92 
           Q 67,78 100,94 
           Q 133,78 166,92 
           L 166,154 
           Q 133,140 100,162 
           Q 67,140 34,154 
           Z"
        fill="none"
        stroke="url(#tmPinkGradComponent)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Lombada central */}
      <line
        x1="100"
        y1="95"
        x2="100"
        y2="161"
        stroke="url(#tmPinkGradComponent)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Folhas inferiores */}
      <path
        d="M 39,158 Q 69,146 95,165"
        fill="none"
        stroke="url(#tmPinkGradComponent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 161,158 Q 131,146 105,165"
        fill="none"
        stroke="url(#tmPinkGradComponent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* 3. Letra "T" (Página Esquerda, Não-bold, Pequena, Centralizada) */}
      <path
        d="M 56,115 L 78,115 M 67,115 L 67,137"
        stroke={corSimboloClaro ? "#FFFFFF" : "#0A192F"}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="dark:stroke-white"
      />

      {/* 4. Letra "M" (Página Direita, Não-bold, Direita/Ereta, Pequena, Centralizada) */}
      <path
        d="M 122,137 L 122,115 L 133,127 L 144,115 L 144,137"
        stroke="url(#tmPinkGradComponent)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  if (variante === "simbolo") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {IconeSimbolo}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Ícone Puro Aumentado */}
      {IconeSimbolo}

      {/* Texto Puro TM-Educa em Segoe UI Normal */}
      <span
        className={`tracking-normal font-normal ${tamanhosTexto[tamanho]} ${corTextoClasse}`}
        style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" }}
      >
        TM<span className="text-[#FF2D75]">-</span>Educa
      </span>
    </div>
  );
}
