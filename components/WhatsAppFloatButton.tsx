"use client";

export default function WhatsAppFloatButton() {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5575900000000";
  return (
    <a
      href={`https://wa.me/${numero}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="focus-ring fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-benvenuto-green text-2xl shadow-xl shadow-black/40 transition-transform hover:scale-110 active:scale-95"
    >
      📲
    </a>
  );
}
