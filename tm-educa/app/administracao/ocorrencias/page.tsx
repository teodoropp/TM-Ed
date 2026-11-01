export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import {
  obterTodasOcorrenciasAdmin,
  obterEstatisticasQualidadeAdmin,
} from "@/modulos/qualidade/consultas";
import { CartaoOcorrencia } from "@/componentes/qualidade/CartaoOcorrencia";
import { ModalAbrirOcorrencia } from "@/componentes/qualidade/ModalAbrirOcorrencia";
import { Botao } from "@/componentes/ui/botao";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { CartaoKpi } from "@/componentes/admin/cartao-kpi";
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Gestão Central de Ocorrências | Administração",
};

export default async function PaginaAdminOcorrencias() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/ocorrencias");
  }

  const [estatisticas, ocorrencias] = await Promise.all([
    obterEstatisticasQualidadeAdmin(),
    obterTodasOcorrenciasAdmin(),
  ]);

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Gestão Central de Ocorrências & Incidentes"
        descricao="Supervisão e resolução formal de queixas pedagógicas, faltas injustificadas, atrasos e litígios."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Ocorrências" },
        ]}
        acoes={
          <>
            <Link href="/administracao/avaliacoes">
              <Botao variante="contorno" className="gap-2 text-xs">
                Métricas de Avaliação
              </Botao>
            </Link>
            <ModalAbrirOcorrencia />
          </>
        }
      />

      {/* Cartões Executivos de Indicadores */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CartaoKpi
          rotulo="Total Registadas"
          valor={estatisticas.totalOcorrencias}
          detalhe="Histórico auditado"
          tom="neutro"
          icone={<ShieldAlert className="h-4 w-4" />}
        />

        <CartaoKpi
          rotulo="Pendentes / Investigação"
          valor={estatisticas.ocorrenciasAbertas}
          detalhe="A aguardar parecer"
          tom="ambar"
          icone={<Clock className="h-4 w-4" />}
        />

        <CartaoKpi
          rotulo="Casos Urgentes"
          valor={estatisticas.ocorrenciasUrgentes}
          detalhe="Prioridade máxima imediata"
          tom="rosa"
          icone={<AlertTriangle className="h-4 w-4" />}
        />

        <CartaoKpi
          rotulo="Taxa de Resolução"
          valor={`${estatisticas.taxaResolucao}%`}
          detalhe="Processos concluídos"
          tom="esmeralda"
          icone={<CheckCircle2 className="h-4 w-4" />}
        />
      </section>

      {/* Lista de Todas as Ocorrências */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Fila de Ocorrências Auditadas ({ocorrencias.length})
          </h2>
        </div>

        {ocorrencias.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Excelente! Nenhuma ocorrência registada no sistema.
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Todas as aulas e serviços escolares estão a decorrer em plena conformidade.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ocorrencias.map((oco) => (
              <CartaoOcorrencia
                key={oco.id}
                ocorrencia={{
                  ...oco,
                  autor: oco.autor
                    ? {
                        nomeCompleto: oco.autor.nomeCompleto,
                        funcao: oco.autor.funcao,
                      }
                    : undefined,
                  responsavel: oco.responsavel
                    ? { nomeCompleto: oco.responsavel.nomeCompleto }
                    : null,
                }}
                modoAdmin={true}
              />
            ))}
          </div>
        )}
      </section>
    </AmbienteAdmin>
  );
}
