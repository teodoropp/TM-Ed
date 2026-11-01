export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterCandidatosMatchingParaPedido } from "@/modulos/pedidos/matching";
import { obterPedidoPorId } from "@/modulos/pedidos/consultas";
import { PainelMatchingAdmin } from "@/componentes/pedidos/painel-matching-admin";
import { BotaoAtivarContrato } from "@/componentes/contratos/botao-ativar-contrato";
import { obterDetalheEstadoPedido } from "@/regras/maquina-estados-pedido";
import { formatarKz } from "@/regras/calculo-preco";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import {
  History,
  UserCheck,
  BookOpen,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Triagem e Matching de Pedido | Administração TM-Educa",
};

interface PropsPaginaAdminTriagem {
  params: Promise<{ id: string }>;
}

export default async function PaginaAdminTriagem({ params }: PropsPaginaAdminTriagem) {
  const { id } = await params;
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect(`/entrar?callbackUrl=/administracao/pedidos/${id}`);
  }

  const [resultadoMatching, pedidoCompleto] = await Promise.all([
    obterCandidatosMatchingParaPedido(id),
    obterPedidoPorId(id),
  ]);

  if (!resultadoMatching || !pedidoCompleto) {
    notFound();
  }

  const { pedido, candidatos } = resultadoMatching;
  const infoEstado = obterDetalheEstadoPedido(pedidoCompleto.estado);

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo={`Pedido: ${pedido.disciplina.nome} (${pedido.anoEscolar.nome})`}
        descricao={`Aluno: ${pedido.aluno.nomeCompleto} · Pais: ${pedidoCompleto.encarregado.utilizador.nomeCompleto} (${pedidoCompleto.encarregado.utilizador.telefone})`}
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Pedidos", href: "/administracao/pedidos" },
          { rotulo: "Triagem & Matching" },
        ]}
        acoes={
          <>
            <Badge variante={infoEstado.variante}>{infoEstado.rotulo}</Badge>
            {pedidoCompleto.estado === "Confirmado" && (
              <BotaoAtivarContrato pedidoId={pedidoCompleto.id} />
            )}
          </>
        }
      />

      {/* Resumo da Demanda Pedagógica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Cartao className="border-slate-200 dark:border-slate-800 md:col-span-2">
          <CartaoCabecalho>
            <CartaoTitulo className="text-base font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Requisitos da Família
            </CartaoTitulo>
          </CartaoCabecalho>
          <CartaoConteudo>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400">Modalidade:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.modalidade}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400">Localização:</span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {pedido.municipio ? `${pedido.municipio}, ${pedido.bairro || ""}` : "Sessão Online"}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400">Duração / Freq.:</span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {pedido.duracaoMinutos} min · {pedido.frequenciaSemanal}x/semana
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400">Dias Pretendidos:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.diasSemana}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400">Horário:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.horarioPreferencial}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400">Foco:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.objetivo}</p>
              </div>
            </div>

            {pedido.disciplinasAdicionais && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs dark:border-amber-800/60 dark:bg-amber-950/25">
                <span className="font-semibold text-amber-800 dark:text-amber-300">
                  Disciplinas adicionais indicadas pela família:
                </span>
                <p className="mt-0.5 text-amber-900 dark:text-amber-200">
                  {pedido.disciplinasAdicionais}
                </p>
                <p className="mt-1 text-[11px] text-amber-700/80 dark:text-amber-400/80">
                  A formalizar no catálogo antes do matching.
                </p>
              </div>
            )}

            {pedido.observacoes && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 text-xs">
                <span className="text-slate-400 font-semibold">Observações da Família:</span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5 italic">&ldquo;{pedido.observacoes}&rdquo;</p>
              </div>
            )}
          </CartaoConteudo>
        </Cartao>

        <Cartao className="border-slate-200 dark:border-slate-800">
          <CartaoCabecalho>
            <CartaoTitulo className="text-base font-bold">Valores Oficiais</CartaoTitulo>
            <CartaoDescricao>Estimativa gerada pelo motor TM-Educa</CartaoDescricao>
          </CartaoCabecalho>
          <CartaoConteudo className="space-y-3">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400">Preço Cliente / Aula:</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatarKz(pedido.precoUnitarioKz)}
              </p>
            </div>

            <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">Estimativa Mensal (4 semanas):</span>
              <p className="text-2xl font-black text-emerald-600">
                {formatarKz(pedido.estimativaMensalKz)}
              </p>
            </div>

            {pedidoCompleto.professorAtribuido && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> Explicador Atribuído
                </span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {pedidoCompleto.professorAtribuido.utilizador.nomeCompleto}
                </p>
                <p className="text-slate-500">
                  {pedidoCompleto.professorAtribuido.utilizador.telefone}
                </p>
              </div>
            )}
          </CartaoConteudo>
        </Cartao>
      </div>

      {/* Painel do Motor de Matching */}
      <PainelMatchingAdmin
        pedidoId={pedido.id}
        estadoAtual={pedidoCompleto.estado}
        candidatos={candidatos}
      />

      {/* Histórico e Auditoria de Estados */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoCabecalho>
          <CartaoTitulo className="text-base font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            Auditoria de Estados do Pedido
          </CartaoTitulo>
        </CartaoCabecalho>
        <CartaoConteudo>
          <div className="space-y-4">
            {pedidoCompleto.historico.map((item) => (
              <div key={item.id} className="flex items-start justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {item.novoEstado}
                    {item.alteradoPor && (
                      <span className="font-normal text-slate-500 ml-2">
                        por {item.alteradoPor.nomeCompleto}
                      </span>
                    )}
                  </p>
                  {item.motivo && (
                    <p className="text-slate-600 dark:text-slate-400 italic">
                      {item.motivo}
                    </p>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(item.criadoEm).toLocaleString("pt-AO")}
                </span>
              </div>
            ))}
          </div>
        </CartaoConteudo>
      </Cartao>
    </AmbienteAdmin>
  );
}
