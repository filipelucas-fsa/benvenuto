"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { PedidoStatus } from "@/types/database";

export interface EstadoAcao {
  sucesso: boolean;
  mensagem: string;
}

export async function atualizarStatusPedido(id: string, status: PedidoStatus): Promise<EstadoAcao> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("pedidos").update({ status }).eq("id", id);

  if (error) {
    return { sucesso: false, mensagem: `Erro ao atualizar: ${error.message}` };
  }

  revalidatePath("/admin/pedidos");
  return { sucesso: true, mensagem: "Status atualizado." };
}
