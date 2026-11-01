/**
 * Estrutura de navegação do Painel de Administração da TM-Educa.
 *
 * A navegação é apresentada num menu lateral esquerdo (não existe menu superior
 * nesta área). Os itens estão agrupados por domínio de gestão para permitir uma
 * leitura rápida do sistema, à semelhança de um SaaS operacional.
 */

export type NomeIconeAdmin =
  | "painel"
  | "pedidos"
  | "acompanhamentos"
  | "contratos"
  | "aulas"
  | "financeiro"
  | "ocorrencias"
  | "avaliacoes"
  | "catalogo"
  | "precos"
  | "remuneracoes"
  | "disciplinas"
  | "utilizadores"
  | "encarregados"
  | "alunos"
  | "professores"
  | "configuracoes";

export interface ItemNavegacaoAdmin {
  rotulo: string;
  href: string;
  icone: NomeIconeAdmin;
  /** Contador opcional apresentado à direita do rótulo. */
  badge?: number | string | null;
  /** Quando verdadeiro, o item só fica ativo em Equality exato do caminho. */
  exato?: boolean;
}

export interface GrupoNavegacaoAdmin {
  rotulo: string;
  itens: ItemNavegacaoAdmin[];
}

export const GRUPOS_NAVEGACAO_ADMIN: GrupoNavegacaoAdmin[] = [
  {
    rotulo: "Visão Geral",
    itens: [
      {
        rotulo: "Painel Geral",
        href: "/administracao",
        icone: "painel",
        exato: true,
      },
    ],
  },
  {
    rotulo: "Operações",
    itens: [
      { rotulo: "Pedidos", href: "/administracao/pedidos", icone: "pedidos" },
      {
        rotulo: "Acompanhamentos",
        href: "/administracao/acompanhamentos",
        icone: "acompanhamentos",
      },
      { rotulo: "Contratos", href: "/administracao/contratos", icone: "contratos" },
      { rotulo: "Aulas", href: "/administracao/aulas", icone: "aulas" },
    ],
  },
  {
    rotulo: "Financeiro",
    itens: [
      {
        rotulo: "Finanças & Margens",
        href: "/administracao/financeiro",
        icone: "financeiro",
      },
    ],
  },
  {
    rotulo: "Qualidade",
    itens: [
      {
        rotulo: "Ocorrências",
        href: "/administracao/ocorrencias",
        icone: "ocorrencias",
      },
      {
        rotulo: "Avaliações de Explicadores",
        href: "/administracao/avaliacoes",
        icone: "avaliacoes",
      },
    ],
  },
  {
    rotulo: "Catálogo",
    itens: [
      { rotulo: "Catálogo", href: "/administracao/catalogo", icone: "catalogo" },
      {
        rotulo: "Preçário Oficial",
        href: "/administracao/catalogo/precos",
        icone: "precos",
      },
      {
        rotulo: "Remunerações",
        href: "/administracao/catalogo/remuneracoes",
        icone: "remuneracoes",
      },
      {
        rotulo: "Disciplinas",
        href: "/administracao/catalogo/disciplinas",
        icone: "disciplinas",
      },
    ],
  },
  {
    rotulo: "Utilizadores",
    itens: [
      {
        rotulo: "Utilizadores",
        href: "/administracao/utilizadores",
        icone: "utilizadores",
      },
      {
        rotulo: "Pais / Encarregados",
        href: "/administracao/utilizadores/encarregados",
        icone: "encarregados",
      },
      {
        rotulo: "Alunos",
        href: "/administracao/utilizadores/alunos",
        icone: "alunos",
      },
      {
        rotulo: "Professores",
        href: "/administracao/utilizadores/professores",
        icone: "professores",
      },
    ],
  },
  {
    rotulo: "Sistema",
    itens: [
      {
        rotulo: "Definições",
        href: "/administracao/configuracoes",
        icone: "configuracoes",
      },
    ],
  },
];
