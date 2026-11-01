export const dynamic = "force-dynamic";

import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterTodasDisciplinasAdmin } from "@/modulos/catalogo/consultas";
import { GestorDisciplinas } from "@/componentes/catalogo/gestor-disciplinas";
import { Botao } from "@/componentes/ui/botao";
import { AmbienteAdmin } from "@/componentes/admin/ambiente-admin";
import { CabecalhoPagina } from "@/componentes/admin/cabecalho-pagina";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Disciplinas Curriculares | Administração TM-Educa",
};

export default async function PaginaAdminDisciplinas() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ADMINISTRADOR") {
    redirect("/entrar?callbackUrl=/administracao/catalogo/disciplinas");
  }

  const disciplinas = await obterTodasDisciplinasAdmin();

  return (
    <AmbienteAdmin>
      {/* Cabeçalho */}
      <CabecalhoPagina
        titulo="Disciplinas Curriculares"
        descricao="Gestão do catálogo de disciplinas disponíveis para solicitação de explicações e acompanhamento escolar."
        caminho={[
          { rotulo: "Administração", href: "/administracao" },
          { rotulo: "Catálogo", href: "/administracao/catalogo" },
          { rotulo: "Disciplinas" },
        ]}
        acoes={
          <Link href="/administracao/catalogo">
            <Botao variante="contorno">Voltar ao Catálogo</Botao>
          </Link>
        }
      />

      {/* Gestor Interativo de Disciplinas */}
      <GestorDisciplinas disciplinasIniciais={disciplinas} />
    </AmbienteAdmin>
  );
}
