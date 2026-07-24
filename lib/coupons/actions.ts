"use server";

// ===== CONTROLLER (uso público, chamado pelo carrinho) =====
// Só orquestra: pega a sessão/cliente Supabase e chama o Service.
// Nenhuma regra de desconto é decidida aqui.

import { createServerSupabase } from "@/lib/supabase/server";
import { validarEAplicarCupom } from "./service";
import { registrarUsoDoCupom } from "./repository";
import type { ItemParaValidacao, ResultadoValidacaoCupom } from "./types";

export async function validarCupomAction(
  codigo: string,
  itens: ItemParaValidacao[]
): Promise<ResultadoValidacaoCupom> {
  const supabase = await createServerSupabase();
  return validarEAplicarCupom(supabase, codigo, itens);
}

// Chamado no momento em que o pedido é finalizado (mensagem do WhatsApp aberta),
// pra manter a contagem de utilizações coerente com o `limite_uso` do cupom.
export async function registrarUsoCupomAction(params: {
  cupomId: string;
  valorDescontoAplicado: number;
  clienteTelefone?: string;
}) {
  const supabase = await createServerSupabase();
  await registrarUsoDoCupom(supabase, params);
}
