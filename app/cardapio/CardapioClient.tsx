"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Categoria, Produto } from "@/types/database";

export default function CardapioClient({
  categorias,
  produtos,
  categoriaInicialSlug,
}: {
  categorias: Categoria[];
  produtos: Produto[];
  categoriaInicialSlug?: string;
}) {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(() => {
    if (!categoriaInicialSlug) return null;
    return categorias.find((c) => c.slug === categoriaInicialSlug)?.id ?? null;
  });

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const combinaCategoria = !categoriaAtiva || p.categoria_id === categoriaAtiva;
      const combinaBusca =
        !busca || p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (p.descricao ?? "").toLowerCase().includes(busca.toLowerCase());
      return combinaCategoria && combinaBusca;
    });
  }, [produtos, busca, categoriaAtiva]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-benvenuto-cream/40" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar no cardápio…"
            className="focus-ring w-full rounded-full border border-benvenuto-gold/15 bg-benvenuto-charcoal py-3 pl-11 pr-4 text-sm text-benvenuto-cream placeholder:text-benvenuto-cream/35"
          />
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoriaAtiva(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            categoriaAtiva === null
              ? "bg-benvenuto-red text-benvenuto-cream"
              : "border border-benvenuto-gold/15 text-benvenuto-cream/60 hover:border-benvenuto-gold/40"
          }`}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaAtiva(cat.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              categoriaAtiva === cat.id
                ? "bg-benvenuto-red text-benvenuto-cream"
                : "border border-benvenuto-gold/15 text-benvenuto-cream/60 hover:border-benvenuto-gold/40"
            }`}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {produtosFiltrados.length === 0 ? (
        <p className="py-16 text-center text-benvenuto-cream/50">
          Nenhum item encontrado. Tente outra busca.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {produtosFiltrados.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
}
