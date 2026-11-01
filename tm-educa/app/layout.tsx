import type { Metadata } from "next";
import "./globals.css";
import { configuracaoSite } from "@/configuracao/site";
import { ProvedorTema } from "@/componentes/layout/provedor-tema";
import { EsquemaEstruturado } from "@/componentes/seo/esquema-estruturado";

export const metadata: Metadata = {
  metadataBase: new URL(configuracaoSite.url),
  title: {
    default: `${configuracaoSite.nome} — Acompanhamento Escolar & Explicações em Luanda`,
    template: `%s | ${configuracaoSite.nome}`,
  },
  description:
    "Ecossistema de excelência pedagógica em Angola. Professores rigorosamente selecionados ao domicílio (Luanda) e aulas online interativas. Preçário oficial transparente de 1.ª à 13.ª classe.",
  keywords: [
    "Acompanhamento escolar Angola",
    "Explicações ao domicílio Luanda",
    "Aulas particulares Luanda",
    "TM-Educa",
    "Ensino Primário Angola",
    "I Ciclo Luanda",
    "II Ciclo Luanda",
    "Preparação Exames UAN",
    "Explicador Talatona Kilamba Maianga",
    "Educação Angola",
  ],
  authors: [{ name: "TM-Educa" }],
  creator: "TM-Educa",
  publisher: "TM-Educa",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: configuracaoSite.url,
    siteName: configuracaoSite.nome,
    title: `${configuracaoSite.nome} — Acompanhamento Escolar & Explicações em Luanda`,
    description: configuracaoSite.descricao,
    images: [
      {
        url: "/imagens/identidade_visual.jpg",
        width: 1200,
        height: 630,
        alt: "TM-Educa — Acompanhamento Escolar e Explicações em Luanda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${configuracaoSite.nome} — Acompanhamento Escolar & Explicações em Luanda`,
    description: configuracaoSite.descricao,
    images: ["/imagens/identidade_visual.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TM-Educa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <EsquemaEstruturado />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var temaSalvo = localStorage.getItem('tm-educa-tema');
                  if (temaSalvo === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.colorScheme = 'dark';
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
                try {
                  if (!window.__tmSwLimpo) {
                    window.__tmSwLimpo = true;
                    var pSw = ('serviceWorker' in navigator)
                      ? navigator.serviceWorker.getRegistrations().then(function(regs) {
                          return Promise.all(regs.map(function(r) { return r.unregister(); })).then(function(res) { return res.length > 0; });
                        })
                      : Promise.resolve(false);
                    var pCache = ('caches' in window)
                      ? caches.keys().then(function(names) {
                          return Promise.all(names.map(function(n) { return caches.delete(n); })).then(function(res) { return res.length > 0; });
                        })
                      : Promise.resolve(false);
                    Promise.all([pSw, pCache]).then(function(resultados) {
                      if (resultados[0] || resultados[1]) {
                        window.location.reload();
                      }
                    });
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-[#ff2d75] selection:text-white bg-slate-50 text-slate-900 dark:bg-[#060a12] dark:text-slate-100 flex min-h-screen flex-col font-sans">
        <ProvedorTema>{children}</ProvedorTema>
      </body>
    </html>
  );
}
