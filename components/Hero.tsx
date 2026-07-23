"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bike, ChevronRight, Leaf, Clock3 } from "lucide-react";

const DIFERENCIAIS = [
  { icone: Bike, texto: "Entrega rápida em Feira de Santana" },
  { icone: Leaf, texto: "Ingredientes selecionados" },
  { icone: Clock3, texto: "Aberto todos os dias" },
];

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let removerScroll: (() => void) | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(".hero-title", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.3")
        .fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .fromTo(".hero-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, "-=0.4")
        .fromTo(".hero-diferencial", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.2");

      const onScroll = () => {
        const y = window.scrollY;
        if (imgRef.current) imgRef.current.style.transform = `translateY(${y * 0.15}px) scale(1.08)`;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      removerScroll = () => window.removeEventListener("scroll", onScroll);
    })();
    return () => removerScroll?.();
  }, []);

  const embers = Array.from({ length: 14 });

  return (
    <section className="relative flex min-h-[720px] w-full items-center overflow-hidden bg-benvenuto-black pb-16 pt-28">
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero-pizza-forno.jpg"
          alt="Pizza artesanal saindo do forno a lenha da Benvenuto"
          fill
          priority
          className="object-cover object-center opacity-85"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-benvenuto-black via-benvenuto-black/75 to-benvenuto-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-benvenuto-black/90 via-benvenuto-black/40 to-transparent" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {embers.map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-benvenuto-gold/70 animate-flicker"
            style={{
              left: `${(i * 7.3) % 100}%`,
              bottom: `${(i * 11) % 60}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              animationDelay: `${i * 0.35}s`,
              filter: "blur(0.5px)",
              boxShadow: "0 0 6px rgba(201,162,39,0.6)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
        <p className="hero-eyebrow mb-2 font-display text-2xl italic text-benvenuto-red opacity-0 sm:text-3xl">
          O verdadeiro sabor
        </p>
        <h1 className="hero-title max-w-2xl font-display text-5xl font-black uppercase leading-[1.05] tracking-tight text-benvenuto-cream opacity-0 sm:text-6xl md:text-7xl">
          Da Itália
          <span className="block text-benvenuto-green">na sua mesa!</span>
        </h1>
        <p className="hero-sub mt-6 max-w-md font-body text-base text-benvenuto-cream/75 opacity-0 sm:text-lg">
          Pizzas artesanais feitas com ingredientes selecionados e muito amor em cada detalhe.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta focus-ring flex items-center gap-2 rounded-full bg-benvenuto-red px-6 py-3.5 font-semibold text-benvenuto-cream opacity-0 shadow-lg shadow-benvenuto-red/30 transition-all hover:scale-[1.03] hover:bg-benvenuto-red-dark active:scale-95"
          >
            <Bike size={18} /> Peça agora
          </a>
          <Link
            href="/cardapio"
            className="hero-cta focus-ring flex items-center gap-1.5 rounded-full border border-benvenuto-cream/25 bg-benvenuto-black/60 px-6 py-3.5 font-semibold text-benvenuto-cream opacity-0 backdrop-blur-sm transition-all hover:scale-[1.03] hover:border-benvenuto-cream/50 active:scale-95"
          >
            Ver cardápio <ChevronRight size={16} />
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          {DIFERENCIAIS.map(({ icone: Icone, texto }) => (
            <div key={texto} className="hero-diferencial flex items-center gap-2.5 opacity-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-benvenuto-red/40 text-benvenuto-red">
                <Icone size={16} />
              </span>
              <span className="max-w-[9rem] text-xs leading-tight text-benvenuto-cream/70">{texto}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
