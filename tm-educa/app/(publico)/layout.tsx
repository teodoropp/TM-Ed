import { Suspense } from "react";
import { CabecalhoBase } from "@/componentes/layout/cabecalho-base";
import { RodapeBase } from "@/componentes/layout/rodape-base";
import { BotaoFlutuanteWhatsapp } from "@/componentes/inicio/botao-flutuante-whatsapp";

/**
 * Layout do site público da TM-Educa.
 *
 * Este route group agrupa todas as páginas públicas (landing page, páginas
 * institucionais e o portal do explicador) e é o ÚNICO local onde o menu
 * superior e o rodapé institucional são renderizados.
 *
 * As áreas privadas — Portal dos Pais (/portal-encarregado) e Painel de
 * Administração (/administracao) — ficam fora deste grupo e não recebem
 * qualquer chrome público: navega exclusivamente pelos seus próprios menus
 * laterais.
 */
export default function LayoutPublico({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense
        fallback={
          <div className="h-14 border-b border-slate-200/60 bg-white dark:bg-[#07101c]" />
        }
      >
        <CabecalhoBase />
      </Suspense>

      <main className="flex-1">{children}</main>

      <RodapeBase />

      <BotaoFlutuanteWhatsapp />
    </>
  );
}
