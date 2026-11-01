/**
 * Motor oficial de compatibilidade e ranking de matching assistido da TM-Educa.
 * Classifica os explicadores com base em filtros eliminatórios e pontuação ponderada.
 */

export interface DadosCandidatoProfessor {
  id: string;
  perfilId: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  fotoUrl?: string | null;
  formacaoAcademica?: string | null;
  anosExperiencia: number;
  avaliacaoMedia: number; // 1 a 5 estrelas
  totalAulasDadas: number;
  disciplinasIds: string[];
  zonasAtendimento: Array<{
    municipio: string;
    bairro?: string | null;
  }>;
  disponibilidades: Array<{
    diaSemana: string;
    horaInicio: string;
    horaFim: string;
  }>;
  totalAlunosAtivos: number;
}

export interface RequisitosPedidoMatching {
  disciplinaId: string;
  modalidade: "Domicilio" | "Online" | "Centro";
  municipio?: string | null;
  bairro?: string | null;
  diasSemana?: string[]; // Ex: ["Segunda", "Quarta"]
}

export interface ResultadoAvaliacaoDocente {
  professor: DadosCandidatoProfessor;
  apto: boolean;
  motivoInaptidao?: string;
  pontuacaoTotal: number; // 0 a 100 pontos
  detalhePontuacao: {
    avaliacaoHistorica: number; // até 30
    proximidadeGeografica: number; // até 25
    experienciaEFormacao: number; // até 20
    capacidadeAgenda: number; // até 15
    assiduidadeEHistorico: number; // até 10
  };
  compatibilidadePercentual: number;
}

/**
 * Avalia um único professor frente aos requisitos de um pedido de acompanhamento.
 */
export function avaliarCompatibilidadeDocente(
  professor: DadosCandidatoProfessor,
  requisitos: RequisitosPedidoMatching
): ResultadoAvaliacaoDocente {
  // 1. FILTROS ELIMINATÓRIOS
  // 1.1. Competência Curricular na Disciplina
  if (!professor.disciplinasIds.includes(requisitos.disciplinaId)) {
    return {
      professor,
      apto: false,
      motivoInaptidao: "Não possui competência cadastrada na disciplina solicitada.",
      pontuacaoTotal: 0,
      detalhePontuacao: {
        avaliacaoHistorica: 0,
        proximidadeGeografica: 0,
        experienciaEFormacao: 0,
        capacidadeAgenda: 0,
        assiduidadeEHistorico: 0,
      },
      compatibilidadePercentual: 0,
    };
  }

  // 1.2. Zona Geográfica (se for ao domicílio)
  if (requisitos.modalidade === "Domicilio" && requisitos.municipio) {
    const atendeMunicipio = professor.zonasAtendimento.some(
      (z) => z.municipio.toLowerCase().trim() === requisitos.municipio?.toLowerCase().trim()
    );

    if (!atendeMunicipio && professor.zonasAtendimento.length > 0) {
      return {
        professor,
        apto: false,
        motivoInaptidao: `Não atende no município solicitado (${requisitos.municipio}).`,
        pontuacaoTotal: 0,
        detalhePontuacao: {
          avaliacaoHistorica: 0,
          proximidadeGeografica: 0,
          experienciaEFormacao: 0,
          capacidadeAgenda: 0,
          assiduidadeEHistorico: 0,
        },
        compatibilidadePercentual: 0,
      };
    }
  }

  // 1.3. Disponibilidade nos Dias da Semana Solicitados
  if (requisitos.diasSemana && requisitos.diasSemana.length > 0) {
    const diasDisponiveisProfessor = new Set(
      (professor.disponibilidades || []).map((d) => d.diaSemana.toLowerCase().trim())
    );

    const temTodosOsDias = requisitos.diasSemana.every((dia) =>
      diasDisponiveisProfessor.has(dia.toLowerCase().trim())
    );

    if (!temTodosOsDias) {
      return {
        professor,
        apto: false,
        motivoInaptidao: "O professor não tem disponibilidade nos dias da semana solicitados pelo aluno.",
        pontuacaoTotal: 0,
        detalhePontuacao: {
          avaliacaoHistorica: 0,
          proximidadeGeografica: 0,
          experienciaEFormacao: 0,
          capacidadeAgenda: 0,
          assiduidadeEHistorico: 0,
        },
        compatibilidadePercentual: 0,
      };
    }
  }

  // 2. PONTUAÇÃO DE PREFERÊNCIA (0 A 100 PONTOS)

  // 2.1. Avaliação Histórica (Peso 30%)
  const nota = Math.min(Math.max(professor.avaliacaoMedia || 5.0, 1.0), 5.0);
  const pontuacaoAvaliacao = Math.round((nota / 5.0) * 30);

  // 2.2. Proximidade Geográfica (Peso 25%)
  let pontuacaoProximidade = 15;
  if (requisitos.modalidade === "Domicilio") {
    const bairroExato = professor.zonasAtendimento.some(
      (z) =>
        z.bairro &&
        requisitos.bairro &&
        z.bairro.toLowerCase().trim() === requisitos.bairro.toLowerCase().trim()
    );

    if (bairroExato) {
      pontuacaoProximidade = 25;
    } else {
      const mesmoMunicipio = professor.zonasAtendimento.some(
        (z) =>
          z.municipio &&
          requisitos.municipio &&
          z.municipio.toLowerCase().trim() === requisitos.municipio.toLowerCase().trim()
      );
      pontuacaoProximidade = mesmoMunicipio ? 18 : 10;
    }
  } else {
    // Modalidade Online tem proximidade neutra/ótima por não exigir deslocação
    pontuacaoProximidade = 22;
  }

  // 2.3. Experiência e Formação (Peso 20%)
  let pontuacaoExperiencia = 8;
  if (professor.anosExperiencia >= 6) {
    pontuacaoExperiencia = 20;
  } else if (professor.anosExperiencia >= 3) {
    pontuacaoExperiencia = 15;
  } else if (professor.anosExperiencia >= 1) {
    pontuacaoExperiencia = 10;
  }

  // 2.4. Capacidade de Agenda / Carga Horária Atual (Peso 15%)
  let pontuacaoAgenda = 15;
  if (professor.totalAlunosAtivos >= 6) {
    pontuacaoAgenda = 6;
  } else if (professor.totalAlunosAtivos >= 3) {
    pontuacaoAgenda = 10;
  }

  // 2.5. Assiduidade e Histórico de Aulas (Peso 10%)
  let pontuacaoAssiduidade = 6;
  if (professor.totalAulasDadas >= 30) {
    pontuacaoAssiduidade = 10;
  } else if (professor.totalAulasDadas >= 10) {
    pontuacaoAssiduidade = 8;
  }

  const pontuacaoTotal = Math.min(
    100,
    pontuacaoAvaliacao +
      pontuacaoProximidade +
      pontuacaoExperiencia +
      pontuacaoAgenda +
      pontuacaoAssiduidade
  );

  return {
    professor,
    apto: true,
    pontuacaoTotal,
    detalhePontuacao: {
      avaliacaoHistorica: pontuacaoAvaliacao,
      proximidadeGeografica: pontuacaoProximidade,
      experienciaEFormacao: pontuacaoExperiencia,
      capacidadeAgenda: pontuacaoAgenda,
      assiduidadeEHistorico: pontuacaoAssiduidade,
    },
    compatibilidadePercentual: pontuacaoTotal,
  };
}

/**
 * Executa o ranking de matching em lote para todos os professores disponíveis.
 * Retorna os candidatos ordenados do mais compatível para o menos compatível.
 */
export function ordenarProfessoresPorCompatibilidade(
  professores: DadosCandidatoProfessor[],
  requisitos: RequisitosPedidoMatching
): ResultadoAvaliacaoDocente[] {
  return professores
    .map((prof) => avaliarCompatibilidadeDocente(prof, requisitos))
    .sort((a, b) => {
      // Prioridade: aptos primeiro
      if (a.apto && !b.apto) return -1;
      if (!a.apto && b.apto) return 1;
      // Em seguida, maior pontuação
      return b.pontuacaoTotal - a.pontuacaoTotal;
    });
}
