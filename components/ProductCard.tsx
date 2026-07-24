"use client";

import Image from "next/image";
import { Plus, Flame } from "lucide-react";
import type { Produto } from "@/types/database";
import { useCart } from "@/lib/store/cart";

const formatarPreco = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ProductCard({ produto }: { produto: Produto }) {
  const addItem = useCart((s) => s.addItem);
  const precoFinal = produto.preco_promocional ?? produto.preco;
  const emPromocao = produto.preco_promocional != null && produto.preco_promocional < produto.preco;
  const percentualDesconto = emPromocao
    ? Math.round(100 - (produto.preco_promocional! / produto.preco) * 100)
    : 0;
  const esgotado = !produto.disponivel;

  const CORES_BADGE: Record<string, string> = {
    tradicional: "bg-benvenuto-green text-benvenuto-cream",
    premium: "bg-benvenuto-gold text-benvenuto-black",
    novidade: "bg-benvenuto-red text-benvenuto-cream",
    benvenuto: "bg-benvenuto-black text-benvenuto-cream border border-benvenuto-gold/40",
  };
  const corBadgeCustom = produto.badge_texto
    ? CORES_BADGE[produto.badge_texto.toLowerCase()] ?? "bg-benvenuto-green text-benvenuto-cream"
    : "";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal transition-all duration-300 ${
        esgotado
          ? "opacity-60"
          : "hover:-translate-y-1 hover:border-benvenuto-gold/30 hover:shadow-2xl hover:shadow-black/50"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-benvenuto-black">
        {produto.imagem_url ? (
          <Image
            src={produto.imagem_url}
            alt={produto.nome}
            fill
            className={`object-cover transition-transform duration-500 ${!esgotado && "group-hover:scale-110"}`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🍕</div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {produto.badge_texto && !esgotado && (
            <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-md ${corBadgeCustom}`}>
              {produto.badge_texto}
            </span>
          )}
          {produto.destaque && !esgotado && (
            <span className="flex w-fit items-center gap-1 rounded-full bg-benvenuto-red px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-benvenuto-cream shadow-md">
              <Flame size={11} /> Mais pedida
            </span>
          )}
        </div>
        {emPromocao && !esgotado && (
          <span className="absolute right-3 top-3 rounded-full bg-benvenuto-gold px-2.5 py-1 text-[10px] font-bold text-benvenuto-black shadow-md">
            -{percentualDesconto}%
          </span>
        )}

        {esgotado && (
          <div className="absolute inset-0 flex items-center justify-center bg-benvenuto-black/60">
            <span className="rounded-full border border-benvenuto-cream/30 bg-benvenuto-black/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-benvenuto-cream/80">
              Esgotado
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold text-benvenuto-cream">{produto.nome}</h3>
        {produto.descricao && (
          <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-benvenuto-cream/60">
            {produto.descricao}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            {emPromocao && (
              <span className="mr-2 text-xs text-benvenuto-cream/40 line-through">
                {formatarPreco(produto.preco)}
              </span>
            )}
            <span className="font-display text-lg font-bold text-benvenuto-gold">
              {formatarPreco(precoFinal)}
            </span>
          </div>
          <button
            onClick={() => !esgotado && addItem(produto)}
            disabled={esgotado}
            aria-label={esgotado ? `${produto.nome} esgotado` : `Adicionar ${produto.nome} ao carrinho`}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-benvenuto-red text-benvenuto-cream transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-benvenuto-cream/10 disabled:text-benvenuto-cream/30 disabled:hover:scale-100"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
