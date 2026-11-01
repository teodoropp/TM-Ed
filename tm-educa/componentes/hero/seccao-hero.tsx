import React from "react";
import { CarrosselHero } from "./carrossel-hero";

/**
 * Secção Hero principal da página inicial da TM-Educa em formato Full-Width (tela cheia).
 * Cobre a largura total da página de ponta a ponta, oferecendo máxima imersão visual e acolhimento.
 */
export function SeccaoHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#07101C]">
      {/* Carrossel Full-Screen de ponta a ponta */}
      <CarrosselHero />
    </section>
  );
}
