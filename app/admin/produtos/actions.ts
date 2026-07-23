"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

export interface EstadoFormulario {
  sucesso: boolean;
  mensagem: string;
}

// Aceita tanto "12.90" quanto "12,90" (formato brasileiro).
function parsePreco(valor: FormDataEntryValue | null): number {
  const texto = String(valor ?? "").trim().replace(",", ".");
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : NaN;
}

export async function salvarProduto(
  _estadoAnterior: EstadoFormulario | null,
  formData: FormData
): Promise<EstadoFormulario> {
  const supabase = await createServerSupabase();

  const nome = String(formData.get("nome") ?? "").trim();
  const categoriaId = String(formData.get("categoria_id") ?? "").trim();
  const preco = parsePreco(formData.get("preco"));

  if (!nome) return { sucesso: false, mensagem: "Informe o nome do produto." };
  if (!categoriaId) return { sucesso: false, mensagem: "Selecione uma categoria." };
  if (Number.isNaN(preco) || preco < 0) {
    return { sucesso: false, mensagem: "Preço inválido. Use apenas números, ex: 39.90" };
  }

  const id = formData.get("id") as string | null;
  const payload = {
    nome,
    descricao: String(formData.get("descricao") ?? ""),
    preco,
    categoria_id: categoriaId,
    imagem_url: String(formData.get("imagem_url") ?? ""),
    badge_texto: String(formData.get("badge_texto") ?? "").trim() || null,
    disponivel: formData.get("disponivel") === "on",
    destaque: formData.get("destaque") === "on",
  };

  const { error } = id
    ? await supabase.from("produtos").update(payload).eq("id", id)
    : await supabase.from("produtos").insert(payload);

  if (error) {
    // Erro mais comum aqui: usuário logado não está cadastrado em `public.usuarios`,
    // então a política de RLS (is_admin()) bloqueia a escrita.
    return { sucesso: false, mensagem: `Erro ao salvar: ${error.message}` };
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");
  return { sucesso: true, mensagem: id ? "Produto atualizado!" : "Produto criado!" };
}

export async function excluirProduto(id: string) {
  const supabase = await createServerSupabase();
  // Soft delete — mantém histórico e respeita a coluna `deleted` do schema.
  await supabase.from("produtos").update({ deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");
}
