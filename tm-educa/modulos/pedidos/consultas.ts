import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import { EstadoPedido } from "@prisma/client";

/**
 * Consulta todos os pedidos submetidos pelo pai autenticado.
 */
export async function obterMeusPedidos() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ENCARREGADO") {
    return [];
  }

  const perfil = await baseDados.perfilEncarregado.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
  });

  if (!perfil) return [];

  return await baseDados.pedidoAcompanhamento.findMany({
    where: { encarregadoId: perfil.id },
    orderBy: { criadoEm: "desc" },
    include: {
      aluno: true,
      anoEscolar: true,
      disciplina: true,
      professorAtribuido: {
        include: { utilizador: true },
      },
    },
  });
}

/**
 * Consulta os detalhes completos de um pedido de acompanhamento específico.
 */
export async function obterPedidoPorId(id: string) {
  const sessao = await obterSessao();
  if (!sessao) return null;

  const pedido = await baseDados.pedidoAcompanhamento.findUnique({
    where: { id },
    include: {
      aluno: true,
      anoEscolar: {
        include: { ciclo: true },
      },
      disciplina: true,
      encarregado: {
        include: { utilizador: true },
      },
      professorAtribuido: {
        include: { utilizador: true },
      },
      historico: {
        orderBy: { criadoEm: "desc" },
        include: { alteradoPor: true },
      },
      propostas: {
        orderBy: { criadoEm: "desc" },
        include: {
          professor: {
            include: { utilizador: true },
          },
        },
      },
    },
  });

  if (!pedido) return null;

  // Verificação de permissões: apenas o encarregado dono ou administrador pode ver
  if (sessao.funcao === "ENCARREGADO") {
    const perfil = await baseDados.perfilEncarregado.findUnique({
      where: { utilizadorId: sessao.utilizadorId },
    });
    if (perfil?.id !== pedido.encarregadoId) {
      return null;
    }
  }

  return pedido;
}

/**
 * Consulta todos os pedidos no sistema para supervisão e matching no painel administrativo.
 */
export async function obterTodosPedidosAdmin(filtroEstado?: EstadoPedido) {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return [];
  }

  return await baseDados.pedidoAcompanhamento.findMany({
    where: filtroEstado ? { estado: filtroEstado } : undefined,
    orderBy: { criadoEm: "desc" },
    include: {
      aluno: true,
      anoEscolar: true,
      disciplina: true,
      encarregado: {
        include: { utilizador: true },
      },
      professorAtribuido: {
        include: { utilizador: true },
      },
      propostas: {
        where: { estado: "Pendente" },
        include: {
          professor: {
            include: { utilizador: true },
          },
        },
      },
    },
  });
}

/**
 * Obtém contadores de pedidos para os cartões de resumo da administração.
 */
export async function obterEstatisticasPedidosAdmin() {
  const [total, emAnalise, aProcurar, aAguardar, confirmados] = await Promise.all([
    baseDados.pedidoAcompanhamento.count(),
    baseDados.pedidoAcompanhamento.count({ where: { estado: "EmAnalise" } }),
    baseDados.pedidoAcompanhamento.count({ where: { estado: "AProcurarProfessor" } }),
    baseDados.pedidoAcompanhamento.count({ where: { estado: "AAguardarConfirmacao" } }),
    baseDados.pedidoAcompanhamento.count({ where: { estado: "Confirmado" } }),
  ]);

  return {
    total,
    emAnalise,
    aProcurar,
    aAguardar,
    confirmados,
  };
}

import { obterRemuneracaoPorAnoEDuracao } from "@/modulos/precos/consultas";
import { EstadoPropostaMatching, DiaSemana } from "@prisma/client";

/**
 * Extrai a lista de dias da semana a partir do texto do pedido do aluno.
 */
export function extrairDiasRequeridos(diasTexto: string | null | undefined): DiaSemana[] {
  if (!diasTexto) return [];

  const texto = diasTexto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const dias: DiaSemana[] = [];

  if (texto.includes("segunda a sexta") || texto.includes("seg a sex")) {
    return [
      DiaSemana.Segunda,
      DiaSemana.Terca,
      DiaSemana.Quarta,
      DiaSemana.Quinta,
      DiaSemana.Sexta,
    ];
  }

  if (/\bseg(unda)?\b/.test(texto) || texto.includes("segunda")) {
    dias.push(DiaSemana.Segunda);
  }
  if (/\bter(ca)?\b/.test(texto) || texto.includes("terca")) {
    dias.push(DiaSemana.Terca);
  }
  if (/\bqua(rta)?\b/.test(texto) || texto.includes("quarta")) {
    dias.push(DiaSemana.Quarta);
  }
  if (/\bqui(nta)?\b/.test(texto) || texto.includes("quinta")) {
    dias.push(DiaSemana.Quinta);
  }
  if (/\bsex(ta)?\b/.test(texto) || texto.includes("sexta")) {
    dias.push(DiaSemana.Sexta);
  }
  if (/\bsab(ado)?\b/.test(texto) || texto.includes("sabado")) {
    dias.push(DiaSemana.Sabado);
  }
  if (/\bdom(ingo)?\b/.test(texto) || texto.includes("domingo")) {
    dias.push(DiaSemana.Domingo);
  }

  return dias;
}

/**
 * Valida se o professor possui disponibilidade ativa para todos os dias solicitados pelo aluno.
 */
export function professorTemDisponibilidadeParaDias(
  diasPedido: string | null | undefined,
  disponibilidades: Array<{ diaSemana: DiaSemana; activo: boolean }>
): boolean {
  if (!diasPedido) return true;

  const diasNecessarios = extrairDiasRequeridos(diasPedido);
  if (diasNecessarios.length === 0) return true;

  // Dias em que o professor está ativo na sua grelha semanal
  const diasAtivosProfessor = new Set(
    disponibilidades
      .filter((d) => d.activo)
      .map((d) => d.diaSemana)
  );

  // Se o professor não tiver nenhum dia ativo, não pode receber propostas
  if (diasAtivosProfessor.size === 0) return false;

  // O professor deve ter disponibilidade em TODOS os dias solicitados pelo aluno
  return diasNecessarios.every((dia) => diasAtivosProfessor.has(dia));
}

/**
 * Consulta as propostas de matching recebidas pelo professor autenticado.
 * Aplica filtro estrito de disponibilidade: se o professor não tem disponibilidade
 * para os dias solicitados pelo aluno, a proposta NÃO é exibida.
 */
export async function obterPropostasProfessor() {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "PROFESSOR") {
    return [];
  }

  const perfil = await baseDados.perfilProfessor.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
    include: {
      disponibilidades: true,
    },
  });

  if (!perfil) return [];

  try {
    // Busca pedidos de alunos abertos em Luanda ou Online
    const pedidosAbertos = await baseDados.pedidoAcompanhamento.findMany({
      where: {
        estado: {
          in: [
            EstadoPedido.AProcurarProfessor,
            EstadoPedido.EmAnalise,
            EstadoPedido.SemProfessorDisponivel,
            EstadoPedido.AAguardarConfirmacao,
          ],
        },
        professorAtribuidoId: null,
      },
      include: {
        aluno: true,
        anoEscolar: true,
        disciplina: true,
        propostas: {
          where: { professorId: perfil.id },
        },
      },
      orderBy: { criadoEm: "desc" },
    });

    // Cria a proposta de matching para pedidos abertos APENAS se o professor tiver disponibilidade nos dias da aula
    for (const pedido of pedidosAbertos) {
      if (!professorTemDisponibilidadeParaDias(pedido.diasSemana, perfil.disponibilidades)) {
        continue;
      }

      if (pedido.propostas.length === 0) {
        const remunItem = await obterRemuneracaoPorAnoEDuracao(
          pedido.anoEscolarId,
          pedido.duracaoMinutos
        );
        const remuneracao = remunItem
          ? remunItem.remuneracaoPorAulaKz
          : pedido.precoUnitarioKz > 0
          ? Math.round(pedido.precoUnitarioKz * 0.7)
          : 6500;

        const expiraEm = new Date();
        expiraEm.setDate(expiraEm.getDate() + 7);

        await baseDados.propostaMatching.create({
          data: {
            pedidoId: pedido.id,
            professorId: perfil.id,
            pontuacaoMatching: 95,
            remuneracaoPorAulaKz: remuneracao,
            estado: EstadoPropostaMatching.Pendente,
            expiraEm,
          },
        });
      }
    }
  } catch (erro) {
    console.error("Erro ao sincronizar pedidos abertos com propostas:", erro);
  }

  const todasPropostas = await baseDados.propostaMatching.findMany({
    where: { professorId: perfil.id },
    orderBy: { criadoEm: "desc" },
    include: {
      pedido: {
        include: {
          aluno: true,
          anoEscolar: true,
          disciplina: true,
        },
      },
    },
  });

  // Filtro eliminatório: se o professor não tem disponibilidade para o dia do aluno, a proposta NÃO deve aparecer
  return todasPropostas.filter((p) => {
    if (p.estado === EstadoPropostaMatching.Aceite) return true;
    return professorTemDisponibilidadeParaDias(p.pedido.diasSemana, perfil.disponibilidades);
  });
}
