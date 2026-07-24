"use client";

import { useTransition } from "react";
import { excluirProduto } from "./actions";

export default function ExcluirButton({ id, nome }: { id: string; nome: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`Excluir "${nome}"? Essa ação pode ser desfeita apenas pelo suporte técnico.`)) return;
    startTransition(() => excluirProduto(id));
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-benvenuto-red hover:underline disabled:opacity-40"
    >
      {isPending ? "Excluindo…" : "Excluir"}
    </button>
  );
}
