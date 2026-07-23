"use client";

import { useFormState, useFormStatus } from "react-dom";
import { salvarCategoria, type EstadoFormulario } from "./actions";

const estadoInicial: EstadoFormulario = { sucesso: false, mensagem: "" };

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="sm:col-span-3 rounded-full bg-benvenuto-red py-2.5 font-semibold text-benvenuto-cream disabled:opacity-50"
    >
      {pending ? "Salvando…" : "Salvar categoria"}
    </button>
  );
}

export default function CategoriaForm() {
  const [estado, formAction] = useFormState(salvarCategoria, estadoInicial);

  return (
    <form action={formAction} className="mt-5 grid gap-3 sm:grid-cols-3">
      <input
        name="nome"
        placeholder="Nome (ex: Pizzas)"
        required
        className="rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream sm:col-span-2"
      />
      <input
        name="ordem"
        type="number"
        placeholder="Ordem"
        defaultValue={0}
        className="rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
      />
      <label className="flex items-center gap-2 text-sm text-benvenuto-cream/70 sm:col-span-3">
        <input type="checkbox" name="ativo" defaultChecked /> Ativa (visível no site)
      </label>

      {estado.mensagem && (
        <p
          className={`sm:col-span-3 rounded-lg px-3 py-2 text-sm ${
            estado.sucesso ? "bg-benvenuto-green/15 text-benvenuto-green" : "bg-benvenuto-red/15 text-benvenuto-red"
          }`}
        >
          {estado.sucesso ? "✓" : "⚠"} {estado.mensagem}
        </p>
      )}

      <BotaoSalvar />
    </form>
  );
}
