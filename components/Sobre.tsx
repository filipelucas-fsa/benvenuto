import Image from "next/image";

export default function Sobre() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-benvenuto-charcoal py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-2">
        <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-2xl border border-benvenuto-gold/15 shadow-2xl shadow-black/50 md:order-1">
          <Image
            src="/images/salao-benvenuto.jpg"
            alt="Salão acolhedor do Benvenuto Restaurante & Pizzaria"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 40vw, 90vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-benvenuto-black/40 to-transparent" />
        </div>

        <div className="order-1 md:order-2">
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.25em] text-benvenuto-gold">
            Nossa história
          </p>
          <h2 className="font-display text-4xl font-bold text-benvenuto-cream sm:text-5xl">
            Uma mesa italiana,
            <span className="italic text-benvenuto-red"> feita em família</span>
          </h2>
          <div className="divisor-dourado my-6 w-24" />
          <p className="max-w-md font-body leading-relaxed text-benvenuto-cream/75">
            O Benvenuto nasceu do sonho de trazer o sabor autêntico da culinária italiana para
            perto de casa — com massas frescas, pizzas fartas assadas em forno a lenha e aquele
            tempero de acolhimento que só se aprende de geração em geração.
          </p>
          <p className="mt-4 max-w-md font-body leading-relaxed text-benvenuto-cream/75">
            Aqui, cada prato é preparado para ser compartilhado. É comida farta, ambiente
            aconchegante e o tipo de experiência que faz o cliente voltar sempre.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-benvenuto-gold/10 pt-6">
            {[
              { valor: "+15", label: "anos de tradição" },
              { valor: "100%", label: "forno a lenha" },
              { valor: "5⭐", label: "avaliação média" },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-display text-2xl font-bold text-benvenuto-gold">{item.valor}</p>
                <p className="text-xs text-benvenuto-cream/60">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
