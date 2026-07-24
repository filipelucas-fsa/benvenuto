"use client";

import { useState, useTransition } from "react";
import { excluirCategoria } from "./actions";

export default function ExcluirCategoriaButton({ id, nome }: { id: string; nome: string }) {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const handleClick = () => {
    if (!confirm(`Excluir a categoria "${nome}"? Produtos vinculados a ela deixarão de aparecer com categoria definida.`)) return;
    setErro(null);
    startTransition(async () => {
      const resultado = await excluirCategoria(id);
      if (!resultado.sucesso) setErro(resultado.mensagem);
    });
  };

  return (
    <div className="text-right">
      <button onClick={handleClick} disabled={isPending} className="text-benvenuto-red hover:underline disabled:opacity-40">
        {isPending ? "Excluindo…" : "Excluir"}
      </button>
      {erro && <p className="mt-1 text-xs text-benvenuto-red">{erro}</p>}
    </div>
  );
}
