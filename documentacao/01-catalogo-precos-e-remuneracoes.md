# 01 — CATÁLOGO, PREÇOS E REMUNERAÇÕES

> **Documento Guia TM-Educa**  
> **Âmbito:** Preçário oficial da TM-Educa, regras de cálculo comercial, remuneração docente e margem bruta

---

## 1. Tabela Comercial Oficial da TM-Educa

> [!CAUTION]
> **PROIBIÇÃO DE VALORES HARDCODED NO CÓDIGO!**  
> Os valores abaixo são a tabela oficial da TM-Educa e devem residir exclusivamente na base de dados (`TabelaPreco`).  
> O código fonte consulta a base de dados; nunca coloca literais numéricos comerciais espalhados no código.

Os preços abaixo referem-se ao **valor por aula individual**, expressos em Kwanzas Angolanos (Kz):

### Ensino Primário (1.º ao 6.º Ano)
| Ano Escolar | 1 Hora (60 min) | 1h30 (90 min) | 2 Horas (120 min) |
| :---: | :---: | :---: | :---: |
| **1.º Ano** | 3.000 Kz | 4.500 Kz | 6.000 Kz |
| **2.º Ano** | 3.500 Kz | 5.000 Kz | 6.500 Kz |
| **3.º Ano** | 4.000 Kz | 5.500 Kz | 7.000 Kz |
| **4.º Ano** | 4.500 Kz | 6.500 Kz | 8.500 Kz |
| **5.º Ano** | 6.000 Kz | 7.500 Kz | 9.500 Kz |
| **6.º Ano** | 7.000 Kz | 8.500 Kz | 10.500 Kz |

### I Ciclo do Ensino Secundário (7.º ao 9.º Ano)
| Ano Escolar | 1 Hora (60 min) | 1h30 (90 min) | 2 Horas (120 min) |
| :---: | :---: | :---: | :---: |
| **7.º Ano** | 8.500 Kz | 10.000 Kz | 12.500 Kz |
| **8.º Ano** | 9.000 Kz | 11.500 Kz | 14.000 Kz |
| **9.º Ano** | 9.500 Kz | 12.000 Kz | 15.500 Kz |

### II Ciclo do Ensino Secundário (10.º ao 12.º Ano)
| Ano Escolar | 1 Hora (60 min) | 1h30 (90 min) | 2 Horas (120 min) |
| :---: | :---: | :---: | :---: |
| **10.º Ano** | 11.500 Kz | 15.500 Kz | 20.500 Kz |
| **11.º Ano** | 12.500 Kz | 17.000 Kz | 22.500 Kz |
| **12.º Ano** | 13.500 Kz | 18.500 Kz | 24.500 Kz |

---

## 2. Regra e Fórmula de Cálculo Comercial

### Estimativa Mensal Baseada em 4 Semanas
A mensalidade contratada é uma **estimativa mensal** baseada em blocos de 4 semanas de aulas:

$$\text{Estimativa Mensal (Kz)} = \text{Preço por Aula} \times \text{Aulas por Semana} \times 4\text{ Semanas}$$

#### Exemplo Prático de Negócio:
* Aluno do 10.º Ano
* Duração: 1 hora (11.500 Kz / aula)
* Frequência: 3 vezes por semana
$$\text{Estimativa Mensal} = 11.500 \times 3 \times 4 = 138.000\text{ Kz}$$

> [!NOTE]
> Na interface com o cliente, a nomenclatura obrigatória é:  
> **"Estimativa mensal: 138.000 Kz"** (nunca apenas "Preço mensal", para clareza sobre o ciclo de 4 semanas).

### Múltiplas Disciplinas e Serviços
Um encarregado pode contratar acompanhamento em várias disciplinas para o mesmo aluno ou para alunos diferentes:
* Exemplo: Matemática (10.º ano, 1h, 3x/semana = 138.000 Kz) + Física (10.º ano, 1h, 2x/semana = 92.000 Kz).
* **Total Mensal Estimado Contratado:** $138.000 + 92.000 = 230.000\text{ Kz}$.

---

## 3. Tabela de Remuneração dos Professores

A remuneração do explicador é uma regra interna da TM-Educa:
1. **Confidencialidade Estrita:** O professor nunca visualiza o preço comercial cobrado ao encarregado. Tem acesso unicamente ao seu valor contratual de remuneração por aula lecionada.
2. **Parametrização Flexível:** Não se aplica uma percentagem cega. O administrador configura uma tabela própria (`TabelaRemuneracao`) por ano escolar e duração de aula.
3. **Imutabilidade Histórica:** Quando um acompanhamento e respetivo contrato são firmados, os valores acordados por aula (`preco_aula_kz` e `remuneracao_aula_kz`) ficam congelados no registo do serviço para salvaguardar a estabilidade financeira de ambas as partes.

---

## 4. Estrutura Financeira e Margem Bruta

O módulo financeiro do painel administrativo calcula a margem operacional bruta da empresa com base em aulas elegíveis:

$$\text{Margem Bruta (Kz)} = \text{Valor Recebido do Cliente} - \text{Remuneração Paga ao Professor}$$

$$\text{Margem Bruta (\%)} = \left(\frac{\text{Margem Bruta (Kz)}}{\text{Valor Recebido do Cliente}}\right) \times 100$$
