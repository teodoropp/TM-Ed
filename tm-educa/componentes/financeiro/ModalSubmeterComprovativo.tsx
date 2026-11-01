"use client";

import { useState, useTransition } from "react";
import { acaoSubmeterComprovativoPagamento } from "@/modulos/financeiro/acoes";
import { CONTAS_BANCARIAS_TM_EDUCA } from "@/regras/calculo-financeiro";
import { Botao } from "@/componentes/ui/botao";
import { Cartao, CartaoConteudo } from "@/componentes/ui/cartao";
import { CreditCard, Copy, Check, Upload, AlertCircle, X } from "lucide-react";

interface PropriedadesModalComprovativo {
  cobrancaId: string;
  numeroFatura: string;
  valorKz: number;
  mesReferencia: string;
}

export function ModalSubmeterComprovativo({
  cobrancaId,
  numeroFatura,
  valorKz,
  mesReferencia,
}: PropriedadesModalComprovativo) {
  const [aberto, setAberto] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();
  const [referencia, setReferencia] = useState("");
  const [bancoOrigem, setBancoOrigem] = useState("BAI");
  const [observacoes, setObservacoes] = useState("");
  const [ibanCopiado, setIbanCopiado] = useState<string | null>(null);

  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const copiarIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setIbanCopiado(iban);
    setTimeout(() => setIbanCopiado(null), 3000);
  };

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    setSucesso(null);
    setErro(null);

    iniciarTransicao(async () => {
      const res = await acaoSubmeterComprovativoPagamento({
        cobrancaId,
        referenciaBancaria: referencia,
        bancoOrigem,
        observacoes,
      });

      if (res.sucesso) {
        setSucesso(res.mensagem);
        setTimeout(() => setAberto(false), 2500);
      } else {
        setErro(res.mensagem);
      }
    });
  };

  return (
    <div>
      {!aberto ? (
        <Botao
          variante="primario"
          tamanho="sm"
          className="gap-1.5"
          onClick={() => setAberto(true)}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Pagar / Enviar Comprovativo
        </Botao>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Liquidação da Fatura {numeroFatura}
                </h3>
                <p className="text-xs text-slate-500">
                  Referência: {mesReferencia} • Montante:{" "}
                  <strong className="text-emerald-600 font-extrabold text-sm">
                    {valorKz.toLocaleString("pt-PT")} Kz
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setAberto(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coordenadas Bancárias Oficiais */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Contas Bancárias Oficiais da TM-Educa:
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {CONTAS_BANCARIAS_TM_EDUCA.map((c) => (
                  <div
                    key={c.sigla}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {c.banco}
                      </div>
                      <div className="text-slate-500 font-mono select-all">
                        IBAN: {c.iban}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Titular: {c.titular}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copiarIban(c.iban)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 w-fit"
                    >
                      {ibanCopiado === c.iban ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copiar IBAN
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário de Envio do Comprovativo */}
            <form onSubmit={submeter} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Dados da Transferência Efetuada:
              </h4>

              {sucesso && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  ✓ {sucesso}
                </div>
              )}

              {erro && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                  ✕ {erro}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Banco de Origem:
                  </label>
                  <select
                    value={bancoOrigem}
                    onChange={(e) => setBancoOrigem(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="BAI">BAI (Banco Angolano de Investimentos)</option>
                    <option value="BFA">BFA (Banco de Fomento Angola)</option>
                    <option value="BIC">Banco BIC</option>
                    <option value="BPC">BPC (Banco de Poupança e Crédito)</option>
                    <option value="Standard Bank">Standard Bank Angola</option>
                    <option value="Millennium Atlantico">Banco Millennium Atlântico</option>
                    <option value="Multicaixa Express">App Multicaixa Express</option>
                    <option value="Outro">Outro Banco Angolano</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ID da Operação / Ref. Bancária:
                  </label>
                  <input
                    type="text"
                    required
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Ex: TRF-20261007-94821 ou Ref. MCX"
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas Adicionais (opcional):
                </label>
                <input
                  type="text"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Transferido a partir da conta do pai Sr. António."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Botao
                  type="button"
                  variante="contorno"
                  tamanho="sm"
                  onClick={() => setAberto(false)}
                >
                  Cancelar
                </Botao>
                <Botao type="submit" tamanho="sm" disabled={pendente}>
                  {pendente ? "A submeter..." : "Confirmar e Enviar Comprovativo"}
                </Botao>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
