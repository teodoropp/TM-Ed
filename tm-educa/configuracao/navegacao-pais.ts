/**
 * Estrutura de navegação do Portal dos Pais (TM-Educa).
 *
 * A navegação é apresentada num menu lateral esquerdo, agrupada por domínio
 * de uso, para que qualquer pai encontre rapidamente a acção que precisa:
 * quem são os filhos, o que está em curso, o que tem de pagar e onde pedir
 * ajuda.
 */

export type NomeIconePais =
  | "dashboard"
  | "filhos"
  | "pedidos"
  | "acompanhamentos"
  | "avaliacoes"
  | "pagamentos"
  | "precos"
  | "contratos"
  | "documentos"
  | "ocorrencias"
  | "perfil";

/** Chave do contador que pode ser exibido à direita do item de navegação. */
export type ChaveContadorPais = "pagamentos" | "avaliacoes";

export interface ItemNavegacaoPais {
  rotulo: string;
  /** Texto de apoio apresentado quando o menu está recolhido ou em ecrãs pequenos. */
  descricao: string;
  href: string;
  icone: NomeIconePais;
  /** Contador dinâmico (pendências) exibido à direita do rótulo. */
  contador?: ChaveContadorPais;
  /** Quando verdadeiro, o item só fica ativo em igualdade exata do caminho. */
  exato?: boolean;
}

export interface GrupoNavegacaoPais {
  rotulo: string;
  itens: ItemNavegacaoPais[];
}

export const GRUPOS_NAVEGACAO_PAIS: GrupoNavegacaoPais[] = [
  {
    rotulo: "Início",
    itens: [
      {
        rotulo: "Visão Geral",
        descricao: "Resumo da sua família",
        href: "/portal-encarregado",
        icone: "dashboard",
        exato: true,
      },
    ],
  },
  {
    rotulo: "Percurso Escolar",
    itens: [
      {
        rotulo: "Os Meus Filhos",
        descricao: "Perfis e necessidades",
        href: "/portal-encarregado/alunos",
        icone: "filhos",
      },
      {
        rotulo: "Pedidos de Apoio",
        descricao: "Solicitações e estado",
        href: "/portal-encarregado/pedidos",
        icone: "pedidos",
      },
      {
        rotulo: "Aulas & Acompanhamentos",
        descricao: "Planos e calendário",
        href: "/portal-encarregado/acompanhamentos",
        icone: "acompanhamentos",
      },
      {
        rotulo: "Avaliações",
        descricao: "Avaliar o explicador",
        href: "/portal-encarregado/avaliacoes",
        icone: "avaliacoes",
        contador: "avaliacoes",
      },
    ],
  },
  {
    rotulo: "Contas & Faturação",
    itens: [
      {
        rotulo: "Pagamentos & Faturas",
        descricao: "Faturas e comprovativos",
        href: "/portal-encarregado/pagamentos",
        icone: "pagamentos",
        contador: "pagamentos",
      },
      {
        rotulo: "Preçário",
        descricao: "Tabela e simulador",
        href: "/portal-encarregado/precos",
        icone: "precos",
      },
    ],
  },
  {
    rotulo: "Documentação Legal",
    itens: [
      {
        rotulo: "Contrato de Serviços",
        descricao: "Assinatura e 12 cláusulas",
        href: "/portal-encarregado/contratos",
        icone: "contratos",
      },
      {
        rotulo: "Os Meus Documentos",
        descricao: "Contratos e BIs anexados",
        href: "/portal-encarregado/documentos",
        icone: "documentos",
      },
    ],
  },
  {
    rotulo: "Apoio",
    itens: [
      {
        rotulo: "Ocorrências",
        descricao: "Faltas e contestações",
        href: "/portal-encarregado/ocorrencias",
        icone: "ocorrencias",
      },
      {
        rotulo: "O Meu Perfil",
        descricao: "Dados e morada",
        href: "/portal-encarregado/perfil",
        icone: "perfil",
      },
    ],
  },
];

/** Ordem canónica das chaves de contadores, usada para validar os dados recebidos. */
export const CHAVES_CONTADOR_PAIS: ChaveContadorPais[] = ["pagamentos", "avaliacoes"];
