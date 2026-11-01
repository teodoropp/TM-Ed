import { Suspense } from "react";
import { TelaRecuperarSenha } from "@/componentes/autenticacao/tela-recuperar-senha";

export const metadata = {
  title: "Recuperar Palavra-passe",
  description: "Redefina a sua palavra-passe de acesso à plataforma TM-Educa.",
};

export default function PaginaRecuperarSenha() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-[#FF2D75] rounded-full animate-spin" />
        </div>
      }
    >
      <TelaRecuperarSenha />
    </Suspense>
  );
}

