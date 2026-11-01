# 07 — SEGURANÇA, PRIVACIDADE E PWA

> **Documento Guia TM-Educa**  
> **Âmbito:** Proteção de dados de menores, segurança de infraestrutura e aplicação web progressiva (PWA)

---

## 1. Proteção de Dados e Privacidade de Menores de Idade

Uma vez que a plataforma opera com dados de crianças e jovens estudantes, a salvaguarda da privacidade é um pilar fundamental da TM-Educa:

### 1.1. Princípio da Minimização de Dados
* Apenas são recolhidos os dados indispensáveis ao acompanhamento pedagógico (primeiro e último nome, ano escolar, escola e dificuldades de aprendizagem).
* Documentos de identificação pessoal de menores (como bilhete de identidade ou assento de nascimento) **não são exigidos no sistema**.

### 1.2. Titularidade Tutelar Exclusiva
* Nenhum aluno menor cria contas ou assina documentos de forma autónoma.
* A conta legal, o consentimento para recolha de dados escolares e os contratos são assinados e controlados exclusivamente pelo Pai titular.

### 1.3. Controlo Rigoroso de Acesso aos Dados do Aluno
* **Pai:** Visualiza unicamente os seus próprios filhos.
* **Professor:** Acede aos dados pedagógicos e morada do aluno **apenas enquanto tiver um serviço ativo**. Concluído o acompanhamento ou cancelado o contrato, o acesso aos contactos e residência do aluno é revogado.
* **Administrador:** Acesso a dados restrito e protegido por auditoria de operações.

---

## 2. Normas de Segurança Técnica

### 2.1. Sessões Seguras e Autenticação
* Sessões geridas com cookies estritamente com atributos:
  * `HttpOnly` (impede leitura de tokens via JavaScript malicioso ou ataques XSS).
  * `Secure` (forçado via HTTPS em produção).
  * `SameSite=Lax` (proteção contra ataques CSRF).
* Palavras-passe encriptadas com algoritmo de derivação de chave forte (`bcryptjs` com fator de custo elevado).

### 2.2. Validação Isomórfica de Dados
* Todas as entradas de utilizador nas Server Actions e APIs passam obrigatoriamente por esquemas Zod centralizados em `validacoes/`.
* Parâmetros não mapeados são eliminados (*strip unknown keys*).

### 2.3. Prevenção de Injeção SQL
* Utilização exclusiva de consultas parametrizadas via Prisma ORM. Proibição de concatenações de strings em comandos SQL em bruto (*raw SQL*).

---

## 3. Arquitetura da Progressive Web App (PWA)

Para garantir excelente desempenho e facilidade de acesso no terreno sem os custos nem a fricção de lojas de aplicações nativas, a TM-Educa é concebida como PWA:

### 3.1. Funcionalidades da PWA:
* **Instalabilidade:** Adição direta ao ecrã principal de telemóveis (Android e iOS).
* **Ecrã Total (*Standalone*):** Eliminação das barras do navegador para uma sensação de aplicação nativa.
* **Desempenho com Cache:** Estratégia de cache inteligente configurada via Service Worker:
  * Recursos visuais estáticos (fontes, logótipos, estilos) com estratégia *StaleWhileRevalidate*.
  * Dados dinâmicos de aulas e alunos com estratégia *NetworkFirst* (com tolerância a falha pontual de rede).

### 3.2. Ficheiro de Manifesto (`app/manifest.ts`):
* Nome: `TM-Educa — Acompanhamento Escolar`
* Nome Curto: `TM-Educa`
* Cor de Destaque (`theme_color`): Azul Institucional TM-Educa
* Cor de Fundo (`background_color`): `#ffffff`
* Orientação: `portrait-primary`
* Ícones em alta resolução (192x192 e 512x512).
