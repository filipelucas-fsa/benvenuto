"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { GaleriaItem } from "@/types/database";

const PLACEHOLDER: GaleriaItem[] = [
  { id: "1", imagem_url: "/images/forno-lenha.jpg", legenda: "Pizzas no forno a lenha", ordem: 1, ativo: true },
  { id: "2", imagem_url: "/images/salao-benvenuto.jpg", legenda: "Nosso salão", ordem: 2, ativo: true },
  { id: "3", imagem_url: "/images/bar-benvenuto.jpg", legenda: "Espaço do bar", ordem: 3, ativo: true },
];

// Layout masonry simples via CSS columns — aceita novas imagens sem alterar a estrutura.
export default function Galeria({ imagens = [] as GaleriaItem[] }) {
  const lista = imagens.length > 0 ? imagens : PLACEHOLDER;
  const [aberta, setAberta] = useState<GaleriaItem | null>(null);

  return (
    <section id="galeria" className="bg-benvenuto-black py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-benvenuto-gold">Galeria</p>
          <h2 className="font-display text-4xl font-bold text-benvenuto-cream sm:text-5xl">
            Um gostinho do ambiente
          </h2>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {lista.map((img) => (
            <button
              key={img.id}
              onClick={() => setAberta(img)}
              className="focus-ring group relative block w-full overflow-hidden rounded-xl border border-benvenuto-gold/10"
            >
              <Image
                src={img.imagem_url}
                alt={img.legenda ?? "Benvenuto"}
                width={600}
                height={450}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-benvenuto-black/0 transition-colors group-hover:bg-benvenuto-black/20" />
            </button>
          ))}
        </div>
      </div>

      {aberta && (
        <div
          onClick={() => setAberta(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
        >
          <button className="absolute right-6 top-6 text-benvenuto-cream" aria-label="Fechar">
            <X size={28} />
          </button>
          <div className="relative max-h-[85vh] max-w-4xl">
            <Image
              src={aberta.imagem_url}
              alt={aberta.legenda ?? "Benvenuto"}
              width={1200}
              height={900}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
