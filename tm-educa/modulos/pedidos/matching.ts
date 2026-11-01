import { baseDados } from "@/servicos/base-dados";
import type { Prisma } from "@prisma/client";
import {
  DadosCandidatoProfessor,
  RequisitosPedidoMatching,
  ResultadoAvaliacaoDocente,
  ordenarProfessoresPorCompatibilidade,
} from "@/regras/motor-matching";

/** Pedido com as relações necessárias ao matching. */
type PedidoComRelacoes = Prisma.PedidoAcompanhamentoGetPayload<{
  include: {
    aluno: true;
    anoEscolar: true;
    disciplina: true;
    encarregado: true;
  };
}>;

/**
 * Executa o matching assistido para um pedido de acompanhamento específico.
 */
export async function obterCandidatosMatchingParaPedido(
  pedidoId: string
): Promise<{
  pedido: PedidoComRelacoes;
  candidatos: ResultadoAvaliacaoDocente[];
} | null> {
  const pedido = await baseDados.pedidoAcompanhamento.findUnique({
    where: { id: pedidoId },
    include: {
      aluno: true,
      anoEscolar: true,
      disciplina: true,
      encarregado: true,
    },
  });

  if (!pedido) return null;

  // Buscar todos os professores verificados ou ativos no sistema
  const professoresDb = await baseDados.perfilProfessor.findMany({
    where: {
      estado: { in: ["Activo", "Verificado"] },
    },
    include: {
      utilizador: true,
      disciplinasLecionadas: true,
      zonasAtendimento: true,
      disponibilidades: { where: { activo: true } },
      pedidosAtribuidos: { where: { estado: { in: ["Confirmado", "Activo"] } } },
    },
  });

  // Mapear professores para a estrutura de dados do motor de matching
  const candidatosDados: DadosCandidatoProfessor[] = professoresDb.map((prof) => ({
    id: prof.utilizadorId,
    perfilId: prof.id,
    nomeCompleto: prof.utilizador.nomeCompleto,
    email: prof.utilizador.email,
    telefone: prof.utilizador.telefone,
    fotoUrl: prof.fotoUrl,
    formacaoAcademica: prof.formacaoAcademica,
    anosExperiencia: prof.anosExperiencia,
    avaliacaoMedia: prof.avaliacaoMedia,
    totalAulasDadas: prof.totalAulasDadas,
    disciplinasIds: prof.disciplinasLecionadas.map((d) => d.disciplinaId),
    zonasAtendimento: prof.zonasAtendimento.map((z) => ({
      municipio: z.municipio,
      bairro: z.bairro,
    })),
    disponibilidades: prof.disponibilidades.map((disp) => ({
      diaSemana: disp.diaSemana,
      horaInicio: disp.horaInicio,
      horaFim: disp.horaFim,
    })),
    totalAlunosAtivos: prof.pedidosAtribuidos.length,
  }));

  const requisitos: RequisitosPedidoMatching = {
    disciplinaId: pedido.disciplinaId,
    modalidade: pedido.modalidade as "Domicilio" | "Online" | "Centro",
    municipio: pedido.municipio,
    bairro: pedido.bairro,
    diasSemana: pedido.diasSemana ? pedido.diasSemana.split(",").map((s) => s.trim()) : undefined,
  };

  const candidatos = ordenarProfessoresPorCompatibilidade(candidatosDados, requisitos);

  return {
    pedido,
    candidatos,
  };
}
