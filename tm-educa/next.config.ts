import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restringe as qualidades a [75] por omissão e coagida
    // qualquer `quality` para o valor mais próximo. O hero pede 92,
    // por isso tem de estar na allowlist.
    qualities: [75, 92],
    // Desde o Next 16, imagens locais com query string exigem `search`
    // explícito, para impedir a enumeração de URLs arbitrárias. Restringimos a
    // `/imagens/**` e proibimos query strings, que não são necessárias.
    localPatterns: [{ pathname: "/imagens/**", search: "" }],
  },
  // Redução do paralelismo para evitar esgotamento de threads/PIDs em contentores de build (os error 11)
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  async redirects() {
    return [
      {
        source: "/sobre",
        destination: "/#quem-somos",
        permanent: false,
      },
      {
        source: "/como-funciona",
        destination: "/#metodologia",
        permanent: false,
      },
      {
        source: "/servicos",
        destination: "/#servicos",
        permanent: false,
      },
      {
        source: "/contactos",
        destination: "/#contacto",
        permanent: false,
      },
      {
        source: "/contacto",
        destination: "/#contacto",
        permanent: false,
      },
      {
        source: "/perguntas-frequentes",
        destination: "/#faq",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
