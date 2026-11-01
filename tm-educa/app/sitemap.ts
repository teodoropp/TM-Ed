import type { MetadataRoute } from "next";
import { configuracaoSite } from "@/configuracao/site";

/**
 * Geração dinâmica do sitemap.xml para indexação no Google Search Console.
 * Contempla estritamente as URLs canónicas públicas da TM-Educa.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urlBase = configuracaoSite.url || "https://tmeduca.ao";
  const dataAtual = new Date();

  return [
    {
      url: `${urlBase}`,
      lastModified: dataAtual,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${urlBase}/preparacao-exames`,
      lastModified: dataAtual,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${urlBase}/professores`,
      lastModified: dataAtual,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${urlBase}/termos`,
      lastModified: dataAtual,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${urlBase}/privacidade`,
      lastModified: dataAtual,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

