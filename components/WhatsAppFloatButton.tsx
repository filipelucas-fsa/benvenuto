"use client";

import WhatsAppIcon from "./icons/WhatsAppIcon";

export default function WhatsAppFloatButton() {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5575900000000";
  return (
    <a
      href={`https://wa.me/${numero}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group focus-ring fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-benvenuto-green text-benvenuto-cream shadow-xl shadow-black/40 transition-all duration-300 hover:scale-110 hover:shadow-benvenuto-green/50 active:scale-95"
    >
      <span className="absolute inset-0 rounded-full bg-benvenuto-green opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60" />
      <WhatsAppIcon size={26} className="relative" />
    </a>
  );
}
