/**
 * Configuração centralizada e tipada dos dados dos slides do Carrossel Hero da TM-Educa.
 * Integração das 5 imagens oficiais fornecidas pelo utilizador da pasta 'Nova pasta'.
 *
 * NOTA SOBRE AS IMAGENS: estas 5 imagens oficiais não têm texto incrustado (baked in)
 * e são compostas com o sujeto à direita e espaço negativo à esquerda, por isso o
 * badge/título/subtítulo/CTA são desenhados em HTML (ver `slide-hero.tsx`). Isso
 * permite que o texto se adapte a qualquer largura de ecrã em vez de ser cortado
 * pela propagem `object-cover`.
 *
 * Não usar os ficheiros `banner-*.png` / `slide-*.png` (1920x500): são cropped
 * muito panorâmicos com os cabeças já cortados de origem e o texto incrustado.
 */

export interface DadosSlideHero {
  id: string;
  ordem: number;
  titulo: string;
  subtitulo?: string;
  imagemDesktop: string;
  imagemMobile: string;
  textoAlternativo: string;
  badge: string;
  linkAcao?: string;
  etiquetaAcao?: string;
}

export const SLIDES_HERO: DadosSlideHero[] = [
  {
    id: "acompanhamento-personalizado",
    ordem: 1,
    titulo: "Cada aluno tem o seu caminho.",
    subtitulo: "Nós ajudamos a construir o próximo passo.",
    imagemDesktop: "/imagens/hero/tutoria-fundo-amarelo.png",
    imagemMobile: "/imagens/hero/tutoria-fundo-amarelo-mobile.png",
    textoAlternativo:
      "Explicadora a apoiar um aluno que escreve no caderno, num ambiente de estudo acolhedor.",
    badge: "Apoio Individualizado",
    linkAcao: "/portal-encarregado/pedidos/novo",
    etiquetaAcao: "Solicitar Explicador",
  },
  {
    id: "professor-certo",
    ordem: 2,
    titulo: "O professor certo pode mudar a forma de aprender.",
    subtitulo:
      "Paciência, método e dedicação que devolvem o sorriso e a confiança aos seus filhos.",
    imagemDesktop: "/imagens/hero/mentoria-foco-inspiracao.png",
    imagemMobile: "/imagens/hero/mentoria-foco-inspiracao-mobile.png",
    textoAlternativo:
      "Professora dedicada orienta cuidadosamente um estudante durante uma sessão de estudo.",
    badge: "Explicadores Selecionados",
    linkAcao: "/portal-encarregado/pedidos/novo",
    etiquetaAcao: "Encontrar Explicador",
  },
  {
    id: "evolucao-resultados",
    ordem: 3,
    titulo: "Aprender. Evoluir. Alcançar.",
    subtitulo:
      "Rotina estruturada de estudo e evolução contínua do 1.º ao 12.º ano e exames nacionais.",
    imagemDesktop: "/imagens/hero/estudante-concentrado.png",
    imagemMobile: "/imagens/hero/estudante-concentrado-mobile.png",
    textoAlternativo:
      "Estudante concentrado a estudar no caderno, com ambiente de estudo limpo.",
    badge: "Resultados Comprovados",
    linkAcao: "/#servicos",
    etiquetaAcao: "Conhecer Soluções",
  },
  {
    id: "regresso-aulas-dourado",
    ordem: 4,
    titulo: "Preparação de Excelência para o Ano Letivo",
    subtitulo:
      "Acompanhamento contínuo do 1.º ao 12.º ano, exames nacionais e acesso ao ensino superior.",
    imagemDesktop: "/imagens/hero/regresso-aulas-dourado.png",
    imagemMobile: "/imagens/hero/regresso-aulas-dourado-mobile.png",
    textoAlternativo:
      "Estudantes radiantes e prontos para um ano letivo de sucesso.",
    badge: "Evolução Contínua",
    linkAcao: "/#servicos",
    etiquetaAcao: "Preparar o Ano",
  },
  {
    id: "familia-progresso-escolar",
    ordem: 5,
    titulo: "Mais do que explicações.",
    subtitulo:
      "Um acompanhamento completo com supervisão direta e total tranquilidade para a família.",
    imagemDesktop: "/imagens/hero/familia-progresso-escolar.png",
    imagemMobile: "/imagens/hero/familia-progresso-escolar-mobile.png",
    textoAlternativo:
      "Família e Progresso Escolar: Encarregada de educação serena e satisfeita ao lado dos filhos e do orientador.",
    badge: "Pais • Aluno • Explicador",
    linkAcao: "/portal-encarregado/pedidos/novo",
    etiquetaAcao: "Conhecer o Modelo",
  },
];