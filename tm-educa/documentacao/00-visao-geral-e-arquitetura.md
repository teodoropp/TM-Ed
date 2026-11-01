# 00 — VISÃO GERAL E ARQUITECTURA

> **Documento Guia TM-Educa**  
> **Âmbito:** Estrutura técnica, princípios de desenho de software e organização de pastas

---

## 1. Princípios Fundamentais de Desenvolvimento

O projecto deve respeitar escrupulosamente os seguintes princípios de engenharia de software:

1. **Arquitectura Modular (Monólito Modular):**
   * O código é organizado por domínios em `modulos/` e `regras/`.
   * Baixo acoplamento entre módulos e alta coesão interna.
   * Não existem dependências circulares entre domínios.
2. **Separação Rigorosa de Responsabilidades:**
   * **Apresentação:** Componentes puros em `componentes/` e rotas em `app/`. Não contêm consultas SQL diretas nem lógica de negócio comercial.
   * **Serviços / Server Actions:** Recebem dados da interface, validam através de esquemas Zod e delegam a execução nas regras de domínio.
   * **Regras de Negócio Puras:** Ficheiros em `regras/` (ex.: cálculo de preços, remuneração, matching) são puramente funcionais, determinísticos e simples de testar isoladamente.
   * **Acesso a Dados:** Camada de persistência gerida exclusivamente via Prisma ORM com transações seguras.
3. **Páginas e Componentes Pequenos:**
   * Proibição expressa de ficheiros gigantes (*monolíticos*). Componentes complexos devem ser decompostos em subcomponentes com responsabilidade única.
4. **Tipagem Estrita de Ponta a Ponta:**
   * TypeScript rigoroso (`strict: true`). Não utilizar o tipo `any`.
   * Modelos do Prisma alimentam automaticamente as definições de tipos partilhadas.
5. **Nomenclatura em Português de Portugal (pt-PT):**
   * Ficheiros, pastas, funções, variáveis e componentes em português, exceto requisitos da própria framework (ex.: `page.tsx`, `layout.tsx`, `route.ts`).
   * Exemplos: `utilizador`, `encarregado`, `professor`, `acompanhamento`, `pagamento`, `remuneracao`, `obterPrecoEstimado()`.
6. **Comentários Relevantes:**
   * Apenas comentários que justifiquem regras de negócio ou decisões técnicas complexas. Comentários sempre em português de Portugal.

---

## 2. Stack Tecnológica Recomendada

| Componente | Tecnologia | Justificação |
| :--- | :--- | :--- |
| **Framework Fullstack** | Next.js (App Router) | Renderização híbrida no servidor (RSC) para velocidade máxima, SEO nas páginas públicas e Server Actions seguras. |
| **Linguagem** | TypeScript | Prevenção de falhas em cálculos financeiros e estados operacionais através de tipagem estática. |
| **Design System** | Tailwind CSS + shadcn/ui | Interface moderna, flexível, acessível e sem dependência de temas externos genéricos. |
| **Base de Dados** | PostgreSQL | Integridade transacional ACID, suporte a chaves estrangeiras, restrições e auditoria robusta. |
| **ORM** | Prisma | Esquema declarativo unificado, geração de migrações determinísticas e prevenção de injeções SQL. |
| **Validação** | Zod | Validação idêntica no cliente e no servidor, garantindo segurança estrita nas entradas. |
| **Autenticação** | NextAuth.js (Auth.js v5) | Sessões seguras em cookies HTTP-Only, suporte nativo a RBAC e encriptação de senhas com `bcrypt`. |
| **PWA** | Serwist (@serwist/next) | Suporte completo a Progressive Web App para funcionamento nativo em dispositivos móveis. |
| **Testes** | Vitest | Execução rápida de testes unitários e de integração de regras de negócio. |

---

## 3. Estrutura Canónica de Pastas

```text
tm-educa/
├── app/                                # Rotas e páginas da aplicação
│   ├── (publico)/                      # Páginas públicas institucionais (SEO)
│   ├── (autenticacao)/                 # Fluxos de entrada e registo
│   ├── portal-encarregado/             # Área privada do pai
│   ├── portal-professor/               # Área privada do explicador/professor
│   ├── administracao/                  # Painel de controlo administrativo
│   ├── api/                            # Rotas auxiliares de API e webhooks
│   └── manifest.ts                     # Definição PWA
├── componentes/                        # Interface visual reutilizável
│   ├── ui/                             # Botões, diálogos, tabelas base (shadcn/ui)
│   ├── navegacao/                      # Menus, barras de topo e barras laterais
│   ├── cartoes/                        # Cartões informativos de métricas e listas
│   ├── formularios/                    # Componentes de formulário normalizados
│   ├── calendarios/                    # Vistas de agenda e marcação
│   ├── tabelas/                        # Tabelas avançadas com filtros e paginação
│   └── modais/                         # Caixas modais especializadas
├── modulos/                            # Módulos verticais de negócio
│   ├── autenticacao/
│   ├── utilizadores/
│   ├── encarregados/
│   ├── alunos/
│   ├── professores/
│   ├── catalogo/
│   ├── precos/
│   ├── pedidos/
│   ├── correspondencias/
│   ├── contratos/
│   ├── acompanhamentos/
│   ├── aulas/
│   ├── presencas/
│   ├── substituicoes/
│   ├── pagamentos/
│   ├── remuneracoes/
│   ├── avaliacoes/
│   ├── ocorrencias/
│   └── notificacoes/
├── servicos/                           # Clientes de infraestrutura
│   ├── base-dados.ts                   # Instância global do Prisma Client
│   └── sessao.ts                       # Helpers de validação de sessão
├── regras/                             # Lógica pura de cálculo e regras comerciais
├── validacoes/                         # Esquemas Zod reutilizáveis
├── tipos/                              # Interfaces TypeScript do sistema
├── prisma/                             # Definição de esquema e sementes (seed)
├── documentacao/                       # Manuais e guias do projecto (este directório)
└── public/                             # Recursos estáticos e ícones PWA
```
