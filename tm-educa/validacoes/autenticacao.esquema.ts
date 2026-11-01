import { z } from "zod";

/**
 * Validação de início de sessão (login) em português de Portugal.
 */
export const esquemaEntrar = z.object({
  email: z
    .string()
    .min(1, "O correio eletrónico é obrigatório.")
    .email("Introduza um endereço de correio eletrónico válido."),
  palavraPasse: z
    .string()
    .min(1, "A palavra-passe é obrigatória.")
    .min(6, "A palavra-passe deve conter pelo menos 6 caracteres."),
});

export type DadosEntrar = z.infer<typeof esquemaEntrar>;

/**
 * Validação de registo de novo utilizador.
 */
export const esquemaRegistar = z.object({
  nomeCompleto: z
    .string()
    .min(1, "O nome completo é obrigatório.")
    .min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z
    .string()
    .min(1, "O correio eletrónico é obrigatório.")
    .email("Introduza um endereço de correio eletrónico válido."),
  telefone: z
    .string()
    .min(1, "O número de telefone é obrigatório.")
    .min(9, "Introduza um número de telefone válido com pelo menos 9 dígitos."),
  palavraPasse: z
    .string()
    .min(1, "A palavra-passe é obrigatória.")
    .min(8, "A palavra-passe deve conter pelo menos 8 caracteres."),
  funcao: z.enum(["ENCARREGADO", "PROFESSOR"]),
});

export type DadosRegistar = z.infer<typeof esquemaRegistar>;

/**
 * Validação de pedido de recuperação de palavra-passe.
 */
export const esquemaSolicitarRecuperacao = z.object({
  email: z
    .string()
    .min(1, "O correio eletrónico é obrigatório.")
    .email("Introduza um endereço de correio eletrónico válido."),
});

export type DadosSolicitarRecuperacao = z.infer<typeof esquemaSolicitarRecuperacao>;

/**
 * Validação de redefinição de palavra-passe com código ou token.
 */
export const esquemaRedefinirSenha = z.object({
  email: z
    .string()
    .min(1, "O correio eletrónico é obrigatório.")
    .email("Introduza um endereço de correio eletrónico válido."),
  codigoOuToken: z
    .string()
    .min(6, "Introduza o código de 6 dígitos ou utilize o link enviado por e-mail."),
  novaPalavraPasse: z
    .string()
    .min(8, "A nova palavra-passe deve conter pelo menos 8 caracteres."),
});

export type DadosRedefinirSenha = z.infer<typeof esquemaRedefinirSenha>;
