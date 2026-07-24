"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

export interface EstadoFormulario {
  sucesso: boolean;
  mensagem: string;
}

export async function salvarConfiguracoes(
  _estadoAnterior: EstadoFormulario | null,
  formData: FormData
): Promise<EstadoFormulario> {
  const supabase = await createServerSupabase();

  const nomeRestaurante = String(formData.get("nome_restaurante") ?? "").trim();
  if (!nomeRestaurante) {
    return { sucesso: false, mensagem: "O nome do restaurante não pode ficar vazio." };
  }

  const { error } = await supabase.from("configuracoes").update({
    nome_restaurante: nomeRestaurante,
    telefone: String(formData.get("telefone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    endereco: String(formData.get("endereco") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
  }).eq("id", 1);

  if (error) {
    return { sucesso: false, mensagem: `Erro ao salvar: ${error.message}` };
  }

  revalidatePath("/admin/configuracoes");
  revalidatePath("/");
  return { sucesso: true, mensagem: "Configurações salvas com sucesso!" };
}
