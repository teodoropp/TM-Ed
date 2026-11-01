"use server";

import { baseDados } from "@/servicos/base-dados";
import { obterSessao } from "@/modulos/autenticacao/sessao";
import { obterPrecoPorAnoEDuracao, obterRemuneracaoPorAnoEDuracao } from "@/modulos/precos/consultas";
import { calcularEstimativaMensal } from "@/regras/calculo-preco";
import { validarTransicaoEstado } from "@/regras/maquina-estados-pedido";
import {
  EstadoPedido,
  EstadoPropostaMatching,
  EstadoAcompanhamento,
  EstadoAula,
  ModalidadeAula,
  ObjetivoPedagogico,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface DadosCriarPedido {
  alunoId: string;
  /** Ano escolar escolhido no pedido (define o preço por aula e o total). */
  anoEscolarId: string;
  /** Disciplinas curriculares pretendidas (uma ou várias). */
  disciplinasIds: string[];
  /** Disciplinas adicionais escritas pelo pai (II Ciclo: cursos diferentes). */
  disciplinasAdicionais?: string;
  modalidade: ModalidadeAula;
  duracaoMinutos: number;
  frequenciaSemanal: number;
  diasSemana: string;
  horarioPreferencial: string;
  objetivo: ObjetivoPedagogico;
  observacoes?: string;
  municipio?: string;
  bairro?: string;
  endereco?: string;
  pontoReferencia?: string;
}

export interface RespostaAcaoPedido {
  sucesso: boolean;
  mensagem: string;
  pedidoId?: string;
  /** Identificadores de todos os pedidos criados (um por disciplina). */
  pedidosIds?: string[];
}

/**
 * Cria uma nova solicitação de acompanhamento escolar pelo pai.
 */
export async function acaoCriarPedido(dados: DadosCriarPedido): Promise<RespostaAcaoPedido> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ENCARREGADO") {
    return { sucesso: false, mensagem: "Apenas pais podem submeter pedidos." };
  }

  const perfil = await baseDados.perfilEncarregado.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
  });

  if (!perfil) {
    return { sucesso: false, mensagem: "Perfil de encarregado não encontrado." };
  }

  // Obter o aluno (deve pertencer à conta do pai autenticado)
  const aluno = await baseDados.aluno.findFirst({
    where: { id: dados.alunoId, encarregadoId: perfil.id },
  });

  if (!aluno) {
    return { sucesso: false, mensagem: "Aluno selecionado inválido ou não pertencente à sua conta." };
  }

  // Buscar o ano escolar escolhido no pedido (define o preço e a estimativa)
  const anoEscolar = await baseDados.catalogoAnoEscolar.findUnique({
    where: { id: dados.anoEscolarId },
  });

  if (!anoEscolar) {
    return { sucesso: false, mensagem: "Ano escolar inválido. Selecione um ano da lista." };
  }

  // O ano deve existir no catálogo de preços (com preço ativo para a duração)
  const precoItem = await obterPrecoPorAnoEDuracao(anoEscolar.id, dados.duracaoMinutos);
  if (!precoItem) {
    return {
      sucesso: false,
      mensagem: `Não existe preço regulamentado para ${anoEscolar.nome} com ${dados.duracaoMinutos} minutos. Escolha outra duração ou ano.`,
    };
  }

  const precoUnitarioKz = precoItem.precoPorAulaKz;
  const estimativaMensalKz = calcularEstimativaMensal(precoUnitarioKz, dados.frequenciaSemanal);

  // Validar as disciplinas escolhidas (todas devem existir e estar activas)
  const disciplinasIds = [...new Set(dados.disciplinasIds)];

  if (disciplinasIds.length === 0) {
    return { sucesso: false, mensagem: "Seleccione pelo menos uma disciplina curricular." };
  }

  const disciplinas = await baseDados.catalogoDisciplina.findMany({
    where: { id: { in: disciplinasIds } },
    select: { id: true, nome: true },
  });

  if (disciplinas.length !== disciplinasIds.length) {
    return {
      sucesso: false,
      mensagem: "Uma ou mais disciplinas seleccionadas não são válidas.",
    };
  }

  try {
    const novosPedidos = await baseDados.$transaction(async (tx) => {
      // O valor é por ano escolar (tabela oficial regulamentada), não por disciplina.
      // O pedido é criado com a primeira disciplina como âncora e as restantes
      // consolidadas em disciplinasAdicionais, mantendo um único plano com valor tabelado.
      const disciplinaPrincipal = disciplinas[0];
      const outrasDisciplinas = disciplinas.slice(1).map((d) => d.nome);
      const listaDisciplinasAdicionais = [
        ...outrasDisciplinas,
        ...(dados.disciplinasAdicionais?.trim() ? [dados.disciplinasAdicionais.trim()] : []),
      ];
      const disciplinasAdicionaisFinal =
        listaDisciplinasAdicionais.length > 0
          ? listaDisciplinasAdicionais.join(", ")
          : null;

      const pedido = await tx.pedidoAcompanhamento.create({
        data: {
          encarregadoId: perfil.id,
          alunoId: aluno.id,
          anoEscolarId: anoEscolar.id,
          disciplinaId: disciplinaPrincipal.id,
          disciplinasAdicionais: disciplinasAdicionaisFinal,
          modalidade: dados.modalidade,
          duracaoMinutos: dados.duracaoMinutos,
          frequenciaSemanal: dados.frequenciaSemanal,
          diasSemana: dados.diasSemana,
          horarioPreferencial: dados.horarioPreferencial,
          objetivo: dados.objetivo,
          observacoes: dados.observacoes || null,
          municipio: dados.municipio || perfil.municipio || null,
          bairro: dados.bairro || perfil.bairro || null,
          endereco: dados.endereco || perfil.endereco || null,
          pontoReferencia: dados.pontoReferencia || null,
          precoUnitarioKz,
          estimativaMensalKz,
          estado: EstadoPedido.EmAnalise,
        },
      });

      // Registo inicial no Histórico de Auditoria
      await tx.historicoEstadoPedido.create({
        data: {
          pedidoId: pedido.id,
          estadoAnterior: EstadoPedido.EmAnalise,
          novoEstado: EstadoPedido.EmAnalise,
          alteradoPorId: sessao.utilizadorId,
          motivo:
            disciplinas.length > 1
              ? `Submissão do pedido para ${anoEscolar.nome} (Disciplinas: ${disciplinas.map((d) => d.nome).join(", ")}). Plano regulamentado por ano escolar.`
              : `Submissão do pedido para ${anoEscolar.nome} (${disciplinaPrincipal.nome}).`,
        },
      });

      return [pedido];
    });

    revalidatePath("/portal-encarregado/pedidos");
    revalidatePath("/administracao/pedidos");

    return {
      sucesso: true,
      mensagem: "Pedido de acompanhamento submetido com sucesso!",
      pedidoId: novosPedidos[0].id,
      pedidosIds: novosPedidos.map((p) => p.id),
    };
  } catch (erro) {
    console.error("Erro ao criar pedido:", erro);
    return { sucesso: false, mensagem: "Erro ao registar o pedido no sistema." };
  }
}

/**
 * Atualiza o estado de um pedido de acompanhamento com auditoria obrigatória (Admin).
 */
export async function acaoAtualizarEstadoPedido(
  pedidoId: string,
  novoEstado: EstadoPedido,
  motivo?: string
): Promise<RespostaAcaoPedido> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração." };
  }

  const pedido = await baseDados.pedidoAcompanhamento.findUnique({
    where: { id: pedidoId },
  });

  if (!pedido) {
    return { sucesso: false, mensagem: "Pedido de acompanhamento não encontrado." };
  }

  if (!validarTransicaoEstado(pedido.estado, novoEstado)) {
    return {
      sucesso: false,
      mensagem: `Transição inválida: Não é permitido alterar de ${pedido.estado} para ${novoEstado}.`,
    };
  }

  try {
    await baseDados.$transaction(async (tx) => {
      await tx.pedidoAcompanhamento.update({
        where: { id: pedidoId },
        data: { estado: novoEstado },
      });

      await tx.historicoEstadoPedido.create({
        data: {
          pedidoId,
          estadoAnterior: pedido.estado,
          novoEstado,
          alteradoPorId: sessao.utilizadorId,
          motivo: motivo || `Estado alterado pela administração para ${novoEstado}.`,
        },
      });
    });

    revalidatePath(`/administracao/pedidos`);
    revalidatePath(`/administracao/pedidos/${pedidoId}`);
    revalidatePath(`/portal-encarregado/pedidos`);

    return { sucesso: true, mensagem: "Estado do pedido atualizado com sucesso!" };
  } catch (erro) {
    console.error("Erro ao atualizar estado do pedido:", erro);
    return { sucesso: false, mensagem: "Erro ao atualizar o estado do pedido." };
  }
}

/**
 * Envia uma proposta formal de matching ao professor selecionado (Admin).
 */
export async function acaoEnviarPropostaMatching(
  pedidoId: string,
  professorId: string,
  pontuacaoMatching: number
): Promise<RespostaAcaoPedido> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "ADMINISTRADOR") {
    return { sucesso: false, mensagem: "Acesso restrito à administração." };
  }

  const pedido = await baseDados.pedidoAcompanhamento.findUnique({
    where: { id: pedidoId },
  });

  if (!pedido) {
    return { sucesso: false, mensagem: "Pedido não encontrado." };
  }

  // Buscar remuneração de professor correspondente
  const remunItem = await obterRemuneracaoPorAnoEDuracao(pedido.anoEscolarId, pedido.duracaoMinutos);
  const remuneracaoPorAulaKz = remunItem ? remunItem.remuneracaoPorAulaKz : 0;

  try {
    await baseDados.$transaction(async (tx) => {
      // Criar a proposta de matching com prazo de resposta de 48h
      const expiraEm = new Date();
      expiraEm.setHours(expiraEm.getHours() + 48);

      await tx.propostaMatching.create({
        data: {
          pedidoId,
          professorId,
          pontuacaoMatching,
          remuneracaoPorAulaKz,
          estado: EstadoPropostaMatching.Pendente,
          expiraEm,
        },
      });

      // Atualizar pedido para "AAguardarConfirmacao"
      await tx.pedidoAcompanhamento.update({
        where: { id: pedidoId },
        data: {
          estado: EstadoPedido.AAguardarConfirmacao,
        },
      });

      // Registar no histórico
      await tx.historicoEstadoPedido.create({
        data: {
          pedidoId,
          estadoAnterior: pedido.estado,
          novoEstado: EstadoPedido.AAguardarConfirmacao,
          alteradoPorId: sessao.utilizadorId,
          motivo: `Proposta de matching formal submetida ao explicador com ${pontuacaoMatching}% de compatibilidade.`,
        },
      });
    });

    revalidatePath(`/administracao/pedidos/${pedidoId}`);
    revalidatePath(`/portal-professor/pedidos`);

    return { sucesso: true, mensagem: "Proposta enviada ao professor com sucesso!" };
  } catch (erro) {
    console.error("Erro ao submeter proposta de matching:", erro);
    return { sucesso: false, mensagem: "Erro ao enviar a proposta de matching." };
  }
}

/**
 * Responde a uma proposta de matching recebida (Aceitar ou Recusar com motivo) - Professor.
 */
function extrairHoraInicioAulas(horarioStr?: string | null) {
  const match = (horarioStr || "").match(/(\d{1,2}):(\d{2})/);
  if (match) {
    return { horas: parseInt(match[1], 10), minutos: parseInt(match[2], 10) };
  }
  return { horas: 15, minutos: 0 };
}

function calcularAulasAgenda(
  diasTexto: string | null | undefined,
  horarioStr: string | null | undefined,
  duracaoMinutos: number,
  totalAulas: number = 12
) {
  const { horas, minutos } = extrairHoraInicioAulas(horarioStr);
  const diasAlvo: number[] = [];
  const t = (diasTexto || "").toLowerCase();
  if (t.includes("seg")) diasAlvo.push(1);
  if (t.includes("ter")) diasAlvo.push(2);
  if (t.includes("qua")) diasAlvo.push(3);
  if (t.includes("qui")) diasAlvo.push(4);
  if (t.includes("sex")) diasAlvo.push(5);
  if (t.includes("sab")) diasAlvo.push(6);
  if (t.includes("dom")) diasAlvo.push(0);

  if (diasAlvo.length === 0) diasAlvo.push(1, 3, 5);

  const aulas: Array<{
    numeroSessao: number;
    dataHoraInicio: Date;
    dataHoraFim: Date;
  }> = [];

  const dataCursor = new Date();
  let sessao = 1;

  for (let d = 0; d < 45 && aulas.length < totalAulas; d++) {
    const dataVerificar = new Date(dataCursor.getTime() + d * 24 * 60 * 60 * 1000);
    const diaSemana = dataVerificar.getDay();

    if (diasAlvo.includes(diaSemana)) {
      const inicio = new Date(dataVerificar);
      inicio.setHours(horas, minutos, 0, 0);
      const fim = new Date(inicio.getTime() + duracaoMinutos * 60 * 1000);

      aulas.push({
        numeroSessao: sessao++,
        dataHoraInicio: inicio,
        dataHoraFim: fim,
      });
    }
  }

  return aulas;
}

export async function acaoResponderPropostaMatching(
  propostaId: string,
  resposta: "ACEITAR" | "RECUSAR",
  motivoRecusa?: string
): Promise<RespostaAcaoPedido> {
  const sessao = await obterSessao();
  if (!sessao || sessao.funcao !== "PROFESSOR") {
    return { sucesso: false, mensagem: "Acesso restrito ao perfil de professor." };
  }

  const perfil = await baseDados.perfilProfessor.findUnique({
    where: { utilizadorId: sessao.utilizadorId },
  });

  if (!perfil) {
    return { sucesso: false, mensagem: "Perfil de professor não encontrado." };
  }

  const proposta = await baseDados.propostaMatching.findUnique({
    where: { id: propostaId },
    include: { pedido: true },
  });

  if (!proposta || proposta.professorId !== perfil.id) {
    return { sucesso: false, mensagem: "Proposta não encontrada ou não endereçada a si." };
  }

  if (proposta.estado !== EstadoPropostaMatching.Pendente) {
    return { sucesso: false, mensagem: "Esta proposta já foi previamente respondida." };
  }

  if (resposta === "RECUSAR" && (!motivoRecusa || motivoRecusa.trim().length < 5)) {
    return { sucesso: false, mensagem: "É obrigatório indicar o motivo da recusa." };
  }

  try {
    await baseDados.$transaction(async (tx) => {
      const agora = new Date();

      if (resposta === "ACEITAR") {
        await tx.propostaMatching.update({
          where: { id: propostaId },
          data: {
            estado: EstadoPropostaMatching.Aceite,
            respondidoEm: agora,
          },
        });

        await tx.pedidoAcompanhamento.update({
          where: { id: proposta.pedidoId },
          data: {
            estado: EstadoPedido.Confirmado,
            professorAtribuidoId: perfil.id,
          },
        });

        await tx.historicoEstadoPedido.create({
          data: {
            pedidoId: proposta.pedidoId,
            estadoAnterior: proposta.pedido.estado,
            novoEstado: EstadoPedido.Confirmado,
            alteradoPorId: sessao.utilizadorId,
            motivo: "Professor aceitou formalmente a atribuição do acompanhamento pedagógico.",
          },
        });

        // Cria o AcompanhamentoServico ativo para ligar o aluno ao professor
        const acompExistente = await tx.acompanhamentoServico.findFirst({
          where: { pedidoId: proposta.pedidoId },
        });

        if (!acompExistente) {
          const acomp = await tx.acompanhamentoServico.create({
            data: {
              codigo: `ACOMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              pedidoId: proposta.pedidoId,
              alunoId: proposta.pedido.alunoId,
              encarregadoId: proposta.pedido.encarregadoId,
              professorId: perfil.id,
              disciplinaId: proposta.pedido.disciplinaId,
              modalidade: proposta.pedido.modalidade,
              duracaoMinutos: proposta.pedido.duracaoMinutos,
              frequenciaSemanal: proposta.pedido.frequenciaSemanal,
              diasSemana: proposta.pedido.diasSemana,
              horarioPreferencial: proposta.pedido.horarioPreferencial,
              precoPorAulaKz: proposta.pedido.precoUnitarioKz,
              remuneracaoPorAulaKz: proposta.remuneracaoPorAulaKz,
              estimativaMensalKz: proposta.pedido.estimativaMensalKz,
              estado: EstadoAcompanhamento.Activo,
              municipio: proposta.pedido.municipio,
              bairro: proposta.pedido.bairro,
              endereco: proposta.pedido.endereco,
            },
          });

          // Gera as sessões agendadas na agenda do professor
          const totalAulas = (proposta.pedido.frequenciaSemanal || 3) * 4;
          const aulasLista = calcularAulasAgenda(
            proposta.pedido.diasSemana,
            proposta.pedido.horarioPreferencial,
            proposta.pedido.duracaoMinutos,
            totalAulas
          );

          for (const a of aulasLista) {
            await tx.aula.create({
              data: {
                acompanhamentoId: acomp.id,
                numeroSessao: a.numeroSessao,
                dataHoraInicio: a.dataHoraInicio,
                dataHoraFim: a.dataHoraFim,
                duracaoMinutos: proposta.pedido.duracaoMinutos,
                modalidade: proposta.pedido.modalidade,
                estado: EstadoAula.Agendada,
                precoCobradoKz: proposta.pedido.precoUnitarioKz,
                remuneracaoPagaKz: proposta.remuneracaoPorAulaKz,
              },
            });
          }
        }
      } else {
        await tx.propostaMatching.update({
          where: { id: propostaId },
          data: {
            estado: EstadoPropostaMatching.Recusada,
            motivoRecusa: motivoRecusa?.trim() || null,
            respondidoEm: agora,
          },
        });

        // Retorna o pedido para procura de novo explicador
        await tx.pedidoAcompanhamento.update({
          where: { id: proposta.pedidoId },
          data: {
            estado: EstadoPedido.AProcurarProfessor,
            professorAtribuidoId: null,
          },
        });

        await tx.historicoEstadoPedido.create({
          data: {
            pedidoId: proposta.pedidoId,
            estadoAnterior: proposta.pedido.estado,
            novoEstado: EstadoPedido.AProcurarProfessor,
            alteradoPorId: sessao.utilizadorId,
            motivo: `Professor recusou a proposta: "${motivoRecusa?.trim()}". Pedido devolvido à triagem.`,
          },
        });
      }
    });

    revalidatePath("/portal-professor");
    revalidatePath("/portal-professor/aulas");
    revalidatePath("/portal-professor/agenda");
    revalidatePath("/portal-professor/alunos");
    revalidatePath("/portal-professor/propostas");
    revalidatePath("/portal-professor/remuneracoes");
    revalidatePath("/portal-professor/pedidos");
    revalidatePath("/administracao/pedidos");
    revalidatePath(`/administracao/pedidos/${proposta.pedidoId}`);

    return {
      sucesso: true,
      mensagem:
        resposta === "ACEITAR"
          ? "Proposta aceite com sucesso! As aulas foram agendadas na sua agenda e o aluno está no seu painel."
          : "Recusa registada. O pedido foi devolvido para nova alocação.",
    };
  } catch (erro) {
    console.error("Erro ao responder a proposta:", erro);
    return { sucesso: false, mensagem: "Erro ao processar a resposta da proposta." };
  }
}
