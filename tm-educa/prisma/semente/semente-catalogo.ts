import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ConfigCiclo {
  nome: string;
  ordem: number;
  anos: {
    nome: string;
    ordem: number;
    /** Preço oficial por aula (cliente) e remuneração do explicador, por ano. */
    precos: { duracao: number; clienteKz: number; professorKz: number }[];
  }[];
}

/**
 * Tabela de Preços oficial da TM-Educa ("Tabela de Preço.pdf").
 *
 * O preço é definido POR ANO ESCOLAR (e não por ciclo) e por duração de
 * sessão (1h, 1h30, 2h).
 *
 * Cálculo mensal oficial (constante em todas as tabelas):
 *   Estimativa Mensal = Preço por Aula × Dias Úteis por Semana × 4 Semanas
 *
 * A remuneração do explicador corresponde a 70% do preço ao cliente, o que
 * preserva a margem bruta de 30% usada na tabela anterior.
 */
const ESTRUTURA_CURRICULAR: ConfigCiclo[] = [
  {
    nome: "Ensino Primário",
    ordem: 1,
    anos: [
      {
        nome: "1.º Ano",
        ordem: 1,
        precos: [
          { duracao: 60, clienteKz: 3000, professorKz: 2100 },
          { duracao: 90, clienteKz: 4500, professorKz: 3150 },
          { duracao: 120, clienteKz: 6000, professorKz: 4200 },
        ],
      },
      {
        nome: "2.º Ano",
        ordem: 2,
        precos: [
          { duracao: 60, clienteKz: 3500, professorKz: 2450 },
          { duracao: 90, clienteKz: 5000, professorKz: 3500 },
          { duracao: 120, clienteKz: 6500, professorKz: 4550 },
        ],
      },
      {
        nome: "3.º Ano",
        ordem: 3,
        precos: [
          { duracao: 60, clienteKz: 4000, professorKz: 2800 },
          { duracao: 90, clienteKz: 5500, professorKz: 3850 },
          { duracao: 120, clienteKz: 7000, professorKz: 4900 },
        ],
      },
      {
        nome: "4.º Ano",
        ordem: 4,
        precos: [
          { duracao: 60, clienteKz: 4500, professorKz: 3150 },
          { duracao: 90, clienteKz: 6500, professorKz: 4550 },
          { duracao: 120, clienteKz: 8500, professorKz: 5950 },
        ],
      },
      {
        nome: "5.º Ano",
        ordem: 5,
        precos: [
          { duracao: 60, clienteKz: 6000, professorKz: 4200 },
          { duracao: 90, clienteKz: 7500, professorKz: 5250 },
          { duracao: 120, clienteKz: 9500, professorKz: 6650 },
        ],
      },
      {
        nome: "6.º Ano",
        ordem: 6,
        precos: [
          { duracao: 60, clienteKz: 7000, professorKz: 4900 },
          { duracao: 90, clienteKz: 8500, professorKz: 5950 },
          { duracao: 120, clienteKz: 10500, professorKz: 7350 },
        ],
      },
    ],
  },
  {
    nome: "I Ciclo do Ensino Secundário",
    ordem: 2,
    anos: [
      {
        nome: "7.º Ano",
        ordem: 7,
        precos: [
          { duracao: 60, clienteKz: 8500, professorKz: 5950 },
          { duracao: 90, clienteKz: 10000, professorKz: 7000 },
          { duracao: 120, clienteKz: 12500, professorKz: 8750 },
        ],
      },
      {
        nome: "8.º Ano",
        ordem: 8,
        precos: [
          { duracao: 60, clienteKz: 9000, professorKz: 6300 },
          { duracao: 90, clienteKz: 11500, professorKz: 8050 },
          { duracao: 120, clienteKz: 14000, professorKz: 9800 },
        ],
      },
      {
        nome: "9.º Ano",
        ordem: 9,
        precos: [
          { duracao: 60, clienteKz: 9500, professorKz: 6650 },
          { duracao: 90, clienteKz: 12000, professorKz: 8400 },
          { duracao: 120, clienteKz: 15500, professorKz: 10850 },
        ],
      },
    ],
  },
  {
    nome: "II Ciclo do Ensino Secundário",
    ordem: 3,
    anos: [
      {
        nome: "10.º Ano",
        ordem: 10,
        precos: [
          { duracao: 60, clienteKz: 11500, professorKz: 8050 },
          { duracao: 90, clienteKz: 15500, professorKz: 10850 },
          { duracao: 120, clienteKz: 20500, professorKz: 14350 },
        ],
      },
      {
        nome: "11.º Ano",
        ordem: 11,
        precos: [
          { duracao: 60, clienteKz: 12500, professorKz: 8750 },
          { duracao: 90, clienteKz: 17000, professorKz: 11900 },
          { duracao: 120, clienteKz: 22500, professorKz: 15750 },
        ],
      },
      {
        nome: "12.º Ano",
        ordem: 12,
        precos: [
          { duracao: 60, clienteKz: 13500, professorKz: 9450 },
          { duracao: 90, clienteKz: 18500, professorKz: 12950 },
          { duracao: 120, clienteKz: 24500, professorKz: 17150 },
        ],
      },
    ],
  },
];

const DISCIPLINAS_INICIAIS = [
  { nome: "Matemática", descricao: "Álgebra, Geometria, Aritmética e Cálculo" },
  { nome: "Língua Portuguesa", descricao: "Gramática, Compreensão de Texto e Redação" },
  { nome: "Física", descricao: "Mecânica, Termodinâmica, Óptica e Eletromagnetismo" },
  { nome: "Química", descricao: "Química Geral, Orgânica e Inorgânica" },
  { nome: "Biologia", descricao: "Biologia Geral, Genética e Anatomia" },
  { nome: "Inglês", descricao: "Gramática, Vocabulário e Expressão Oral" },
  { nome: "Francês", descricao: "Iniciação e Acompanhamento Curricular" },
  { nome: "História", descricao: "História de Angola, África e Universal" },
  { nome: "Geografia", descricao: "Geografia Física, Humana e Económica" },
];

export async function semearCatalogoEPrecos() {
  console.log("A semear Ciclos, Anos Escolares, Preçário e Remunerações da TM-Educa...");

  for (const cicloConfig of ESTRUTURA_CURRICULAR) {
    const ciclo = await prisma.catalogoCiclo.upsert({
      where: { nome: cicloConfig.nome },
      update: { ordem: cicloConfig.ordem },
      create: {
        nome: cicloConfig.nome,
        ordem: cicloConfig.ordem,
      },
    });

    console.log(`✓ Ciclo sincronizado: ${ciclo.nome}`);

    for (const anoConfig of cicloConfig.anos) {
      const ano = await prisma.catalogoAnoEscolar.upsert({
        where: { nome: anoConfig.nome },
        update: {
          cicloId: ciclo.id,
          ordem: anoConfig.ordem,
        },
        create: {
          nome: anoConfig.nome,
          ordem: anoConfig.ordem,
          cicloId: ciclo.id,
        },
      });

      // Semear Preços e Remunerações para as 3 durações (60, 90, 120 min)
      for (const precoConfig of anoConfig.precos) {
        await prisma.tabelaPreco.upsert({
          where: {
            anoEscolarId_duracaoMinutos: {
              anoEscolarId: ano.id,
              duracaoMinutos: precoConfig.duracao,
            },
          },
          update: {
            precoPorAulaKz: precoConfig.clienteKz,
            activo: true,
          },
          create: {
            anoEscolarId: ano.id,
            duracaoMinutos: precoConfig.duracao,
            precoPorAulaKz: precoConfig.clienteKz,
            activo: true,
          },
        });

        await prisma.tabelaRemuneracao.upsert({
          where: {
            anoEscolarId_duracaoMinutos: {
              anoEscolarId: ano.id,
              duracaoMinutos: precoConfig.duracao,
            },
          },
          update: {
            remuneracaoPorAulaKz: precoConfig.professorKz,
            activo: true,
          },
          create: {
            anoEscolarId: ano.id,
            duracaoMinutos: precoConfig.duracao,
            remuneracaoPorAulaKz: precoConfig.professorKz,
            activo: true,
          },
        });
      }
    }
  }

  // Semear Disciplinas Curriculares
  console.log("A semear disciplinas escolares...");
  for (const disc of DISCIPLINAS_INICIAIS) {
    await prisma.catalogoDisciplina.upsert({
      where: { nome: disc.nome },
      update: {
        descricao: disc.descricao,
        activo: true,
      },
      create: {
        nome: disc.nome,
        descricao: disc.descricao,
        activo: true,
      },
    });
  }

  console.log("✓ Catálogo escolar, 36 preços e 36 remunerações semeados com sucesso!");
}

if (require.main === module) {
  semearCatalogoEPrecos()
    .catch((erro) => {
      console.error("Erro ao semear catálogo:", erro);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
