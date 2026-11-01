-- CreateEnum
CREATE TYPE "TipoContrato" AS ENUM ('Cliente', 'Professor');

-- CreateEnum
CREATE TYPE "EstadoContrato" AS ENUM ('Rascunho', 'Activo', 'Suspenso', 'Rescindido', 'Concluido');

-- CreateEnum
CREATE TYPE "EstadoAcompanhamento" AS ENUM ('PendenteAtivacao', 'Activo', 'Suspenso', 'Concluido', 'Cancelado');

-- CreateEnum
CREATE TYPE "EstadoAula" AS ENUM ('Agendada', 'Realizada', 'Aluno_Ausente', 'Professor_Ausente', 'Cancelada', 'Reagendada', 'Substituida');

-- CreateEnum
CREATE TYPE "EstadoCobranca" AS ENUM ('Pendente', 'EmAnalise', 'Pago', 'Falhado', 'Cancelado', 'Reembolsado');

-- CreateEnum
CREATE TYPE "MetodoPagamento" AS ENUM ('TransferenciaBancaria', 'MulticaixaExpress', 'Deposito', 'NumerarioCentro');

-- CreateEnum
CREATE TYPE "EstadoFolhaRemuneracao" AS ENUM ('Rascunho', 'EmRevisao', 'Aprovada', 'Paga', 'Cancelada');

-- CreateEnum
CREATE TYPE "TipoOcorrencia" AS ENUM ('Falta', 'Reclamacao', 'Comportamento', 'Pagamento', 'Incidente', 'Administrativo');

-- CreateEnum
CREATE TYPE "GravidadeOcorrencia" AS ENUM ('Baixa', 'Media', 'Alta', 'Urgente');

-- CreateEnum
CREATE TYPE "EstadoOcorrencia" AS ENUM ('Aberta', 'EmInvestigacao', 'AguardandoParecer', 'Resolvida', 'Cancelada');

-- CreateTable
CREATE TABLE "contratos" (
    "id" TEXT NOT NULL,
    "numero_contrato" TEXT NOT NULL,
    "tipo" "TipoContrato" NOT NULL,
    "utilizador_id" TEXT NOT NULL,
    "pedido_id" TEXT,
    "valor_mensal_kz" INTEGER NOT NULL DEFAULT 0,
    "valor_por_aula_kz" INTEGER NOT NULL DEFAULT 0,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "termos_aceites" BOOLEAN NOT NULL DEFAULT true,
    "estado" "EstadoContrato" NOT NULL DEFAULT 'Activo',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acompanhamentos_servicos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "contrato_id" TEXT,
    "pedido_id" TEXT,
    "aluno_id" TEXT NOT NULL,
    "encarregado_id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "disciplina_id" TEXT NOT NULL,
    "modalidade" "ModalidadeAula" NOT NULL DEFAULT 'Domicilio',
    "duracao_minutos" INTEGER NOT NULL DEFAULT 60,
    "frequencia_semanal" INTEGER NOT NULL DEFAULT 2,
    "dias_semana" TEXT NOT NULL,
    "horario_preferencial" TEXT NOT NULL,
    "preco_por_aula_kz" INTEGER NOT NULL,
    "remuneracao_por_aula_kz" INTEGER NOT NULL,
    "estimativa_mensal_kz" INTEGER NOT NULL,
    "estado" "EstadoAcompanhamento" NOT NULL DEFAULT 'Activo',
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3),
    "municipio" TEXT,
    "bairro" TEXT,
    "endereco" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acompanhamentos_servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aulas" (
    "id" TEXT NOT NULL,
    "acompanhamento_id" TEXT NOT NULL,
    "numero_sessao" INTEGER NOT NULL DEFAULT 1,
    "data_hora_inicio" TIMESTAMP(3) NOT NULL,
    "data_hora_fim" TIMESTAMP(3) NOT NULL,
    "duracao_minutos" INTEGER NOT NULL,
    "modalidade" "ModalidadeAula" NOT NULL,
    "estado" "EstadoAula" NOT NULL DEFAULT 'Agendada',
    "sumario" TEXT,
    "trabalhos_de_casa" TEXT,
    "observacoes_pedagogicas" TEXT,
    "preco_cobrado_kz" INTEGER NOT NULL,
    "remuneracao_paga_kz" INTEGER NOT NULL,
    "registado_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reposicoes_aulas" (
    "id" TEXT NOT NULL,
    "aula_original_id" TEXT NOT NULL,
    "aula_reposicao_id" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "responsavel_cancelamento" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reposicoes_aulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cobrancas_clientes" (
    "id" TEXT NOT NULL,
    "numero_fatura" TEXT NOT NULL,
    "contrato_id" TEXT NOT NULL,
    "encarregado_id" TEXT NOT NULL,
    "mes_referencia" TEXT NOT NULL,
    "valor_kz" INTEGER NOT NULL,
    "metodo" "MetodoPagamento" NOT NULL DEFAULT 'TransferenciaBancaria',
    "estado" "EstadoCobranca" NOT NULL DEFAULT 'Pendente',
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "comprovativo_url" TEXT,
    "referencia_bancaria" TEXT,
    "banco_origem" TEXT,
    "observacoes" TEXT,
    "validado_por_id" TEXT,
    "validado_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cobrancas_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folhas_remuneracoes" (
    "id" TEXT NOT NULL,
    "codigo_folha" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "mes_referencia" TEXT NOT NULL,
    "total_aulas_elegiveis" INTEGER NOT NULL DEFAULT 0,
    "valor_bruto_kz" INTEGER NOT NULL DEFAULT 0,
    "descontos_kz" INTEGER NOT NULL DEFAULT 0,
    "valor_liquido_kz" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoFolhaRemuneracao" NOT NULL DEFAULT 'Rascunho',
    "iban_destino" TEXT,
    "comprovativo_pagamento_url" TEXT,
    "data_liquidacao" TIMESTAMP(3),
    "observacoes" TEXT,
    "processado_por_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folhas_remuneracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes_professores" (
    "id" TEXT NOT NULL,
    "acompanhamento_id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "encarregado_id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "qualidade_pedagogica" INTEGER NOT NULL DEFAULT 5,
    "pontualidade" INTEGER NOT NULL DEFAULT 5,
    "comunicacao" INTEGER NOT NULL DEFAULT 5,
    "adaptacao_aluno" INTEGER NOT NULL DEFAULT 5,
    "profissionalismo" INTEGER NOT NULL DEFAULT 5,
    "nota_media" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "comentario" TEXT,
    "visivel_publicamente" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocorrencias" (
    "id" TEXT NOT NULL,
    "numero_ocorrencia" TEXT NOT NULL,
    "tipo" "TipoOcorrencia" NOT NULL,
    "gravidade" "GravidadeOcorrencia" NOT NULL DEFAULT 'Media',
    "estado" "EstadoOcorrencia" NOT NULL DEFAULT 'Aberta',
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "autor_id" TEXT NOT NULL,
    "responsavel_id" TEXT,
    "acompanhamento_id" TEXT,
    "aula_id" TEXT,
    "resolucao" TEXT,
    "resolvido_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ocorrencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contratos_numero_contrato_key" ON "contratos"("numero_contrato");

-- CreateIndex
CREATE UNIQUE INDEX "acompanhamentos_servicos_codigo_key" ON "acompanhamentos_servicos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "acompanhamentos_servicos_pedido_id_key" ON "acompanhamentos_servicos"("pedido_id");

-- CreateIndex
CREATE UNIQUE INDEX "reposicoes_aulas_aula_original_id_key" ON "reposicoes_aulas"("aula_original_id");

-- CreateIndex
CREATE UNIQUE INDEX "reposicoes_aulas_aula_reposicao_id_key" ON "reposicoes_aulas"("aula_reposicao_id");

-- CreateIndex
CREATE UNIQUE INDEX "cobrancas_clientes_numero_fatura_key" ON "cobrancas_clientes"("numero_fatura");

-- CreateIndex
CREATE UNIQUE INDEX "folhas_remuneracoes_codigo_folha_key" ON "folhas_remuneracoes"("codigo_folha");

-- CreateIndex
CREATE UNIQUE INDEX "ocorrencias_numero_ocorrencia_key" ON "ocorrencias"("numero_ocorrencia");

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_utilizador_id_fkey" FOREIGN KEY ("utilizador_id") REFERENCES "utilizadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acompanhamentos_servicos" ADD CONSTRAINT "acompanhamentos_servicos_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acompanhamentos_servicos" ADD CONSTRAINT "acompanhamentos_servicos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos_acompanhamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acompanhamentos_servicos" ADD CONSTRAINT "acompanhamentos_servicos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acompanhamentos_servicos" ADD CONSTRAINT "acompanhamentos_servicos_encarregado_id_fkey" FOREIGN KEY ("encarregado_id") REFERENCES "perfis_encarregados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acompanhamentos_servicos" ADD CONSTRAINT "acompanhamentos_servicos_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "perfis_professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acompanhamentos_servicos" ADD CONSTRAINT "acompanhamentos_servicos_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "catalogo_disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_acompanhamento_id_fkey" FOREIGN KEY ("acompanhamento_id") REFERENCES "acompanhamentos_servicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reposicoes_aulas" ADD CONSTRAINT "reposicoes_aulas_aula_original_id_fkey" FOREIGN KEY ("aula_original_id") REFERENCES "aulas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reposicoes_aulas" ADD CONSTRAINT "reposicoes_aulas_aula_reposicao_id_fkey" FOREIGN KEY ("aula_reposicao_id") REFERENCES "aulas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobrancas_clientes" ADD CONSTRAINT "cobrancas_clientes_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobrancas_clientes" ADD CONSTRAINT "cobrancas_clientes_encarregado_id_fkey" FOREIGN KEY ("encarregado_id") REFERENCES "perfis_encarregados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folhas_remuneracoes" ADD CONSTRAINT "folhas_remuneracoes_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "perfis_professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_professores" ADD CONSTRAINT "avaliacoes_professores_acompanhamento_id_fkey" FOREIGN KEY ("acompanhamento_id") REFERENCES "acompanhamentos_servicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_professores" ADD CONSTRAINT "avaliacoes_professores_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "perfis_professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_professores" ADD CONSTRAINT "avaliacoes_professores_encarregado_id_fkey" FOREIGN KEY ("encarregado_id") REFERENCES "perfis_encarregados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_professores" ADD CONSTRAINT "avaliacoes_professores_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "utilizadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "utilizadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_acompanhamento_id_fkey" FOREIGN KEY ("acompanhamento_id") REFERENCES "acompanhamentos_servicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "aulas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
