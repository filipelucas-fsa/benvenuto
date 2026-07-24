"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

export interface EstadoFormulario {
  sucesso: boolean;
  mensagem: string;
}

function gerarSlug(nome: string) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function salvarCategoria(
  _estadoAnterior: EstadoFormulario | null,
  formData: FormData
): Promise<EstadoFormulario> {
  const supabase = await createServerSupabase();
  const id = formData.get("id") as string | null;
  const nome = String(formData.get("nome") ?? "").trim();

  if (!nome) return { sucesso: false, mensagem: "Informe o nome da categoria." };

  const payload = {
    nome,
    slug: gerarSlug(nome),
    ordem: Number(formData.get("ordem") ?? 0),
    ativo: formData.get("ativo") === "on",
  };

  const { error } = id
    ? await supabase.from("categorias").update(payload).eq("id", id)
    : await supabase.from("categorias").insert(payload);

  if (error) {
    // Erro comum: slug duplicado (já existe categoria com nome muito parecido)
    return { sucesso: false, mensagem: `Erro ao salvar: ${error.message}` };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");
  return { sucesso: true, mensagem: id ? "Categoria atualizada!" : "Categoria criada!" };
}

export async function excluirCategoria(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("categorias")
    .update({ deleted: true, deleted_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");

  if (error) return { sucesso: false, mensagem: error.message };
  return { sucesso: true, mensagem: "Categoria excluída." };
}
