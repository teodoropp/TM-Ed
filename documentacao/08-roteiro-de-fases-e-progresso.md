# 08 — ROTEIRO DE FASES E GUIA DE RETOMA DO PROJECTO

> **Documento Guia TM-Educa**  
> **Âmbito:** Roteiro completo de 13 fases (Fase 0 à Fase 12), critérios de aceitação e instruções para retomar o projeto a qualquer momento

---

## 1. Tabela de Estado e Progresso Global

> [!TIP]
> **COMO USAR ESTA TABELA:**  
> Sempre que uma fase for formalmente aprovada e concluída, altere o estado para `Concluída` e marque os respetivos critérios de aceitação.  
> Se estiver sem mexer no projeto há muito tempo, **consulte esta tabela para saber de imediato onde nos encontramos e qual é o próximo passo.**

| Fase | Título | Estado Atual | Principais Entregas |
| :---: | :--- | :---: | :--- |
| **FASE 0** | **Arquitetura, Planeamento e Documentação** | **Concluída** | Especificação de 20 pontos, pasta de documentação completa e modelo conceptual validado. |
| **FASE 1** | **Fundação Técnica e Design System** | **Concluída** | Setup Next.js, TypeScript estrito, Tailwind CSS, shadcn/ui, Prisma Client e regras comerciais base. |
| **FASE 2** | **Autenticação, Utilizadores e RBAC** | **Concluída** | Sessões HTTP-Only seguras com jose, login/registo diferenciado, hashing bcrypt e middleware RBAC. |
| **FASE 3** | **Administração de Alunos, Encarregados e Professores** | **Concluída** | Gestão tutelar de múltiplos alunos, perfis docentes, disponibilidade semanal e administração. |
| **FASE 4** | **Catálogo Escolar e Tabela Oficial de Preços** | **Concluída** | Catálogo escolar, 36 preços e 36 remunerações sem hardcoding, motor de cálculo, simulador e gestão administrativa. |
| **FASE 5** | **Pedidos de Acompanhamento e Motor de Matching** | **Concluída** | Formulário do encarregado, máquina de estados com auditoria, ranking de matching e ciclo de propostas. |
| **FASE 6** | **Acompanhamentos, Contratos e Calendário** | **Concluída** | Formalização de contratos, ativação de serviços, motor de projeção de aulas e agenda em grelha. |
| **FASE 7** | **Aulas, Presenças, Reposições e Substituições** | **Concluída** | Marcação de presenças e sumários, cancelamentos auditados, reposições encadeadas e trocas. |
| **FASE 8** | **Pagamentos, Remunerações e Finanças** | **Concluída** | Cobranças de clientes, comprovativos, folhas de remuneração de explicadores e margem bruta. |
| **FASE 9** | **Avaliações e Gestão de Ocorrências** | **Concluída** | Sistema de avaliação por 5 estrelas e módulo de ocorrências/reclamações com mediação. |
| **FASE 10** | **Portais Completos (Encarregado e Professor)** | **Concluída** | Polimento das áreas privadas com navegação adaptada e suporte offline no telemóvel. |
| **FASE 11** | **Website Institucional Público** | **Concluída** | Páginas públicas da TM-Educa e do centro Temilara (Hero, preçário, depoimentos, SEO). |
| **FASE 12** | **Testes Finais, Otimização e Produção** | **Concluída** | Testes Vitest (preços, remuneração, matching, RBAC), auditoria de segurança e deploy. |

---

## 2. Detalhe e Critérios de Aceitação de Cada Fase

### Fase 0 — Arquitectura, Planeamento e Documentação
* [x] Elaboração do plano de 20 pontos arquiteturais.
* [x] Criação da pasta `documentacao/` com os 9 manuais de orientação.
* [x] Validação final do cliente e aprovação expressa para avançar.

### Fase 1 — Fundação Técnica e Design System
* [x] Projeto Next.js configurado na raiz com TypeScript estrito.
* [x] Tailwind CSS configurado com paleta de cores corporativa TM-Educa.
* [x] Componentes base do design system (`Botao`, `Cartao`, `Badge`, `Input`) instalados e testados.
* [x] Prisma ORM configurado com cliente Postgres e geração tipada verificada.
* [x] Estrutura base de pastas e utilitários em português de Portugal criada.
* [x] Compilação limpa do TypeScript e verificação de build sem erros.

### Fase 2 — Autenticação e Sessões
* [x] Sessões criptografadas em cookies HTTP-Only seguros com algoritmo HS256 (`jose`).
* [x] Validação de login e registo com hashing irreversível de senhas em `bcryptjs`.
* [x] Middleware / Proxy de proteção de rotas privadas (`/administracao`, `/portal-encarregado`, `/portal-professor`).
* [x] Registo transacional com criação automática do perfil correspondente (Encarregado vs Professor).
* [x] Redirecionamento dinâmico e inteligente após login baseado na função do utilizador.
* [x] Cabeçalho atualizado dinamicamente refletindo utilizador autenticado.

### Fase 3 — Utilizadores, Alunos e Professores
* [x] Gestão de Encarregados de Educação (contactos, NIF, morada e educandos associados).
* [x] Gestão tutelar de múltiplos Alunos sob a mesma conta familiar (cadastro, edição, remoção suave e dados pedagógicos).
* [x] Perfil de Professor com qualificações académicas, biografia, zonas de atendimento e grelha semanal de disponibilidade.
* [x] Painel de gestão da administração para supervisão de utilizadores e triagem/aprovação de estados docentes.

### Fase 4 — Catálogo e Tabela de Preços
* [x] Tabelas do catálogo (Ciclos, Anos Escolares, Disciplinas) em Prisma Schema.
* [x] Semente (*seed*) da base de dados com o preçário oficial da TM-Educa (Primário, I Ciclo, II Ciclo - 36 preços e 36 remunerações).
* [x] Motor de cálculo em `regras/calculo-preco.ts` e `regras/calculo-remuneracao.ts` com estimativa baseada em 4 semanas e aviso contratual oficial.
* [x] Simulador visual interativo de mensalidades (`SimuladorPrecos`) e tabela visual por ciclo.
* [x] Painel de gestão administrativa do catálogo, preçário em linha, remunerações com margens brutas e disciplinas (`/administracao/catalogo/*`).
* [x] Página de transparência de preços e simulação no portal do encarregado (`/portal-encarregado/precos`).

### Fase 5 — Pedidos e Matching
* [x] Formulário dinâmico de solicitação de acompanhamento no portal do encarregado (`/portal-encarregado/pedidos/novo`).
* [x] Máquina de estados do pedido com tabela de auditoria `HistoricoEstadoPedido` e regras de transição.
* [x] Algoritmo de compatibilidade e ranking de matching assistido para o administrador (`/administracao/pedidos/[id]`).
* [x] Notificação de proposta para o professor com fluxo de aceitar/recusar com motivo obrigatório (`/portal-professor/pedidos`).
* [x] Visão detalhada da linha do tempo do pedido no portal do encarregado (`/portal-encarregado/pedidos/[id]`).

### Fase 6 — Contratos e Calendário
* [x] Geração de Contratos de Cliente com numeração oficial (`TM-CTR-AAAA-XXXX`) e termos aceites.
* [x] Criação de instâncias ativas de `AcompanhamentoServico` com preços e remunerações congeladas.
* [x] Geração automática da agenda de aulas com recorrência semanal (`regras/gerador-calendario.ts`).
* [x] Portal do Encarregado com acompanhamentos ativos e calendário das sessões (`/portal-encarregado/acompanhamentos`).
* [x] Portal do Professor com cronograma e agenda semanal de aulas lecionadas (`/portal-professor/agenda`).
* [x] Painel da Administração para supervisão de contratos (`/administracao/contratos`) e serviços ativos (`/administracao/acompanhamentos`).

### Fase 7 — Aulas, Presenças, Reposições e Substituições
* [x] Marcação de presenças e sumários de matéria no portal do professor (`/portal-professor/aulas/[id]`).
* [x] Política de cancelamento comercial e pedagógica (regra das 24 horas para faltas do explicador vs família em `regras/politica-cancelamento-reposicao.ts`).
* [x] Sistema encadeado de aulas de reposição (`ReposicaoAula`) ligadas à sessão original cancelada.
* [x] Fluxo de substituição de professor titular sem alteração contratual para o cliente (`ModalSubstituirProfessor`).
* [x] Ficha pedagógica transparente para consulta familiar (`/portal-encarregado/aulas/[id]`).
* [x] Painel administrativo de supervisão operacional de todas as aulas (`/administracao/aulas`).

### Fase 8 — Pagamentos e Remunerações
* [x] Gestão de cobranças a clientes, emissão de avisos de pagamento e receção de comprovativos bancários (`/portal-encarregado/pagamentos`).
* [x] Geração de folhas de remuneração de professores baseadas estritamente em aulas elegíveis (`/portal-professor/remuneracoes`).
* [x] Painel de margem bruta em Kwanzas e percentual em tempo real (`/administracao/financeiro`).
* [x] Modelos `CobrancaCliente` e `FolhaRemuneracao` no Prisma ORM com enums `EstadoCobranca`, `MetodoPagamento` e `EstadoFolhaRemuneracao`.
* [x] Conciliação bancária assistida com aprovação e rejeição auditada de comprovativos.

### Fase 9 — Avaliações e Ocorrências
* [x] Modelos `AvaliacaoProfessor` e `Ocorrencia` no Prisma ORM com auditoria completa.
* [x] Formulário de avaliação docente em 5 critérios com média por estrelas e comentários.
* [x] Módulo completo de registo, atribuição de responsável e resolução de ocorrências/reclamações com parecer formal.
* [x] Painéis no Portal do Encarregado (`/portal-encarregado/avaliacoes`, `/portal-encarregado/ocorrencias`), Portal do Professor (`/portal-professor/avaliacoes`, `/portal-professor/ocorrencias`) e Administração Central (`/administracao/avaliacoes`, `/administracao/ocorrencias`).

### Fase 10 — Portais Dedicados
* [x] Polimento visual e responsivo do Portal do Encarregado de Educação com resumo executivo de aulas, faturas e avaliações.
* [x] Otimização mobile-first do Portal do Professor para marcação rápida de presenças e sumários em campo no telemóvel (`WidgetAulasHojeMobile`).
* [x] Layouts dedicados de portal com sub-navegação coesa (`BarraNavegacaoPortal`) nos três portais (Encarregado, Professor, Administração).
* [x] Suporte a PWA mobile com Web App Manifest oficial (`manifest.json`) e meta tags para dispositivos móveis.

### Fase 11 — Website Institucional Público
* [x] Páginas públicas completas (`/`, `/sobre`, `/como-funciona`, `/servicos`, `/professores`, `/preparacao-exames`, `/contactos`, `/perguntas-frequentes`, `/temilara`).
* [x] Destaque do centro educativo físico **Temilara** (Camama, Luanda) e da sua ligação ao ecossistema TM-Educa.
* [x] Formulários públicos de contacto, solicitação de acompanhamento e candidatura de explicadores.
* [x] Simulador Oficial de Preços integrado na página inicial com cálculo em Kwanzas.

### Fase 12 — Testes, Segurança e Produção
* [x] Cobertura de testes unitários com Vitest em cálculos de preços, remunerações e regras de cancelamento (20 testes automatizados com 100% de sucesso).
* [x] Testes de isolamento RBAC garantindo que nenhum perfil acede a dados de outros utilizadores.
* [x] Configuração do PWA com manifesto (`manifest.json`) e Service Worker operacional (`sw.js`).
* [x] Auditoria de segurança e preparação final para implantação em produção (TypeScript estrito e compilação limpa do Next.js).

---

## 3. Como Retomar o Projecto Após um Período de Pausa

Se regressar ao projeto após algum tempo, siga este protocolo de 3 minutos:
1. Abra este ficheiro ([08-roteiro-de-fases-e-progresso.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/08-roteiro-de-fases-e-progresso.md)).
2. Identifique qual é a fase marcada como `Em Execução`.
3. Verifique os critérios pendentes dessa fase.
4. Antes de programar qualquer novo ficheiro, apresente o plano da fase ao utilizador e aguarde a aprovação formal conforme a **Regra de Ouro**.
