"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface CabecalhoContextType {
  estaTransparente: boolean;
  rolou: boolean;
}

const CabecalhoContext = createContext<CabecalhoContextType>({
  estaTransparente: false,
  rolou: false,
});

export const useCabecalho = () => useContext(CabecalhoContext);

interface PropsCabecalhoAnimado {
  children: React.ReactNode;
}

/**
 * Invólucro de cabeçalho dinâmico com efeito de transparência sobre o banner
 * e transição suave para fundo branco sólido ao rolar a página para baixo.
 */
export function CabecalhoAnimado({ children }: PropsCabecalhoAnimado) {
  const [rolou, setRolou] = useState(false);
  const pathname = usePathname();

  // O efeito de transparência no topo aplica-se na página inicial (onde há o banner hero)
  const ePaginaInicial = pathname === "/";

  useEffect(() => {
    const aoRolar = () => {
      if (window.scrollY > 25) {
        setRolou(true);
      } else {
        setRolou(false);
      }
    };

    // Verificar posição no carregamento
    aoRolar();

    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Na página inicial no topo: 100% transparente
  // Ao rolar para baixo ou nas outras páginas: branco sólido com blur e borda
  const estaTransparente = ePaginaInicial && !rolou;

  return (
    <CabecalhoContext.Provider value={{ estaTransparente, rolou }}>
      <header
        className={`fixed top-0 left-0 w-full h-14 z-50 transition-all duration-300 ${
          estaTransparente
            ? "bg-transparent border-b border-transparent shadow-none"
            : "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs dark:bg-[#07101c]/95 dark:border-slate-800/80"
        }`}
      >
        {children}
      </header>
      {/* Nas outras páginas (onde não há banner hero no topo), manter o espaçador para não sobrepor o conteúdo */}
      {!ePaginaInicial && <div className="h-14 w-full" aria-hidden="true" />}
    </CabecalhoContext.Provider>
  );
}
