import Hero from "@/components/Hero";
import CategoriaSelector from "@/components/CategoriaSelector";
import Sobre from "@/components/Sobre";
import Depoimentos from "@/components/Depoimentos";
import Galeria from "@/components/Galeria";
import ComboBanner from "@/components/ComboBanner";
import PecaAgora from "@/components/PecaAgora";
import { createServerSupabase } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createServerSupabase();

  const { data: destaques } = await supabase
    .from("produtos")
    .select("*")
    .eq("destaque", true)
    .eq("disponivel", true)
    .limit(5);

  const { data: avaliacoes } = await supabase
    .from("avaliacoes")
    .select("*")
    .eq("aprovado", true)
    .limit(3);

  return (
    <>
      <Hero />
      <CategoriaSelector />

      {destaques && destaques.length > 0 && (
        <section className="bg-benvenuto-black py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-1 items-center justify-center gap-3 sm:justify-start">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-benvenuto-red sm:hidden" />
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-benvenuto-cream/70">
                  As mais pedidas
                </h2>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-benvenuto-red sm:hidden" />
              </div>
              <Link
                href="/cardapio"
                className="focus-ring hidden shrink-0 rounded-full border border-benvenuto-gold/25 px-4 py-2 text-xs font-semibold text-benvenuto-cream/80 transition-colors hover:border-benvenuto-gold hover:text-benvenuto-cream sm:inline-block"
              >
                Ver todas as pizzas →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {destaques.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/cardapio"
                className="focus-ring inline-block text-sm font-semibold text-benvenuto-gold hover:underline"
              >
                Ver cardápio completo →
              </Link>
            </div>
          </div>
        </section>
      )}

      <ComboBanner />
      <Sobre />
      <Galeria />
      <Depoimentos avaliacoes={avaliacoes ?? []} />
      <PecaAgora />
    </>
  );
}
