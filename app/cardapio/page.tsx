import { createServerSupabase } from "@/lib/supabase/server";
import CardapioClient from "./CardapioClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cardápio",
  description: "Confira nosso cardápio completo de pizzas, massas, carnes, sobremesas e bebidas.",
};

export const revalidate = 60;

export default async function CardapioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createServerSupabase();

  const [{ data: categorias }, { data: produtos }] = await Promise.all([
    supabase.from("categorias").select("*").order("ordem"),
    supabase.from("produtos").select("*").eq("deleted", false).order("ordem"),
  ]);

  return (
    <div className="min-h-screen bg-benvenuto-black pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-benvenuto-gold">
            Cardápio digital
          </p>
          <h1 className="font-display text-4xl font-bold text-benvenuto-cream sm:text-5xl">
            O que vai pedir hoje?
          </h1>
        </div>

        <CardapioClient categorias={categorias ?? []} produtos={produtos ?? []} categoriaInicialSlug={categoria} />
      </div>
    </div>
  );
}
