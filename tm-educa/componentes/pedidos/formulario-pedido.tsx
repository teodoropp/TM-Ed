"use client";

import React, { useState, useMemo } from "react";
import { acaoCriarPedido } from "@/modulos/pedidos/acoes";
import { formatarKz, calcularEstimativaMultiplosServicos } from "@/regras/calculo-preco";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo, CartaoDescricao } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { Input } from "@/componentes/ui/input";
import { ModalidadeAula, ObjetivoPedagogico } from "@prisma/client";
import {
  GraduationCap,
  BookOpen,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  Loader2,
  Check,
  ChevronDown,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ModalComprovativoPedidoPDF } from "./ModalComprovativoPedidoPDF";

export interface AlunoOpcao {
  id: string;
  nomeCompleto: string;
  anoEscolar: string;
  sistemaEnsino?: string | null;
}

export interface DisciplinaOpcao {
  id: string;
  nome: string;
}

export interface PrecoAnoOpcao {
  /** Identificador do ano no catálogo curricular (CatalogoAnoEscolar). */
  anoId: string;
  /** Nome canónico do ano (ex.: "7.º Ano"). */
  anoNome: string;
  /** Ciclo a que o ano pertence, para apresentação. */
  cicloNome?: string;
  precos: {
    duracaoMinutos: number;
    precoPorAulaKz: number;
  }[];
}

interface PropsFormularioPedido {
  alunos: AlunoOpcao[];
  disciplinas: DisciplinaOpcao[];
  precosPorAno: PrecoAnoOpcao[];
  moradaPredefinida?: {
    municipio?: string | null;
    bairro?: string | null;
    endereco?: string | null;
  };
}

/** Normaliza o ano do filho para o nome canónico do catálogo (sem o ciclo). */
function normalizarAno(ano: string | undefined | null): string {
  if (!ano) return "";
  return ano.replace(/\s*\(.*\)\s*$/, "").trim();
}

/**
 * Núcleo curricular do II Ciclo do Ensino Secundário.
 *
 * A partir do 10.º ano os alunos frequentam cursos diferentes, pelo que
 * além do núcleo comum o pai indica as restantes disciplinas no campo de texto.
 */
const NUCLEO_II_CICLO = ["Matemática", "Física", "Língua Portuguesa"];

/** Nome do ciclo do II Ciclo, tal como está no catálogo. */
const CICLO_II_SECUNDARIO = "II Ciclo do Ensino Secundário";

/**
 * Períodos e horas de início disponíveis para as aulas.
 *
 * O pai escolhe primeiro o período (Manhã, Tarde, Noite ou Sábado) e depois a
 * hora exacta dentro desse período. O fim da sessão é calculado
 * automaticamente a partir da duração escolhida na secção 3.
 */
const PERIODOS_HORARIOS = [
  {
    id: "manha",
    rotulo: "Manhã",
    horas: ["07:00", "08:00", "09:00", "10:00"],
  },
  {
    id: "tarde",
    rotulo: "Tarde",
    horas: ["13:00", "14:00", "15:00", "16:00"],
  },
  {
    id: "noite",
    rotulo: "Noite",
    horas: ["17:00", "18:00", "19:00", "20:00"],
  },
  {
    id: "sabado",
    rotulo: "Sábado",
    horas: ["08:00", "09:00", "10:00", "11:00"],
  },
];

/** Calcula a hora de fim somando a duração da sessão à hora de início. */
function calcularHoraFim(horaInicio: string, duracaoMinutos: number): string {
  const [h, m] = horaInicio.split(":").map((n) => parseInt(n, 10));
  const total = h * 60 + m + duracaoMinutos;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function FormularioPedido({
  alunos,
  disciplinas,
  precosPorAno,
  moradaPredefinida,
}: PropsFormularioPedido) {
  const router = useRouter();

  // Estados do Formulário
  const [alunoId, setAlunoId] = useState<string>(alunos[0]?.id || "");
  /**
   * Modo de selecção das disciplinas:
   *  - "todas": contrato com todas as disciplinas disponíveis (predefinição);
   *  - "personalizar": o pai escolhe individualmente as disciplinas.
   */
  const [modoDisciplinas, setModoDisciplinas] = useState<"todas" | "personalizar">(
    "todas"
  );
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<string[]>(
    []
  );
  /** Disciplinas extra escritas pelo pai (II Ciclo — cursos diferentes). */
  const [disciplinasAdicionais, setDisciplinasAdicionais] = useState<string>("");
  const [menuDisciplinasAberto, setMenuDisciplinasAberto] = useState(false);
  const refMenuDisciplinas = React.useRef<HTMLDivElement>(null);
  const [modalidade, setModalidade] = useState<ModalidadeAula>(ModalidadeAula.Domicilio);
  const [duracaoMinutos, setDuracaoMinutos] = useState<number>(60);
  const [frequenciaSemanal, setFrequenciaSemanal] = useState<number>(3);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>(["Segunda", "Quarta", "Sexta"]);
  const [periodoHorario, setPeriodoHorario] = useState<string>(PERIODOS_HORARIOS[1].id);
  const [horaInicio, setHoraInicio] = useState<string>(PERIODOS_HORARIOS[1].horas[2]);
  const [objetivo, setObjetivo] = useState<ObjetivoPedagogico>(ObjetivoPedagogico.AcompanhamentoContinuo);
  const [observacoes, setObservacoes] = useState<string>("");

  // Morada (pré-preenchida com o perfil do pai)
  const [municipio, setMunicipio] = useState<string>(moradaPredefinida?.municipio || "Luanda");
  const [bairro, setBairro] = useState<string>(moradaPredefinida?.bairro || "");
  const [endereco, setEndereco] = useState<string>(moradaPredefinida?.endereco || "");

  const [aSubmeter, setASubmeter] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [modalComprovativoAberto, setModalComprovativoAberto] = useState(false);

  /* Aluno selecionado. */
  const alunoSelecionado = useMemo(
    () => alunos.find((a) => a.id === alunoId),
    [alunos, alunoId]
  );

  /**
   * Ano escolar em vigor. É independente do ano registado no perfil do filho:
   * o pai pode contratar apoio para um ano diferente (ex.: o filho acabou de
   * avançar de classe). Determina o preço por aula e, com este, o total.
   */
  const [anoEscolarId, setAnoEscolarId] = useState<string>("");

  /** Ano canónico do filho, normalizado para o catálogo. */
  const anoDoFilho = useMemo(
    () => normalizarAno(alunoSelecionado?.anoEscolar),
    [alunoSelecionado]
  );

  /** Ano escolar selecionado (dados do catálogo de preços). */
  const anoSelecionado = useMemo(
    () => precosPorAno.find((p) => p.anoId === anoEscolarId),
    [precosPorAno, anoEscolarId]
  );

  /**
   * No II Ciclo do Ensino Secundário só o núcleo comum é seleccionável —
   * as restantes disciplinas do curso são escritas pelo pai.
   */
  const ehIIciclo = anoSelecionado?.cicloNome === CICLO_II_SECUNDARIO;

  /** Disciplinas disponíveis para o ano escolar escolhido. */
  const disciplinasDisponiveis = useMemo(() => {
    if (!ehIIciclo) return disciplinas;
    return disciplinas.filter((d) => NUCLEO_II_CICLO.includes(d.nome));
  }, [disciplinas, ehIIciclo]);

  /** Fecha o menu de disciplinas ao clicar fora ou ao premir ESC. */
  React.useEffect(() => {
    if (!menuDisciplinasAberto) return;

    function aoClicarFora(evento: MouseEvent) {
      if (
        refMenuDisciplinas.current &&
        !refMenuDisciplinas.current.contains(evento.target as Node)
      ) {
        setMenuDisciplinasAberto(false);
      }
    }

    function aoPremirEsc(evento: KeyboardEvent) {
      if (evento.key === "Escape") setMenuDisciplinasAberto(false);
    }

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoPremirEsc);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoPremirEsc);
    };
  }, [menuDisciplinasAberto]);

  /**
   * Ao trocar de ano escolar, as disciplinas seleccionadas são reconciliadas
   * com as disponíveis para o novo ciclo.
   */
  const [anoAplicado, setAnoAplicado] = useState<string>("");
  if (anoAplicado !== anoEscolarId) {
    setAnoAplicado(anoEscolarId);
    setDisciplinasSelecionadas((atuais) => {
      const validas = atuais.filter((id) =>
        disciplinasDisponiveis.some((d) => d.id === id)
      );
      if (validas.length > 0) return validas;
      return disciplinasDisponiveis.map((d) => d.id);
    });
    if (!ehIIciclo) setDisciplinasAdicionais("");
  }

  /**
   * Alterna entre "Todas as disciplinas" e "Personalizar selecção".
   * Ao passar para personalizado, as disciplinas ficam todas marcadas para
   * que o pai apenas desligue as que não pretende.
   */
  function definirModoDisciplinas(modo: "todas" | "personalizar") {
    setModoDisciplinas(modo);
    if (modo === "personalizar") {
      setDisciplinasSelecionadas((atuais) => {
        const validas = atuais.filter((id) =>
          disciplinasDisponiveis.some((d) => d.id === id)
        );
        return validas.length > 0
          ? validas
          : disciplinasDisponiveis.map((d) => d.id);
      });
    }
  }

  /**
   * Ao trocar de filho, o ano acompanha automaticamente o ano registado no
   * perfil (mantendo a escolha manual sempre que o pai a alterar).
   */
  function aoSelecionarAluno(novoAlunoId: string) {
    setAlunoId(novoAlunoId);
    const novoAluno = alunos.find((a) => a.id === novoAlunoId);
    const anoCorrespondente = precosPorAno.find(
      (p) => p.anoNome === normalizarAno(novoAluno?.anoEscolar)
    );
    if (anoCorrespondente) setAnoEscolarId(anoCorrespondente.anoId);
  }

  /** Período seleccionado e as horas disponíveis dentro dele. */
  const periodoSelecionado = useMemo(
    () =>
      PERIODOS_HORARIOS.find((p) => p.id === periodoHorario) ??
      PERIODOS_HORARIOS[0],
    [periodoHorario]
  );

  /** Ao trocar de período, a hora passa para a primeira hora desse período. */
  function aoSelecionarPeriodo(periodoId: string) {
    setPeriodoHorario(periodoId);
    const novoPeriodo = PERIODOS_HORARIOS.find((p) => p.id === periodoId);
    if (novoPeriodo) setHoraInicio(novoPeriodo.horas[0]);
  }

  /** Hora de fim da sessão, calculada a partir da hora de início e da duração. */
  const horaFim = useMemo(
    () => calcularHoraFim(horaInicio, duracaoMinutos),
    [horaInicio, duracaoMinutos]
  );

  /**
   * Horário preferencial gravado no pedido.
   * Mantém o formato "Período (HH:MM - HH:MM)", lido pelo gerador de
   * calendário para fixar a hora de início de cada sessão.
   */
  const horarioPreferencial = `${periodoSelecionado.rotulo} (${horaInicio} - ${horaFim})`;

  /* Preço por aula correspondente ao ano e à duração escolhidos. */
  const precoAulaUnitario = useMemo(() => {
    if (!anoSelecionado) return 0;
    const itemPreco = anoSelecionado.precos.find(
      (p) => p.duracaoMinutos === duracaoMinutos
    );
    return itemPreco ? itemPreco.precoPorAulaKz : 0;
  }, [anoSelecionado, duracaoMinutos]);

  /**
   * Disciplinas que entram no pedido: todas as disponíveis (modo "todas") ou
   * apenas as escolhidas individualmente (modo "personalizar").
   */
  const disciplinasEfectivas = useMemo(
    () =>
      modoDisciplinas === "todas"
        ? disciplinasDisponiveis
        : disciplinasSelecionadas
            .map((id) => disciplinas.find((d) => d.id === id))
            .filter((d): d is DisciplinaOpcao => Boolean(d)),
    [modoDisciplinas, disciplinasDisponiveis, disciplinasSelecionadas, disciplinas]
  );

  /**
   * Estimativa mensal oficial do acompanhamento escolar.
   * Regra oficial TM-Educa: O valor é fixado por ano de escolaridade e duração da aula,
   * multiplicado pela frequência semanal e 4 semanas do mês.
   * A quantidade de disciplinas escolhidas NÃO altera o valor — todas as disciplinas
   * curriculares selecionadas estão integradas no mesmo plano.
   */
  const totalAulasMes = frequenciaSemanal * 4;
  const estimativaMensalTotal = useMemo(() => {
    return precoAulaUnitario * totalAulasMes;
  }, [precoAulaUnitario, totalAulasMes]);

  /* Ano inicial: o do primeiro filho registado. */
  const anoInicial = useMemo(() => {
    const primeiro = alunos[0];
    const correspondente = precosPorAno.find(
      (p) => p.anoNome === normalizarAno(primeiro?.anoEscolar)
    );
    return correspondente?.anoId ?? precosPorAno[0]?.anoId ?? "";
  }, [alunos, precosPorAno]);

  /* Sincroniza o ano inicial com o primeiro filho. */
  const [anoInicialAplicado, setAnoInicialAplicado] = useState(false);
  if (!anoInicialAplicado && anoInicial) {
    setAnoInicialAplicado(true);
    if (!anoEscolarId) setAnoEscolarId(anoInicial);
  }

  function alternarDia(dia: string) {
    if (diasSelecionados.includes(dia)) {
      if (diasSelecionados.length > 1) {
        setDiasSelecionados(diasSelecionados.filter((d) => d !== dia));
      }
    } else {
      setDiasSelecionados([...diasSelecionados, dia]);
    }
  }

  function alternarDisciplina(disciplinaId: string) {
    setDisciplinasSelecionadas((atuais) =>
      atuais.includes(disciplinaId)
        ? atuais.filter((d) => d !== disciplinaId)
        : [...atuais, disciplinaId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!alunoId || !anoEscolarId || disciplinasEfectivas.length === 0) {
      setErro(
        "Por favor, selecione o filho, o ano escolar e pelo menos uma disciplina."
      );
      return;
    }

    setASubmeter(true);
    setErro(null);

    const res = await acaoCriarPedido({
      alunoId,
      anoEscolarId,
      disciplinasIds: disciplinasEfectivas.map((d) => d.id),
      disciplinasAdicionais: ehIIciclo ? disciplinasAdicionais : undefined,
      modalidade,
      duracaoMinutos,
      frequenciaSemanal,
      diasSemana: diasSelecionados.join(", "),
      horarioPreferencial,
      objetivo,
      observacoes,
      municipio: modalidade === "Domicilio" ? municipio : undefined,
      bairro: modalidade === "Domicilio" ? bairro : undefined,
      endereco: modalidade === "Domicilio" ? endereco : undefined,
    });

    setASubmeter(false);

    if (res.sucesso && res.pedidoId) {
      router.push(`/portal-encarregado/pedidos/${res.pedidoId}`);
    } else {
      setErro(res.mensagem);
    }
  }

  const classeSelect =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Filho, Ano e Disciplinas */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoCabecalho>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <CartaoTitulo className="text-base font-bold">
              1. Filho, Ano e Disciplinas
            </CartaoTitulo>
          </div>
          <CartaoDescricao>
            Indique quem recebe o apoio, em que ano escolar e em que matérias.
            Pode escolher várias disciplinas de uma vez.
          </CartaoDescricao>
        </CartaoCabecalho>
        <CartaoConteudo className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Filho *
              </label>
              <select
                value={alunoId}
                onChange={(e) => aoSelecionarAluno(e.target.value)}
                className={classeSelect}
                required
              >
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nomeCompleto}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ano Escolar *
              </label>
              <select
                value={anoEscolarId}
                onChange={(e) => setAnoEscolarId(e.target.value)}
                className={classeSelect}
                required
              >
                {precosPorAno.map((ano) => (
                  <option key={ano.anoId} value={ano.anoId}>
                    {ano.anoNome}
                    {ano.cicloNome ? ` — ${ano.cicloNome}` : ""}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                {anoDoFilho && anoDoFilho !== anoSelecionado?.anoNome
                  ? `O perfil do filho indica "${anoDoFilho}".`
                  : "Define o preço por aula e o total mensal."}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {ehIIciclo ? "Núcleo Curricular *" : "Disciplinas Curriculares *"}
              </label>
              <p className="text-[11px] text-slate-500">
                {ehIIciclo
                  ? "No II Ciclo, todos seguem Matemática, Física e Português. As restantes disciplinas do curso são indicadas abaixo."
                  : "Por defeito, o pedido inclui todas as disciplinas. Escolha \"Personalizar\" para indicar apenas as pretendidas."}
              </p>
            </div>
          </div>

          {/* DROPDOWN MULTI-SELECT DE DISCIPLINAS */}
          <div className="relative" ref={refMenuDisciplinas}>
            <button
              type="button"
              onClick={() => setMenuDisciplinasAberto((aberto) => !aberto)}
              aria-haspopup="listbox"
              aria-expanded={menuDisciplinasAberto}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <span className="min-w-0 truncate">
                {modoDisciplinas === "todas"
                  ? ehIIciclo
                    ? "Todo o núcleo curricular"
                    : "Todas as disciplinas"
                  : disciplinasSelecionadas.length === 0
                  ? "Seleccione as disciplinas"
                  : disciplinasSelecionadas.length === 1
                  ? disciplinas.find((d) => d.id === disciplinasSelecionadas[0])?.nome
                  : `${disciplinasSelecionadas.length} disciplinas seleccionadas`}
              </span>

              <span className="flex shrink-0 items-center gap-2">
                {modoDisciplinas === "todas" ? (
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    {disciplinasDisponiveis.length}
                  </span>
                ) : (
                  disciplinasSelecionadas.length > 0 && (
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      {disciplinasSelecionadas.length}
                    </span>
                  )
                )}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-slate-400 transition-transform duration-200",
                    menuDisciplinasAberto && "rotate-180"
                  )}
                />
              </span>
            </button>

            {menuDisciplinasAberto && (
              <div className="absolute left-0 right-0 z-30 mt-1.5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                {/* DUAS OPCÕES: TODAS OU PERSONALIZAR */}
                <div className="border-b border-slate-100 p-1.5 dark:border-slate-800">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={modoDisciplinas === "todas"}
                    onClick={() => definirModoDisciplinas("todas")}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors ${
                      modoDisciplinas === "todas"
                        ? "bg-emerald-50 dark:bg-emerald-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        modoDisciplinas === "todas"
                          ? "border-emerald-600"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {modoDisciplinas === "todas" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900 dark:text-white">
                        {ehIIciclo ? "Todo o núcleo curricular" : "Todas as disciplinas"}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {disciplinasDisponiveis.length} disciplinas do catálogo
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={modoDisciplinas === "personalizar"}
                    onClick={() => definirModoDisciplinas("personalizar")}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors ${
                      modoDisciplinas === "personalizar"
                        ? "bg-emerald-50 dark:bg-emerald-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        modoDisciplinas === "personalizar"
                          ? "border-emerald-600"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {modoDisciplinas === "personalizar" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900 dark:text-white">
                        Personalizar selecção
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        Escolher apenas as disciplinas pretendidas
                      </span>
                    </span>
                  </button>
                </div>

                {/* LISTA DE DISCIPLINAS (MODO PERSONALIZAR) */}
                {modoDisciplinas === "personalizar" && (
                  <>
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/50">
                      <button
                        type="button"
                        onClick={() =>
                          setDisciplinasSelecionadas(
                            disciplinasDisponiveis.map((d) => d.id)
                          )
                        }
                        className="text-[11px] font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                      >
                        Seleccionar todas
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisciplinasSelecionadas([])}
                        className="text-[11px] font-semibold text-slate-500 hover:underline dark:text-slate-400"
                      >
                        Limpar
                      </button>
                    </div>

                    <ul
                      role="listbox"
                      aria-multiselectable="true"
                      className="sem-barra max-h-56 overflow-y-auto py-1"
                    >
                      {disciplinasDisponiveis.map((disc) => {
                        const selecionada = disciplinasSelecionadas.includes(disc.id);
                        return (
                          <li key={disc.id} role="option" aria-selected={selecionada}>
                            <button
                              type="button"
                              onClick={() => alternarDisciplina(disc.id)}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            >
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                  selecionada
                                    ? "border-emerald-600 bg-emerald-600 text-white"
                                    : "border-slate-300 dark:border-slate-600"
                                }`}
                              >
                                {selecionada && <Check className="h-3 w-3" />}
                              </span>
                              <span
                                className={
                                  selecionada
                                    ? "font-medium text-slate-900 dark:text-white"
                                    : "text-slate-600 dark:text-slate-300"
                                }
                              >
                                {disc.nome}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          {/* DISCIPLINAS ADICIONAIS (II CICLO) */}
          {ehIIciclo && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Outras disciplinas do curso
              </label>
              <textarea
                rows={2}
                value={disciplinasAdicionais}
                onChange={(e) => setDisciplinasAdicionais(e.target.value)}
                placeholder="Ex.: Economia, Geometria Técnica, Banca e Sistemas..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <p className="text-[11px] text-slate-500">
                Separe por vírgula. A coordenação pedagógica confirma estas
                disciplinas antes do matching.
              </p>
            </div>
          )}

          {modoDisciplinas === "personalizar" && disciplinasSelecionadas.length === 0 && (
            <p className="text-[11px] font-medium text-rose-600">
              Seleccione pelo menos uma disciplina para continuar.
            </p>
          )}
        </CartaoConteudo>
      </Cartao>

      {/* 2. Modalidade e Localização */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoCabecalho>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <CartaoTitulo className="text-base font-bold">2. Modalidade e Local das Aulas</CartaoTitulo>
          </div>
          <CartaoDescricao>Onde prefere que as sessões sejam lecionadas?</CartaoDescricao>
        </CartaoCabecalho>
        <CartaoConteudo className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: ModalidadeAula.Domicilio,
                titulo: "Ao Domicílio (Luanda)",
                desc: "Explicador credenciado desloca-se com segurança à sua residência",
              },
              {
                id: ModalidadeAula.Online,
                titulo: "Aulas Online Interativas",
                desc: "Sessões digitais com quadro interativo e flexibilidade para todo o país",
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setModalidade(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  modalidade === item.id
                    ? "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <p className="font-bold text-sm text-slate-900 dark:text-white">{item.titulo}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          {modalidade === ModalidadeAula.Domicilio && (
            <div className="pt-2 grid grid-cols-1 gap-4 border-t border-slate-100 dark:border-slate-800 mt-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Município *
                </label>
                <Input
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  placeholder="Ex: Luanda, Talatona, Kilamba Kiaxi..."
                  required={modalidade === ModalidadeAula.Domicilio}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Bairro *
                </label>
                <Input
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex: Alvalade, Miramar, Benfica..."
                  required={modalidade === ModalidadeAula.Domicilio}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Endereço / Rua
                </label>
                <Input
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Rua Comandante Gika, Casa 12 (junto à escola)"
                />
              </div>
            </div>
          )}
        </CartaoConteudo>
      </Cartao>

      {/* 3. Duração e Horários Pretendidos */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoCabecalho>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <CartaoTitulo className="text-base font-bold">3. Duração e Horários Pretendidos</CartaoTitulo>
          </div>
          <CartaoDescricao>Defina o ritmo pedagógico ideal para o seu filho.</CartaoDescricao>
        </CartaoCabecalho>
        <CartaoConteudo className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Duração por Aula */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duração da Sessão
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { min: 60, rotulo: "1 Hora (60 min)" },
                  { min: 90, rotulo: "1h30 (90 min)" },
                  { min: 120, rotulo: "2 Horas (120 min)" },
                ].map((item) => (
                  <button
                    key={item.min}
                    type="button"
                    onClick={() => setDuracaoMinutos(item.min)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all text-center ${
                      duracaoMinutos === item.min
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {item.rotulo}
                  </button>
                ))}
              </div>
            </div>

            {/* Dias Úteis por Semana */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Dias Úteis por Semana
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequenciaSemanal(freq)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all text-center ${
                      frequenciaSemanal === freq
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {freq}x / semana
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dias da Semana */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Dias de Preferência para as Aulas
            </label>
            <div className="flex flex-wrap gap-2">
              {["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"].map((dia) => {
                const rotulos: Record<string, string> = {
                  Segunda: "Segunda-feira",
                  Terca: "Terça-feira",
                  Quarta: "Quarta-feira",
                  Quinta: "Quinta-feira",
                  Sexta: "Sexta-feira",
                  Sabado: "Sábado",
                };
                const selecionado = diasSelecionados.includes(dia);
                return (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => alternarDia(dia)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      selecionado
                        ? "bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
                        : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {rotulos[dia]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* HORÁRIO: 1) PERÍODO  2) HORA EXACTA */}
          <div className="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
            {/* Passo 1 — Período */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                Período Preferencial
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PERIODOS_HORARIOS.map((periodo) => {
                  const selecionado = periodoHorario === periodo.id;
                  return (
                    <button
                      key={periodo.id}
                      type="button"
                      onClick={() => aoSelecionarPeriodo(periodo.id)}
                      className={`rounded-lg border px-3 py-2.5 text-center transition-all ${
                        selecionado
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40"
                          : "border-slate-300 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800"
                      }`}
                    >
                      <span
                        className={`block text-xs font-bold ${
                          selecionado
                            ? "text-emerald-800 dark:text-emerald-300"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {periodo.rotulo}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {periodo.horas[0]} - {periodo.horas[periodo.horas.length - 1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Passo 2 — Hora exacta dentro do período */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                Hora de Início da Aula
                <span className="font-normal text-slate-400">
                  (período: {periodoSelecionado.rotulo})
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {periodoSelecionado.horas.map((hora) => {
                  const selecionado = horaInicio === hora;
                  const fim = calcularHoraFim(hora, duracaoMinutos);
                  return (
                    <button
                      key={hora}
                      type="button"
                      onClick={() => setHoraInicio(hora)}
                      className={`rounded-lg border px-3 py-2 text-center transition-all ${
                        selecionado
                          ? "border-emerald-500 bg-emerald-600 text-white shadow-sm"
                          : "border-slate-300 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      <span className="block text-sm font-bold">{hora}</span>
                      <span
                        className={`block text-[10px] ${
                          selecionado ? "text-emerald-50" : "text-slate-500"
                        }`}
                      >
                        até {fim}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500">
                Sessão de {duracaoMinutos} min:{" "}
                <strong className="text-slate-700 dark:text-slate-300">
                  {horaInicio} - {horaFim}
                </strong>{" "}
                em {periodoSelecionado.rotulo.toLowerCase()}.
              </p>
            </div>
          </div>
        </CartaoConteudo>
      </Cartao>

      {/* 4. Objetivo Pedagógico e Observações */}
      <Cartao className="border-slate-200 dark:border-slate-800">
        <CartaoCabecalho>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <CartaoTitulo className="text-base font-bold">4. Foco Pedagógico</CartaoTitulo>
          </div>
          <CartaoDescricao>Orientações e metas para a direção pedagógica e o explicador.</CartaoDescricao>
        </CartaoCabecalho>
        <CartaoConteudo className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Objetivo Principal *
            </label>
            <select
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value as ObjetivoPedagogico)}
              className={classeSelect}
            >
              <option value={ObjetivoPedagogico.AcompanhamentoContinuo}>Acompanhamento Contínuo e Apoio aos Trabalhos de Casa</option>
              <option value={ObjetivoPedagogico.MelhoriaNotas}>Melhoria Rápida de Notas</option>
              <option value={ObjetivoPedagogico.PreparacaoTestes}>Preparação Intensiva para Testes e Provas</option>
              <option value={ObjetivoPedagogico.PreparacaoExames}>Preparação para Exames Nacionais e Admissão</option>
              <option value={ObjetivoPedagogico.RecuperacaoMateria}>Recuperação de Matéria em Atraso</option>
              <option value={ObjetivoPedagogico.Outro}>Outro Objetivo Específico</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Observações ou Recomendações Adicionais
            </label>
            <textarea
              rows={3}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: O aluno tem maior facilidade com geometria, mas precisa de apoio reforçado em equações..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </CartaoConteudo>
      </Cartao>

      {/* Resumo do Investimento Oficial & Submissão */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-100 dark:to-slate-800/80 border border-emerald-200 dark:border-emerald-800/60 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/60 dark:border-emerald-800/40 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Preço Unitário Regulamentado
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {formatarKz(precoAulaUnitario)} <span className="text-xs font-normal text-slate-500">/ aula</span>
            </p>
            <p className="text-xs text-slate-500">
              {anoSelecionado?.anoNome ?? "Sem ano definido"} · {duracaoMinutos} min ·{" "}
              {modalidade === "Domicilio" ? "Ao domicílio" : "Online"}
            </p>
            <p className="text-xs text-slate-500">
              {periodoSelecionado.rotulo} · {horaInicio} - {horaFim} ·{" "}
              {frequenciaSemanal} aulas por semana ({diasSelecionados.length} dias)
            </p>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Estimativa Mensal Oficial
            </span>
            <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
              {formatarKz(estimativaMensalTotal)}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Valor fixado por ano de escolaridade · {totalAulasMes} aulas no mês (4 semanas)
            </p>
          </div>
        </div>

        {/* DISCIPLINAS ABRANGIDAS NO PLANO CURRICULAR */}
        {disciplinasEfectivas.length > 0 && (
          <div className="rounded-xl border border-emerald-200/70 bg-white/70 p-4 dark:border-emerald-800/50 dark:bg-slate-900/40 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/50 dark:border-emerald-800/40 pb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[#FF2D75]" />
                Disciplinas Abrangidas no Plano ({disciplinasEfectivas.length})
              </p>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                ✓ Valor único por ano (Sem custo adicional por disciplina)
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-0.5">
              {disciplinasEfectivas.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/70 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 dark:border-emerald-800/50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  {item.nome}
                </span>
              ))}
              {ehIIciclo && disciplinasAdicionais && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/70 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-900 dark:text-amber-200 dark:border-amber-800/50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                  + {disciplinasAdicionais}
                </span>
              )}
            </div>

            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 italic">
              Conforme a regulamentação TM-Educa, o valor do serviço é por ano de escolaridade e carga horária semanal ({frequenciaSemanal} aulas/semana). Caso selecione uma ou mais disciplinas, o valor total mensal não se altera.
            </p>
          </div>
        )}

        {erro && (
          <div className="p-3.5 rounded-lg bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
            {erro}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>A submissão do pedido não obriga a pagamento imediato. O matching é iniciado sem custos.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Botao
              type="button"
              variante="contorno"
              tamanho="lg"
              onClick={() => setModalComprovativoAberto(true)}
              disabled={!alunoSelecionado || !anoSelecionado || disciplinasEfectivas.length === 0}
              className="gap-2 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:border-[#FF2D75] hover:text-[#FF2D75] shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#FF2D75]" />
              Gerar Comprovativo PDF
            </Botao>

            <Botao type="submit" tamanho="lg" disabled={aSubmeter} className="gap-2 bg-gradient-to-r from-[#FF2D75] to-[#E11D48] hover:from-[#E11D48] hover:to-[#BE123C] text-white shadow-md rounded-xl">
              {aSubmeter ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A Enviar Pedido...
                </>
              ) : (
                "Enviar Pedido"
              )}
            </Botao>
          </div>
        </div>
      </div>

      {modalComprovativoAberto && (
        <ModalComprovativoPedidoPDF
          aberto={modalComprovativoAberto}
          aoFechar={() => setModalComprovativoAberto(false)}
          dados={{
            numeroPedido: `COT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            dataEmissao: new Date(),
            nomeEncarregado: "Encarregado de Educação",
            emailEncarregado: moradaPredefinida ? undefined : undefined,
            municipio,
            bairro,
            endereco,
            nomeAluno: alunoSelecionado?.nomeCompleto || "Educando",
            anoEscolar: anoSelecionado?.anoNome || "Ano a definir",
            sistemaEnsino: alunoSelecionado?.sistemaEnsino || "Geral Angolano",
            disciplinas: [
              ...disciplinasEfectivas.map((d) => d.nome),
              ...(ehIIciclo && disciplinasAdicionais ? [disciplinasAdicionais] : []),
            ],
            modalidade,
            duracaoMinutos,
            frequenciaSemanal,
            diasSemana: diasSelecionados.join(", "),
            horarioPreferencial,
            objetivo,
            observacoes,
            precoUnitarioKz: precoAulaUnitario,
            estimativaMensalKz: estimativaMensalTotal,
          }}
        />
      )}
    </form>
  );
}
