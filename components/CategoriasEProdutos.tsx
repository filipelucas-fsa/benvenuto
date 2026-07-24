"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pizza, CupSoda, ChefHat, Cookie, Package, UtensilsCrossed } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Categoria, Produto } from "@/types/database";

const BOTOES = [
  { id: "pizzas", nome: "Pizzas", icone: Pizza, slugs: ["pizzas-salgadas", "pizzas-doces"] },
  { id: "bebidas", nome: "Bebidas", icone: CupSoda, slugs: ["bebidas-geladas", "vinhos"] },
  { id: "porcoes", nome: "Porções", icone: ChefHat, slugs: ["petiscos"] },
  { id: "sobremesa", nome: "Sobremesa", icone: Cookie, slugs: ["pizzas-doces"] },
  { id: "combos", nome: "Combos", icone: Package, slugs: ["combos"] },
];

const TODOS_ID = "__todos__";

export default function CategoriasEProdutos({
  categorias,
  produtos,
}: {
  categorias: Categoria[];
  produtos: Produto[];
}) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>(BOTOES[0].id);

  const produtosExibidos = useMemo(() => {
    if (categoriaAtiva === TODOS_ID) {
      return [...produtos]
        .sort((a, b) => Number(b.destaque) - Number(a.destaque) || a.ordem - b.ordem)
        .slice(0, 5);
    }

    const config = BOTOES.find((b) => b.id === categoriaAtiva);
    if (config) {
      const ids = categorias.filter((c) => config.slugs.includes(c.slug)).map((c) => c.id);
      return produtos
        .filter((p) => ids.includes(p.categoria_id))
        .sort((a, b) => Number(b.destaque) - Number(a.destaque) || a.ordem - b.ordem)
        .slice(0, 10);
    }

    return [];
  }, [produtos, categoriaAtiva, categorias]);

  const botaoAtivo = BOTOES.find((b) => b.id === categoriaAtiva);
  const titulo = botaoAtivo ? botaoAtivo.nome : "As mais pedidas";

  return (
    <>
      <section className="relative overflow-hidden py-14 text-benvenuto-black">
        <div className="absolute inset-0">
          <Image src="/images/new-backgrund.jpeg" alt="" fill className="object-cover" sizes="100vw" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5">
          <div className="mb-10 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-benvenuto-red" />
            <span className="h-px w-6 bg-benvenuto-green" />
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-benvenuto-black/70">
              Escolha por categoria
            </h2>
            <span className="h-px w-6 bg-benvenuto-green" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-benvenuto-red" />
          </div>

          <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-7">
            {BOTOES.map((botao) => {
              const Icone = botao.icone;
              const ativo = categoriaAtiva === botao.id;
              return (
                <button
                  key={botao.id}
                  onClick={() => setCategoriaAtiva(botao.id)}
                  aria-pressed={ativo}
                  className="group flex flex-col items-center gap-2.5 focus-ring"
                >
                  <span
                    className={`flex h-16 w-16 items-center justify-center rounded-full border-2 bg-benvenuto-cream/40 backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-1 group-active:scale-95 ${
                      ativo
                        ? "border-benvenuto-red bg-benvenuto-red text-benvenuto-cream shadow-lg shadow-benvenuto-red/30"
                        : "border-benvenuto-black/15 text-benvenuto-black/70 group-hover:border-benvenuto-red group-hover:text-benvenuto-red"
                    }`}
                  >
                    <Icone size={24} strokeWidth={1.75} />
                  </span>
                  <span className={`text-xs font-semibold transition-colors ${ativo ? "text-benvenuto-red" : "text-benvenuto-black/80"}`}>
                    {botao.nome}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => setCategoriaAtiva(TODOS_ID)}
              aria-pressed={categoriaAtiva === TODOS_ID}
              className="group flex flex-col items-center gap-2.5 focus-ring"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 bg-benvenuto-cream/40 backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-1 group-active:scale-95 ${
                  categoriaAtiva === TODOS_ID
                    ? "border-benvenuto-red bg-benvenuto-red text-benvenuto-cream shadow-lg shadow-benvenuto-red/30"
                    : "border-benvenuto-black/15 text-benvenuto-black/70 group-hover:border-benvenuto-red group-hover:text-benvenuto-red"
                }`}
              >
                <UtensilsCrossed size={24} strokeWidth={1.75} />
              </span>
              <span className={`text-xs font-semibold transition-colors ${categoriaAtiva === TODOS_ID ? "text-benvenuto-red" : "text-benvenuto-black/80"}`}>
                Todos
              </span>
            </button>
          </div>
        </div>
      </section>

      {produtosExibidos.length > 0 && (
        <section className="bg-benvenuto-black py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-1 items-center justify-center gap-3 sm:justify-start">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-benvenuto-red sm:hidden" />
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-benvenuto-cream/70">
                  {titulo}
                </h2>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-benvenuto-red sm:hidden" />
              </div>
              <Link
                href="/cardapio"
                className="focus-ring hidden shrink-0 rounded-full border border-benvenuto-gold/25 px-4 py-2 text-xs font-semibold text-benvenuto-cream/80 transition-colors hover:border-benvenuto-gold hover:text-benvenuto-cream sm:inline-block"
              >
                Ver cardápio completo →
              </Link>
            </div>

            <div
              key={categoriaAtiva}
              className="animate-fade-up grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5"
            >
              {produtosExibidos.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/cardapio" className="focus-ring inline-block text-sm font-semibold text-benvenuto-gold hover:underline">
                Ver cardápio completo →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
