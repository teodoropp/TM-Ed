"use client";

import React, { useState } from "react";
import { acaoAtivarAcompanhamentoEGerarContrato } from "@/modulos/contratos/acoes";
import { Botao } from "@/componentes/ui/botao";
import { FileCheck, Loader2 } from "lucide-react";

interface PropsBotaoAtivarContrato {
  pedidoId: string;
}

export function BotaoAtivarContrato({ pedidoId }: PropsBotaoAtivarContrato) {
  const [aSubmeter, setASubmeter] = useState(false);

  async function handleAtivar() {
    if (
      !confirm(
        "Deseja formalizar o Contrato Comercial e ativar o serviço? O sistema irá gerar automaticamente as aulas para as próximas 4 semanas no calendário."
      )
    ) {
      return;
    }

    setASubmeter(true);
    const res = await acaoAtivarAcompanhamentoEGerarContrato(pedidoId);
    setASubmeter(false);

    if (res.sucesso) {
      alert(res.mensagem);
      window.location.reload();
    } else {
      alert(res.mensagem);
    }
  }

  return (
    <Botao
      onClick={handleAtivar}
      disabled={aSubmeter}
      className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
    >
      {aSubmeter ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          A Gerar Contrato e Aulas...
        </>
      ) : (
        <>
          <FileCheck className="w-4 h-4" />
          Formalizar Contrato e Ativar Serviço
        </>
      )}
    </Botao>
  );
}
