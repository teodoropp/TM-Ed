export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Clock, Info, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterPerfilProfessorLogado } from "@/modulos/professores/consultas";
import { CabecalhoPaginaProfessor } from "@/componentes/professores/CabecalhoPaginaProfessor";
import { GrelhaDisponibilidade } from "@/componentes/professores/grelha-disponibilidade";
import { Cartao, CartaoConteudo } from "@/componentes/ui/cartao";

export const metadata = {
  title: "Disponibilidade Horária | TM-Educa",
};

export default async function PaginaDisponibilidadeProfessor() {
  const utilizador = await obterUtilizadorAutenticado();

  if (!utilizador || !utilizador.perfilProfessor || utilizador.funcao !== "PROFESSOR") {
    redirect("/entrar?callbackUrl=/portal-professor/disponibilidade");
  }

  const perfil = await obterPerfilProfessorLogado();
  if (!perfil) {
    redirect("/entrar?callbackUrl=/portal-professor/disponibilidade");
  }

  const disponibilidadesIniciais = (perfil.disponibilidades || []).map((d) => ({
    diaSemana: d.diaSemana,
    horaInicio: d.horaInicio,
    horaFim: d.horaFim,
    activo: d.activo,
  }));

  return (
    <div className="space-y-6 portal-tipografia">
      <CabecalhoPaginaProfessor
        titulo="Disponibilidade Horária"
        descricao="Defina os dias da semana e intervalos horários em que está disponível para lecionar. O sistema de atribuição pedagógica usa esta grelha para lhe propor novos alunos compatíveis."
        icone={Clock}
      />

      {/* Cartão de Dicas de Atribuição */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Cartao className="rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-500 text-xs font-normal">
              <Sparkles className="h-4 w-4" />
              <span>Prioridade na Atribuição</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Professores com mais janelas horárias ativas recebem até 3x mais propostas automáticas dos encarregados.
            </p>
          </CartaoConteudo>
        </Cartao>

        <Cartao className="rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-normal">
              <CheckCircle2 className="h-4 w-4" />
              <span>Turnos Mais Solicitados</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              O horário das <strong>15h às 19h</strong> em dias úteis e <strong>Sábados de manhã</strong> têm a maior procura em Luanda.
            </p>
          </CartaoConteudo>
        </Cartao>

        <Cartao className="rounded-[5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07182E] shadow-sm">
          <CartaoConteudo className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sky-500 text-xs font-normal">
              <ShieldCheck className="h-4 w-4" />
              <span>Flexibilidade Garantida</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pode alterar as suas horas semanais a qualquer momento sem afetar as aulas já confirmadas na sua agenda.
            </p>
          </CartaoConteudo>
        </Cartao>
      </div>

      {/* Grelha de Disponibilidade */}
      <div className="bg-white dark:bg-[#07182E] p-6 rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-sm">
        <GrelhaDisponibilidade disponibilidadesIniciais={disponibilidadesIniciais} />
      </div>
    </div>
  );
}
