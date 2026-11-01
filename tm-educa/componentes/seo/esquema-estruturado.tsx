import React from "react";
import { configuracaoSite } from "@/configuracao/site";

/**
 * Componente que renderiza os dados estruturados oficiais em formato JSON-LD (Schema.org).
 * Ajuda o motor de busca do Google a compreender a identidade, localização, contactos
 * e natureza educacional da TM-Educa.
 */
export function EsquemaEstruturado() {
  const urlBase = configuracaoSite.url || "https://tmeduca.ao";

  const dadosSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${urlBase}/#organizacao`,
        name: configuracaoSite.nome,
        legalName: "TM-Educa Serviços Educacionais, Lda.",
        url: urlBase,
        logo: `${urlBase}/logo/logo-tmeduca.svg`,
        image: `${urlBase}/imagens/identidade_visual.jpg`,
        description: configuracaoSite.descricao,
        slogan: configuracaoSite.slogan,
        email: configuracaoSite.contacto.email,
        telephone: configuracaoSite.contacto.telefone,
        address: {
          "@type": "PostalAddress",
          addressLocality: configuracaoSite.localizacao.cidade,
          addressCountry: "AO",
        },
        areaServed: [
          {
            "@type": "City",
            name: "Luanda",
          },
          {
            "@type": "Country",
            name: "Angola",
          },
        ],
        sameAs: [
          configuracaoSite.redesSociais.instagram,
          configuracaoSite.redesSociais.facebook,
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: configuracaoSite.contacto.telefone,
            contactType: "customer service",
            availableLanguage: ["Portuguese"],
            areaServed: "AO",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${urlBase}/#website`,
        url: urlBase,
        name: configuracaoSite.nome,
        description: configuracaoSite.descricao,
        inLanguage: "pt-PT",
        publisher: {
          "@id": `${urlBase}/#organizacao`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosSchema) }}
    />
  );
}

