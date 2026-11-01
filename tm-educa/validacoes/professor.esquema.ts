import { z } from "zod";

export const esquemaPerfilProfessor = z.object({
  biografia: z.string().optional().nullable(),
  formacaoAcademica: z
    .string()
    .min(3, "Indique a sua formação académica (ex.: Licenciatura em Matemática)."),
  anosExperiencia: z.coerce
    .number()
    .min(0, "Os anos de experiência não podem ser negativos."),
  fotoUrl: z.string().optional().nullable(),
  telefone: z.string().optional().nullable(),
});

export type DadosPerfilProfessor = z.infer<typeof esquemaPerfilProfessor>;

export const esquemaDisponibilidadeProfessor = z.object({
  diaSemana: z.enum([
    "Segunda",
    "Terca",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sabado",
    "Domingo",
  ]),
  horaInicio: z.string().min(4, "Indique o horário inicial."),
  horaFim: z.string().min(4, "Indique o horário final."),
  activo: z.boolean().default(true),
});

export type DadosDisponibilidadeProfessor = z.infer<
  typeof esquemaDisponibilidadeProfessor
>;

export const esquemaZonaAtendimento = z.object({
  municipio: z.string().min(2, "Indique o município de atendimento."),
  bairro: z.string().optional(),
});

export type DadosZonaAtendimento = z.infer<typeof esquemaZonaAtendimento>;
