# MISSÃO: AUDITORIA COMPLETA E FORTALECIMENTO DA SEGURANÇA DA APLICAÇÃO

Assume o papel de um Engenheiro Sénior de Cibersegurança, Especialista em AppSec, Backend Security e DevSecOps.

A tua missão é realizar uma auditoria profunda à aplicação atual, identificar vulnerabilidades e implementar todas as medidas de segurança necessárias para proteger o sistema contra acessos não autorizados, ataques, roubo de dados, manipulação de pagamentos e outras ameaças.

**IMPORTANTE:** Não quero apenas recomendações ou uma lista de boas práticas. Quero que analises o projeto, examines o código existente, implementes as correções necessárias e testes efetivamente as proteções.

## 1. REGRAS FUNDAMENTAIS

Antes de começar:

- Analisa toda a estrutura do projeto.
- Identifica as tecnologias, frameworks, linguagens, bibliotecas e serviços utilizados.
- Identifica o frontend, backend, APIs, banco de dados e serviços externos.
- Analisa os sistemas de autenticação e autorização existentes.
- Identifica as rotas públicas, privadas e administrativas.
- Analisa os ficheiros de configuração e variáveis de ambiente.
- Identifica possíveis vulnerabilidades na arquitetura atual.

Não alteres funcionalidades existentes sem necessidade.

Não removas componentes, páginas, funcionalidades ou dados importantes.

Não alteres o design, a identidade visual ou a experiência do utilizador.

Não substituas tecnologias sem uma justificação técnica fundamentada.

Faz backup ou cria um ponto de recuperação antes de alterações estruturais.

## 2. AUTENTICAÇÃO E AUTORIZAÇÃO

Implementa um sistema de autenticação robusto:

- Protege todas as áreas privadas.
- Implementa autenticação segura.
- Utiliza bcrypt ou Argon2id para armazenar palavras-passe com hash.
- Nunca armazene palavras-passe em texto simples.
- Implementa controlo de sessões.
- Implementa expiração e renovação segura de sessões.
- Protege contra ataques de força bruta.
- Implementa bloqueio temporário após várias tentativas falhadas.
- Implementa recuperação segura de palavras-passe.
- Faz com que os links de recuperação expirem e sejam utilizados apenas uma vez.
- Não reveles se um determinado email está ou não registado.

## 3. PROTEÇÃO DAS CHAVES E VARIÁVEIS DE AMBIENTE

- Identifica todas as chaves API presentes no código.
- Remove credenciais e segredos do frontend.
- Transfere as chaves privadas para variáveis de ambiente no servidor.
- Nunca exponhas tokens, passwords, secrets ou credenciais no código público.
- Verifica os ficheiros .env.
- Garante que .env está incluído no .gitignore.
- Cria ou atualiza um ficheiro .env.example sem credenciais reais.
- Verifica o histórico Git à procura de segredos anteriormente publicados.
- Se encontrares chaves comprometidas, identifica-as e recomenda a sua revogação e substituição.
- Nunca imprimas segredos completos nos relatórios ou logs.

## 4. PROTEÇÃO DO BANCO DE DADOS

- Verifica as permissões de acesso ao banco de dados.
- Garante que o banco de dados não está publicamente acessível.
- Utiliza consultas parametrizadas.
- Previne SQL Injection.
- Verifica as permissões de leitura, escrita, atualização e eliminação.
- Implementa o princípio do menor privilégio.
- Protege os dados sensíveis.
- Verifica as regras de acesso ao banco de dados.
- Garante que os utilizadores só conseguem consultar ou modificar os seus próprios dados.
- Protege operações administrativas.
- Verifica backups e mecanismos de recuperação.

Se estiver a ser utilizado Supabase, Firebase ou outro serviço semelhante, verifica também as políticas RLS, Security Rules e permissões administrativas.

## 5. PROTEÇÃO CONTRA ATAQUES WEB

Implementa proteção contra:

- Cross-Site Scripting (XSS).
- SQL Injection.
- Cross-Site Request Forgery (CSRF).
- Cross-Site Request Forgery em operações sensíveis.
- Clickjacking.
- Session Hijacking.
- Brute Force.
- Credential Stuffing.
- Parameter Tampering.
- Path Traversal.
- Open Redirects.
- Mass Assignment.
- Insecure Direct Object References (IDOR).
- Manipulação de pedidos HTTP.
- Exposição de informações internas.

Implementa também:

- Validação e sanitização dos dados recebidos.
- Validação obrigatória no servidor.
- Content Security Policy (CSP).
- HTTP Strict Transport Security (HSTS).
- X-Content-Type-Options.
- Referrer-Policy.
- Proteção adequada de cookies.
- Cookies Secure, HttpOnly e SameSite quando aplicável.
- CORS com origens explicitamente autorizadas.

## 6. PROTEÇÃO DAS ROTAS E ÁREA ADMINISTRATIVA

Analisa todas as rotas da aplicação.

- Impede o acesso não autorizado às páginas privadas.
- Implementa controlo de acesso baseado em funções (RBAC).
- Separa permissões de administrador, utilizador e outros perfis existentes.
- Valida as permissões no backend, não apenas no frontend.
- Protege APIs administrativas.
- Impede que um utilizador comum execute operações administrativas.
- Verifica a autorização em cada operação sensível.
- Impede alterações de privilégios através da manipulação de pedidos.

Não confies apenas em esconder botões ou páginas no frontend.

## 7. PROTEÇÃO DE FORMULÁRIOS E UPLOADS

- Valida todos os campos no servidor.
- Define limites de caracteres e formatos.
- Verifica os tipos reais dos ficheiros enviados.
- Restringe extensões e tamanhos de ficheiros.
- Impede uploads de ficheiros executáveis perigosos.
- Garante que os ficheiros enviados não podem executar código no servidor.
- Utiliza nomes de ficheiros seguros.
- Protege contra Path Traversal.
- Implementa proteção contra submissões automatizadas e abusivas quando necessário.

## 8. SEGURANÇA DE PAGAMENTOS E VALORES

Se a aplicação tiver pagamentos, reservas, compras, carteiras ou transações:

- Nunca confies nos valores enviados pelo frontend.
- Calcula os preços no backend.
- Valida todos os montantes no servidor.
- Verifica os pagamentos diretamente através do fornecedor de pagamentos.
- Nunca consideres um pagamento concluído apenas porque o frontend enviou essa informação.
- Valida assinaturas dos webhooks.
- Previne pagamentos duplicados.
- Implementa idempotência nas operações financeiras.
- Protege os históricos e registos de transações.
- Impede a manipulação de preços, descontos, taxas e estados de pagamento.

## 9. LIMITAÇÃO DE PEDIDOS E PROTEÇÃO CONTRA ABUSOS

Implementa:

- Rate Limiting nas APIs.
- Limites específicos para login e recuperação de palavras-passe.
- Proteção contra pedidos automatizados abusivos.
- Limites de tamanho dos pedidos.
- Timeouts adequados.
- Monitorização de padrões anormais de acesso.
- Proteção contra consumo excessivo de recursos.

## 10. SEGURANÇA DE PRODUÇÃO

Verifica se:

- HTTPS é obrigatório.
- O modo DEBUG está desativado.
- Mensagens de erro não revelam detalhes internos.
- Stack traces não são apresentados aos utilizadores.
- Diretórios e ficheiros internos não estão publicamente acessíveis.
- Ficheiros de configuração não estão expostos.
- Os endpoints de desenvolvimento estão desativados.
- Os logs não contêm passwords, tokens ou informações sensíveis.
- As dependências estão atualizadas.
- Pacotes desnecessários e vulneráveis são identificados.
- As configurações de produção são seguras.

## 11. MONITORIZAÇÃO E REGISTO DE ATIVIDADES

Implementa um sistema de registo e monitorização de segurança.

Regista eventos como:

- Tentativas de login falhadas.
- Acessos administrativos.
- Alterações de permissões.
- Recuperações de palavras-passe.
- Tentativas de acesso não autorizado.
- Atividades suspeitas.
- Alterações de dados sensíveis.
- Operações financeiras.
- Erros críticos do sistema.

Os logs devem incluir data, hora, tipo de evento e informação necessária para investigação, sem armazenar credenciais ou dados sensíveis desnecessários.

Implementa alertas para atividades suspeitas quando a infraestrutura permitir.

## 12. AUDITORIA DE DEPENDÊNCIAS E CÓDIGO

Executa uma análise de segurança às dependências.

- Identifica bibliotecas com vulnerabilidades conhecidas.
- Atualiza pacotes vulneráveis para versões compatíveis e seguras.
- Remove dependências não utilizadas, após confirmar que não são necessárias.
- Verifica