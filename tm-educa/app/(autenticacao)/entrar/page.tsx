import { Suspense } from "react";
import { TelaLogin } from "@/componentes/autenticacao/tela-login";

export const metadata = {
  title: "Iniciar Sessão",
  description: "Acesso à plataforma e aos portais da TM-Educa.",
};

export default function PaginaEntrar() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-[#FF2D75] rounded-full animate-spin" />
        </div>
      }
    >
      <TelaLogin />
    </Suspense>
  );
}
