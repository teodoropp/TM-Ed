"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCabecalho } from "./cabecalho-animado";

const LINKS_NAVEGACAO = [
  { href: "/#", label: "Início" },
  { href: "/#quem-somos", label: "Quem somos" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/#metodologia", label: "Como funciona" },
  { href: "/#contacto", label: "Contacto" },
];

/**
 * Links de navegação principais do cabeçalho.
 * Ficam totalmente brancos com alto contraste quando sobrepostos ao hero banner,
 * e adaptam-se para cores escuras/tema quando a página rola para baixo.
 */
export function NavegacaoCabecalho() {
  const { estaTransparente } = useCabecalho();
  const pathname = usePathname();

  return (
    <nav
      className="hidden lg:flex items-center space-x-7 text-[13.5px] font-normal"
      style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif" }}
    >
      {LINKS_NAVEGACAO.map((item) => {
        const estaAtivo = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-all duration-200 py-1 ${
              estaAtivo
                ? "text-[#ff2d75] font-semibold"
                : estaTransparente
                ? "text-white hover:text-pink-200 drop-shadow-xs"
                : "text-slate-800 dark:text-slate-200 hover:text-[#ff2d75]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
