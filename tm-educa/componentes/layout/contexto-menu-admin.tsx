"use client";

import * as React from "react";

interface ContextoMenuAdmin {
  /** Indica se o menu lateral se encontra recolhido (barra de ícones). */
  recolhido: boolean;
  /** Alterna o estado de recolha do menu lateral. */
  alternarRecolha: () => void;
  /** Estado do menu lateral em ecrãs móveis. */
  menuMobileAberto: boolean;
  /** Define a abertura do menu lateral em ecrãs móveis. */
  setMenuMobileAberto: (aberto: boolean) => void;
}

const ContextoMenuAdmin = React.createContext<ContextoMenuAdmin | null>(null);

export function ProvedorMenuAdmin({ children }: { children: React.ReactNode }) {
  const [recolhido, setRecolhido] = React.useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = React.useState(false);

  const valor = React.useMemo(
    () => ({
      recolhido,
      alternarRecolha: () => setRecolhido((v) => !v),
      menuMobileAberto,
      setMenuMobileAberto,
    }),
    [recolhido, menuMobileAberto]
  );

  return (
    <ContextoMenuAdmin.Provider value={valor}>
      {children}
    </ContextoMenuAdmin.Provider>
  );
}

export function useMenuAdmin(): ContextoMenuAdmin {
  const contexto = React.useContext(ContextoMenuAdmin);
  if (!contexto) {
    throw new Error(
      "useMenuAdmin tem de ser utilizado dentro de ProvedorMenuAdmin."
    );
  }
  return contexto;
}
