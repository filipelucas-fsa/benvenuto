import Hero from "@/components/Hero";
import CategoriasEProdutos from "@/components/CategoriasEProdutos";
import Sobre from "@/components/Sobre";
import Depoimentos from "@/components/Depoimentos";
import Galeria from "@/components/Galeria";
import ComboBanner from "@/components/ComboBanner";
import PecaAgora from "@/components/PecaAgora";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createServerSupabase();

  const [{ data: categorias }, { data: produtos }, { data: avaliacoes }] = await Promise.all([
    supabase.from("categorias").select("*").eq("deleted", false).eq("ativo", true).order("ordem"),
    supabase.from("produtos").select("*").eq("deleted", false).eq("disponivel", true).order("ordem"),
    supabase.from("avaliacoes").select("*").eq("aprovado", true).limit(3),
  ]);

  return (
    <>
      <Hero />
      <CategoriasEProdutos categorias={categorias ?? []} produtos={produtos ?? []} />
      <ComboBanner />
      <Sobre />
      <Galeria />
      <Depoimentos avaliacoes={avaliacoes ?? []} />
      <PecaAgora />
    </>
  );
}
