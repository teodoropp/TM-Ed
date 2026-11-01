import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function semear() {
  console.log("A iniciar sementeira de dados da TM-Educa...");

  const palavraPassePadrao = await bcrypt.hash("tmeduca2026", 12);

  // 1. Administrador do Sistema (conta real, definida em .env)
  const { semearAdministrador } = await import("./administrador");
  const admin = await semearAdministrador(prisma);
  console.log(`✓ Administrador criado: ${admin.email}`);

  // 2. Pai de Teste
  const encarregado = await prisma.utilizador.upsert({
    where: { email: "encarregado@tmeduca.ao" },
    update: {},
    create: {
      nomeCompleto: "Manuel António de Sousa",
      email: "encarregado@tmeduca.ao",
      telefone: "+244 923 000 002",
      palavraPasseHash: palavraPassePadrao,
      funcao: "ENCARREGADO",
      perfilEncarregado: {
        create: {
          nif: "541209384LA042",
          municipio: "Luanda",
          bairro: "Alvalade",
          endereco: "Rua Comandante Gika, N.º 45",
          profissao: "Engenheiro",
        },
      },
    },
  });
  console.log(`✓ Pais criado: ${encarregado.email}`);

  // 3. Professor de Teste
  const professor = await prisma.utilizador.upsert({
    where: { email: "professor@tmeduca.ao" },
    update: {},
    create: {
      nomeCompleto: "Prof. Domingos Gaspar",
      email: "professor@tmeduca.ao",
      telefone: "+244 923 000 003",
      palavraPasseHash: palavraPassePadrao,
      funcao: "PROFESSOR",
      perfilProfessor: {
        create: {
          formacaoAcademica: "Licenciatura em Matemática e Física",
          anosExperiencia: 7,
          estado: "Activo",
          biografia: "Explicador com ampla experiência na preparação de estudantes para exames nacionais do II Ciclo e testes de acesso ao Ensino Superior.",
        },
      },
    },
  });
  console.log(`✓ Professor criado: ${professor.email}`);

  // 4. Catálogo Escolar, Preçário e Remunerações
  const { semearCatalogoEPrecos } = await import("./semente-catalogo");
  await semearCatalogoEPrecos();

  // 5. Vincular disciplinas e zonas de atendimento ao professor de teste
  const perfilProf = await prisma.perfilProfessor.findUnique({
    where: { utilizadorId: professor.id },
  });

  if (perfilProf) {
    const disciplinas = await prisma.catalogoDisciplina.findMany({
      where: { nome: { in: ["Matemática", "Física"] } },
    });

    for (const d of disciplinas) {
      await prisma.professorDisciplina.upsert({
        where: {
          professorId_disciplinaId: {
            professorId: perfilProf.id,
            disciplinaId: d.id,
          },
        },
        update: {},
        create: {
          professorId: perfilProf.id,
          disciplinaId: d.id,
        },
      });
    }

    const zonas = ["Luanda", "Talatona", "Kilamba Kiaxi"];
    for (const z of zonas) {
      const existeZona = await prisma.professorZonaAtendimento.findFirst({
        where: { professorId: perfilProf.id, municipio: z },
      });
      if (!existeZona) {
        await prisma.professorZonaAtendimento.create({
          data: {
            professorId: perfilProf.id,
            municipio: z,
            bairro: z === "Luanda" ? "Alvalade" : "Benfica",
          },
        });
      }
    }
  }

  console.log("Sementeira da TM-Educa concluída com sucesso!");
  console.log(
    "Contas de demonstração (encarregado@tmeduca.ao, professor@tmeduca.ao): tmeduca2026"
  );
  console.log(`Administrador do sistema: ${admin.email} (palavra-passe definida em .env)`);
}

semear()
  .catch((e) => {
    console.error("Erro durante a sementeira:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
