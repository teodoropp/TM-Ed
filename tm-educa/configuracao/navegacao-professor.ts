/**
 * Estrutura de navegação do Portal do Professor (TM-Educa).
 *
 * Navegação lateral focada em usabilidade operacional e PWA / Mobile-First:
 * - Vista geral do dia e aulas
 * - Gestão de agenda e registo rápido de sumários
 * - Recepção e aceitação de novas propostas de alunos
 * - Controlo de disponibilidade horária e remunerações
 */

export type NomeIconeProfessor =
  | "dashboard"
  | "agenda"
  | "aulas"
  | "propostas"
  | "alunos"
  | "disponibilidade"
  | "remuneracoes"
  | "perfil"
  | "comunicacao";

export type ChaveContadorProfessor = "propostas" | "aulasHoje";

export interface ItemNavegacaoProfessor {
  rotulo: string;
  descricao: string;
  href: string;
  icone: NomeIconeProfessor;
  contador?: ChaveContadorProfessor;
  exato?: boolean;
}

export interface GrupoNavegacaoProfessor {
  rotulo: string;
  itens: ItemNavegacaoProfessor[];
}

export const GRUPOS_NAVEGACAO_PROFESSOR: GrupoNavegacaoProfessor[] = [
  {
    rotulo: "Início",
    itens: [
      {
        rotulo: "Painel Geral",
        descricao: "Resumo do seu dia e estatísticas",
        href: "/portal-professor",
        icone: "dashboard",
        exato: true,
      },
    ],
  },
  {
    rotulo: "Atividade Pedagógica",
    itens: [
      {
        rotulo: "Minha Agenda",
        descricao: "Aulas da semana e horários",
        href: "/portal-professor/agenda",
        icone: "agenda",
        contador: "aulasHoje",
      },
      {
        rotulo: "Minhas Aulas",
        descricao: "Registo de sumários e presenças",
        href: "/portal-professor/aulas",
        icone: "aulas",
      },
      {
        rotulo: "Os Meus Alunos",
        descricao: "Acompanhamentos em curso",
        href: "/portal-professor/alunos",
        icone: "alunos",
      },
      {
        rotulo: "Comunicação",
        descricao: "Contactos e avisos com encarregados",
        href: "/portal-professor/comunicacao",
        icone: "comunicacao",
      },
    ],
  },
  {
    rotulo: "Oportunidades",
    itens: [
      {
        rotulo: "Propostas de Alunos",
        descricao: "Atribuição e novos alunos",
        href: "/portal-professor/propostas",
        icone: "propostas",
        contador: "propostas",
      },
    ],
  },
  {
    rotulo: "Gestão Profissional",
    itens: [
      {
        rotulo: "Disponibilidade",
        descricao: "Dias e horários para lecionar",
        href: "/portal-professor/disponibilidade",
        icone: "disponibilidade",
      },
      {
        rotulo: "Remunerações",
        descricao: "Extrato e histórico de pagamentos",
        href: "/portal-professor/remuneracoes",
        icone: "remuneracoes",
      },
      {
        rotulo: "Perfil Profissional",
        descricao: "Formação e zonas de atendimento",
        href: "/portal-professor/perfil",
        icone: "perfil",
      },
    ],
  },
];
