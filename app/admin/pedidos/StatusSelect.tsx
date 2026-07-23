"use client";

import { useState, useTransition } from "react";
import type { PedidoStatus } from "@/types/database";
import { atualizarStatusPedido } from "./actions";

const STATUS: { valor: PedidoStatus; label: string }[] = [
  { valor: "recebido", label: "Recebido" },
  { valor: "em_preparo", label: "Em preparo" },
  { valor: "saiu_entrega", label: "Saiu p/ entrega" },
  { valor: "finalizado", label: "Finalizado" },
  { valor: "cancelado", label: "Cancelado" },
];

export default function StatusSelect({ id, statusAtual }: { id: string; statusAtual: PedidoStatus }) {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const handleChange = (novoStatus: PedidoStatus) => {
    setErro(null);
    startTransition(async () => {
      const resultado = await atualizarStatusPedido(id, novoStatus);
      if (!resultado.sucesso) setErro(resultado.mensagem);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        defaultValue={statusAtual}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as PedidoStatus)}
        className="focus-ring rounded-lg border border-benvenuto-gold/20 bg-benvenuto-black px-3 py-2 text-sm text-benvenuto-cream disabled:opacity-50"
      >
        {STATUS.map((s) => (
          <option key={s.valor} value={s.valor}>{s.label}</option>
        ))}
      </select>
      {erro && <p className="max-w-[180px] text-right text-xs text-benvenuto-red">{erro}</p>}
    </div>
  );
}
