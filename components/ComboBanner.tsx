import Image from "next/image";
import Link from "next/link";

export default function ComboBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] lg:aspect-[3/1]">
        <Image
          src="/images/combo-banner-bg.jpg"
          alt="Combo Perfeito: Pizza + Bebida"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-benvenuto-black/60 via-benvenuto-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="max-w-xs sm:max-w-sm">
              <h2 className="font-display text-3xl font-black uppercase leading-[0.95] text-benvenuto-cream drop-shadow-lg sm:text-4xl lg:text-5xl">
                Combo
              </h2>
              <h2 className="font-display text-3xl font-black uppercase leading-[0.95] text-benvenuto-red drop-shadow-lg sm:text-4xl lg:text-5xl">
                Perfeito
              </h2>
              <p className="mt-1 font-display text-lg italic text-benvenuto-cream/90 sm:text-xl">
                Pizza + Bebida
              </p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-benvenuto-cream/80">
                A partir de
              </p>
              <p className="font-display text-3xl font-black text-benvenuto-green drop-shadow sm:text-4xl">
                R$ 69,90
              </p>

              <Link
                href="/cardapio?categoria=combos"
                className="focus-ring mt-4 inline-block -rotate-1 rounded bg-benvenuto-red px-5 py-2 text-sm font-bold uppercase tracking-wide text-benvenuto-cream shadow-lg transition-transform hover:rotate-0 hover:scale-105"
              >
                Peça agora!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
