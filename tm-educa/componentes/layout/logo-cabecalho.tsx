"use client";

import React from "react";
import Link from "next/link";
import { LogoTMEduca } from "@/componentes/ui/logo-tmeduca";
import { useCabecalho } from "./cabecalho-animado";

/**
 * Logótipo do cabeçalho que adapta o contraste (branco vs escuro)
 * automaticamente conforme a transparência sobre o banner.
 */
export function LogoCabecalho() {
  const { estaTransparente } = useCabecalho();

  return (
    <Link
      href="/"
      className="hover:opacity-90 transition-opacity shrink-0 flex items-center"
      aria-label="TM-Educa Início"
    >
      <LogoTMEduca
        tamanho="sm"
        variante="completo"
        corTexto={estaTransparente ? "claro" : "auto"}
      />
    </Link>
  );
}
