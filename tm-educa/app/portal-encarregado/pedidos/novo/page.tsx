export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/modulos/autenticacao/consultas";
import { obterMeusAlunos } from "@/modulos/alunos/consultas";
import { obterDisciplinasAtivas } from "@/modulos/catalogo/consultas";
import { obterTabelaPrecosCompleta } from "@/modulos/precos/consultas";
import { FormularioPedido } from "@/componentes/pedidos/formulario-pedido";
import { Botao } from "@/componentes/ui/botao";
import { CabecalhoPaginaPais } from "@/componentes/encarregados/CabecalhoPaginaPais";
import { EstadoVazioPais } from "@/componentes/encarregados/EstadoVazioPais";
import { UserPlus, ClipboardList } from "lucide-react";

export const metadata = {
  title: "Solicitar Acompanhamento Escolar | TM-Educa",
};

export default async function PaginaNovoPedido() {
  const utilizador = await obterUtilizadorAutenticado();
  if (!utilizador || utilizador.funcao !== "ENCARREGADO") {
    redirect("/entrar?callbackUrl=/portal-encarregado/pedidos/novo");
  }

  const [alunos, disciplinas, ciclos] = await Promise.all([
    obterMeusAlunos(),
    obterDisciplinasAtivas(),
    obterTabelaPrecosCompleta(),
  ]);

  // Anos do catálogo com preços oficiais e o ciclo a que pertencem
  const precosPorAno = ciclos.flatMap((ciclo) =>
    ciclo.anos.map((ano) => ({
      anoId: ano.id,
      anoNome: ano.nome,
      cicloNome: ciclo.nome,
      precos: ano.precos.map((preco) => ({
        duracaoMinutos: preco.duracaoMinutos,
        precoPorAulaKz: preco.precoPorAulaKz,
      })),
    }))
  );

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CabecalhoPaginaPais
        titulo="Solicitar Acompanhamento Escolar"
        descricao="Preencha os detalhes pedagógicos e de logística para encontrarmos o explicador credenciado ideal. A proposta chega em menos de 24 horas úteis."
        icone={ClipboardList}
        caminho={[
          { rotulo: "Pedidos de Apoio", href: "/portal-encarregado/pedidos" },
          { rotulo: "Novo Pedido" },
        ]}
        acoes={
          <Link href="/portal-encarregado/pedidos">
            <Botao variante="contorno">Ver Meus Pedidos</Botao>
          </Link>
        }
      />

      {/* Sem filhos registados: instruir o cadastro primeiro */}
      {alunos.length === 0 ? (
        <EstadoVazioPais
          icone={UserPlus}
          tom="aviso"
          titulo="Nenhum filho registado"
          descricao="Para solicitar um explicador ou acompanhamento curricular, precisa primeiro de registar os dados escolares do seu filho."
          acao={{
            rotulo: "Adicionar Primeiro Filho",
            href: "/portal-encarregado/alunos/novo",
          }}
        />
      ) : (
        <FormularioPedido
          alunos={alunos.map((a) => ({
            id: a.id,
            nomeCompleto: a.nomeCompleto,
            anoEscolar: a.anoEscolar,
          }))}
          disciplinas={disciplinas.map((d) => ({
            id: d.id,
            nome: d.nome,
          }))}
          precosPorAno={precosPorAno}
          moradaPredefinida={{
            municipio: utilizador.perfilEncarregado?.municipio,
            bairro: utilizador.perfilEncarregado?.bairro,
            endereco: utilizador.perfilEncarregado?.endereco,
          }}
        />
      )}
    </div>
  );
}
