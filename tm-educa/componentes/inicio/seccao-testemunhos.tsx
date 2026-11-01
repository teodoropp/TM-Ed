import React from "react";
import { Star } from "lucide-react";

/**
 * Secção 8: Testemunhos
 * Carrossel infinito duplo (linha superior para a esquerda, linha inferior para a direita).
 * Pausa suave ao passar o cursor para leitura confortável.
 * Bordas rigorosamente em 5px (rounded-[5px]) e tipografia Segoe Regular.
 */
export function SeccaoTestemunhos() {
  const linhaCima = [
    {
      iniciais: "MC",
      nome: "Dra. Marlene Cardoso",
      cargo: "Mãe de aluno do 8.º ano",
      localizacao: "Talatona, Luanda",
      texto:
        "O meu filho estava com grandes dificuldades em Matemática. Com o explicador enviado pela TM-Educa para o domicílio, subiu de nível 2 para nível 4 no 2.º período. O profissionalismo e rigor são exemplares.",
    },
    {
      iniciais: "AA",
      nome: "Eng. António Afonso",
      cargo: "Pai de 2 alunas no 2.º e 3.º Ciclo",
      localizacao: "Kilamba, Luanda",
      texto:
        "A tranquilidade de receber o sumário da sessão no telemóvel logo após a aula é fantástica. Não preciso de adivinhar o que foi lecionado ou se houve dúvidas. Recomendo vivamente.",
    },
    {
      iniciais: "TS",
      nome: "Dra. Teresa Sebastião",
      cargo: "Encarregada de aluna do 11.º ano",
      localizacao: "Maianga, Luanda",
      texto:
        "Recorremos às aulas online de Físico-Química e Biologia para a preparação para os exames nacionais. O quadro interativo e a metodologia permitiram desbloquear matérias essenciais. Média final excelente!",
    },
    {
      iniciais: "GR",
      nome: "Dr. Gonçalo Ribeiro",
      cargo: "Pai de aluno do 10.º ano",
      localizacao: "Miramar, Luanda",
      texto:
        "A transição para o secundário causou um choque inicial nas notas. Em apenas 3 meses com a explicadora de Geometria Descritiva da TM, o meu filho recuperou a confiança e fechou o ano com 17 valores.",
    },
  ];

  const linhaBaixo = [
    {
      iniciais: "IM",
      nome: "Prof.ª Isabel Meireles",
      cargo: "Mãe de aluna do 6.º ano",
      localizacao: "Belas, Luanda",
      texto:
        "Como professora, sou extremamente exigente com a didática. Fiquei impressionada com a paciência e a estrutura do explicador de Português e Inglês. A minha filha adora as sessões semanais.",
    },
    {
      iniciais: "TL",
      nome: "Arq. Tiago Lourenço",
      cargo: "Pai de aluno do 12.º ano",
      localizacao: "Viana, Luanda",
      texto:
        "O objetivo era ingressar em Engenharia na Universidade Agostinho Neto. A preparação intensiva para o Exame Nacional de Matemática A foi decisiva para garantir a vaga na primeira fase. Serviço de acompanhamento irrepreensível.",
    },
    {
      iniciais: "SC",
      nome: "Dra. Sofia Carvalheiro",
      cargo: "Mãe de aluno do 4.º ano",
      localizacao: "Camama, Luanda",
      texto:
        "O apoio ao estudo e a consolidação do raciocínio no 1.º Ciclo foram determinantes. Notámos uma autonomia muito maior nos trabalhos de casa e excelente à-vontade nas fichas de avaliação.",
    },
    {
      iniciais: "MV",
      nome: "Eng. Miguel Vasconcelos",
      cargo: "Pai de aluno do 9.º ano",
      localizacao: "Rangel, Luanda",
      texto:
        "A garantia de substituição em caso de falta dá-nos uma segurança tremenda. Nunca tivemos uma semana perdida e o acompanhamento pedagógico esteve sempre próximo da nossa família.",
    },
  ];

  return (
    <section
      id="testemunhos"
      className="w-full py-12 sm:py-16 lg:py-20 font-normal overflow-hidden scroll-mt-20"
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      {/* CABEÇALHO DA SECÇÃO */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-[2px] bg-[#FF2D75] rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-[#FF2D75] font-semibold">
              TESTEMUNHOS REAIS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[35px] font-normal text-[#0A192F] dark:text-white tracking-normal leading-[1.15]">
            A confiança de famílias que{" "}
            <span className="text-[#FF2D75]">veem a evolução diária</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Conheça a experiência de pais que confiaram o futuro escolar dos seus filhos à metodologia da TM-Educa.
          </p>
        </div>
      </div>

      {/* ÁREA DOS CARROSSEIS AUTOMÁTICOS INFINITOS (DUPLA LINHA) */}
      <div className="relative w-full overflow-hidden py-2 space-y-5">
        {/* GRADIENTES SUAVES LATERAIS PARA TRANSIÇÃO FLUIDA */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-[#060a12] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-[#060a12] to-transparent z-10" />

        {/* LINHA 1 (SUPERIOR): CARROSSEL AUTOMÁTICO PARA A ESQUERDA */}
        <div className="animate-marquee-left flex gap-5">
          {[...linhaCima, ...linhaCima].map((t, idx) => (
            <div
              key={`cima-${idx}`}
              className="w-[320px] sm:w-[380px] shrink-0 p-6 rounded-[5px] bg-white dark:bg-[#07182E] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-[#FF2D75]/40 transition-all flex flex-col justify-between space-y-4 select-none"
            >
              <div className="space-y-3">
                {/* ESTRELAS */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#FF2D75] text-[#FF2D75]"
                    />
                  ))}
                </div>

                {/* TEXTO DO DEPOIMENTO */}
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  &ldquo;{t.texto}&rdquo;
                </p>
              </div>

              {/* AUTOR DO DEPOIMENTO */}
              <div className="flex items-center gap-3 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-9 h-9 rounded-[5px] bg-[#FFF1F5] dark:bg-[#FF2D75]/15 text-[#FF2D75] flex items-center justify-center font-semibold text-xs shrink-0">
                  {t.iniciais}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0A192F] dark:text-white truncate">
                    {t.nome}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate">
                    {t.cargo} • {t.localizacao}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LINHA 2 (INFERIOR): CARROSSEL AUTOMÁTICO PARA A DIREITA */}
        <div className="animate-marquee-right flex gap-5">
          {[...linhaBaixo, ...linhaBaixo].map((t, idx) => (
            <div
              key={`baixo-${idx}`}
              className="w-[320px] sm:w-[380px] shrink-0 p-6 rounded-[5px] bg-white dark:bg-[#07182E] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-[#FF2D75]/40 transition-all flex flex-col justify-between space-y-4 select-none"
            >
              <div className="space-y-3">
                {/* ESTRELAS */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#FF2D75] text-[#FF2D75]"
                    />
                  ))}
                </div>

                {/* TEXTO DO DEPOIMENTO */}
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  &ldquo;{t.texto}&rdquo;
                </p>
              </div>

              {/* AUTOR DO DEPOIMENTO */}
              <div className="flex items-center gap-3 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-9 h-9 rounded-[5px] bg-[#FFF1F5] dark:bg-[#FF2D75]/15 text-[#FF2D75] flex items-center justify-center font-semibold text-xs shrink-0">
                  {t.iniciais}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0A192F] dark:text-white truncate">
                    {t.nome}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate">
                    {t.cargo} • {t.localizacao}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
