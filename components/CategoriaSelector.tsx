import Image from "next/image";
import Link from "next/link";
import { Pizza, CupSoda, Wine, ChefHat, IceCreamCone, Package, Grid2X2 } from "lucide-react";

const CATEGORIAS = [
  { nome: "Pizzas", slug: "pizzas-salgadas", icone: Pizza, ativo: true },
  { nome: "Bebidas", slug: "bebidas-geladas", icone: CupSoda },
  { nome: "Vinhos", slug: "vinhos", icone: Wine },
  { nome: "Porções", slug: "petiscos", icone: ChefHat },
  { nome: "Sobremesas", slug: "pizzas-doces", icone: IceCreamCone },
  { nome: "Combos", slug: "combos", icone: Package },
  { nome: "Todos", slug: "", icone: Grid2X2 },
];

export default function CategoriaSelector() {
  return (
    <section className="relative overflow-hidden py-14 text-benvenuto-black">
      {/* Textura de papel rasgado real — já traz as bordas denteadas embutidas na imagem */}
      <div className="absolute inset-0">
        <Image
          src="/images/categoria-textura-bg.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
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
          {CATEGORIAS.map(({ nome, slug, icone: Icone, ativo }) => (
            <Link
              key={nome}
              href={slug ? `/cardapio?categoria=${slug}` : "/cardapio"}
              className="group flex flex-col items-center gap-2.5"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 bg-benvenuto-cream/40 backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-1 ${
                  ativo
                    ? "border-benvenuto-red bg-benvenuto-red text-benvenuto-cream shadow-lg shadow-benvenuto-red/30"
                    : "border-benvenuto-black/15 text-benvenuto-black/70 group-hover:border-benvenuto-red group-hover:text-benvenuto-red"
                }`}
              >
                <Icone size={24} strokeWidth={1.75} />
              </span>
              <span className="text-xs font-semibold text-benvenuto-black/80">{nome}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
