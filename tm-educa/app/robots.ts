import type { MetadataRoute } from "next";
import { configuracaoSite } from "@/configuracao/site";

/**
 * Geração dinâmica do ficheiro robots.txt de acordo com as especificações do Next.js App Router.
 * Permite a indexação das páginas públicas institucionais e protege categoricamente
 * os portais privados (Encarregados, Professores e Administração) e rotas de autenticação.
 */
export default function robots(): MetadataRoute.Robots {
  const urlBase = configuracaoSite.url || "https://tmeduca.ao";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/portal-encarregado/",
          "/portal-professor/",
          "/administracao/",
          "/entrar",
          "/registar",
          "/recuperar-senha",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: [
          "/portal-encarregado/",
          "/portal-professor/",
          "/administracao/",
          "/entrar",
          "/registar",
          "/recuperar-senha",
          "/api/",
        ],
      },
    ],
    sitemap: `${urlBase}/sitemap.xml`,
    host: urlBase,
  };
}

