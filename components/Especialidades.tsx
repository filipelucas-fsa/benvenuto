import { Pizza, UtensilsCrossed, Beef, IceCream2, Wine } from "lucide-react";
import Reveal from "./Reveal";

const CATEGORIAS = [
  { nome: "Pizzas", icone: Pizza, desc: "No forno a lenha, do jeito tradicional" },
  { nome: "Massas", icone: UtensilsCrossed, desc: "Frescas, feitas todos os dias" },
  { nome: "Carnes", icone: Beef, desc: "Cortes selecionados e temperos italianos" },
  { nome: "Sobremesas", icone: IceCream2, desc: "O ponto doce da experiência" },
  { nome: "Bebidas", icone: Wine, desc: "Vinhos e drinks para acompanhar" },
];

export default function Especialidades() {
  return (
    <section id="especialidades" className="bg-benvenuto-black py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.25em] text-benvenuto-gold">
            Nossas especialidades
          </p>
          <h2 className="font-display text-4xl font-bold text-benvenuto-cream sm:text-5xl">
            Feito com fartura,
            <span className="italic text-benvenuto-green"> servido com carinho</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIAS.map((cat, i) => {
            const Icone = cat.icone;
            return (
              <Reveal key={cat.nome} delay={i * 80}>
                <div className="group h-full cursor-pointer rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-benvenuto-gold/40 hover:shadow-xl hover:shadow-benvenuto-red/10">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-benvenuto-red/15 text-benvenuto-red transition-colors group-hover:bg-benvenuto-red group-hover:text-benvenuto-cream">
                    <Icone size={26} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-benvenuto-cream">
                    {cat.nome}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-benvenuto-cream/55">{cat.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
