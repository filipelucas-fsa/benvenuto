import { createServerSupabase } from "@/lib/supabase/server";
import ConfiguracoesForm from "./ConfiguracoesForm";

export default async function ConfiguracoesPage() {
  const supabase = await createServerSupabase();
  const { data: config } = await supabase.from("configuracoes").select("*").eq("id", 1).single();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-benvenuto-cream">Configurações</h1>
      <ConfiguracoesForm config={config} />
    </div>
  );
}
