// ===== REPOSITORY =====
// Única camada que conversa diretamente com o Supabase. Nem o Service nem os
// componentes fazem query direta — tudo passa por aqui. Isso facilita trocar
// o banco no futuro sem tocar na regra de negócio.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Cupom, CupomComRelacionamentos, DadosNovoCupom } from "./types";

export async function buscarCupomPorCodigo(
  supabase: SupabaseClient,
  codigo: string
): Promise<Cupom | null> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("codigo", codigo.trim().toUpperCase())
    .eq("deleted", false)
    .maybeSingle();

  if (error || !data) return null;
  return data as Cupom;
}

export async function contarUsosDoCupom(supabase: SupabaseClient, cupomId: string): Promise<number> {
  const { count } = await supabase
    .from("coupon_usage")
    .select("*", { count: "exact", head: true })
    .eq("coupon_id", cupomId);
  return count ?? 0;
}

export async function buscarEscopoDoCupom(supabase: SupabaseClient, cupomId: string) {
  const [{ data: categorias }, { data: produtos }, { data: excluidos }] = await Promise.all([
    supabase.from("coupon_categories").select("categoria_id").eq("coupon_id", cupomId),
    supabase.from("coupon_products").select("produto_id").eq("coupon_id", cupomId),
    supabase.from("coupon_excluded_products").select("produto_id").eq("coupon_id", cupomId),
  ]);

  return {
    categoriaIds: (categorias ?? []).map((c) => c.categoria_id as string),
    produtoIds: (produtos ?? []).map((p) => p.produto_id as string),
    produtoExcluidoIds: (excluidos ?? []).map((p) => p.produto_id as string),
  };
}

export async function registrarUsoDoCupom(
  supabase: SupabaseClient,
  params: { cupomId: string; valorDescontoAplicado: number; clienteTelefone?: string; pedidoId?: string }
) {
  await supabase.from("coupon_usage").insert({
    coupon_id: params.cupomId,
    valor_desconto_aplicado: params.valorDescontoAplicado,
    cliente_telefone: params.clienteTelefone ?? null,
    pedido_id: params.pedidoId ?? null,
  });
}

// ---- Usadas pelo painel administrativo ----

export async function listarCupons(supabase: SupabaseClient): Promise<CupomComRelacionamentos[]> {
  const { data: cupons } = await supabase
    .from("coupons")
    .select("*")
    .eq("deleted", false)
    .order("created_at", { ascending: false });

  if (!cupons) return [];

  const completos = await Promise.all(
    cupons.map(async (cupom) => {
      const [{ categoriaIds, produtoIds, produtoExcluidoIds }, usosAtuais] = await Promise.all([
        buscarEscopoDoCupom(supabase, cupom.id),
        contarUsosDoCupom(supabase, cupom.id),
      ]);
      return {
        ...cupom,
        categoria_ids: categoriaIds,
        produto_ids: produtoIds,
        produto_excluido_ids: produtoExcluidoIds,
        usos_atuais: usosAtuais,
      } as CupomComRelacionamentos;
    })
  );

  return completos;
}

export async function criarCupom(supabase: SupabaseClient, dados: DadosNovoCupom) {
  const { categoria_ids, produto_ids, produto_excluido_ids, ...cupomBase } = dados;

  const { data: cupom, error } = await supabase.from("coupons").insert(cupomBase).select().single();
  if (error || !cupom) return { error };

  await salvarEscopoDoCupom(supabase, cupom.id, { categoria_ids, produto_ids, produto_excluido_ids });
  return { error: null };
}

export async function atualizarCupom(supabase: SupabaseClient, id: string, dados: DadosNovoCupom) {
  const { categoria_ids, produto_ids, produto_excluido_ids, ...cupomBase } = dados;

  const { error } = await supabase.from("coupons").update(cupomBase).eq("id", id);
  if (error) return { error };

  await salvarEscopoDoCupom(supabase, id, { categoria_ids, produto_ids, produto_excluido_ids });
  return { error: null };
}

async function salvarEscopoDoCupom(
  supabase: SupabaseClient,
  cupomId: string,
  escopo: { categoria_ids: string[]; produto_ids: string[]; produto_excluido_ids: string[] }
) {
  // Reescreve as relações do zero — mais simples e seguro que fazer diff.
  await Promise.all([
    supabase.from("coupon_categories").delete().eq("coupon_id", cupomId),
    supabase.from("coupon_products").delete().eq("coupon_id", cupomId),
    supabase.from("coupon_excluded_products").delete().eq("coupon_id", cupomId),
  ]);

  const inserts: PromiseLike<unknown>[] = [];
  if (escopo.categoria_ids.length > 0) {
    inserts.push(
      supabase.from("coupon_categories").insert(
        escopo.categoria_ids.map((categoria_id) => ({ coupon_id: cupomId, categoria_id }))
      )
    );
  }
  if (escopo.produto_ids.length > 0) {
    inserts.push(
      supabase.from("coupon_products").insert(
        escopo.produto_ids.map((produto_id) => ({ coupon_id: cupomId, produto_id }))
      )
    );
  }
  if (escopo.produto_excluido_ids.length > 0) {
    inserts.push(
      supabase.from("coupon_excluded_products").insert(
        escopo.produto_excluido_ids.map((produto_id) => ({ coupon_id: cupomId, produto_id }))
      )
    );
  }
  await Promise.all(inserts);
}

export async function alterarStatusCupom(supabase: SupabaseClient, id: string, ativo: boolean) {
  return supabase.from("coupons").update({ ativo }).eq("id", id);
}

export async function excluirCupom(supabase: SupabaseClient, id: string) {
  return supabase.from("coupons").update({ deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
}
