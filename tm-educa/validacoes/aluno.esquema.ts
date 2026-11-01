import { z } from "zod";

export const esquemaAluno = z.object({
  nomeCompleto: z
    .string()
    .min(3, "O nome do aluno deve conter pelo menos 3 caracteres."),
  dataNascimento: z.string().optional(),
  sexo: z.enum(["Masculino", "Feminino"]).optional(),
  anoEscolar: z
    .string()
    .min(1, "Selecione o ano escolar do aluno."),
  sistemaEnsino: z
    .string()
    .default("Geral Angolano"),
  escola: z.string().optional(),
  dificuldades: z.string().optional(),
  objectivos: z.string().optional(),
  observacoes: z.string().optional(),
});

export type DadosAluno = z.infer<typeof esquemaAluno>;
