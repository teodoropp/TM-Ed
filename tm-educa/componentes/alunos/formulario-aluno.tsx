"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { acaoCriarAluno, acaoAtualizarAluno } from "@/modulos/alunos/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Input } from "@/componentes/ui/input";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export interface PropriedadesFormularioAluno {
  alunoInicial?: {
    id: string;
    nomeCompleto: string;
    dataNascimento?: Date | null;
    sexo?: "Masculino" | "Feminino" | null;
    anoEscolar: string;
    sistemaEnsino: string;
    escola?: string | null;
    dificuldades?: string | null;
    objectivos?: string | null;
    observacoes?: string | null;
  };
}

/**
 * Anos escolares disponíveis.
 *
 * O valor guardado é sempre o nome canónico do catálogo de preços
 * (ex.: "7.º Ano"), para que o preço por aula e a estimativa mensal sejam
 * encontrados corretamente. O rótulo apresenta o ciclo como apoio à leitura.
 */
const OPCOES_ANOS = [
  { valor: "1.º Ano", rotulo: "1.º Ano (Primário)" },
  { valor: "2.º Ano", rotulo: "2.º Ano (Primário)" },
  { valor: "3.º Ano", rotulo: "3.º Ano (Primário)" },
  { valor: "4.º Ano", rotulo: "4.º Ano (Primário)" },
  { valor: "5.º Ano", rotulo: "5.º Ano (Primário)" },
  { valor: "6.º Ano", rotulo: "6.º Ano (Primário)" },
  { valor: "7.º Ano", rotulo: "7.º Ano (I Ciclo)" },
  { valor: "8.º Ano", rotulo: "8.º Ano (I Ciclo)" },
  { valor: "9.º Ano", rotulo: "9.º Ano (I Ciclo)" },
  { valor: "10.º Ano", rotulo: "10.º Ano (II Ciclo)" },
  { valor: "11.º Ano", rotulo: "11.º Ano (II Ciclo)" },
  { valor: "12.º Ano", rotulo: "12.º Ano (II Ciclo)" },
];

const OPCOES_SISTEMAS = [
  "Geral Angolano",
  "Currículo Português",
  "Cambridge International",
  "Internacional / Outro",
];

export function FormularioAluno({ alunoInicial }: PropriedadesFormularioAluno) {
  const router = useRouter();

  const [nomeCompleto, setNomeCompleto] = React.useState(
    alunoInicial?.nomeCompleto || ""
  );
  const [dataNascimento, setDataNascimento] = React.useState(
    alunoInicial?.dataNascimento
      ? new Date(alunoInicial.dataNascimento).toISOString().split("T")[0]
      : ""
  );
  const [sexo, setSexo] = React.useState<"Masculino" | "Feminino" | "">(
    alunoInicial?.sexo || ""
  );
  const [anoEscolar, setAnoEscolar] = React.useState(() => {
    // Normaliza anos legados (ex.: "7.º Ano (I Ciclo)") para o nome canónico
    // do catálogo de preços (ex.: "7.º Ano").
    const inicial = alunoInicial?.anoEscolar || "7.º Ano";
    const opcao = OPCOES_ANOS.find(
      (o) => o.valor === inicial || o.rotulo === inicial
    );
    return opcao?.valor ?? inicial;
  });
  const [sistemaEnsino, setSistemaEnsino] = React.useState(
    alunoInicial?.sistemaEnsino || "Geral Angolano"
  );
  const [escola, setEscola] = React.useState(alunoInicial?.escola || "");
  const [dificuldades, setDificuldades] = React.useState(
    alunoInicial?.dificuldades || ""
  );
  const [objectivos, setObjectivos] = React.useState(
    alunoInicial?.objectivos || ""
  );
  const [observacoes, setObservacoes] = React.useState(
    alunoInicial?.observacoes || ""
  );

  const [carregando, setCarregando] = React.useState(false);
  const [mensagemErro, setMensagemErro] = React.useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = React.useState<string | null>(null);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setMensagemErro(null);
    setMensagemSucesso(null);
    setCarregando(true);

    try {
      const dados = {
        nomeCompleto,
        dataNascimento: dataNascimento || undefined,
        sexo: (sexo as "Masculino" | "Feminino") || undefined,
        anoEscolar,
        sistemaEnsino,
        escola: escola || undefined,
        dificuldades: dificuldades || undefined,
        objectivos: objectivos || undefined,
        observacoes: observacoes || undefined,
      };

      const res = alunoInicial
        ? await acaoAtualizarAluno(alunoInicial.id, dados)
        : await acaoCriarAluno(dados);

      if (!res.sucesso) {
        setMensagemErro(res.mensagem);
        setCarregando(false);
        return;
      }

      setMensagemSucesso(res.mensagem);
      router.push("/portal-encarregado/alunos");
      router.refresh();
    } catch {
      setMensagemErro("Ocorreu um erro ao processar os dados do aluno.");
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={submeter} className="space-y-6">
      {mensagemErro && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <p>{mensagemErro}</p>
        </div>
      )}

      {mensagemSucesso && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <p>{mensagemSucesso}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome Completo */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Nome Completo do Aluno *
          </label>
          <Input
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            placeholder="Ex.: Teresa Maria dos Santos"
            required
            disabled={carregando}
          />
        </div>

        {/* Data de Nascimento */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Data de Nascimento
          </label>
          <Input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            disabled={carregando}
          />
        </div>

        {/* Sexo */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Sexo
          </label>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value as "Masculino" | "Feminino" | "")}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            disabled={carregando}
          >
            <option value="">Selecione o sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>

        {/* Ano Escolar */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Ano Escolar *
          </label>
          <select
            value={anoEscolar}
            onChange={(e) => setAnoEscolar(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            required
            disabled={carregando}
          >
            {OPCOES_ANOS.map((ano) => (
              <option key={ano.valor} value={ano.valor}>
                {ano.rotulo}
              </option>
            ))}
          </select>
        </div>

        {/* Sistema de Ensino */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Sistema de Ensino *
          </label>
          <select
            value={sistemaEnsino}
            onChange={(e) => setSistemaEnsino(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            required
            disabled={carregando}
          >
            {OPCOES_SISTEMAS.map((sis) => (
              <option key={sis} value={sis}>
                {sis}
              </option>
            ))}
          </select>
        </div>

        {/* Escola / Colégio */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Escola / Colégio que Frequenta
          </label>
          <Input
            value={escola}
            onChange={(e) => setEscola(e.target.value)}
            placeholder="Ex.: Colégio São Francisco de Assis, Luanda"
            disabled={carregando}
          />
        </div>

        {/* Dificuldades Identificadas */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Dificuldades Escolares Identificadas
          </label>
          <textarea
            value={dificuldades}
            onChange={(e) => setDificuldades(e.target.value)}
            placeholder="Ex.: Dificuldade na resolução de equações do 2.º grau e interpretação de problemas de Física."
            rows={3}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            disabled={carregando}
          />
        </div>

        {/* Objetivos Pedagógicos */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Objetivos com o Acompanhamento
          </label>
          <textarea
            value={objectivos}
            onChange={(e) => setObjectivos(e.target.value)}
            placeholder="Ex.: Melhorar as notas para média superior a 15 valores e preparar os exames finais."
            rows={2}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            disabled={carregando}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Botao
          type="button"
          variante="fantasma"
          onClick={() => router.back()}
          disabled={carregando}
        >
          Cancelar
        </Botao>
        <Botao
          type="submit"
          variante="primario"
          className="min-w-36 font-semibold shadow-md"
          disabled={carregando}
        >
          {carregando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              A guardar...
            </>
          ) : alunoInicial ? (
            "Atualizar Aluno"
          ) : (
            "Registar Aluno"
          )}
        </Botao>
      </div>
    </form>
  );
}
