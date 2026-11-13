import React from "react";
import Link from "next/link";
import { Clock, ShieldAlert, ArrowRight, FileCheck } from "lucide-react";

interface PropsBannerAlertaContrato {
  assinadoPeloPai: boolean;
  diasRestantes: number;
  prazoExpirado: boolean;
}

export function BannerAlertaContratoPais({
  assinadoPeloPai,
  diasRestantes,
  prazoExpirado,
}: PropsBannerAlertaContrato) {
  if (assinadoPeloPai) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-rose-600 text-white px-4 py-2.5 text-xs shadow-sm">
      <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {prazoExpirado ? (
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-200" />
          ) : (
            <Clock className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
          )}
          <span>
            {prazoExpirado ? (
              <>
                <strong>Atenção:</strong> O prazo regulamentar de 7 dias para assinar o seu contrato terminou. Formalize hoje para manter o serviço ativo.
              </>
            ) : (
              <>
                <strong>Formalização Pendente:</strong> Tem <strong>{diasRestantes} dia{diasRestantes === 1 ? "" : "s"}</strong> para assinar o seu Contrato de Prestação de Serviços e anexar o seu BI.
              </>
            )}
          </span>
        </div>

        <Link
          href="/portal-encarregado/contratos"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-xs shrink-0"
        >
          <span>Assinar Contrato</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

