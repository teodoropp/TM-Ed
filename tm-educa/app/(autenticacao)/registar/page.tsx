import { Suspense } from "react";
import { TelaRegistar } from "@/componentes/autenticacao/tela-registar";

export const metadata = {
  title: "Criar Conta",
  description: "Registo de Pais e Professores na plataforma TM-Educa.",
};

export default function PaginaRegistar() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-[#FF2D75] rounded-[10px] animate-spin" />
        </div>
      }
    >
      <TelaRegistar />
    </Suspense>
  );
}
