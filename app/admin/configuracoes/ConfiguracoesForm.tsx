"use client";

import { useFormState, useFormStatus } from "react-dom";
import { salvarConfiguracoes, type EstadoFormulario } from "./actions";
import type { Configuracoes } from "@/types/database";

const estadoInicial: EstadoFormulario = { sucesso: false, mensagem: "" };

const CAMPOS = [
  { name: "nome_restaurante", label: "Nome do restaurante" },
  { name: "telefone", label: "Telefone" },
  { name: "whatsapp", label: "WhatsApp (DDI+DDD+número)" },
  { name: "endereco", label: "Endereço" },
  { name: "instagram", label: "Instagram (URL)" },
  { name: "facebook", label: "Facebook (URL)" },
] as const;

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-benvenuto-red py-3 font-semibold text-benvenuto-cream transition-transform hover:scale-[1.01] disabled:opacity-50"
    >
      {pending ? "Salvando…" : "Salvar configurações"}
    </button>
  );
}

export default function ConfiguracoesForm({ config }: { config: Partial<Configuracoes> | null }) {
  const [estado, formAction] = useFormState(salvarConfiguracoes, estadoInicial);

  return (
    <form action={formAction} className="max-w-lg space-y-4 rounded-2xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-6">
      {CAMPOS.map((f) => (
        <div key={f.name}>
          <label className="mb-1 block text-xs font-medium text-benvenuto-cream/70">{f.label}</label>
          <input
            name={f.name}
            defaultValue={(config?.[f.name as keyof Configuracoes] as string) ?? ""}
            className="focus-ring w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream"
          />
        </div>
      ))}

      {estado.mensagem && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
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
