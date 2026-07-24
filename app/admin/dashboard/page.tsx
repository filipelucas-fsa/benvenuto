import Link from "next/link";
import Image from "next/image";
import {
  ClipboardList, DollarSign, Pizza, Percent, ChevronRight,
  Plus, ShoppingCart, Tag as TagIcon, Settings,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const inicioDoDia = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  const [
    { count: pedidosHoje },
    { data: pedidosHojeComTotal },
    { count: produtosCadastrados },
    { count: cuponsAtivos },
    { data: produtosRecentes },
    { data: categorias },
  ] = await Promise.all([
    supabase.from("pedidos").select("*", { count: "exact", head: true }).gte("created_at", inicioDoDia),
    supabase.from("pedidos").select("total").gte("created_at", inicioDoDia),
    supabase.from("produtos").select("*", { count: "exact", head: true }).eq("deleted", false),
    supabase.from("coupons").select("*", { count: "exact", head: true }).eq("deleted", false).eq("ativo", true),
    supabase.from("produtos").select("*, categorias(nome)").eq("deleted", false).order("created_at", { ascending: false }).limit(5),
    supabase.from("categorias").select("*").eq("deleted", false).order("ordem").limit(5),
  ]);

  const faturamentoHoje = (pedidosHojeComTotal ?? []).reduce((acc, p) => acc + Number(p.total), 0);

  const categoriasComContagem = await Promise.all(
    (categorias ?? []).map(async (cat) => {
      const { count } = await supabase
        .from("produtos")
        .select("*", { count: "exact", head: true })
        .eq("categoria_id", cat.id)
        .eq("deleted", false);
      return { ...cat, totalProdutos: count ?? 0 };
    })
  );

  const cards = [
    { label: "Pedidos hoje", valor: String(pedidosHoje ?? 0), icone: ClipboardList, cor: "red" as const, href: "/admin/pedidos" },
    { label: "Faturamento hoje", valor: faturamentoHoje.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), icone: DollarSign, cor: "green" as const, href: "/admin/pedidos" },
    { label: "Produtos cadastrados", valor: String(produtosCadastrados ?? 0), icone: Pizza, cor: "gold" as const, href: "/admin/produtos" },
    { label: "Cupons ativos", valor: String(cuponsAtivos ?? 0), icone: Percent, cor: "purple" as const, href: "/admin/cupons" },
  ];

  const cores = {
    red: "bg-benvenuto-red/15 text-benvenuto-red",
    green: "bg-benvenuto-green/15 text-benvenuto-green",
    gold: "bg-benvenuto-gold/15 text-benvenuto-gold",
    purple: "bg-purple-500/15 text-purple-400",
  };

  const acoesRapidas = [
    { label: "Novo produto", icone: Plus, href: "/admin/produtos" },
    { label: "Nova categoria", icone: TagIcon, href: "/admin/categorias" },
    { label: "Novo cupom", icone: Percent, href: "/admin/cupons" },
    { label: "Ver pedidos", icone: ShoppingCart, href: "/admin/pedidos" },
    { label: "Configurações", icone: Settings, href: "/admin/configuracoes" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-benvenuto-cream">Bem-vindo, Administrador! 🍕</h1>
        <p className="mt-1 text-sm text-benvenuto-cream/50">Gerencie sua pizzaria de forma simples e eficiente.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icone = c.icone;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-6 transition-all duration-300 hover:-translate-y-1 hover:border-benvenuto-gold/25 hover:shadow-xl hover:shadow-black/30"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${cores[c.cor]}`}>
                <Icone size={20} strokeWidth={1.75} />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-benvenuto-cream/45">{c.label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-benvenuto-cream">{c.valor}</p>
            </Link>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-benvenuto-cream/30">
        Faturamento calculado a partir de pedidos registrados no sistema.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-benvenuto-cream">
              🍕 Produtos cadastrados
            </h2>
            <Link
              href="/admin/produtos"
              className="focus-ring flex items-center gap-1 rounded-full bg-benvenuto-red px-3.5 py-2 text-xs font-semibold text-benvenuto-cream"
            >
              <Plus size={14} /> Novo produto
            </Link>
          </div>

          {produtosRecentes && produtosRecentes.length > 0 ? (
            <div className="space-y-1">
              {produtosRecentes.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-benvenuto-black/40">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-benvenuto-black">
                    {p.imagem_url ? (
                      <Image src={p.imagem_url} alt={p.nome} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm">🍕</div>
                    )}
                  </div>
                  <span className="flex-1 truncate text-sm text-benvenuto-cream">{p.nome}</span>
                  <span className="rounded-full bg-benvenuto-red/10 px-2 py-0.5 text-[11px] text-benvenuto-red">
                    {p.categorias?.nome ?? "—"}
                  </span>
                  <span className="w-16 text-right text-sm font-medium text-benvenuto-gold">
                    {Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${p.disponivel ? "bg-benvenuto-green/15 text-benvenuto-green" : "bg-benvenuto-cream/10 text-benvenuto-cream/50"}`}>
                    {p.disponivel ? "Ativo" : "Inativo"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-benvenuto-cream/40">Nenhum produto cadastrado ainda.</p>
          )}

          <Link href="/admin/produtos" className="focus-ring mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-benvenuto-red hover:underline">
            Ver todos os produtos <ChevronRight size={13} />
          </Link>
        </div>

        <div className="rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-benvenuto-cream">
              🏷️ Categorias
            </h2>
            <Link href="/admin/categorias" className="focus-ring rounded-full bg-benvenuto-red px-3.5 py-2 text-xs font-semibold text-benvenuto-cream">
              + Nova
            </Link>
          </div>

          {categoriasComContagem.length > 0 ? (
            <div className="space-y-1">
              {categoriasComContagem.map((cat) => (
                <Link
                  key={cat.id}
                  href="/admin/categorias"
                  className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-benvenuto-black/40"
                >
                  <div>
                    <p className="text-sm text-benvenuto-cream">{cat.nome}</p>
                    <p className="text-xs text-benvenuto-cream/40">{cat.totalProdutos} produtos</p>
                  </div>
                  <ChevronRight size={14} className="text-benvenuto-cream/30" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-benvenuto-cream/40">Nenhuma categoria cadastrada ainda.</p>
          )}

          <Link href="/admin/categorias" className="focus-ring mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-benvenuto-red hover:underline">
            Ver todas as categorias <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-6">
        <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-benvenuto-cream">
          ⚡ Ações rápidas
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {acoesRapidas.map((acao) => {
            const Icone = acao.icone;
            return (
              <Link
                key={acao.label}
                href={acao.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-benvenuto-gold/10 py-5 text-center transition-colors hover:border-benvenuto-red/40 hover:bg-benvenuto-black/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-benvenuto-red/10 text-benvenuto-red">
                  <Icone size={18} />
                </span>
                <span className="text-xs font-medium text-benvenuto-cream/80">{acao.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
