import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://benvenutorestaurante.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Benvenuto Restaurante & Pizzaria",
    template: "%s | Benvenuto Restaurante & Pizzaria",
  },
  description:
    "Massas e pizzas artesanais no forno a lenha, em um ambiente acolhedor e farto. Peça pelo WhatsApp ou reserve sua mesa.",
  openGraph: {
    title: "Benvenuto Restaurante & Pizzaria",
    description:
      "Massas e pizzas artesanais no forno a lenha, em um ambiente acolhedor e farto.",
    url: siteUrl,
    siteName: "Benvenuto Restaurante & Pizzaria",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/images/og-benvenuto.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Benvenuto Restaurante & Pizzaria",
    servesCuisine: ["Italiana", "Pizza", "Massas"],
    priceRange: "$$",
    acceptsReservations: "True",
    url: siteUrl,
  };

  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="font-body textura-massa textura-manjericao antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloatButton />
      </body>
    </html>
  );
}
