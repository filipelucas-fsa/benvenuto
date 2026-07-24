"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-benvenuto-black px-5">
      <form onSubmit={entrar} className="w-full max-w-sm rounded-2xl border border-benvenuto-gold/15 bg-benvenuto-charcoal p-8">
        <h1 className="mb-1 font-display text-2xl font-bold text-benvenuto-cream">Painel administrativo</h1>
        <p className="mb-6 text-sm text-benvenuto-cream/50">Benvenuto Restaurante & Pizzaria</p>

        <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus-ring mb-4 w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
        />

        <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">Senha</label>
        <input
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="focus-ring mb-4 w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
        />

        {erro && <p className="mb-4 text-xs text-benvenuto-red">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="focus-ring w-full rounded-full bg-benvenuto-red py-3 font-semibold text-benvenuto-cream transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {carregando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
