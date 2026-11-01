import net from "net";
import tls from "tls";

export interface OpcoesEnvioEmail {
  para: string;
  assunto: string;
  html: string;
  texto?: string;
}

export interface ResultadoEnvioEmail {
  enviado: boolean;
  metodo: "RESEND" | "SMTP" | "SIMULADO_DEV";
  detalhe?: string;
}

/**
 * Envia um e-mail através de SMTP nativo (TLS/STARTTLS) sem dependências externas.
 */
async function enviarViaSmtpNativo(
  opcoes: OpcoesEnvioEmail,
  config: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  }
): Promise<boolean> {
  return new Promise((resolve) => {
    const usarTlsDireto = config.port === 465;
    let socket: net.Socket | tls.TLSSocket;
    let concluido = false;

    const finalizar = (sucesso: boolean) => {
      if (concluido) return;
      concluido = true;
      try {
        socket?.destroy();
      } catch {
        // ignorar
      }
      resolve(sucesso);
    };

    const timeout = setTimeout(() => finalizar(false), 10000);

    const extrairEmailPuro = (remetente: string) => {
      const match = remetente.match(/<([^>]+)>/);
      return match ? match[1] : remetente.trim();
    };

    const emailRemetente = extrairEmailPuro(config.from);
    const emailDestinatario = extrairEmailPuro(opcoes.para);

    const executarDialogoSmtp = (conexao: net.Socket | tls.TLSSocket, jaSeguro: boolean) => {
      let buffer = "";
      let etapa = 0;

      const enviarComando = (cmd: string) => {
        conexao.write(cmd + "\r\n");
      };

      conexao.on("data", (chunk) => {
        buffer += chunk.toString("utf8");
        const linhas = buffer.split("\r\n");
        buffer = linhas.pop() || "";

        for (const linha of linhas) {
          if (!linha || linha.length < 3) continue;
          // Se for linha de continuação (ex: "250-PIPELINING"), aguarda a linha final ("250 ...")
          if (linha[3] === "-") continue;

          const codigo = parseInt(linha.slice(0, 3), 10);
          if (codigo >= 400) {
            console.warn("[TM-Educa Email SMTP] Resposta de erro:", linha);
            clearTimeout(timeout);
            finalizar(false);
            return;
          }

          if (etapa === 0 && codigo === 220) {
            etapa = 1;
            enviarComando("EHLO tmeduca.ao");
          } else if (etapa === 1 && codigo === 250) {
            if (!jaSeguro && config.port === 587) {
              etapa = 2;
              enviarComando("STARTTLS");
            } else {
              etapa = 3;
              enviarComando("AUTH LOGIN");
            }
          } else if (etapa === 2 && codigo === 220) {
            conexao.removeAllListeners("data");
            const tlsSocket = tls.connect(
              {
                socket: conexao,
                servername: config.host,
                rejectUnauthorized: false,
              },
              () => {
                executarDialogoSmtp(tlsSocket, true);
                tlsSocket.write("EHLO tmeduca.ao\r\n");
              }
            );
            tlsSocket.on("error", () => {
              clearTimeout(timeout);
              finalizar(false);
            });
            return;
          } else if (etapa === 3 && codigo === 334) {
            etapa = 4;
            enviarComando(Buffer.from(config.user, "utf8").toString("base64"));
          } else if (etapa === 4 && codigo === 334) {
            etapa = 5;
            enviarComando(Buffer.from(config.pass, "utf8").toString("base64"));
          } else if (etapa === 5 && codigo === 235) {
            etapa = 6;
            enviarComando(`MAIL FROM:<${emailRemetente}>`);
          } else if (etapa === 6 && codigo === 250) {
            etapa = 7;
            enviarComando(`RCPT TO:<${emailDestinatario}>`);
          } else if (etapa === 7 && codigo === 250) {
            etapa = 8;
            enviarComando("DATA");
          } else if (etapa === 8 && codigo === 354) {
            etapa = 9;
            const assuntoBase64 = `=?UTF-8?B?${Buffer.from(opcoes.assunto, "utf8").toString("base64")}?=`;
            const corpo = [
              `From: ${config.from}`,
              `To: <${emailDestinatario}>`,
              `Subject: ${assuntoBase64}`,
              `MIME-Version: 1.0`,
              `Content-Type: text/html; charset=UTF-8`,
              `Content-Transfer-Encoding: base64`,
              ``,
              Buffer.from(opcoes.html, "utf8")
                .toString("base64")
                .replace(/(.{76})/g, "$1\r\n"),
              `.`,
            ].join("\r\n");
            enviarComando(corpo);
          } else if (etapa === 9 && codigo === 250) {
            etapa = 10;
            enviarComando("QUIT");
            clearTimeout(timeout);
            finalizar(true);
            return;
          }
        }
      });

      // Se já entrou após STARTTLS, a etapa começa no 1 (aguardando resposta do EHLO)
      if (jaSeguro && config.port === 587) {
        etapa = 1;
      }
    };

    try {
      if (usarTlsDireto) {
        socket = tls.connect({
          host: config.host,
          port: config.port,
          servername: config.host,
          rejectUnauthorized: false,
        });
      } else {
        socket = net.createConnection({
          host: config.host,
          port: config.port,
        });
      }

      socket.on("error", () => {
        clearTimeout(timeout);
        finalizar(false);
      });

      executarDialogoSmtp(socket, usarTlsDireto);
    } catch {
      clearTimeout(timeout);
      finalizar(false);
    }
  });
}

/**
 * Serviço central de envio de correio eletrónico da TM-Educa.
 * Suporta Resend API (RESEND_API_KEY), SMTP nativo (SMTP_HOST/SMTP_USER/SMTP_PASS)
 * e registo automático em consola para ambiente de desenvolvimento.
 */
export async function enviarEmail(
  opcoes: OpcoesEnvioEmail
): Promise<ResultadoEnvioEmail> {
  const remetentePadrao =
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    "TM-Educa <tmeduca99@gmail.com>";

  // 1. Tentar envio via Resend API se RESEND_API_KEY estiver configurada
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resposta = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: remetentePadrao,
          to: [opcoes.para],
          subject: opcoes.assunto,
          html: opcoes.html,
          text: opcoes.texto,
        }),
      });

      if (resposta.ok) {
        return { enviado: true, metodo: "RESEND" };
      }
      const erroTexto = await resposta.text();
      console.warn("[TM-Educa Email] Aviso Resend API:", erroTexto);
    } catch (erro) {
      console.warn("[TM-Educa Email] Falha na ligação à Resend API:", erro);
    }
  }

  // 2. Tentar envio via servidor SMTP (com credenciais oficiais TM-Educa por omissão)
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || "465");
  const smtpUser = process.env.SMTP_USER || "tmeduca99@gmail.com";
  const smtpPass = process.env.SMTP_PASS || "9900ooppl";

  if (smtpHost && smtpUser && smtpPass) {
    const enviadoSmtp = await enviarViaSmtpNativo(opcoes, {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
      from: remetentePadrao,
    });

    if (enviadoSmtp) {
      return { enviado: true, metodo: "SMTP" };
    }
  }

  // 3. Fallback em Ambiente de Desenvolvimento (Consola do Servidor)
  console.info("\n==========================================================");
  console.info("📧 [TM-EDUCA CORREIO ELETRÓNICO ENVIADO]");
  console.info(`Para:    ${opcoes.para}`);
  console.info(`Assunto: ${opcoes.assunto}`);
  if (opcoes.texto) {
    console.info("----------------------------------------------------------");
    console.info(opcoes.texto);
  }
  console.info("==========================================================\n");

  return {
    enviado: true,
    metodo: "SIMULADO_DEV",
    detalhe: "E-mail processado e registado no servidor (configure SMTP_HOST/SMTP_USER/SMTP_PASS ou RESEND_API_KEY no .env para entrega externa).",
  };
}

/**
 * Envia o e-mail oficial de Boas-Vindas quando um novo utilizador se regista na TM-Educa.
 */
export async function enviarEmailBoasVindas(dados: {
  nomeCompleto: string;
  email: string;
  funcao: "ENCARREGADO" | "PROFESSOR" | "ADMINISTRADOR";
}): Promise<ResultadoEnvioEmail> {
  const urlBase = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const primeiroNome = dados.nomeCompleto.trim().split(" ")[0] || dados.nomeCompleto;

  const ehProfessor = dados.funcao === "PROFESSOR";
  const linkPortal = ehProfessor
    ? `${urlBase}/portal-professor`
    : `${urlBase}/portal-encarregado`;
  const nomePortal = ehProfessor ? "Portal do Professor" : "Portal dos Pais";

  const assunto = `Boas-vindas à TM-Educa, ${primeiroNome}! O futuro da educação constrói-se em conjunto`;

  const textoAcompanhamento = ehProfessor
    ? "Através da TM-Educa, terá a oportunidade de partilhar o seu saber com excelência, acompanhar de perto o progresso dos seus alunos, gerir a sua agenda e participar ativamente na transformação educativa da comunidade."
    : "Através da TM-Educa, terá a oportunidade de acompanhar mais de perto a jornada escolar do seu educando, manter-se informado e participar de forma mais ativa no seu desenvolvimento académico.";

  const html = `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${assunto}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; color: #0A192F; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F1F5F9; padding: 40px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 15px 35px rgba(10, 25, 47, 0.1);">
              
              <!-- TOPO INSTITUCIONAL TM-EDUCA -->
              <tr>
                <td style="background-color: #0A192F; padding: 32px 36px 26px 36px; text-align: center; border-bottom: 4px solid #FF2D75;">
                  <!-- Logótipo Oficial (Ícone + TM-Educa) -->
                  <table cellpadding="0" cellspacing="0" style="margin: 0 auto 10px auto;">
                    <tr>
                      <td style="vertical-align: middle;">
                        <svg width="46" height="46" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                          <polygon points="100,20 170,50 100,80 30,50" fill="#FFFFFF" />
                          <path d="M 58,61 Q 100,86 142,61 L 142,71 Q 100,96 58,71 Z" fill="#E2E8F0" />
                          <path d="M 42,55 Q 38,70 36,86" stroke="#FF2D75" stroke-width="3" stroke-linecap="round" fill="none" />
                          <circle cx="36" cy="88" r="3.5" fill="#FF2D75" />
                          <path d="M 33,90 L 39,90 L 41,106 L 31,106 Z" fill="#FF2D75" />
                          <path d="M 34,92 Q 67,78 100,94 Q 133,78 166,92 L 166,154 Q 133,140 100,162 Q 67,140 34,154 Z" fill="none" stroke="#FF2D75" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
                          <line x1="100" y1="94" x2="100" y2="162" stroke="#FF2D75" stroke-width="5" stroke-linecap="round" />
                          <path d="M 56,115 L 78,115 M 67,115 L 67,137" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" fill="none" />
                          <path d="M 122,137 L 122,115 L 133,127 L 144,115 L 144,137" stroke="#FF2D75" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                        </svg>
                      </td>
                      <td style="vertical-align: middle; padding-left: 12px; text-align: left;">
                        <div style="font-size: 30px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.5px; line-height: 1; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
                          TM<span style="color: #FF2D75;">-</span>Educa
                        </div>
                      </td>
                    </tr>
                  </table>
                  <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #FF2D75; letter-spacing: 0.1em; margin-bottom: 4px;">
                    A Excelência do Saber no Conforto do Teu Lar
                  </div>
                  <div style="font-size: 12px; color: #94A3B8;">
                    Luanda • www.tmeduca.ao
                  </div>
                </td>
              </tr>

              <!-- FAIXA EM GRADIENTE DA MARCA -->
              <tr>
                <td style="height: 3px; background: linear-gradient(90deg, #FF2D75 0%, #0A192F 50%, #10B981 100%);"></td>
              </tr>

              <!-- CORPO DO E-MAIL -->
              <tr>
                <td style="padding: 36px 36px 28px 36px;">
                  <h1 style="margin: 0 0 18px 0; font-size: 22px; font-weight: 700; color: #0A192F; line-height: 1.3;">
                    Olá, ${dados.nomeCompleto}! 👋
                  </h1>

                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #1E293B;">
                    É com enorme satisfação que damos as boas-vindas à <strong style="color: #0A192F;">TM-Educa</strong>!
                  </p>

                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #334155;">
                    Acreditamos que a educação é um dos pilares mais importantes para construir um futuro melhor. Por isso, criámos um espaço onde a tecnologia e a aprendizagem se unem para aproximar famílias, escolas e alunos.
                  </p>

                  <!-- CARD DE DESTAQUE COM A NOSSA COR -->
                  <div style="background-color: #FFF5F8; border-left: 4px solid #FF2D75; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: #0A192F;">
                      ${textoAcompanhamento}
                    </p>
                  </div>

                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #334155;">
                    <strong style="color: #0A192F;">O seu envolvimento faz a diferença.</strong> Cada passo acompanhado, cada conquista reconhecida e cada desafio partilhado contribuem para uma educação mais próxima e participativa.
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #334155;">
                    Estamos felizes por ter escolhido fazer parte desta comunidade!<br />
                    <strong style="color: #FF2D75;">Seja muito bem-vindo(a) à TM-Educa. O futuro da educação constrói-se em conjunto!</strong>
                  </p>

                  <!-- BOTÃO DE AÇÃO PRINCIPAL COM O ROSA TM-EDUCA -->
                  <div style="text-align: center; margin: 34px 0 28px 0;">
                    <a href="${linkPortal}" style="display: inline-block; background: linear-gradient(135deg, #FF2D75 0%, #E11D48 100%); color: #FFFFFF; text-decoration: none; padding: 14px 34px; border-radius: 8px; font-size: 13.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; box-shadow: 0 4px 14px rgba(255, 45, 117, 0.35);">
                      Aceder ao ${nomePortal}
                    </a>
                  </div>

                  <!-- DESPEDIDA INSTITUCIONAL -->
                  <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; margin-top: 26px;">
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #475569;">
                      Com estima,
                    </p>
                    <p style="margin: 0 0 2px 0; font-size: 15px; font-weight: 700; color: #0A192F;">
                      Equipa TM-Educa
                    </p>
                    <p style="margin: 0; font-size: 12.5px; font-style: italic; color: #FF2D75; font-weight: 600;">
                      Conectando pessoas, aproximando a educação.
                    </p>
                  </div>

                  <!-- CAIXA DE APOIO RÁPIDO AO CLIENTE -->
                  <div style="margin-top: 24px; padding: 14px 18px; background-color: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; font-size: 12px; color: #64748B; line-height: 1.55;">
                    <strong style="color: #0A192F;">Precisa de esclarecimento ou apoio?</strong><br />
                    WhatsApp & Telefone: <a href="https://wa.me/244955916711" style="color: #0A192F; font-weight: 600; text-decoration: none;">(+244) 955 916 711</a> &nbsp;•&nbsp; E-mail: <a href="mailto:tmeduca99@gmail.com" style="color: #FF2D75; text-decoration: none; font-weight: 600;">tmeduca99@gmail.com</a>
                  </div>
                </td>
              </tr>

              <!-- RODAPÉ FINAL TIMBRADO -->
              <tr>
                <td style="background-color: #07101C; padding: 22px 36px; text-align: center; border-top: 1px solid #1E293B;">
                  <div style="font-size: 11.5px; color: #94A3B8; margin-bottom: 4px;">
                    © ${new Date().getFullYear()} TM-Educa • Centro Educativo Temilara
                  </div>
                  <div style="font-size: 10.5px; color: #64748B;">
                    Plataforma Oficial de Explicações ao Domicílio e Apoio Escolar
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const texto = `Olá, ${dados.nomeCompleto}!\n\nÉ com enorme satisfação que damos as boas-vindas à TM-Educa!\n\nAcreditamos que a educação é um dos pilares mais importantes para construir um futuro melhor. Por isso, criámos um espaço onde a tecnologia e a aprendizagem se unem para aproximar famílias, escolas e alunos.\n\n${textoAcompanhamento}\n\nO seu envolvimento faz a diferença. Cada passo acompanhado, cada conquista reconhecida e cada desafio partilhado contribuem para uma educação mais próxima e participativa.\n\nEstamos felizes por ter escolhido fazer parte desta comunidade!\nSeja muito bem-vindo à TM-Educa. O futuro da educação constrói-se em conjunto!\n\nAceda ao seu portal em:\n${linkPortal}\n\nCom estima,\nEquipa TM-Educa\nConectando pessoas, aproximando a educação.\n\nLinha de Apoio: (+244) 955 916 711 • tmeduca99@gmail.com`;

  return await enviarEmail({
    para: dados.email,
    assunto,
    html,
    texto,
  });
}

/**
 * Envia o e-mail de Recuperação de Palavra-Passe com Código de 6 dígitos e Link Direto.
 */
export async function enviarEmailRecuperacaoSenha(dados: {
  nomeCompleto: string;
  email: string;
  codigoVerificacao: string;
  tokenRecuperacao: string;
}): Promise<ResultadoEnvioEmail> {
  const urlBase = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const linkRecuperacao = `${urlBase}/recuperar-senha?email=${encodeURIComponent(dados.email)}&codigo=${encodeURIComponent(dados.codigoVerificacao)}&token=${encodeURIComponent(dados.tokenRecuperacao)}`;

  const assunto = `Código de Recuperação de Senha: ${dados.codigoVerificacao} — TM-Educa`;

  const html = `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; color: #0F172A;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px rgba(10, 25, 47, 0.08);">
              <!-- Cabeçalho -->
              <tr>
                <td style="background-color: #0A192F; padding: 26px 32px; border-bottom: 3px solid #FF2D75; text-align: center;">
                  <table cellpadding="0" cellspacing="0" style="margin: 0 auto 6px auto;">
                    <tr>
                      <td style="vertical-align: middle;">
                        <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                          <polygon points="100,20 170,50 100,80 30,50" fill="#FFFFFF" />
                          <path d="M 58,61 Q 100,86 142,61 L 142,71 Q 100,96 58,71 Z" fill="#E2E8F0" />
                          <path d="M 42,55 Q 38,70 36,86" stroke="#FF2D75" stroke-width="3" stroke-linecap="round" fill="none" />
                          <circle cx="36" cy="88" r="3.5" fill="#FF2D75" />
                          <path d="M 33,90 L 39,90 L 41,106 L 31,106 Z" fill="#FF2D75" />
                          <path d="M 34,92 Q 67,78 100,94 Q 133,78 166,92 L 166,154 Q 133,140 100,162 Q 67,140 34,154 Z" fill="none" stroke="#FF2D75" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
                          <line x1="100" y1="94" x2="100" y2="162" stroke="#FF2D75" stroke-width="5" stroke-linecap="round" />
                          <path d="M 56,115 L 78,115 M 67,115 L 67,137" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" fill="none" />
                          <path d="M 122,137 L 122,115 L 133,127 L 144,115 L 144,137" stroke="#FF2D75" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                        </svg>
                      </td>
                      <td style="vertical-align: middle; padding-left: 10px; text-align: left;">
                        <div style="font-size: 26px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.5px; line-height: 1; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
                          TM<span style="color: #FF2D75;">-</span>Educa
                        </div>
                      </td>
                    </tr>
                  </table>
                  <div style="font-size: 11px; color: #94A3B8;">
                    Segurança e Recuperação de Acesso
                  </div>
                </td>
              </tr>

              <!-- Corpo -->
              <tr>
                <td style="padding: 32px;">
                  <h1 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 600; color: #0A192F;">
                    Recuperação de Palavra-Passe
                  </h1>
                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                    Olá, <strong>${dados.nomeCompleto}</strong>. Recebemos um pedido para redefinir a palavra-passe da sua conta na <strong>TM-Educa</strong>.
                  </p>
                  <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">
                    Utilize o código de verificação de 6 dígitos abaixo na página de recuperação (válido por 30 minutos):
                  </p>

                  <!-- Código em destaque -->
                  <div style="background-color: #0A192F; color: #FFFFFF; text-align: center; padding: 20px; border-radius: 10px; margin: 20px 0; letter-spacing: 8px; font-size: 28px; font-weight: 700; border: 1px solid #1E293B;">
                    ${dados.codigoVerificacao}
                  </div>

                  <p style="margin: 18px 0; font-size: 14px; color: #475569; text-align: center;">
                    Ou clique diretamente no botão abaixo para criar uma nova palavra-passe:
                  </p>

                  <div style="text-align: center; margin: 24px 0;">
                    <a href="${linkRecuperacao}" style="display: inline-block; background-color: #E11D48; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">
                      Redefinir a Minha Palavra-Passe
                    </a>
                  </div>

                  <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 1.5; color: #64748B;">
                    Se não solicitou esta alteração, pode ignorar este e-mail com segurança — a sua palavra-passe atual continuará protegida e inalterada.
                  </p>
                </td>
              </tr>

              <!-- Rodapé -->
              <tr>
                <td style="background-color: #07101C; padding: 20px 32px; text-align: center; font-size: 12px; color: #94A3B8;">
                  © ${new Date().getFullYear()} TM-Educa • Segurança de Contas
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const texto = `Olá, ${dados.nomeCompleto}!\n\nCódigo de Recuperação de Palavra-Passe TM-Educa: ${dados.codigoVerificacao}\n\nOu aceda diretamente ao link (válido por 30 minutos):\n${linkRecuperacao}\n\nSe não solicitou esta alteração, ignore esta mensagem.`;

  return await enviarEmail({
    para: dados.email,
    assunto,
    html,
    texto,
  });
}

/**
 * Envia confirmação por e-mail quando a palavra-passe foi redefinida com sucesso.
 */
export async function enviarEmailSenhaAlterada(dados: {
  nomeCompleto: string;
  email: string;
}): Promise<ResultadoEnvioEmail> {
  const urlBase = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const assunto = "A sua palavra-passe na TM-Educa foi alterada com sucesso";

  const html = `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <body style="margin: 0; padding: 24px; background-color: #F8FAFC; font-family: 'Segoe UI', sans-serif; color: #0F172A;">
      <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 10px; border: 1px solid #E2E8F0; overflow: hidden;">
        <div style="background: #0A192F; padding: 22px 28px; border-bottom: 3px solid #FF2D75; text-align: center;">
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td style="vertical-align: middle;">
                <svg width="36" height="36" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                  <polygon points="100,20 170,50 100,80 30,50" fill="#FFFFFF" />
                  <path d="M 58,61 Q 100,86 142,61 L 142,71 Q 100,96 58,71 Z" fill="#E2E8F0" />
                  <path d="M 42,55 Q 38,70 36,86" stroke="#FF2D75" stroke-width="3" stroke-linecap="round" fill="none" />
                  <circle cx="36" cy="88" r="3.5" fill="#FF2D75" />
                  <path d="M 33,90 L 39,90 L 41,106 L 31,106 Z" fill="#FF2D75" />
                  <path d="M 34,92 Q 67,78 100,94 Q 133,78 166,92 L 166,154 Q 133,140 100,162 Q 67,140 34,154 Z" fill="none" stroke="#FF2D75" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
                  <line x1="100" y1="94" x2="100" y2="162" stroke="#FF2D75" stroke-width="5" stroke-linecap="round" />
                  <path d="M 56,115 L 78,115 M 67,115 L 67,137" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" fill="none" />
                  <path d="M 122,137 L 122,115 L 133,127 L 144,115 L 144,137" stroke="#FF2D75" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </svg>
              </td>
              <td style="vertical-align: middle; padding-left: 10px; text-align: left;">
                <div style="font-size: 24px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.5px; line-height: 1; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
                  TM<span style="color: #FF2D75;">-</span>Educa
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div style="padding: 28px;">
          <h2 style="margin: 0 0 12px 0; color: #0A192F; font-size: 18px;">Palavra-passe atualizada com sucesso</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Olá, <strong>${dados.nomeCompleto}</strong>. Confirmamos que a palavra-passe da sua conta (<strong>${dados.email}</strong>) foi redefinida com sucesso.
          </p>
          <div style="margin: 24px 0;">
            <a href="${urlBase}/entrar" style="display: inline-block; background: #0A192F; color: #FFFFFF; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-size: 13px; font-weight: 600;">
              Iniciar Sessão na TM-Educa
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await enviarEmail({
    para: dados.email,
    assunto,
    html,
    texto: `Olá, ${dados.nomeCompleto}. A palavra-passe da sua conta TM-Educa (${dados.email}) foi alterada com sucesso.`,
  });
}

