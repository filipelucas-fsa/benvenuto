import { Star } from "lucide-react";
import type { Avaliacao } from "@/types/database";

// Preparado para receber dados reais do Supabase (tabela `avaliacoes`)
// e, futuramente, integração com Google Reviews via `fonte: "google"`.
export default function Depoimentos({ avaliacoes = [] as Avaliacao[] }) {
  const lista = avaliacoes.length > 0 ? avaliacoes : PLACEHOLDER;

  return (
    <section className="bg-benvenuto-charcoal py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-benvenuto-gold">
            Quem já provou
          </p>
          <h2 className="font-display text-4xl font-bold text-benvenuto-cream sm:text-5xl">
            Histórias à mesa
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {lista.map((a, i) => (
            <div
              key={i}
              className="rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-black p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-3 flex gap-0.5 text-benvenuto-gold">
                {Array.from({ length: a.nota }).map((_, j) => (
                  <Star key={j} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-benvenuto-cream/75">"{a.comentario}"</p>
              <p className="mt-4 text-xs font-semibold text-benvenuto-cream/50">— {a.autor_nome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLACEHOLDER: Avaliacao[] = [
  { id: "1", autor_nome: "Marina S.", nota: 5, comentario: "Melhor pizza da região, ambiente super acolhedor!", fonte: "manual", aprovado: true, created_at: "" },
  { id: "2", autor_nome: "Carlos A.", nota: 5, comentario: "Massa fresquinha e atendimento excelente. Voltarei sempre.", fonte: "manual", aprovado: true, created_at: "" },
  { id: "3", autor_nome: "Beatriz L.", nota: 5, comentario: "Comida farta, sabor de família. Recomendo demais!", fonte: "manual", aprovado: true, created_at: "" },
];
