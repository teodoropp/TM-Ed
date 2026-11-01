# 04 — CONTRATOS, ACOMPANHAMENTOS E AULAS

> **Documento Guia TM-Educa**  
> **Âmbito:** Estrutura contratual, serviços ativos, agenda de aulas, presenças, cancelamentos, reposições e substituições

---

## 1. Dois Níveis Contratuais

A relação jurídica e comercial da plataforma opera sob dois conceitos distintos:

```text
┌────────────────────────────────┐            ┌────────────────────────────────┐
│       Contrato de Cliente      │            │      Contrato do Professor     │
│   (TM-Educa ↔ Pai)     │            │    (TM-Educa ↔ Professor)      │
│                                │            │                                │
│ • Faturação comercial          │            │ • Prestação de serviço de explicação │
│ • Termos de serviço aos alunos │            │ • Remuneração por aula         │
│ • Vínculo legal permanente     │            │ • Código de conduta e ética    │
└───────────────┬────────────────┘            └────────────────┬───────────────┘
                │                                              │
                └───────────────┐              ┌───────────────┘
                                ▼              ▼
                        ┌──────────────────────────────┐
                        │    AcompanhamentoServiço     │
                        │    (Instância Operacional)   │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                             ┌───────────────────┐
                             │  Agenda de Aulas  │
                             └───────────────────┘
```

> [!NOTE]
> A relação com o professor é tratada como prestação de serviços educativos autónomos, sujeita a validação jurídica antes de utilização em escala de produção em Angola.

---

## 2. Acompanhamento e Agenda de Aulas

Quando o pedido passa a `Activo`:
1. É criado o registo `AcompanhamentoServico`, que vincula o Aluno, o Professor, a Disciplina e as condições de preço/remuneração congeladas.
2. O sistema gera automaticamente as instâncias da entidade `Aula` no calendário para as semanas seguintes com base na frequência acordada.
3. Cada aula contém:
   * Data e horário de início/fim;
   * Modalidade (Domicílio, Online ou Apoio Online Interativo);
   * Estado inicial: `Agendada`.

---

## 3. Registo de Presenças e Sumários Pedagógicos

Após a realização da aula, o professor acede ao `/portal-professor/aulas` e preenche o registo pedagógico:
* **Estado Final da Aula:**
  * `Realizada`: Aula lecionada com sucesso.
  * `Aluno_Ausente`: Aluno não compareceu.
  * `Professor_Ausente`: Professor faltou sem aviso ou justificação.
  * `Cancelada`: Aula cancelada previamente.
  * `Reagendada`: Aula remarcada por mútuo acordo aprovado.
  * `Substituida`: Aula dada por outro explicador indicado.
* **Sumário da Matéria:** Descrição dos conteúdos lecionados, trabalhos de casa passados e notas de evolução pedagógica.
* O Pai recebe notificação e pode ler o sumário no seu portal.

---

## 4. Políticas de Cancelamento e Reposições

As regras de cancelamento protegem ambas as partes contra perdas injustas:

### 4.1. Cancelamento pelo Professor
* **Falta Injustificada:**
  * O professor **não recebe remuneração** pela referida aula;
  * A aula **tem de ser reposta** obrigatoriamente sem custos para a família;
  * Reincidência gera abertura de ocorrência e eventual suspensão do professor da rede TM-Educa.

### 4.2. Cancelamento pelo Pai / Aluno
* **Com Antecedência Mínima (ex.: superior a 24 horas):**
  * Não há cobrança extraordinária;
  * Gera-se um crédito de aula de reposição (`requer_reposicao = true`).
* **Cancelamento Tardio ou No-Show (sem aviso):**
  * A aula é **contabilizada e faturada** à família;
  * A remuneração do professor é assegurada para compensar a deslocação e reserva do seu tempo de trabalho.

### 4.3. Regra de Rastreio de Reposições (`ReposicaoAula`)
Uma aula de reposição **nunca é criada como uma aula avulsa sem histórico**.  
O modelo de dados exige uma ligação direta:

$$\text{Aula Original (Cancelada)} \xleftarrow{\quad\text{ReposicaoAula}\quad} \text{Aula de Reposição (Agendada)}$$

Isto impede duplicações em folhas de pagamento e garante a auditoria de reposição aos encarregados.

---

## 5. Protocolo de Substituição de Professor

Se um professor adoecer, mudar de residência ou demonstrar incompatibilidade pedagógica:

1. O Administrador abre um `PedidoSubstituicaoProfessor`.
2. O contrato do encarregado permanece **inalterado** com a TM-Educa (a família não precisa de cancelar o contrato nem abrir um novo pedido do zero).
3. O sistema roda o algoritmo de matching para sugerir novo professor compatível com os horários e conteúdos já lecionados.
4. Uma vez aprovado o novo professor, as aulas agendadas a partir da data de transição passam automaticamente para o novo explicador.
5. Todo o histórico de sumários e notas pedagógicas anteriores fica acessível ao novo professor para continuidade dos estudos.
