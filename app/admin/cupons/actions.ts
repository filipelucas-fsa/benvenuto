"use server";

// ===== CONTROLLER (uso administrativo) =====
// Faz a ponte entre os formulários do painel e a camada de Repository.
// A validação de negócio de uso do cupom (o que roda no carrinho) fica em
// lib/coupons/service.ts — aqui é só CRUD administrativo.

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  criarCupom,
  atualizarCupom,
  alterarStatusCupom,
  excluirCupom,
} from "@/lib/coupons/repository";
import type { DadosNovoCupom, TipoDesconto, EscopoProdutos } from "@/lib/coupons/types";

export interface EstadoFormularioCupom {
  sucesso: boolean;
  mensagem: string;
}

function lerDadosDoFormulario(formData: FormData): DadosNovoCupom | { erro: string } {
  const nome_interno = String(formData.get("nome_interno") ?? "").trim();
  const codigo = String(formData.get("codigo") ?? "").trim();
  const tipo_desconto = String(formData.get("tipo_desconto") ?? "fixo") as TipoDesconto;
  const valor_desconto = Number(String(formData.get("valor_desconto") ?? "0").replace(",", "."));
  const escopo_produtos = String(formData.get("escopo_produtos") ?? "todos") as EscopoProdutos;
  const limiteUsoRaw = String(formData.get("limite_uso") ?? "").trim();
  const valor_minimo = Number(String(formData.get("valor_minimo") ?? "0").replace(",", ".")) || 0;
  const data_inicio = String(formData.get("data_inicio") ?? "").trim();
  const data_fim = String(formData.get("data_fim") ?? "").trim();

  if (!nome_interno) return { erro: "Informe o nome interno do cupom." };
  if (!codigo) return { erro: "Informe o código do cupom." };
  if (Number.isNaN(valor_desconto) || valor_desconto <= 0) return { erro: "Valor do desconto inválido." };
  if (tipo_desconto === "percentual" && valor_desconto > 100) {
    return { erro: "Desconto percentual não pode passar de 100%." };
  }

  return {
    nome_interno,
    codigo: codigo.toUpperCase(),
    tipo_desconto,
    valor_desconto,
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    ativo: formData.get("ativo") === "on",
    data_inicio: data_inicio ? new Date(data_inicio).toISOString() : null,
    data_fim: data_fim ? new Date(data_fim).toISOString() : null,
    limite_uso: limiteUsoRaw ? Number(limiteUsoRaw) : null,
    valor_minimo,
    escopo_produtos,
    acumulativo: formData.get("acumulativo") === "on",
    categoria_ids: formData.getAll("categoria_ids").map(String),
    produto_ids: formData.getAll("produto_ids").map(String),
    produto_excluido_ids: formData.getAll("produto_excluido_ids").map(String),
  };
}

export async function salvarCupom(
  _estadoAnterior: EstadoFormularioCupom | null,
  formData: FormData
): Promise<EstadoFormularioCupom> {
  const dados = lerDadosDoFormulario(formData);
  if ("erro" in dados) return { sucesso: false, mensagem: dados.erro };

  const supabase = await createServerSupabase();
  const id = formData.get("id") as string | null;

  const { error } = id
    ? await atualizarCupom(supabase, id, dados)
    : await criarCupom(supabase, dados);

  if (error) {
    const mensagem = error.code === "23505"
      ? "Já existe um cupom com esse código."
      : `Erro ao salvar: ${error.message}`;
    return { sucesso: false, mensagem };
  }

  revalidatePath("/admin/cupons");
  return { sucesso: true, mensagem: id ? "Cupom atualizado!" : "Cupom criado!" };
}

export async function alternarStatusCupomAction(id: string, ativo: boolean) {
  const supabase = await createServerSupabase();
  const { error } = await alterarStatusCupom(supabase, id, ativo);
  revalidatePath("/admin/cupons");
  if (error) return { sucesso: false, mensagem: error.message };
  return { sucesso: true, mensagem: ativo ? "Cupom ativado." : "Cupom desativado." };
}

export async function excluirCupomAction(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await excluirCupom(supabase, id);
  revalidatePath("/admin/cupons");
  if (error) return { sucesso: false, mensagem: error.message };
  return { sucesso: true, mensagem: "Cupom excluído." };
}
