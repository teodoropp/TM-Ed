/**
 * Utilitário para o Mecanismo 2:
 * Confirmação Cruzada e Validação de Aulas com o Encarregado de Educação via WhatsApp
 */

export interface DadosValidacaoAulaWhatsApp {
  alunoNome: string;
  disciplinaNome: string;
  dataHoraInicio: Date | string;
  sumario?: string | null;
  trabalhosDeCasa?: string | null;
  encarregadoNome?: string | null;
  encarregadoTelefone?: string | null;
  professorNome?: string | null;
}

export function gerarTextoValidacaoEncarregado(dados: DadosValidacaoAulaWhatsApp): string {
  const data = new Intl.DateTimeFormat("pt-AO", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dados.dataHoraInicio));

  const saudacao = dados.encarregadoNome
    ? `Olá, Estimado(a) Sr(a). ${dados.encarregadoNome}!`
    : "Olá, Estimado(a) Encarregado(a)!";

  let msg = `${saudacao}\n\n`;
  msg += `📚 *TM-Educa Angola — Confirmação de Aula Realizada*\n\n`;
  msg += `Informamos que a sessão de explicações foi concluída:\n`;
  msg += `• *Educando:* ${dados.alunoNome}\n`;
  msg += `• *Disciplina:* ${dados.disciplinaNome}\n`;
  msg += `• *Data e Hora:* ${data}\n`;
  if (dados.professorNome) {
    msg += `• *Explicador:* Prof. ${dados.professorNome}\n`;
  }

  if (dados.sumario && dados.sumario.trim().length > 0) {
    msg += `\n📖 *Sumário Lecionado:*\n"${dados.sumario.trim()}"\n`;
  }

  if (dados.trabalhosDeCasa && dados.trabalhosDeCasa.trim().length > 0) {
    msg += `\n📝 *Trabalhos de Casa (TPC):*\n"${dados.trabalhosDeCasa.trim()}"\n`;
  }

  msg += `\n✅ *Validação de Presença (Mecanismo 2):*\n`;
  msg += `Por favor, responda a esta mensagem com *"Confirmado"* para validar a realização da aula no sistema TM-Educa.\n\n`;
  msg += `Agradecemos a confiança na TM-Educa!`;

  return msg;
}

export function abrirWhatsAppValidacaoEncarregado(dados: DadosValidacaoAulaWhatsApp): boolean {
  if (!dados.encarregadoTelefone) {
    alert("O encarregado de educação não tem contacto telefónico cadastrado no sistema.");
    return false;
  }

  let tel = dados.encarregadoTelefone.replace(/\D/g, "");
  if (!tel.startsWith("244")) {
    tel = `244${tel}`;
  }

  const texto = gerarTextoValidacaoEncarregado(dados);
  const url = `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;

  window.open(url, "_blank");
  return true;
}
