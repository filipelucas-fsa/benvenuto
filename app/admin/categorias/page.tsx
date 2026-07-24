import { createServerSupabase } from "@/lib/supabase/server";
import CategoriaForm from "./CategoriaForm";
import ExcluirCategoriaButton from "./ExcluirCategoriaButton";

export default async function CategoriasPage() {
  const supabase = await createServerSupabase();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("*")
    .eq("deleted", false)
    .order("ordem");

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-benvenuto-cream">Categorias</h1>

      <details className="mb-8 rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-6">
        <summary className="cursor-pointer font-semibold text-benvenuto-cream">+ Nova categoria</summary>
        <CategoriaForm />
      </details>

      <div className="overflow-x-auto rounded-2xl border border-benvenuto-gold/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-benvenuto-charcoal/60 text-xs uppercase tracking-wide text-benvenuto-cream/45">
            <tr>
              <th className="px-5 py-3.5 font-medium">Nome</th>
              <th className="px-5 py-3.5 font-medium">Ordem</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {categorias?.map((c) => (
              <tr key={c.id} className="border-t border-benvenuto-gold/5 text-benvenuto-cream/85 transition-colors hover:bg-benvenuto-charcoal/40">
                <td className="px-5 py-3.5 font-medium">{c.nome}</td>
                <td className="px-5 py-3.5 text-benvenuto-cream/60">{c.ordem}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    c.ativo ? "bg-benvenuto-green/15 text-benvenuto-green" : "bg-benvenuto-cream/10 text-benvenuto-cream/50"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${c.ativo ? "bg-benvenuto-green" : "bg-benvenuto-cream/40"}`} />
                    {c.ativo ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <ExcluirCategoriaButton id={c.id} nome={c.nome} />
                </td>
              </tr>
            ))}
            {(!categorias || categorias.length === 0) && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-benvenuto-cream/40">
                  Nenhuma categoria cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
