"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type TipoTema = "dark" | "light";

interface TemaContextoType {
  tema: TipoTema;
  alternarTema: () => void;
  definirTema: (novoTema: TipoTema) => void;
  montado: boolean;
}

const TemaContexto = createContext<TemaContextoType>({
  tema: "dark",
  alternarTema: () => {},
  definirTema: () => {},
  montado: false,
});

export const CHAVE_STORAGE_TEMA = "tm-educa-tema";

if (typeof window !== "undefined" && !(window as unknown as Record<string, boolean>).__tmSwLimpo) {
  (window as unknown as Record<string, boolean>).__tmSwLimpo = true;
  try {
    const limparSW =
      "serviceWorker" in navigator
        ? navigator.serviceWorker
            .getRegistrations()
            .then((regs) =>
              Promise.all(regs.map((r) => r.unregister())).then((res) => res.length > 0)
            )
        : Promise.resolve(false);

    const limparCaches =
      "caches" in window
        ? caches
            .keys()
            .then((chaves) =>
              Promise.all(chaves.map((c) => caches.delete(c))).then((res) => res.length > 0)
            )
        : Promise.resolve(false);

    Promise.all([limparSW, limparCaches]).then(([tinhaSW, tinhaCache]) => {
      if (tinhaSW || tinhaCache) {
        window.location.reload();
      }
    });
  } catch {
    // ignorar
  }
}

function aplicarTemaNoDocumento(t: TipoTema) {
  if (typeof document === "undefined") return;
  const raiz = document.documentElement;
  if (t === "light") {
    raiz.classList.remove("dark");
    raiz.classList.add("light");
    raiz.style.colorScheme = "light";
  } else {
    // Tema dark padrão
    raiz.classList.remove("light");
    raiz.classList.add("dark");
    raiz.style.colorScheme = "dark";
  }
}

export function ProvedorTema({ children }: { children: React.ReactNode }) {
  // O tema principal padrão é DARK
  const [tema, setTemaState] = useState<TipoTema>("dark");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);

    try {
      const temaSalvo = localStorage.getItem(CHAVE_STORAGE_TEMA) as TipoTema | null;
      if (temaSalvo === "light") {
        setTemaState("light");
        aplicarTemaNoDocumento("light");
      } else {
        // Se for "dark" ou indefinido/nulo, o padrão é escuro
        setTemaState("dark");
        aplicarTemaNoDocumento("dark");
      }
    } catch {
      aplicarTemaNoDocumento("dark");
    }

    // Ouvinte para sincronizar alterações em abas diferentes
    const aoMudarStorage = (e: StorageEvent) => {
      if (e.key === CHAVE_STORAGE_TEMA && (e.newValue === "light" || e.newValue === "dark")) {
        setTemaState(e.newValue);
        aplicarTemaNoDocumento(e.newValue);
      }
    };

    window.addEventListener("storage", aoMudarStorage);
    return () => window.removeEventListener("storage", aoMudarStorage);
  }, []);

  const definirTema = (novoTema: TipoTema) => {
    setTemaState(novoTema);
    aplicarTemaNoDocumento(novoTema);
    try {
      localStorage.setItem(CHAVE_STORAGE_TEMA, novoTema);
      window.dispatchEvent(
        new CustomEvent("tm-educa-tema-alterado", { detail: novoTema })
      );
    } catch {
      // Ignorar erros de quota/restrições no localStorage
    }
  };

  const alternarTema = () => {
    const proximoTema: TipoTema = tema === "dark" ? "light" : "dark";
    definirTema(proximoTema);
  };

  return (
    <TemaContexto.Provider value={{ tema, alternarTema, definirTema, montado }}>
      {children}
    </TemaContexto.Provider>
  );
}

export function useTema() {
  return useContext(TemaContexto);
}
