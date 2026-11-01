# TM-EDUCA — GUIA GERAL E DOCUMENTAÇÃO DO PROJECTO

> **Ecossistema de Educação e Acompanhamento Escolar**  
> **Centro Educativo Físico Associado:** TM-Educa  
> **Idioma Oficial da Plataforma e Código:** Português de Portugal (pt-PT)

---

## 1. O Que É a TM-Educa?

A **TM-Educa** é uma plataforma e ecossistema integral dedicado à gestão e acompanhamento pedagógico escolar de excelência.  
Gere com precisão todo o ciclo operacional e pedagógico:

$$\text{Pai} \longrightarrow \text{Pedido} \longrightarrow \text{Matching} \longrightarrow \text{Professor} \longrightarrow \text{Contrato} \longrightarrow \text{Aulas} \longrightarrow \text{Acompanhamento} \longrightarrow \text{Pagamento} \longrightarrow \text{Remuneração} \longrightarrow \text{Avaliação} \longrightarrow \text{Renovação}$$

### A Relação Entre as Marcas:
* **TM-Educa**: A marca mãe e o ecossistema digital de educação e acompanhamento escolar (plataforma digital, rede de professores, modelo domiciliar e online).
* **TM-Educa**: O centro educativo físico pertencente e integrado no ecossistema TM-Educa.

---

## 2. Mapa dos Documentos de Referência

Esta documentação foi elaborada para que, a qualquer momento — mesmo após longos períodos sem mexer no código —, qualquer programador ou membro da equipa se possa situar de forma imediata e sem ambiguidades.

| Ficheiro | Descrição e Conteúdo |
| :--- | :--- |
| [00-visao-geral-e-arquitetura.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/00-visao-geral-e-arquitetura.md) | Visão executiva, princípios de engenharia, stack tecnológica recomendada e convenções de nomenclatura em pt-PT. |
| [01-catalogo-precos-e-remuneracoes.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/01-catalogo-precos-e-remuneracoes.md) | Tabela comercial oficial em Kwanzas (Kz), fórmula da estimativa mensal ($\times 4$), tabela de remuneração interna e cálculo de margem bruta. |
| [02-utilizadores-perfis-e-alunos.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/02-utilizadores-perfis-e-alunos.md) | Papeis de utilizador (RBAC), perfil tutelar do aluno (sem conta própria no MVP), cadastro de professores e disponibilidade horária. |
| [03-ciclo-operacional-pedidos-e-matching.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/03-ciclo-operacional-pedidos-e-matching.md) | Ciclo de vida dos pedidos, histórico auditável de estados e algoritmo de matching com critérios eliminatórios e pontuação. |
| [04-contratos-acompanhamentos-e-aulas.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/04-contratos-acompanhamentos-e-aulas.md) | Contratos comerciais e explicadores, serviços ativos, ciclo de aulas, presenças, sumários, cancelamentos, reposições e substituições. |
| [05-financeiro-e-qualidade.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/05-financeiro-e-qualidade.md) | Cobrança a clientes, folhas de remuneração de professores, avaliação de qualidade por estrelas e gestão de ocorrências. |
| [06-portais-e-website-publico.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/06-portais-e-website-publico.md) | Estrutura de ecrãs do Website Público, Portal do Pai, Portal do Professor e Painel de Administração. |
| [07-seguranca-privacidade-e-pwa.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/07-seguranca-privacidade-e-pwa.md) | Políticas de proteção de dados de menores, sessões seguras HTTP-Only, validação rigorosa e suporte a PWA mobile-first. |
| [08-roteiro-de-fases-e-progresso.md](file:///C:/Users/User/3D%20Objects/Projecto_Soft/tm-educa/documentacao/08-roteiro-de-fases-e-progresso.md) | Roteiro completo de 13 fases (Fase 0 a Fase 12), critérios de aceitação e checklist de progresso atualizável. |

---

## 3. Regra de Ouro do Desenvolvimento

> [!IMPORTANT]
> **NUNCA IMPLEMENTAR IMEDIATAMENTE!**  
> Antes de criar qualquer funcionalidade ou alterar qualquer ficheiro:
> 1. Analisar o pedido e apresentar um **plano detalhado de implementação** (objetivo, ficheiros, entidades, regras, testes e riscos).
> 2. **Aguardar explicitamente a aprovação** do utilizador.
> 3. **Apenas após aprovação expressa**, executar a implementação. Nunca assumir aprovação implícita.

---

## 4. Localização do Projecto
* **Directoria Principal:** `C:\Users\User\3D Objects\Projecto_Soft\tm-educa\`
* **Directoria de Documentação:** `C:\Users\User\3D Objects\Projecto_Soft\tm-educa\documentacao\`
