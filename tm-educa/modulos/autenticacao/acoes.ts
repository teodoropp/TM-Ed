"use server";

import bcrypt from "bcryptjs";
import { baseDados } from "@/servicos/base-dados";
import {
  esquemaEntrar,
  esquemaRegistar,
  esquemaSolicitarRecuperacao,
  esquemaRedefinirSenha,
  DadosEntrar,
  DadosRegistar,
  DadosRedefinirSenha,
} from "@/validacoes/autenticacao.esquema";
import {
  criarTokenSessao,
  definirCookieSessao,
  destruirSessao,
  gerarDadosRecuperacaoSenha,
  verificarDadosRecuperacaoSenha,
} from "./sessao";
import {
  enviarEmailBoasVindas,
  enviarEmailRecuperacaoSenha,
  enviarEmailSenhaAlterada,
} from "@/servicos/email";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface RespostaAcaoAutenticacao {
  sucesso: boolean;
  mensagem: string;
  urlRedirecionamento?: string;
}

/**
 * Server Action para início de sessão (Login).
 */
export async function acaoEntrar(
  dados: DadosEntrar,
  callbackUrl?: string
): Promise<RespostaAcaoAutenticacao> {
  const validacao = esquemaEntrar.safeParse(dados);
  if (!validacao.success) {
    const primeiraMensagem =
      validacao.error.issues?.[0]?.message || "Dados de acesso inválidos.";
    return {
      sucesso: false,
      mensagem: primeiraMensagem,
    };
  }

  const { email, palavraPasse } = validacao.data;

  try {
    const utilizador = await baseDados.utilizador.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!utilizador || !utilizador.activo) {
      return {
        sucesso: false,
        mensagem: "O correio eletrónico ou a palavra-passe estão incorretos.",
      };
    }

    const palavraPasseValida = await bcrypt.compare(
      palavraPasse,
      utilizador.palavraPasseHash
    );

    if (!palavraPasseValida) {
      return {
        sucesso: false,
        mensagem: "O correio eletrónico ou a palavra-passe estão incorretos.",
      };
    }

    const token = await criarTokenSessao({
      utilizadorId: utilizador.id,
      email: utilizador.email,
      nomeCompleto: utilizador.nomeCompleto,
      funcao: utilizador.funcao,
    });

    await definirCookieSessao(token);

    // Determinar destino com base no papel (RBAC) ou callbackUrl válido
    let destino = callbackUrl;
    if (!destino || destino === "/" || destino.startsWith("/entrar")) {
      switch (utilizador.funcao) {
        case "ADMINISTRADOR":
          destino = "/administracao";
          break;
        case "PROFESSOR":
          destino = "/portal-professor";
          break;
        case "ENCARREGADO":
        default:
          destino = "/portal-encarregado";
          break;
      }
    }

    return {
      sucesso: true,
      mensagem: "Sessão iniciada com sucesso.",
      urlRedirecionamento: destino,
    };
  } catch (erro: any) {
    console.error("Erro na ação de entrar:", erro);
    const msg = erro?.message || "";
    if (
      msg.includes("DATABASE_URL") ||
      msg.includes("Can't reach database server") ||
      msg.includes("P1001") ||
      msg.includes("connect ECONNREFUSED") ||
      msg.includes("Environment variable not found")
    ) {
      return {
        sucesso: false,
        mensagem: `Erro de ligação à base de dados: Verifique se a variável DATABASE_URL está configurada na Hostinger (${erro?.code || "P1001"}).`,
      };
    }
    return {
      sucesso: false,
      mensagem: `Ocorreu um erro ao processar o seu acesso: ${erro?.message || "Tente novamente."}`,
    };
  }
}

/**
 * Server Action para registo de novos utilizadores (Paiss ou Professores).
 */
export async function acaoRegistar(
  dados: DadosRegistar
): Promise<RespostaAcaoAutenticacao> {
  const validacao = esquemaRegistar.safeParse(dados);
  if (!validacao.success) {
    const primeiraMensagem =
      validacao.error.issues?.[0]?.message || "Dados de registo inválidos.";
    return {
      sucesso: false,
      mensagem: primeiraMensagem,
    };
  }

  const { nomeCompleto, email, telefone, palavraPasse, funcao } = validacao.data;
  const emailNormalizado = email.toLowerCase().trim();

  try {
    const utilizadorExistente = await baseDados.utilizador.findUnique({
      where: { email: emailNormalizado },
    });

    if (utilizadorExistente) {
      return {
        sucesso: false,
        mensagem: "Já existe uma conta associada a este endereço de correio eletrónico.",
      };
    }

    const salt = await bcrypt.genSalt(12);
    const palavraPasseHash = await bcrypt.hash(palavraPasse, salt);

    // Criação transacional do utilizador e do respetivo perfil
    const novoUtilizador = await baseDados.$transaction(async (tx) => {
      const u = await tx.utilizador.create({
        data: {
          nomeCompleto,
          email: emailNormalizado,
          telefone,
          palavraPasseHash,
          funcao,
        },
      });

      if (funcao === "ENCARREGADO") {
        await tx.perfilEncarregado.create({
          data: {
            utilizadorId: u.id,
          },
        });
      } else if (funcao === "PROFESSOR") {
        await tx.perfilProfessor.create({
          data: {
            utilizadorId: u.id,
            estado: "Pendente",
          },
        });
      }

      return u;
    });

    const token = await criarTokenSessao({
      utilizadorId: novoUtilizador.id,
      email: novoUtilizador.email,
      nomeCompleto: novoUtilizador.nomeCompleto,
      funcao: novoUtilizador.funcao,
    });

    await definirCookieSessao(token);

    // Envio do e-mail oficial de Boas-Vindas (não bloqueante em caso de falha de rede externa)
    try {
      await enviarEmailBoasVindas({
        nomeCompleto: novoUtilizador.nomeCompleto,
        email: novoUtilizador.email,
        funcao: novoUtilizador.funcao,
      });
    } catch (erroEmail) {
      console.warn("Aviso ao enviar e-mail de boas-vindas:", erroEmail);
    }

    const destino =
      novoUtilizador.funcao === "PROFESSOR"
        ? "/portal-professor"
        : "/portal-encarregado";

    return {
      sucesso: true,
      mensagem: "Conta criada com sucesso! Enviámos um e-mail de boas-vindas para a sua caixa de correio.",
      urlRedirecionamento: destino,
    };
  } catch (erro) {
    console.error("Erro na ação de registar:", erro);
    return {
      sucesso: false,
      mensagem: "Não foi possível concluir o registo. Por favor, tente novamente.",
    };
  }
}

export interface DadosGoogleAuth {
  email: string;
  nomeCompleto?: string;
  funcao?: "ADMINISTRADOR" | "ENCARREGADO" | "PROFESSOR";
}

/**
 * Server Action para início de sessão e registo via Google.
 */
export async function acaoAutenticarGoogle(
  dados: DadosGoogleAuth,
  callbackUrl?: string
): Promise<RespostaAcaoAutenticacao> {
  const emailNormalizado = dados.email.toLowerCase().trim();
  if (!emailNormalizado || !emailNormalizado.includes("@")) {
    return {
      sucesso: false,
      mensagem: "Endereço de correio eletrónico Google inválido.",
    };
  }

  try {
    let utilizador = await baseDados.utilizador.findUnique({
      where: { email: emailNormalizado },
    });

    if (utilizador) {
      if (!utilizador.activo) {
        return {
          sucesso: false,
          mensagem: "Esta conta encontra-se inativa. Contacte a administração da TM-Educa.",
        };
      }
    } else {
      // Registo automático com conta Google
      const nomeFinal =
        dados.nomeCompleto?.trim() ||
        emailNormalizado.split("@")[0].replace(/[._]/g, " ");
      const funcaoFinal = dados.funcao || "ENCARREGADO";
      const salt = await bcrypt.genSalt(10);
      const palavraPasseHash = await bcrypt.hash(
        `google_oauth_${Date.now()}_${Math.random()}`,
        salt
      );

      utilizador = await baseDados.$transaction(async (tx) => {
        const u = await tx.utilizador.create({
          data: {
            nomeCompleto: nomeFinal,
            email: emailNormalizado,
            telefone: "+244 923 000 000",
            palavraPasseHash,
            funcao: funcaoFinal,
            activo: true,
          },
        });

        if (funcaoFinal === "ENCARREGADO") {
          await tx.perfilEncarregado.create({
            data: {
              utilizadorId: u.id,
            },
          });
        } else if (funcaoFinal === "PROFESSOR") {
          await tx.perfilProfessor.create({
            data: {
              utilizadorId: u.id,
              estado: "Pendente",
            },
          });
        }

        return u;
      });

      // Enviar e-mail de boas-vindas ao novo utilizador registado via Google
      try {
        await enviarEmailBoasVindas({
          nomeCompleto: utilizador.nomeCompleto,
          email: utilizador.email,
          funcao: utilizador.funcao,
        });
      } catch (erroEmail) {
        console.warn("Aviso ao enviar e-mail de boas-vindas (Google):", erroEmail);
      }
    }

    const token = await criarTokenSessao({
      utilizadorId: utilizador.id,
      email: utilizador.email,
      nomeCompleto: utilizador.nomeCompleto,
      funcao: utilizador.funcao,
    });

    await definirCookieSessao(token);

    let destino = callbackUrl;
    if (!destino || destino === "/" || destino.startsWith("/entrar")) {
      switch (utilizador.funcao) {
        case "ADMINISTRADOR":
          destino = "/administracao";
          break;
        case "PROFESSOR":
          destino = "/portal-professor";
          break;
        case "ENCARREGADO":
        default:
          destino = "/portal-encarregado";
          break;
      }
    }

    return {
      sucesso: true,
      mensagem: "Autenticação Google realizada com sucesso.",
      urlRedirecionamento: destino,
    };
  } catch (erro) {
    console.error("Erro na autenticação Google:", erro);
    return {
      sucesso: false,
      mensagem: "Ocorreu um erro ao processar o acesso com a Google. Tente novamente.",
    };
  }
}

/**
 * Server Action para terminar sessão (Logout) com redirecionamento no servidor.
 */
export async function acaoTerminarSessao() {
  await destruirSessao();
  revalidatePath("/", "layout");
  redirect("/entrar");
}

/**
 * Server Action para terminar sessão invocada a partir de componentes cliente.
 */
export async function acaoEncerrarSessaoCliente(): Promise<RespostaAcaoAutenticacao> {
  await destruirSessao();
  revalidatePath("/", "layout");
  return {
    sucesso: true,
    mensagem: "Sessão terminada com sucesso.",
    urlRedirecionamento: "/entrar",
  };
}

export interface RespostaRecuperacaoSenha {
  sucesso: boolean;
  mensagem: string;
  codigoDemonstracao?: string;
  metodoEnvio?: "RESEND" | "SMTP" | "SIMULADO_DEV";
  urlRedirecionamento?: string;
}

/**
 * Passo 1 da Recuperação de Senha: Gera código de 6 dígitos + link seguro e envia para o e-mail.
 */
export async function acaoSolicitarRecuperacaoSenha(
  email: string
): Promise<RespostaRecuperacaoSenha> {
  const validacao = esquemaSolicitarRecuperacao.safeParse({ email });
  if (!validacao.success) {
    return {
      sucesso: false,
      mensagem:
        validacao.error.issues?.[0]?.message ||
        "Introduza um endereço de correio eletrónico válido.",
    };
  }

  const emailNormalizado = validacao.data.email.toLowerCase().trim();

  try {
    const utilizador = await baseDados.utilizador.findUnique({
      where: { email: emailNormalizado },
    });

    if (!utilizador || !utilizador.activo) {
      return {
        sucesso: false,
        mensagem:
          "Não foi encontrada nenhuma conta ativa associada a este endereço de correio eletrónico.",
      };
    }

    const { codigo, token } = await gerarDadosRecuperacaoSenha({
      utilizadorId: utilizador.id,
      email: utilizador.email,
      palavraPasseHash: utilizador.palavraPasseHash,
    });

    const resultadoEmail = await enviarEmailRecuperacaoSenha({
      nomeCompleto: utilizador.nomeCompleto,
      email: utilizador.email,
      codigoVerificacao: codigo,
      tokenRecuperacao: token,
    });

    return {
      sucesso: true,
      mensagem: `Enviámos um código de 6 dígitos e o link de recuperação para ${utilizador.email}.`,
      codigoDemonstracao:
        resultadoEmail.metodo === "SIMULADO_DEV" ? codigo : undefined,
      metodoEnvio: resultadoEmail.metodo,
    };
  } catch (erro) {
    console.error("Erro ao solicitar recuperação de palavra-passe:", erro);
    return {
      sucesso: false,
      mensagem:
        "Não foi possível processar o pedido de recuperação neste momento. Tente novamente.",
    };
  }
}

/**
 * Passo 2 da Recuperação de Senha: Valida o código de 6 dígitos ou token JWT e atualiza a palavra-passe.
 */
export async function acaoRedefinirPalavraPasse(
  dados: DadosRedefinirSenha
): Promise<RespostaRecuperacaoSenha> {
  const validacao = esquemaRedefinirSenha.safeParse(dados);
  if (!validacao.success) {
    return {
      sucesso: false,
      mensagem:
        validacao.error.issues?.[0]?.message ||
        "Verifique os dados introduzidos.",
    };
  }

  const { email, codigoOuToken, novaPalavraPasse } = validacao.data;
  const emailNormalizado = email.toLowerCase().trim();

  try {
    const utilizador = await baseDados.utilizador.findUnique({
      where: { email: emailNormalizado },
    });

    if (!utilizador || !utilizador.activo) {
      return {
        sucesso: false,
        mensagem: "Conta de utilizador não encontrada ou inativa.",
      };
    }

    const codigoValido = await verificarDadosRecuperacaoSenha({
      utilizadorId: utilizador.id,
      email: utilizador.email,
      palavraPasseHashAtual: utilizador.palavraPasseHash,
      codigoOuToken,
    });

    if (!codigoValido) {
      return {
        sucesso: false,
        mensagem:
          "O código de verificação é inválido ou já expirou. Por favor, verifique o código ou solicite um novo.",
      };
    }

    const salt = await bcrypt.genSalt(12);
    const novaPalavraPasseHash = await bcrypt.hash(novaPalavraPasse, salt);

    await baseDados.utilizador.update({
      where: { id: utilizador.id },
      data: {
        palavraPasseHash: novaPalavraPasseHash,
      },
    });

    try {
      await enviarEmailSenhaAlterada({
        nomeCompleto: utilizador.nomeCompleto,
        email: utilizador.email,
      });
    } catch (erroEmail) {
      console.warn("Aviso ao enviar confirmação de alteração de senha:", erroEmail);
    }

    return {
      sucesso: true,
      mensagem:
        "A sua palavra-passe foi redefinida com sucesso! Já pode iniciar sessão com a nova senha.",
      urlRedirecionamento: "/entrar?recuperada=1",
    };
  } catch (erro) {
    console.error("Erro ao redefinir palavra-passe:", erro);
    return {
      sucesso: false,
      mensagem:
        "Ocorreu um erro ao atualizar a sua palavra-passe. Por favor, tente novamente.",
    };
  }
}
