"use client";

import { useFormState, useFormStatus } from "react-dom";
import { salvarProduto, type EstadoFormulario } from "./actions";
import type { Categoria } from "@/types/database";

const estadoInicial: EstadoFormulario = { sucesso: false, mensagem: "" };

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="sm:col-span-2 rounded-full bg-benvenuto-red py-2.5 font-semibold text-benvenuto-cream disabled:opacity-50"
    >
      {pending ? "Salvando…" : "Salvar produto"}
    </button>
  );
}

export default function ProdutoForm({ categorias }: { categorias: Categoria[] }) {
  const [estado, formAction] = useFormState(salvarProduto, estadoInicial);

  return (
    <form action={formAction} className="mt-5 grid gap-3 sm:grid-cols-2">
      <input name="nome" placeholder="Nome" required className="rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream" />
      <select name="categoria_id" required defaultValue="" className="rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream">
        <option value="" disabled>Categoria</option>
        {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </select>
      <input name="preco" inputMode="decimal" placeholder="Preço (ex: 39.90)" required className="rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream" />
      <input name="imagem_url" placeholder="URL da imagem" className="rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream" />
      <select name="badge_texto" defaultValue="" className="rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream">
        <option value="">Sem selo</option>
        <option value="Tradicional">Tradicional</option>
        <option value="Premium">Premium</option>
        <option value="Novidade">Novidade</option>
        <option value="Benvenuto">Benvenuto</option>
      </select>
      <textarea name="descricao" placeholder="Descrição" className="sm:col-span-2 rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream" />
      <label className="flex items-center gap-2 text-sm text-benvenuto-cream/70">
        <input type="checkbox" name="disponivel" defaultChecked /> Disponível
      </label>
      <label className="flex items-center gap-2 text-sm text-benvenuto-cream/70">
        <input type="checkbox" name="destaque" /> Destaque
      </label>

      {estado.mensagem && (
        <p
          className={`sm:col-span-2 rounded-lg px-3 py-2 text-sm ${
            estado.sucesso
              ? "bg-benvenuto-green/15 text-benvenuto-green"
              : "bg-benvenuto-red/15 text-benvenuto-red"
          }`}
        >
          {estado.sucesso ? "✓" : "⚠"} {estado.mensagem}
        </p>
      )}

      <BotaoSalvar />
    </form>
  );
}
