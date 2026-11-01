-- CreateEnum
CREATE TYPE "FuncaoUtilizador" AS ENUM ('ADMINISTRADOR', 'ENCARREGADO', 'PROFESSOR');

-- CreateEnum
CREATE TYPE "EstadoProfessor" AS ENUM ('Pendente', 'Em_analise', 'Verificado', 'Activo', 'Suspenso', 'Inactivo');

-- CreateEnum
CREATE TYPE "ModalidadeAula" AS ENUM ('Domicilio', 'Online', 'Centro');

-- CreateEnum
CREATE TYPE "SexoAluno" AS ENUM ('Masculino', 'Feminino');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('EmAnalise', 'AProcurarProfessor', 'SemProfessorDisponivel', 'ProfessorEncontrado', 'AAguardarConfirmacao', 'Confirmado', 'Activo', 'Suspenso', 'Concluido', 'Cancelado');

-- CreateEnum
CREATE TYPE "EstadoPropostaMatching" AS ENUM ('Pendente', 'Aceite', 'Recusada', 'Expirada', 'Cancelada');

-- CreateEnum
CREATE TYPE "ObjetivoPedagogico" AS ENUM ('AcompanhamentoContinuo', 'MelhoriaNotas', 'PreparacaoTestes', 'PreparacaoExames', 'RecuperacaoMateria', 'Outro');

-- CreateTable
CREATE TABLE "utilizadores" (
    "id" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "palavra_passe_hash" TEXT NOT NULL,
    "funcao" "FuncaoUtilizador" NOT NULL DEFAULT 'ENCARREGADO',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilizadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_encarregados" (
    "id" TEXT NOT NULL,
    "utilizador_id" TEXT NOT NULL,
    "nif" TEXT,
    "municipio" TEXT,
    "bairro" TEXT,
    "endereco" TEXT,
    "profissao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfis_encarregados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" TEXT NOT NULL,
    "encarregado_id" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3),
    "sexo" "SexoAluno",
    "ano_escolar" TEXT NOT NULL,
    "sistema_ensino" TEXT NOT NULL DEFAULT 'Geral Angolano',
    "escola" TEXT,
    "dificuldades" TEXT,
    "objectivos" TEXT,
    "observacoes" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_professores" (
    "id" TEXT NOT NULL,
    "utilizador_id" TEXT NOT NULL,
    "foto_url" TEXT,
    "biografia" TEXT,
    "formacao_academica" TEXT,
    "anos_experiencia" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoProfessor" NOT NULL DEFAULT 'Pendente',
    "avaliacao_media" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "total_aulas_dadas" INTEGER NOT NULL DEFAULT 0,
    "observacoes_admin" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfis_professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professores_disciplinas" (
    "id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "disciplina_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professores_disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professores_disponibilidades" (
    "id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_fim" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professores_disponibilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professores_zonas_atendimento" (
    "id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "bairro" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professores_zonas_atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_administradores" (
    "id" TEXT NOT NULL,
    "utilizador_id" TEXT NOT NULL,
    "departamento" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfis_administradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_ciclos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "catalogo_ciclos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_anos_escolares" (
    "id" TEXT NOT NULL,
    "ciclo_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "catalogo_anos_escolares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_disciplinas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalogo_disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabelas_precos" (
    "id" TEXT NOT NULL,
    "ano_escolar_id" TEXT NOT NULL,
    "duracao_minutos" INTEGER NOT NULL,
    "preco_por_aula_kz" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "vigente_desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tabelas_precos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabelas_remuneracoes" (
    "id" TEXT NOT NULL,
    "ano_escolar_id" TEXT NOT NULL,
    "duracao_minutos" INTEGER NOT NULL,
    "remuneracao_por_aula_kz" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "vigente_desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tabelas_remuneracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos_acompanhamento" (
    "id" TEXT NOT NULL,
    "encarregado_id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "ano_escolar_id" TEXT NOT NULL,
    "disciplina_id" TEXT NOT NULL,
    "modalidade" "ModalidadeAula" NOT NULL DEFAULT 'Domicilio',
    "duracao_minutos" INTEGER NOT NULL DEFAULT 60,
    "frequencia_semanal" INTEGER NOT NULL DEFAULT 2,
    "dias_semana" TEXT NOT NULL,
    "horario_preferencial" TEXT NOT NULL,
    "objetivo" "ObjetivoPedagogico" NOT NULL DEFAULT 'AcompanhamentoContinuo',
    "observacoes" TEXT,
    "municipio" TEXT,
    "bairro" TEXT,
    "endereco" TEXT,
    "ponto_referencia" TEXT,
    "preco_unitario_kz" INTEGER NOT NULL DEFAULT 0,
    "estimativa_mensal_kz" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'EmAnalise',
    "professor_atribuido_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_acompanhamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_estados_pedidos" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "estado_anterior" "EstadoPedido" NOT NULL,
    "novo_estado" "EstadoPedido" NOT NULL,
    "alterado_por_id" TEXT,
    "motivo" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_estados_pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propostas_matching" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "pontuacao_matching" INTEGER NOT NULL DEFAULT 0,
    "remuneracao_por_aula_kz" INTEGER NOT NULL,
    "estado" "EstadoPropostaMatching" NOT NULL DEFAULT 'Pendente',
    "motivo_recusa" TEXT,
    "expira_em" TIMESTAMP(3),
    "respondido_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "propostas_matching_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilizadores_email_key" ON "utilizadores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_encarregados_utilizador_id_key" ON "perfis_encarregados"("utilizador_id");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_professores_utilizador_id_key" ON "perfis_professores"("utilizador_id");

-- CreateIndex
CREATE UNIQUE INDEX "professores_disciplinas_professor_id_disciplina_id_key" ON "professores_disciplinas"("professor_id", "disciplina_id");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_administradores_utilizador_id_key" ON "perfis_administradores"("utilizador_id");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_ciclos_nome_key" ON "catalogo_ciclos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_anos_escolares_nome_key" ON "catalogo_anos_escolares"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_disciplinas_nome_key" ON "catalogo_disciplinas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tabelas_precos_ano_escolar_id_duracao_minutos_key" ON "tabelas_precos"("ano_escolar_id", "duracao_minutos");

-- CreateIndex
CREATE UNIQUE INDEX "tabelas_remuneracoes_ano_escolar_id_duracao_minutos_key" ON "tabelas_remuneracoes"("ano_escolar_id", "duracao_minutos");

-- AddForeignKey
ALTER TABLE "perfis_encarregados" ADD CONSTRAINT "perfis_encarregados_utilizador_id_fkey" FOREIGN KEY ("utilizador_id") REFERENCES "utilizadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_encarregado_id_fkey" FOREIGN KEY ("encarregado_id") REFERENCES "perfis_encarregados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_professores" ADD CONSTRAINT "perfis_professores_utilizador_id_fkey" FOREIGN KEY ("utilizador_id") REFERENCES "utilizadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores_disciplinas" ADD CONSTRAINT "professores_disciplinas_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "perfis_professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores_disciplinas" ADD CONSTRAINT "professores_disciplinas_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "catalogo_disciplinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores_disponibilidades" ADD CONSTRAINT "professores_disponibilidades_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "perfis_professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores_zonas_atendimento" ADD CONSTRAINT "professores_zonas_atendimento_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "perfis_professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_administradores" ADD CONSTRAINT "perfis_administradores_utilizador_id_fkey" FOREIGN KEY ("utilizador_id") REFERENCES "utilizadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogo_anos_escolares" ADD CONSTRAINT "catalogo_anos_escolares_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "catalogo_ciclos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas_precos" ADD CONSTRAINT "tabelas_precos_ano_escolar_id_fkey" FOREIGN KEY ("ano_escolar_id") REFERENCES "catalogo_anos_escolares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas_remuneracoes" ADD CONSTRAINT "tabelas_remuneracoes_ano_escolar_id_fkey" FOREIGN KEY ("ano_escolar_id") REFERENCES "catalogo_anos_escolares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_acompanhamento" ADD CONSTRAINT "pedidos_acompanhamento_encarregado_id_fkey" FOREIGN KEY ("encarregado_id") REFERENCES "perfis_encarregados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_acompanhamento" ADD CONSTRAINT "pedidos_acompanhamento_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_acompanhamento" ADD CONSTRAINT "pedidos_acompanhamento_ano_escolar_id_fkey" FOREIGN KEY ("ano_escolar_id") REFERENCES "catalogo_anos_escolares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_acompanhamento" ADD CONSTRAINT "pedidos_acompanhamento_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "catalogo_disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_acompanhamento" ADD CONSTRAINT "pedidos_acompanhamento_professor_atribuido_id_fkey" FOREIGN KEY ("professor_atribuido_id") REFERENCES "perfis_professores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_estados_pedidos" ADD CONSTRAINT "historico_estados_pedidos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos_acompanhamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_estados_pedidos" ADD CONSTRAINT "historico_estados_pedidos_alterado_por_id_fkey" FOREIGN KEY ("alterado_por_id") REFERENCES "utilizadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propostas_matching" ADD CONSTRAINT "propostas_matching_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos_acompanhamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propostas_matching" ADD CONSTRAINT "propostas_matching_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "perfis_professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
