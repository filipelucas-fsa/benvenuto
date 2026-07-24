"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { salvarCupom, type EstadoFormularioCupom } from "./actions";
import type { CupomComRelacionamentos, EscopoProdutos } from "@/lib/coupons/types";
import type { Categoria, Produto } from "@/types/database";

const estadoInicial: EstadoFormularioCupom = { sucesso: false, mensagem: "" };

function paraDatetimeLocal(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-benvenuto-red py-3 font-semibold text-benvenuto-cream transition-transform hover:scale-[1.01] disabled:opacity-50"
    >
      {pending ? "Salvando…" : "Salvar cupom"}
    </button>
  );
}

export default function CupomModal({
  aberto,
  aoFechar,
  cupomExistente,
  categorias,
  produtos,
}: {
  aberto: boolean;
  aoFechar: () => void;
  cupomExistente: CupomComRelacionamentos | null;
  categorias: Categoria[];
  produtos: Produto[];
}) {
  const [estado, formAction] = useFormState(salvarCupom, estadoInicial);
  const [escopo, setEscopo] = useState<EscopoProdutos>(cupomExistente?.escopo_produtos ?? "todos");

  useEffect(() => {
    setEscopo(cupomExistente?.escopo_produtos ?? "todos");
  }, [cupomExistente, aberto]);

  useEffect(() => {
    if (estado.sucesso) {
      const timer = setTimeout(aoFechar, 900);
      return () => clearTimeout(timer);
    }
  }, [estado.sucesso, aoFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-benvenuto-gold/15 bg-benvenuto-charcoal p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-benvenuto-cream">
            {cupomExistente ? "Editar cupom" : "Novo cupom"}
          </h2>
          <button onClick={aoFechar} aria-label="Fechar" className="focus-ring text-benvenuto-cream/60 hover:text-benvenuto-cream">
            <X size={20} />
          </button>
        </div>

        <form action={formAction} className="space-y-4">
          {cupomExistente && <input type="hidden" name="id" value={cupomExistente.id} />}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Nome interno</label>
              <input
                name="nome_interno"
                defaultValue={cupomExistente?.nome_interno}
                placeholder="Ex: Campanha de aniversário"
                required
                className="w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Código do cupom</label>
              <input
                name="codigo"
                defaultValue={cupomExistente?.codigo}
                placeholder="PIZZA10"
                required
                className="w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm uppercase text-benvenuto-cream"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Tipo de desconto</label>
              <select
                name="tipo_desconto"
                defaultValue={cupomExistente?.tipo_desconto ?? "percentual"}
                className="w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
              >
                <option value="percentual">Porcentagem (%)</option>
                <option value="fixo">Valor fixo (R$)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Valor do desconto</label>
              <input
                name="valor_desconto"
                defaultValue={cupomExistente?.valor_desconto}
                placeholder="10"
                required
                inputMode="decimal"
                className="w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Descrição (opcional)</label>
              <textarea
                name="descricao"
                defaultValue={cupomExistente?.descricao ?? ""}
                rows={2}
                className="w-full resize-none rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Válido a partir de</label>
              <input
                type="datetime-local"
                name="data_inicio"
                defaultValue={paraDatetimeLocal(cupomExistente?.data_inicio ?? null)}
                className="w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Válido até</label>
              <input
                type="datetime-local"
                name="data_fim"
                defaultValue={paraDatetimeLocal(cupomExistente?.data_fim ?? null)}
                className="w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Limite de usos</label>
              <input
                name="limite_uso"
                defaultValue={cupomExistente?.limite_uso ?? ""}
                placeholder="Ilimitado"
                inputMode="numeric"
                className="w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Pedido mínimo (R$)</label>
              <input
                name="valor_minimo"
                defaultValue={cupomExistente?.valor_minimo ?? 0}
                inputMode="decimal"
                className="w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Onde o cupom vale</label>
              <select
                name="escopo_produtos"
                value={escopo}
                onChange={(e) => setEscopo(e.target.value as EscopoProdutos)}
                className="w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
              >
                <option value="todos">Todos os produtos</option>
                <option value="categorias">Categorias específicas</option>
                <option value="produtos">Produtos específicos</option>
              </select>
            </div>

            {escopo === "categorias" && (
              <div className="col-span-2 max-h-36 overflow-y-auto rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black p-3">
                {categorias.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 py-1 text-sm text-benvenuto-cream/80">
                    <input
                      type="checkbox"
                      name="categoria_ids"
                      value={cat.id}
                      defaultChecked={cupomExistente?.categoria_ids.includes(cat.id)}
                    />
                    {cat.nome}
                  </label>
                ))}
              </div>
            )}

            {escopo === "produtos" && (
              <div className="col-span-2 max-h-36 overflow-y-auto rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black p-3">
                {produtos.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 py-1 text-sm text-benvenuto-cream/80">
                    <input
                      type="checkbox"
                      name="produto_ids"
                      value={p.id}
                      defaultChecked={cupomExistente?.produto_ids.includes(p.id)}
                    />
                    {p.nome}
                  </label>
                ))}
              </div>
            )}

            <div className="col-span-2">
              <details>
                <summary className="cursor-pointer text-xs font-medium text-benvenuto-cream/60">
                  Excluir produtos específicos deste cupom (opcional)
                </summary>
                <div className="mt-2 max-h-36 overflow-y-auto rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black p-3">
                  {produtos.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 py-1 text-sm text-benvenuto-cream/80">
                      <input
                        type="checkbox"
                        name="produto_excluido_ids"
                        value={p.id}
                        defaultChecked={cupomExistente?.produto_excluido_ids.includes(p.id)}
                      />
                      {p.nome}
                    </label>
                  ))}
                </div>
              </details>
            </div>

            <label className="flex items-center gap-2 text-sm text-benvenuto-cream/70">
              <input type="checkbox" name="ativo" defaultChecked={cupomExistente?.ativo ?? true} /> Ativo
            </label>
            <label className="flex items-center gap-2 text-sm text-benvenuto-cream/70">
              <input type="checkbox" name="acumulativo" defaultChecked={cupomExistente?.acumulativo ?? false} />
              Acumula com outros cupons
            </label>
          </div>

          {estado.mensagem && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                estado.sucesso ? "bg-benvenuto-green/15 text-benvenuto-green" : "bg-benvenuto-red/15 text-benvenuto-red"
              }`}
            >
              {estado.sucesso ? "✓" : "⚠"} {estado.mensagem}
            </p>
          )}

          <BotaoSalvar />
        </form>
      </div>
    </div>
  );
}
