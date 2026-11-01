import { obterSessao } from "@/modulos/autenticacao/sessao";
import { CabecalhoAnimado } from "./cabecalho-animado";
import { LogoCabecalho } from "./logo-cabecalho";
import { NavegacaoCabecalho } from "./navegacao-cabecalho";
import { MenuUtilizadorCabecalho } from "./menu-utilizador-cabecalho";
import { SeletorTema } from "./seletor-tema";

export async function CabecalhoBase() {
  const sessao = await obterSessao();

  let linkPortal = "/portal-encarregado";
  let etiquetaPortal = "Portal dos Pais";

  if (sessao) {
    if (sessao.funcao === "ADMINISTRADOR") {
      linkPortal = "/administracao";
      etiquetaPortal = "Painel Gestão";
    } else if (sessao.funcao === "PROFESSOR") {
      linkPortal = "/portal-professor";
      etiquetaPortal = "Portal Professor";
    }
  }

  return (
    <CabecalhoAnimado>
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LADO ESQUERDO: APENAS O LOGÓTIPO ADAPTÁVEL (BRANCO SOBRE O HERO) */}
        <LogoCabecalho />

        {/* LADO DIREITO: LINKS DE NAVEGAÇÃO + BOTÃO ENTRAR/CRIAR CONTA COM POPOVER + SELETOR DE TEMA */}
        <div className="flex items-center space-x-3 sm:space-x-5 h-full">
          {/* Links de navegação: totalmente brancos sobre o Hero */}
          <NavegacaoCabecalho />

          {/* Botão de Utilizador e Popover de Autenticação */}
          <MenuUtilizadorCabecalho
            sessao={sessao}
            linkPortal={linkPortal}
            etiquetaPortal={etiquetaPortal}
          />

          {/* Seletor de Tema (Dark Padrão / Branco Opcional) */}
          <SeletorTema />
        </div>
      </div>
    </CabecalhoAnimado>
  );
}
