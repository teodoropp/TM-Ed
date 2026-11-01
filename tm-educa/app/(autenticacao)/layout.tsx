import type { Metadata } from "next";

/**
 * Layout do grupo de autenticação.
 * Define explicitamente que nenhuma página deste grupo (entrar, registar, recuperar senha)
 * deve ser indexada pelos motores de busca.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LayoutAutenticacao({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

