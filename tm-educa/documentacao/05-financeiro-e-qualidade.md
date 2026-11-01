# 05 — FINANCEIRO E QUALIDADE

> **Documento Guia TM-Educa**  
> **Âmbito:** Pagamentos de clientes, remuneração de explicadores, cálculo de margens, avaliações e gestão de ocorrências

---

## 1. Módulo Financeiro — Pagamentos de Clientes

A plataforma não implementa inicialmente uma carteira digital fechada (*wallet*). Toda a liquidação comercial baseia-se na emissão de faturas/avisos de cobrança e conciliação por comprovativo bancário ou referência:

### Estados da Cobrança (`PagamentoCliente`):
* `Pendente`: Cobrança gerada com data limite de vencimento.
* `Em analise`: O encarregado enviou o comprovativo de transferência bancária / referência e a administração está a validar.
* `Pago`: Montante recebido e validado na conta bancária da TM-Educa.
* `Falhado`: Tentativa de pagamento rejeitada ou prazo expirado sem liquidação.
* `Cancelado`: Fatura anulada por alteração de contrato.
* `Reembolsado`: Montante devolvido à família por acordo comercial.

---

## 2. Remuneração dos Professores

A remuneração dos explicadores baseia-se exclusivamente em **aulas elegíveis** no período de competência (mensal ou quinzenal):

### Aulas Elegíveis:
$$\text{Aulas Elegíveis} = \text{Aulas com Estado } \mathbf{Realizada} + \text{Aulas } \mathbf{Aluno\_Ausente}\text{ (sem aviso prévio)}$$

Aulas onde o professor faltou injustificadamente (`Professor_Ausente`) ou aulas canceladas com aviso atempado são **excluídas** da folha de pagamento do período.

### Processamento da Folha (`FolhaRemuneracao`):
1. **Geração (Rascunho):** O sistema agrupa todas as aulas elegíveis do professor no período e multiplica pelo valor acordado da aula.
2. **Revisão:** A administração analisa se existem reclamações ou ocorrências pendentes contra o professor.
3. **Aprovação:** A folha passa a `Aprovado` e fica visível no portal do professor como valor liquidável.
4. **Liquidação (`Pago`):** Após transferência bancária para o IBAN do professor, anexa-se o recibo/comprovativo e o registo é arquivado.

---

## 3. Gestão da Qualidade e Avaliações de Explicadores

A excelência pedagógica da TM-Educa é sustentada por avaliações regulares efetuadas pelos pais.

### Dimensões de Avaliação (1 a 5 Estrelas + Comentário):
* **Qualidade Pedagógica:** Clareza nas explicações e domínio do programa curricular.
* **Pontualidade e Assiduidade:** Cumprimento rigoroso do horário da aula.
* **Comunicação:** Facilidade de contacto e esclarecimento com os pais.
* **Adaptação ao Aluno:** Capacidade de lidar com as dificuldades específicas e ritmo do filho.
* **Profissionalismo e Postura:** Apresentação, respeito e compromisso ético.

Estas notas alimentam automaticamente o cálculo da pontuação de **Matching** para futuras atribuições de alunos.

---

## 4. Gestão de Ocorrências e Mediação (`RegistoOcorrencia`)

Qualquer incidente ocorrido no ecossistema deve ser formalmente registado e tratado:

### Tipos de Ocorrência:
* `Falta`: Faltas não comunicadas de alunos ou professores.
* `Reclamacao`: Queixa formal de um encarregado ou professor sobre postura ou conduta.
* `Comportamento`: Problemas disciplinares do aluno durante a aula.
* `Pagamento`: Contestações de valores faturados ou atrasos reiterados.
* `Incidente`: Qualquer evento extraordinário na residência ou no apoio online.
* `Administrativo`: Questões contratuais diversas.

### Ciclo de Resolução:
* Ocorrência aberta $\longrightarrow$ Atribuída a um administrador responsável $\longrightarrow$ Registo de diligências de contacto $\longrightarrow$ Parecer e Resolução formal $\longrightarrow$ Estado: `Resolvida`.
