import { ClipboardList, Clock3, Pizza } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  const [{ count: pedidosHoje }, { count: pedidosPendentes }, { count: produtosAtivos }] = await Promise.all([
    supabase.from("pedidos").select("*", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase.from("pedidos").select("*", { count: "exact", head: true })
      .in("status", ["recebido", "em_preparo"]),
    supabase.from("produtos").select("*", { count: "exact", head: true }).eq("disponivel", true),
  ]);

  const cards = [
    { label: "Pedidos hoje", valor: pedidosHoje ?? 0, icone: ClipboardList, cor: "red" as const },
    { label: "Pedidos em aberto", valor: pedidosPendentes ?? 0, icone: Clock3, cor: "gold" as const },
    { label: "Produtos ativos", valor: produtosAtivos ?? 0, icone: Pizza, cor: "green" as const },
  ];

  const cores = {
    red: "bg-benvenuto-red/15 text-benvenuto-red",
    gold: "bg-benvenuto-gold/15 text-benvenuto-gold",
    green: "bg-benvenuto-green/15 text-benvenuto-green",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-benvenuto-cream">Visão geral</h1>
        <p className="mt-1 text-sm text-benvenuto-cream/50">
          Resumo rápido da operação de hoje.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((c) => {
          const Icone = c.icone;
          return (
            <div
              key={c.label}
              className="group rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-6 transition-all duration-300 hover:-translate-y-1 hover:border-benvenuto-gold/25 hover:shadow-xl hover:shadow-black/30"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${cores[c.cor]}`}>
                <Icone size={20} strokeWidth={1.75} />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-benvenuto-cream/45">{c.label}</p>
              <p className="mt-2 font-display text-4xl font-bold text-benvenuto-cream">{c.valor}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-benvenuto-gold/15 p-6 text-sm text-benvenuto-cream/45">
        Gráficos de vendas por período e produtos mais pedidos podem ser adicionados aqui
        assim que houver histórico suficiente de pedidos.
      </div>
    </div>
  );
}
