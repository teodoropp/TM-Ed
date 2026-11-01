export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPedidoPorId } from "@/modulos/pedidos/consultas";
import { obterDetalheEstadoPedido } from "@/regras/maquina-estados-pedido";
import { formatarKz } from "@/regras/calculo-preco";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Badge } from "@/componentes/ui/badge";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { BotaoGerarComprovativoPDF } from "@/componentes/pedidos/ModalComprovativoPedidoPDF";
import {
  GraduationCap,
  UserCheck,
  History,
  BookOpen,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Detalhes do Pedido de Acompanhamento | TM-Educa",
};

interface PropsPaginaDetalhesPedido {
  params: Promise<{ id: string }>;
}

export default async function PaginaDetalhesPedido({ params }: PropsPaginaDetalhesPedido) {
  const { id } = await params;
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador) {
    redirect(`/entrar?callbackUrl=/portal-encarregado/pedidos/${id}`);
  }

  const pedido = await obterPedidoPorId(id);
  if (!pedido) {
    notFound();
  }

  const detalhe = obterDetalheEstadoPedido(pedido.estado);

  const listaDisciplinas = [
    pedido.disciplina.nome,
    ...(pedido.disciplinasAdicionais
      ? pedido.disciplinasAdicionais.split(",").map((d) => d.trim()).filter(Boolean)
      : []),
  ];

  const dadosComprovativo = {
    numeroPedido: `PED-${new Date(pedido.criadoEm).getFullYear()}-${pedido.id.slice(0, 6).toUpperCase()}`,
    dataEmissao: pedido.criadoEm,
    nomeEncarregado: pedido.encarregado.utilizador.nomeCompleto,
    emailEncarregado: pedido.encarregado.utilizador.email,
    telefoneEncarregado: pedido.encarregado.utilizador.telefone,
    municipio: pedido.municipio,
    bairro: pedido.bairro,
    endereco: pedido.endereco,
    nomeAluno: pedido.aluno.nomeCompleto,
    anoEscolar: pedido.anoEscolar.nome,
    sistemaEnsino: pedido.aluno.sistemaEnsino,
    disciplinas: listaDisciplinas,
    modalidade: pedido.modalidade,
    duracaoMinutos: pedido.duracaoMinutos,
    frequenciaSemanal: pedido.frequenciaSemanal,
    diasSemana: pedido.diasSemana,
    horarioPreferencial: pedido.horarioPreferencial,
    objetivo: pedido.objetivo,
    observacoes: pedido.observacoes,
    precoUnitarioKz: pedido.precoUnitarioKz,
    estimativaMensalKz: pedido.estimativaMensalKz,
    estado: detalhe.rotulo,
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <CabecalhoPaginaPais
        titulo={`${pedido.disciplina.nome} · ${pedido.anoEscolar.nome}`}
        descricao={`Filho: ${pedido.aluno.nomeCompleto} · Submetido em ${new Date(pedido.criadoEm).toLocaleDateString("pt-AO")}`}
        icone={GraduationCap}
        caminho={[
          { rotulo: "Pedidos de Apoio", href: "/portal-encarregado/pedidos" },
          { rotulo: "Detalhes" },
        ]}
        acoes={
          <div className="flex flex-wrap items-center gap-2.5">
            <BotaoGerarComprovativoPDF dados={dadosComprovativo} />
            <Badge variante={detalhe.variante} className="px-3 py-1">
              {detalhe.rotulo}
            </Badge>
          </div>
        }
      />

      {/* Banner de Comprovativo Oficial Disponível */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#07182E] via-[#0A192F] to-[#162C4E] border border-slate-800 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF2D75]/20 text-[#FF2D75] ring-1 ring-[#FF2D75]/30">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Comprovativo Oficial de Pedido (PDF)
            </p>
            <p className="text-xs text-slate-300">
              Descarregue ou imprima o documento timbrado oficial com a chancela e dados regulamentados da TM-Educa.
            </p>
          </div>
        </div>

        <BotaoGerarComprovativoPDF dados={dadosComprovativo} />
      </div>

      {/* Resumo do Pedido e Condições */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Cartao className="border-slate-200 dark:border-slate-800 md:col-span-2">
          <CartaoCabecalho>
            <CartaoTitulo className="text-base font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Condições Pedagógicas Contratadas
            </CartaoTitulo>
          </CartaoCabecalho>
          <CartaoConteudo className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400">Modalidade:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.modalidade}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Duração da Aula:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.duracaoMinutos} Minutos</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Frequência Semanal:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.frequenciaSemanal} Aulas por Semana</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Dias Pretendidos:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.diasSemana}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Horário Preferencial:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.horarioPreferencial}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Objetivo Pedagógico:</span>
                <p className="font-bold text-slate-900 dark:text-white">{pedido.objetivo}</p>
              </div>
            </div>

            {/* Disciplinas Abrangidas */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <span className="text-slate-400 font-semibold block">
                Disciplinas Abrangidas no Plano ({listaDisciplinas.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {listaDisciplinas.map((disc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/70 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 dark:border-emerald-800/60"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {disc}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * Conforme a tabela regulamentada TM-Educa, o valor do serviço é fixado por ano de escolaridade e frequência semanal, abrangendo todas as disciplinas selecionadas sem custos adicionais.
              </p>
            </div>

            {pedido.observacoes && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold">Observações Registadas:</span>
                <p className="text-slate-700 dark:text-slate-300 mt-1 italic">&ldquo;{pedido.observacoes}&rdquo;</p>
              </div>
            )}
          </CartaoConteudo>
        </Cartao>

        {/* Resumo Financeiro */}
        <Cartao className="border-slate-200 dark:border-slate-800">
          <CartaoCabecalho>
            <CartaoTitulo className="text-base font-bold">Investimento Oficial</CartaoTitulo>
            <CartaoDescricao>Tabela regulamentada TM-Educa</CartaoDescricao>
          </CartaoCabecalho>
          <CartaoConteudo className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Preço por Aula:</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatarKz(pedido.precoUnitarioKz)}
              </p>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">Estimativa Mensal (4 semanas):</span>
              <p className="text-2xl font-black text-emerald-600">
                {formatarKz(pedido.estimativaMensalKz)}
              </p>
              <p className="text-[11px] text-slate-500">
                Valor único do {pedido.anoEscolar.nome}
              </p>
            </div>

            {pedido.professorAtribuido && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <UserCheck className="h-4 w-4" /> Explicador Atribuído
                </span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {pedido.professorAtribuido.utilizador.nomeCompleto}
                </p>
                <p className="text-slate-500">
                  {pedido.professorAtribuido.formacaoAcademica || "Explicador Credenciado"}
                </p>
              </div>
            )}
          </CartaoConteudo>
        </Cartao>
      </div>

      {/* Linha do Tempo e Auditoria de Estados */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoCabecalho>
          <CartaoTitulo className="text-base font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            Linha do Tempo e Histórico do Pedido
          </CartaoTitulo>
          <CartaoDescricao>Auditoria transparente de todas as etapas de triagem e alocação.</CartaoDescricao>
        </CartaoCabecalho>
        <CartaoConteudo>
          <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {pedido.historico.map((h) => {
              const info = obterDetalheEstadoPedido(h.novoEstado);
              return (
                <div key={h.id} className="relative space-y-1">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {info.rotulo}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(h.criadoEm).toLocaleString("pt-AO")}
                    </span>
                  </div>
                  {h.motivo && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {h.motivo}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CartaoConteudo>
      </Cartao>
    </div>
  );
}
