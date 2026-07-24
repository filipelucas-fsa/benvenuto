import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, MapPin, ChevronRight } from "lucide-react";
import WhatsAppIcon from "./icons/WhatsAppIcon";

const INFORMACOES = [
  { label: "Quem somos", href: "#sobre" },
  { label: "Política de privacidade", href: "#" },
  { label: "Termos de uso", href: "#" },
  { label: "Trabalhe conosco", href: "#" },
];

export default function Footer() {
  return (
    <footer id="localizacao" className="border-t border-benvenuto-gold/10 bg-benvenuto-black pt-16">
      <div className="mx-auto max-w-6xl px-5 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-benvenuto-gold/30">
                <Image src="/images/logo-benvenuto.png" alt="Benvenuto" fill className="object-cover" />
              </span>
              <p className="font-display text-lg font-bold text-benvenuto-cream">Benvenuto</p>
            </div>
            <p className="mt-3 max-w-xs text-sm text-benvenuto-cream/55">
              Tradição, sabor e qualidade que você sente em cada fatia desde 2017.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="focus-ring rounded-full border border-benvenuto-gold/20 p-2 text-benvenuto-cream/70 hover:border-benvenuto-gold hover:text-benvenuto-gold">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="focus-ring rounded-full border border-benvenuto-gold/20 p-2 text-benvenuto-cream/70 hover:border-benvenuto-gold hover:text-benvenuto-gold">
                <Facebook size={16} />
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="focus-ring rounded-full border border-benvenuto-gold/20 p-2 text-benvenuto-cream/70 hover:border-benvenuto-gold hover:text-benvenuto-gold"
              >
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-benvenuto-gold">Navegação</h3>
            <ul className="space-y-2.5 text-sm text-benvenuto-cream/60">
              <li><Link href="#sobre" className="hover:text-benvenuto-cream">Sobre</Link></li>
              <li><Link href="/cardapio" className="hover:text-benvenuto-cream">Cardápio</Link></li>
              <li><Link href="#galeria" className="hover:text-benvenuto-cream">Galeria</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-benvenuto-gold">Horário</h3>
            <ul className="space-y-2 text-sm text-benvenuto-cream/60">
              <li>Todos os dias</li>
              <li>Das 17h às 00h</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-benvenuto-gold">Informações</h3>
            <ul className="space-y-2.5 text-sm text-benvenuto-cream/60">
              {INFORMACOES.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="flex items-center justify-between gap-1 hover:text-benvenuto-cream">
                    {item.label} <ChevronRight size={14} className="opacity-40" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-benvenuto-gold/10 pt-6 text-center text-xs text-benvenuto-cream/40 sm:flex-row sm:justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> Feira de Santana, BA
          </span>
          <span>© {new Date().getFullYear()} Benvenuto Pizzaria. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
