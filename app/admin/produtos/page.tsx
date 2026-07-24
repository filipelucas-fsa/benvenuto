import { createServerSupabase } from "@/lib/supabase/server";
import ExcluirButton from "./ExcluirButton";
import ProdutoForm from "./ProdutoForm";

export default async function ProdutosPage() {
  const supabase = await createServerSupabase();
  const [{ data: produtos }, { data: categorias }] = await Promise.all([
    supabase.from("produtos").select("*, categorias(nome)").eq("deleted", false).order("ordem"),
    supabase.from("categorias").select("*").eq("deleted", false).order("ordem"),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-benvenuto-cream">Produtos</h1>

      <details className="mb-8 rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-6">
        <summary className="cursor-pointer font-semibold text-benvenuto-cream">+ Novo produto</summary>
        <ProdutoForm categorias={categorias ?? []} />
      </details>

      <div className="overflow-x-auto rounded-2xl border border-benvenuto-gold/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-benvenuto-charcoal/60 text-xs uppercase tracking-wide text-benvenuto-cream/45">
            <tr>
              <th className="px-5 py-3.5 font-medium">Produto</th>
              <th className="px-5 py-3.5 font-medium">Categoria</th>
              <th className="px-5 py-3.5 font-medium">Preço</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {produtos?.map((p: any) => (
              <tr
                key={p.id}
                className="border-t border-benvenuto-gold/5 text-benvenuto-cream/85 transition-colors hover:bg-benvenuto-charcoal/40"
              >
                <td className="px-5 py-3.5 font-medium">{p.nome}</td>
                <td className="px-5 py-3.5 text-benvenuto-cream/60">{p.categorias?.nome ?? "—"}</td>
                <td className="px-5 py-3.5 font-mono text-benvenuto-gold">
                  {Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.disponivel
                        ? "bg-benvenuto-green/15 text-benvenuto-green"
                        : "bg-benvenuto-cream/10 text-benvenuto-cream/50"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${p.disponivel ? "bg-benvenuto-green" : "bg-benvenuto-cream/40"}`} />
                    {p.disponivel ? "Disponível" : "Indisponível"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <ExcluirButton id={p.id} nome={p.nome} />
                </td>
              </tr>
            ))}
            {(!produtos || produtos.length === 0) && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-benvenuto-cream/40">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
