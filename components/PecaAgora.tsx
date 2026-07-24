import Link from "next/link";
import { Globe, Bike, Clock3 } from "lucide-react";
import WhatsAppIcon from "./icons/WhatsAppIcon";

const OPCOES = [
  { label: "Pelo cardápio online", icone: Globe, href: "/cardapio" },
  { label: "Pelo WhatsApp", icone: WhatsAppIcon, href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` },
  { label: "Entrega rápida", icone: Bike, href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` },
];

export default function PecaAgora() {
  return (
    <section className="bg-benvenuto-red py-16">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <h2 className="font-display text-3xl font-black uppercase leading-tight text-benvenuto-cream sm:text-4xl">
          Peça agora
          <span className="block">pelo seu jeito</span>
        </h2>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {OPCOES.map(({ label, icone: Icone, href }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="focus-ring flex flex-col items-center gap-3 rounded-2xl border border-benvenuto-cream/20 bg-benvenuto-red-dark/40 px-4 py-6 transition-all hover:-translate-y-1 hover:bg-benvenuto-red-dark/60"
            >
              <Icone size={26} className="text-benvenuto-cream" />
              <span className="text-sm font-semibold text-benvenuto-cream">{label}</span>
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-9 flex max-w-md items-center gap-3 rounded-xl bg-benvenuto-cream/95 px-4 py-3 text-left text-benvenuto-black">
          <Clock3 size={20} className="shrink-0 text-benvenuto-black/70" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">Aberto todos os dias! Das 17h às 00h</p>
          </div>
          <span className="shrink-0 rounded-full bg-benvenuto-green/15 px-2.5 py-1 text-xs font-semibold text-benvenuto-green">
            Aberto agora
          </span>
        </div>
      </div>
    </section>
  );
}
