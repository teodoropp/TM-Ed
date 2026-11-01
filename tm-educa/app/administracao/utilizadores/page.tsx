export const dynamic = "force-dynamic";

import Link from "next/link";
import { Cartao, CartaoCabecalho, CartaoTitulo, CartaoDescricao, CartaoRodape } from "@/componentes/ui/cartao";
import { Botao } from "@/componentes/ui/botao";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import { Users, GraduationCap, School, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Gestão de Utilizadores | Administração",
};

export default function PaginaGestaoUtilizadores() {
  return (
    <AmbienteAdmin>
      <CabecalhoPagina
        titulo="Gestão Central de Utilizadores"
        descricao="Supervisão pedagógica de Pais, Alunos e Rede de Professores."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Utilizadores" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paiss */}
        <Cartao className="flex flex-col justify-between hover:border-blue-300 transition-colors">
          <CartaoCabecalho>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-3">
              <Users className="h-6 w-6" />
            </div>
            <CartaoTitulo>Pais</CartaoTitulo>
            <CartaoDescricao>
              Consulta de contas familiares, dados de contacto, NIF, morada e filhos associados.
            </CartaoDescricao>
          </CartaoCabecalho>
          <CartaoRodape>
            <Link href="/administracao/utilizadores/encarregados" className="w-full">
              <Botao variante="contorno" className="w-full gap-2">
                Ver Pais <ArrowRight className="h-4 w-4" />
              </Botao>
            </Link>
          </CartaoRodape>
        </Cartao>

        {/* Alunos */}
        <Cartao className="flex flex-col justify-between hover:border-blue-300 transition-colors">
          <CartaoCabecalho>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-3">
              <School className="h-6 w-6" />
            </div>
            <CartaoTitulo>Alunos</CartaoTitulo>
            <CartaoDescricao>
              Catálogo geral de alunos, anos escolares, sistemas de ensino, histórico e dificuldades.
            </CartaoDescricao>
          </CartaoCabecalho>
          <CartaoRodape>
            <Link href="/administracao/utilizadores/alunos" className="w-full">
              <Botao variante="contorno" className="w-full gap-2">
                Ver Alunos <ArrowRight className="h-4 w-4" />
              </Botao>
            </Link>
          </CartaoRodape>
        </Cartao>

        {/* Professores */}
        <Cartao className="flex flex-col justify-between hover:border-amber-300 transition-colors">
          <CartaoCabecalho>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 mb-3">
              <GraduationCap className="h-6 w-6" />
            </div>
            <CartaoTitulo>Rede de Professores</CartaoTitulo>
            <CartaoDescricao>
              Triagem de candidatos, validação de perfis, disponibilidade e alteração de estados operacionais.
            </CartaoDescricao>
          </CartaoCabecalho>
          <CartaoRodape>
            <Link href="/administracao/utilizadores/professores" className="w-full">
              <Botao variante="destaque" className="w-full gap-2 font-semibold">
                Gerir Professores <ArrowRight className="h-4 w-4" />
              </Botao>
            </Link>
          </CartaoRodape>
        </Cartao>
      </div>
    </AmbienteAdmin>
  );
}
