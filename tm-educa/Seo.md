Quero que trabalhes na configuração completa de SEO deste projeto Next.js para melhorar a forma como o site é apresentado e indexado pelos motores de pesquisa, principalmente pelo Google.

IMPORTANTE: O projeto já está desenvolvido. NÃO quero que recries, reorganizes ou substituas a estrutura existente sem necessidade. Primeiro analisa cuidadosamente o projeto atual e adapta as configurações de SEO à arquitetura que já existe.

## REGRA PRINCIPAL — NÃO ALTERAR ANTES DA MINHA APROVAÇÃO

Antes de fazer QUALQUER alteração no código:

1. Analisa toda a estrutura relevante do projeto.
2. Identifica a versão do Next.js utilizada.
3. Identifica se o projeto utiliza App Router ou Pages Router.
4. Analisa a estrutura das páginas existentes.
5. Analisa o `layout` principal.
6. Verifica se já existem configurações de metadata.
7. Verifica se já existem `robots.txt`, `sitemap.xml`, Open Graph, Schema.org ou outras configurações de SEO.
8. Verifica se existem componentes ou configurações que possam entrar em conflito com a implementação.
9. Identifica quais páginas devem ser indexadas e quais eventualmente não devem.
10. Analisa o conteúdo existente das páginas para perceber quais devem ser os títulos, descrições e informações relevantes para SEO.

DEPOIS DESSA ANÁLISE, NÃO IMPLEMENTES NADA.

Apresenta-me primeiro um PLANO DETALHADO da implementação.

O plano deve mostrar:

- O que será alterado.
- Quais ficheiros serão criados.
- Quais ficheiros existentes serão alterados.
- O motivo de cada alteração.
- Como será implementado.
- Quais páginas terão metadata própria.
- Como será configurado o sitemap.
- Como será configurado o robots.txt.
- Como será configurado o canonical.
- Como será configurado o Open Graph.
- Como será configurado o Schema.org/JSON-LD.
- Como será feita a configuração para o Google.
- Possíveis problemas ou conflitos encontrados no projeto.
- O que NÃO será alterado.

Aguarda a minha aprovação.

SOMENTE depois de eu aprovar o plano podes começar a implementação.

---

# OBJETIVO

Quero deixar o projeto tecnicamente preparado para SEO, de forma que, depois de publicado e submetido ao Google Search Console, o Google consiga rastrear, compreender e indexar corretamente o site.

Não quero SEO artificial ou práticas de black-hat SEO.

A implementação deve seguir as boas práticas atuais do Next.js e dos motores de pesquisa.

---

# 1. METADATA GLOBAL

Configura corretamente a metadata global do site utilizando a abordagem recomendada para a versão do Next.js utilizada pelo projeto.

Deve contemplar, quando aplicável:

- title
- description
- metadataBase
- canonical
- robots
- keywords apenas se fizer sentido
- authors
- creator
- publisher
- applicationName
- Open Graph
- Twitter/X metadata
- icons
- locale
- informações relevantes da empresa

NÃO inventes informações sobre a empresa.

Utiliza as informações que já existem no projeto.

Se alguma informação necessária não existir, identifica isso no plano e pede-me os dados necessários em vez de inventá-los.

---

# 2. TÍTULOS DAS PÁGINAS

Analisa todas as páginas públicas existentes.

Cada página importante deve possuir um título adequado e específico.

Evita utilizar o mesmo title em todas as páginas.

Por exemplo, se existirem páginas:

- Página inicial
- Sobre nós
- Serviços
- Contactos

cada uma deve possuir metadata adequada ao seu conteúdo.

Não alteres o conteúdo textual das páginas apenas para inserir palavras-chave sem necessidade.

---

# 3. META DESCRIPTIONS

Cria descriptions relevantes para cada página indexável.

As descriptions devem:

- descrever realmente o conteúdo da página;
- ser naturais;
- evitar keyword stuffing;
- ser diferentes entre páginas;
- utilizar informações reais existentes no projeto.

---

# 4. CANONICAL URLs

Configura corretamente URLs canónicas para evitar problemas de conteúdo duplicado.

Utiliza o domínio oficial do projeto.

NÃO inventes o domínio.

Se o domínio de produção não estiver definido no projeto, identifica isso no plano e solicita-me o domínio antes de implementar essa parte.

---

# 5. SITEMAP

Cria ou configura o sitemap utilizando a solução adequada para a arquitetura atual do projeto.

O sitemap deve incluir somente URLs públicas e relevantes para indexação.

Não incluir:

- páginas administrativas;
- dashboards privados;
- páginas de autenticação;
- páginas internas;
- páginas que não devem ser indexadas;
- URLs duplicadas.

Se existirem páginas dinâmicas, analisa como devem ser tratadas.

---

# 6. ROBOTS.TXT

Cria ou configura corretamente o robots.txt.

Permite o rastreamento das páginas públicas.

Bloqueia áreas privadas ou administrativas quando necessário.

Inclui a referência para o sitemap.

Não bloqueies recursos necessários para o Google compreender corretamente as páginas.

---

# 7. OPEN GRAPH

Configura Open Graph para que quando uma página for partilhada em redes sociais ou aplicações compatíveis, sejam apresentados:

- título;
- descrição;
- URL;
- imagem;
- nome do site;
- tipo de conteúdo.

Verifica se o projeto já possui uma imagem adequada para Open Graph.

Se não existir, não inventes uma imagem. Identifica isso no plano.

---

# 8. TWITTER/X

Configura metadata adequada para Twitter/X quando fizer sentido.

Utiliza a imagem e informações existentes no projeto.

---

# 9. JSON-LD / SCHEMA.ORG

Analisa o tipo de empresa e o conteúdo real do site e implementa dados estruturados adequados.

Por exemplo, dependendo do projeto, poderá fazer sentido utilizar:

- Organization
- LocalBusiness
- WebSite
- WebPage
- Service
- BreadcrumbList

NÃO adiciones schemas apenas por adicionar.

Utiliza somente tipos de dados estruturados que sejam realmente suportados pelo conteúdo existente.

NÃO inventes avaliações, preços, contactos, endereços, horários ou outras informações.

---

# 10. PÁGINAS PRIVADAS

Analisa as áreas privadas do projeto.

Páginas como:

- login;
- dashboard;
- painel administrativo;
- área de colaborador;
- páginas internas;
- páginas que exigem autenticação;

não devem ser indexadas pelo Google.

Implementa a proteção de SEO adequada sem prejudicar o funcionamento normal dessas áreas.

---

# 11. ESTRUTURA HTML E SEO ON-PAGE

Analisa as páginas existentes e verifica:

- H1;
- H2;
- H3;
- headings duplicados;
- hierarquia de headings;
- imagens;
- atributos alt;
- links internos;
- links semânticos;
- textos importantes;
- estrutura HTML;
- URLs.

Corrige problemas evidentes relacionados com SEO, mas NÃO reformules o conteúdo do site sem necessidade.

Se uma alteração de conteúdo for necessária para melhorar SEO, apresenta-a primeiro no plano.

---

# 12. IMAGENS

Analisa as imagens utilizadas nas páginas.

Verifica:

- alt text;
- nomes;
- dimensões;
- carregamento;
- utilização de next/image;
- possíveis problemas de performance;
- imagens utilizadas no Open Graph.

Não substituas imagens existentes sem necessidade.

---

# 13. PERFORMANCE

Analisa possíveis problemas técnicos que possam prejudicar SEO, especialmente:

- imagens demasiado pesadas;
- fontes;
- scripts;
- JavaScript desnecessário;
- renderização;
- Core Web Vitals;
- carregamento inicial.

Não quero uma refatoração geral do projeto.

Corrige somente problemas diretamente relacionados com SEO/performance e que sejam seguros dentro da arquitetura existente.

---

# 14. URLS

Analisa a estrutura das URLs existentes.

As URLs devem ser:

- claras;
- consistentes;
- legíveis;
- estáveis.

NÃO alteres URLs existentes sem necessidade, porque isso pode criar problemas com links já publicados.

Se alguma URL precisar realmente ser alterada, apresenta primeiro a alteração no plano e indica se será necessário criar redirects.

---

# 15. REDIRECTS

Se forem identificadas URLs antigas que precisem ser substituídas, analisa a necessidade de redirects permanentes.

Não cries redirects desnecessários.

---

# 16. GOOGLE SEARCH CONSOLE

Prepara o projeto para utilização com Google Search Console.

Não precisas configurar uma conta do Google nem executar ações externas que dependam das minhas credenciais.

Apenas deixa o projeto preparado tecnicamente.

No final, informa-me quais passos precisarão ser feitos manualmente no Google Search Console depois do site estar publicado.

Por exemplo:

- adicionar propriedade;
- verificar domínio;
- enviar sitemap;
- solicitar indexação;
- verificar cobertura/indexação.

---

# 17. DOMÍNIO

Não assumes qual é o domínio de produção.

Procura primeiro se ele já está definido em:

- variáveis de ambiente;
- configuração do projeto;
- documentação;
- metadata existente;
- configuração de deploy.

Se não estiver definido, indica-me que precisas do domínio oficial.

Não utilizes `example.com`, `localhost` ou outro domínio fictício na configuração final.

---

# 18. COMPATIBILIDADE

A implementação deve respeitar:

- versão atual do Next.js;
- TypeScript;
- estrutura existente;
- componentes existentes;
- arquitetura atual;
- convenções do projeto.

Não introduzas bibliotecas externas para resolver algo que o próprio Next.js já suporta, salvo se houver uma razão técnica clara.

---

# 19. ORGANIZAÇÃO DO CÓDIGO

Mantém o projeto modular.

Não coloques toda a configuração em arquivos gigantes.

Componentes, utilitários e configurações devem permanecer separados quando fizer sentido.

Não mistures lógica de SEO desnecessariamente dentro das páginas.

Nomes de arquivos, pastas, funções e variáveis devem ser em português sempre que tecnicamente possível.

Exceções são nomes exigidos pelo Next.js, frameworks, bibliotecas ou convenções técnicas.

Todos os comentários adicionados ao código devem estar em português.

---

# 20. NÃO FAZER

Não quero que:

- recries o projeto;
- alteres o design sem necessidade;
- alteres o backend;
- alteres APIs;
- alteres banco de dados;
- alteres autenticação;
- removas funcionalidades existentes;
- substituas componentes sem necessidade;
- instales dependências desnecessárias;
- inventes informações da empresa;
- inventes domínio;
- inventes contactos;
- inventes localização;
- inventes avaliações;
- cries conteúdo falso apenas para SEO;
- utilizes keyword stuffing;
- cries páginas artificiais apenas para tentar posicionar no Google.

---

# 21. VALIDAÇÃO FINAL

Depois da implementação, verifica:

- `metadata`;
- titles;
- descriptions;
- canonical;
- robots;
- sitemap;
- Open Graph;
- JSON-LD;
- indexação de páginas públicas;
- bloqueio de páginas privadas;
- links internos;
- headings;
- imagens;
- erros de TypeScript;
- erros de build;
- possíveis problemas de SSR/SSG;
- URLs.

Executa os comandos de validação apropriados ao projeto.

Se algum erro aparecer, corrige-o antes de concluir.

---

# 22. RELATÓRIO FINAL

Depois de implementar, apresenta um relatório contendo:

### Alterações realizadas
Lista todos os ficheiros criados e modificados.

### SEO implementado
Explica o que foi configurado.

### Páginas indexáveis
Lista as páginas que poderão ser indexadas.

### Páginas não indexáveis
Lista as páginas que foram protegidas contra indexação e explica o motivo.

### Sitemap
Indica onde está disponível.

### Robots
Indica onde está disponível.

### Schema
Indica quais schemas foram implementados.

### Pendências
Indica qualquer informação que ainda preciso fornecer.

### Google Search Console
Explica exatamente o que eu preciso fazer manualmente depois de publicar o site.

### Validação
Indica quais testes foram executados e se passaram.

IMPORTANTE:

Não consideres o trabalho concluído apenas porque o código compila.

O objetivo é deixar o projeto tecnicamente preparado para ser rastreado e indexado corretamente pelo Google, respeitando completamente a estrutura e as funcionalidades já existentes.

COMEÇA APENAS PELA ANÁLISE DO PROJETO E APRESENTAÇÃO DO PLANO.

NÃO FAÇAS NENHUMA ALTERAÇÃO ATÉ EU APROVAR O PLANO.