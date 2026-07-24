import { createServerSupabase } from "@/lib/supabase/server";
import { listarCupons } from "@/lib/coupons/repository";
import CupomList from "./CupomList";

export default async function CuponsPage() {
  const supabase = await createServerSupabase();

  const [cupons, { data: categorias }, { data: produtos }] = await Promise.all([
    listarCupons(supabase),
    supabase.from("categorias").select("*").eq("deleted", false).order("ordem"),
    supabase.from("produtos").select("*").eq("deleted", false).order("nome"),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-benvenuto-cream">Cupons</h1>
        <p className="mt-1 text-sm text-benvenuto-cream/50">
          Cupons de desconto aplicáveis no carrinho antes do pedido ir pro WhatsApp.
        </p>
      </div>

      <CupomList cupons={cupons} categorias={categorias ?? []} produtos={produtos ?? []} />
    </div>
  );
}
