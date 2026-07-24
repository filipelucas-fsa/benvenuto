// ===== SERVICE =====
// Toda a regra de negócio de cupom mora aqui. Nem o carrinho, nem o admin,
// nem a Server Action decidem se um cupom é válido — eles só chamam esta
// camada e mostram o resultado.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ItemParaValidacao, ResultadoValidacaoCupom } from "./types";
import {
  buscarCupomPorCodigo,
  buscarEscopoDoCupom,
  contarUsosDoCupom,
} from "./repository";

function itemElegivel(
  item: ItemParaValidacao,
  escopo: { categoriaIds: string[]; produtoIds: string[]; produtoExcluidoIds: string[] },
  escopoProdutos: "todos" | "categorias" | "produtos"
): boolean {
  if (escopo.produtoExcluidoIds.includes(item.produtoId)) return false;

  if (escopoProdutos === "todos") return true;
  if (escopoProdutos === "categorias") return escopo.categoriaIds.includes(item.categoriaId);
  if (escopoProdutos === "produtos") return escopo.produtoIds.includes(item.produtoId);
  return false;
}

export async function validarEAplicarCupom(
  supabase: SupabaseClient,
  codigo: string,
  itens: ItemParaValidacao[]
): Promise<ResultadoValidacaoCupom> {
  if (!codigo.trim()) {
    return { valido: false, mensagem: "Informe um código de cupom." };
  }

  const cupom = await buscarCupomPorCodigo(supabase, codigo);
  if (!cupom) {
    return { valido: false, mensagem: "Cupom não encontrado." };
  }

  if (!cupom.ativo) {
    return { valido: false, mensagem: "Este cupom não está mais ativo." };
  }

  const agora = new Date();
  if (cupom.data_inicio && agora < new Date(cupom.data_inicio)) {
    return { valido: false, mensagem: "Este cupom ainda não é válido." };
  }
  if (cupom.data_fim && agora > new Date(cupom.data_fim)) {
    return { valido: false, mensagem: "Este cupom expirou." };
  }

  if (cupom.limite_uso != null) {
    const usos = await contarUsosDoCupom(supabase, cupom.id);
    if (usos >= cupom.limite_uso) {
      return { valido: false, mensagem: "Este cupom atingiu o limite de utilizações." };
    }
  }

  const subtotalCarrinho = itens.reduce((acc, i) => acc + i.precoUnitario * i.quantidade, 0);
  if (subtotalCarrinho < cupom.valor_minimo) {
    return {
      valido: false,
      mensagem: `Este cupom exige um pedido mínimo de ${cupom.valor_minimo.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}.`,
    };
  }

  const escopo = await buscarEscopoDoCupom(supabase, cupom.id);
  const itensElegiveis = itens.filter((item) => itemElegivel(item, escopo, cupom.escopo_produtos));

  if (itensElegiveis.length === 0) {
    return { valido: false, mensagem: "Este cupom não se aplica aos itens do seu carrinho." };
  }

  const baseElegivel = itensElegiveis.reduce((acc, i) => acc + i.precoUnitario * i.quantidade, 0);

  let desconto =
    cupom.tipo_desconto === "percentual"
      ? baseElegivel * (cupom.valor_desconto / 100)
      : cupom.valor_desconto;

  // Nunca deixa o desconto ultrapassar o valor elegível do carrinho.
  desconto = Math.min(desconto, baseElegivel);
  desconto = Math.round(desconto * 100) / 100;

  return {
    valido: true,
    mensagem: "Cupom aplicado com sucesso!",
    cupom,
    descontoAplicado: desconto,
    novoSubtotal: Math.round((subtotalCarrinho - desconto) * 100) / 100,
  };
}
