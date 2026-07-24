"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/cardapio?categoria=combos", label: "Promoções" },
  { href: "#sobre", label: "Sobre nós" },
  { href: "#localizacao", label: "Contato" },
];

export default function Navbar() {
  const [solido, setSolido] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const items = useCart((s) => s.items);
  const abrirCarrinho = useCart((s) => s.open);
  const totalItens = items.reduce((acc, i) => acc + i.quantidade, 0);

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-3 z-40 flex justify-center px-3 sm:top-4">
      <header
        className={`w-full max-w-6xl rounded-full border transition-all duration-300 ease-out ${
          solido
            ? "border-white/10 bg-benvenuto-black/70 py-1.5 shadow-lg shadow-black/40 backdrop-blur-2xl"
            : "border-white/[0.08] bg-benvenuto-black/40 py-2.5 shadow-md shadow-black/20 backdrop-blur-xl"
        }`}
        style={{ width: "90%" }}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuAberto((v) => !v)}
              aria-label="Menu"
              className="focus-ring text-benvenuto-cream md:hidden"
            >
              {menuAberto ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-benvenuto-gold/30 transition-transform group-hover:scale-105">
                <Image src="/images/logo-benvenuto.png" alt="Benvenuto" fill className="object-cover" />
              </span>
              <span className="hidden font-display text-lg font-bold tracking-wide text-benvenuto-cream sm:inline">
                Benvenuto
              </span>
            </Link>
          </div>

          <ul className="hidden items-center gap-7 md:flex">
            {LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="focus-ring text-sm font-medium text-benvenuto-cream/80 transition-colors hover:text-benvenuto-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={abrirCarrinho}
            aria-label="Abrir carrinho"
            className="focus-ring relative flex items-center gap-2 rounded-full bg-benvenuto-red px-3.5 py-2 text-benvenuto-cream transition-transform hover:scale-105"
          >
            <ShoppingBag size={16} />
            <span className="hidden text-sm font-semibold sm:inline">Carrinho</span>
            {totalItens > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-benvenuto-gold text-[11px] font-bold text-benvenuto-black">
                {totalItens}
              </span>
            )}
          </button>
        </nav>

        {menuAberto && (
          <ul className="mt-2 flex flex-col gap-1 border-t border-white/10 px-5 py-4 md:hidden">
            {LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuAberto(false)}
                  className="block py-2.5 text-benvenuto-cream/90"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}
