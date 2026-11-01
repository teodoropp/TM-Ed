"use client";

import * as React from "react";
import { acaoAtualizarPerfilProfessor } from "@/modulos/professores/acoes";
import { Botao } from "@/componentes/ui/botao";
import { Input } from "@/componentes/ui/input";
import { Badge } from "@/componentes/ui/badge";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Globe,
  Sparkles,
  Camera,
  Phone,
  GraduationCap,
  BookOpen,
  Save,
  X,
} from "lucide-react";

export interface PropriedadesFormularioPerfilDocente {
  perfilInicial: {
    fotoUrl?: string | null;
    telefone?: string | null;
    formacaoAcademica?: string | null;
    anosExperiencia?: number;
    biografia?: string | null;
    zonasAtendimento?: Array<{ municipio: string }>;
    disciplinasIds?: string[];
  };
  disciplinasDisponiveis?: Array<{ id: string; nome: string }>;
  aoConcluir?: () => void;
  aoCancelar?: () => void;
}

const OPCAO_TODA_LUANDA = "Toda a Província de Luanda (Sem restrição de bairros)";

const MUNICIPIOS_DISPONIVEIS = [
  "Luanda (Ingombota, Maianga, Alvalade, Maculusso, Samba, Sambizanga, Rangel, Miramar, Ilha)",
  "Talatona (Benfica, Camama, Cidade Universitária, Morro Bento, Lar do Patriota, Futungo)",
  "Belas (Centralidade do Kilamba, Morro dos Veados, Ramiros, Vila Verde, Barra do Cuanza)",
  "Kilamba Kiaxi (Golf 1 e 2, Palanca, Projecto Nova Vida, Sapú, Calemba 2)",
  "Viana (Zango 1 a 5 e 8000, Estalagem, Vila de Viana, Capalanga, Baía, Kikuxi)",
  "Cazenga (Hoji-ya-Henda, Tala Hadi, Cazenga Popular, Kalawenda)",
  "Cacuaco (Centralidade do Sequele, Kikolo, Vidrul, Funda, Vila de Cacuaco)",
  "Icolo e Bengo (Catete, Bom Jesus, Calomboloca, Cabiri)",
  "Quiçama (Muxima, Demba Chio, Cabo Ledo)",
  "Aulas Online (Acesso Remoto Sem Limitação Geográfica)",
];

export function FormularioPerfilDocente({
  perfilInicial,
  disciplinasDisponiveis = [],
  aoConcluir,
  aoCancelar,
}: PropriedadesFormularioPerfilDocente) {
  const [fotoUrl, setFotoUrl] = React.useState(perfilInicial.fotoUrl || "");
  const [telefone, setTelefone] = React.useState(perfilInicial.telefone || "");
  const [formacaoAcademica, setFormacaoAcademica] = React.useState(
    perfilInicial.formacaoAcademica || ""
  );
  const [anosExperiencia, setAnosExperiencia] = React.useState(
    perfilInicial.anosExperiencia || 0
  );
  const [biografia, setBiografia] = React.useState(
    perfilInicial.biografia || ""
  );
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = React.useState<string[]>(
    perfilInicial.disciplinasIds || []
  );

  function alternarDisciplina(id: string) {
    setDisciplinasSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  const [municipiosSelecionados, setMunicipiosSelecionados] = React.useState<string[]>(() => {
    const iniciais = perfilInicial.zonasAtendimento?.map((z) => z.municipio) || [];
    if (iniciais.length === 0) {
      return [OPCAO_TODA_LUANDA, ...MUNICIPIOS_DISPONIVEIS];
    }
    return iniciais;
  });

  const [carregando, setCarregando] = React.useState(false);
  const [mensagemSucesso, setMensagemSucesso] = React.useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = React.useState<string | null>(null);

  const cobreTodaLuanda = municipiosSelecionados.includes(OPCAO_TODA_LUANDA);

  function alternarTodaLuanda() {
    if (cobreTodaLuanda) {
      setMunicipiosSelecionados([]);
    } else {
      setMunicipiosSelecionados([OPCAO_TODA_LUANDA, ...MUNICIPIOS_DISPONIVEIS]);
    }
  }

  function alternarMunicipio(m: string) {
    setMunicipiosSelecionados((prev) => {
      const existe = prev.includes(m);
      let novo = existe ? prev.filter((item) => item !== m) : [...prev, m];

      if (existe && novo.includes(OPCAO_TODA_LUANDA)) {
        novo = novo.filter((item) => item !== OPCAO_TODA_LUANDA);
      }
      return novo;
    });
  }

  function selecionarTudo() {
    setMunicipiosSelecionados([OPCAO_TODA_LUANDA, ...MUNICIPIOS_DISPONIVEIS]);
  }

  function desmarcarTudo() {
    setMunicipiosSelecionados([]);
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setMensagemSucesso(null);
    setMensagemErro(null);

    try {
      const res = await acaoAtualizarPerfilProfessor(
        {
          fotoUrl: fotoUrl.trim() || null,
          telefone: telefone.trim() || null,
          formacaoAcademica,
          anosExperiencia: Number(anosExperiencia),
          biografia,
        },
        municipiosSelecionados,
        disciplinasDisponiveis.length > 0 ? disciplinasSelecionadas : undefined
      );

      if (!res.sucesso) {
        setMensagemErro(res.mensagem);
        setCarregando(false);
        return;
      }

      setMensagemSucesso(res.mensagem);
      setCarregando(false);

      if (aoConcluir) {
        setTimeout(() => {
          aoConcluir();
          window.location.reload();
        }, 800);
      } else {
        window.location.reload();
      }
    } catch {
      setMensagemErro("Ocorreu um erro ao guardar o perfil de explicador.");
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-6 portal-tipografia">
      {mensagemErro && (
        <div className="flex items-center gap-3 rounded-[5px] border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <p>{mensagemErro}</p>
        </div>
      )}

      {mensagemSucesso && (
        <div className="flex items-center gap-3 rounded-[5px] border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <p>{mensagemSucesso}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fotografia / URL da Imagem */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-normal uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Camera className="h-4 w-4 text-rose-500" />
            Fotografia do Professor (URL ou Link da Foto)
          </label>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-[5px] overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt="Pré-visualização"
                  className="h-full w-full object-cover"
                  onError={() => setFotoUrl("")}
                />
              ) : (
                <Camera className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <Input
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              placeholder="Cole aqui o link da sua foto (ex: https://.../minha-foto.jpg)"
              disabled={carregando}
              className="rounded-[5px] h-10 border-slate-200 dark:border-slate-700 text-xs flex-1 font-normal"
            />
          </div>
          <p className="text-[11px] text-slate-400 font-normal">
            Uma foto profissional e nítida transmite confiança aos encarregados de educação.
          </p>
        </div>

        {/* Telefone de Contacto */}
        <div className="space-y-1.5">
          <label className="text-xs font-normal uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-sky-500" />
            Contacto Telefónico / WhatsApp *
          </label>
          <Input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Ex.: +244 923 000 000"
            disabled={carregando}
            className="rounded-[5px] h-10 border-slate-200 dark:border-slate-700 text-xs font-normal"
          />
        </div>

        {/* Anos de Experiência */}
        <div className="space-y-1.5">
          <label className="text-xs font-normal uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Anos de Experiência de Ensino / Acompanhamento
          </label>
          <Input
            type="number"
            min={0}
            max={50}
            value={anosExperiencia}
            onChange={(e) => setAnosExperiencia(Number(e.target.value))}
            required
            disabled={carregando}
            className="rounded-[5px] h-10 border-slate-200 dark:border-slate-700 text-xs font-normal"
          />
        </div>

        {/* Formação Académica */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-normal uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-emerald-500" />
            Formação Académica e Habilitações Literárias *
          </label>
          <Input
            value={formacaoAcademica}
            onChange={(e) => setFormacaoAcademica(e.target.value)}
            placeholder="Ex.: Licenciatura em Ensino da Matemática (ISCED-Luanda)"
            required
            disabled={carregando}
            className="rounded-[5px] h-10 border-slate-200 dark:border-slate-700 text-xs font-normal"
          />
        </div>

        {/* Biografia */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-normal uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Biografia e Apresentação aos Pais e Alunos
          </label>
          <textarea
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            placeholder="Apresente o seu percurso, metodologia pedagógica, foco de ensino e estilo de acompanhamento..."
            rows={4}
            className="w-full rounded-[5px] border border-slate-300 bg-white p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF2D75] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 font-normal"
            disabled={carregando}
          />
        </div>
      </div>

      {/* Disciplinas Habilitadas */}
      {disciplinasDisponiveis.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-xs font-normal uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              Disciplinas Curriculares que Leciona
            </label>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Selecione as disciplinas em que está habilitado para receber propostas de acompanhamento (matching pedagógico):
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {disciplinasDisponiveis.map((disc) => {
              const selecionada = disciplinasSelecionadas.includes(disc.id);
              return (
                <div
                  key={disc.id}
                  onClick={() => alternarDisciplina(disc.id)}
                  className={`p-3 rounded-[5px] border cursor-pointer transition-all flex items-center gap-2.5 ${
                    selecionada
                      ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-950/30"
                      : "border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#07182E]/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selecionada}
                    readOnly
                    className="h-3.5 w-3.5 rounded-[3px] border-slate-300 text-indigo-600 cursor-pointer"
                  />
                  <span className="text-xs font-normal text-slate-800 dark:text-slate-200">
                    {disc.nome}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Zonas de Atendimento em Luanda */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div>
            <label className="text-xs font-normal uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-rose-500" />
              Zonas de Atendimento Presencial em Luanda & Online
            </label>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              A TM-Educa opera em toda a extensão de Luanda sem restrição de bairros. Escolha cobertura integral ou áreas prioritárias:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selecionarTudo}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-normal"
            >
              Selecionar Toda Luanda
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              type="button"
              onClick={desmarcarTudo}
              className="text-[11px] text-slate-500 hover:underline cursor-pointer font-normal"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Opção Master: Toda a Província de Luanda */}
        <div
          onClick={alternarTodaLuanda}
          className={`p-4 rounded-[5px] border cursor-pointer transition-all flex items-center justify-between gap-3 ${
            cobreTodaLuanda
              ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20"
              : "border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-white dark:bg-[#07182E]"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={cobreTodaLuanda}
              readOnly
              className="h-4 w-4 rounded-[3px] border-slate-300 text-emerald-600 cursor-pointer"
            />
            <div>
              <span className="text-xs font-normal text-slate-900 dark:text-white block">
                {OPCAO_TODA_LUANDA}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                Disponível para dar aulas a domicílio em qualquer área, município ou bairro da província de Luanda.
              </span>
            </div>
          </div>

          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] rounded-[5px] shrink-0 font-normal">
            <Sparkles className="h-3 w-3 mr-1" />
            Recomendado
          </Badge>
        </div>

        {/* Grelha Detalhada por Municípios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {MUNICIPIOS_DISPONIVEIS.map((m) => {
            const selecionado = municipiosSelecionados.includes(m);
            const isOnline = m.includes("Online");

            return (
              <div
                key={m}
                onClick={() => alternarMunicipio(m)}
                className={`p-3 rounded-[5px] border cursor-pointer transition-all flex items-start gap-2.5 ${
                  selecionado
                    ? "border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40"
                    : "border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#07182E]/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selecionado}
                  readOnly
                  className="mt-0.5 h-3.5 w-3.5 rounded-[3px] border-slate-300 text-rose-600 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-xs font-normal text-slate-800 dark:text-slate-200 block flex items-center gap-1">
                    {isOnline ? (
                      <Globe className="h-3.5 w-3.5 text-sky-500" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    )}
                    {m}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {aoCancelar && (
          <Botao
            type="button"
            variante="contorno"
            onClick={aoCancelar}
            disabled={carregando}
            className="rounded-[5px] h-9 px-4 text-xs font-normal"
          >
            <X className="h-3.5 w-3.5 mr-1.5" />
            Cancelar
          </Botao>
        )}

        <Botao
          type="submit"
          disabled={carregando}
          className="rounded-[5px] h-9 px-5 text-xs font-normal bg-[#FF2D75] hover:bg-[#FF2D75]/90 text-white shadow-sm"
        >
          {carregando ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              A Guardar Alterações...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Guardar Perfil
            </>
          )}
        </Botao>
      </div>
    </form>
  );
}
