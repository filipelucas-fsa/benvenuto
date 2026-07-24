"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminNavLinks from "./AdminNavLinks";
import LogoutButton from "./LogoutButton";

export default function AdminMobileNav({ email }: { email?: string }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="border-b border-benvenuto-gold/10 bg-benvenuto-charcoal px-5 py-3.5 md:hidden">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-bold text-benvenuto-cream">
          Benvenuto<span className="text-benvenuto-gold">.</span> Admin
        </p>
        <button
          onClick={() => setAberto((v) => !v)}
          aria-label="Abrir menu"
          className="focus-ring text-benvenuto-cream"
        >
          {aberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {aberto && (
        <div className="mt-4 border-t border-benvenuto-gold/10 pt-4">
          <AdminNavLinks onNavigate={() => setAberto(false)} />
          <div className="mt-6 border-t border-benvenuto-gold/10 pt-4">
            <p className="mb-2 truncate text-xs text-benvenuto-cream/40">{email}</p>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
