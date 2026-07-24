import { ClipboardList, Store, Bike, UtensilsCrossed } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import StatusSelect from "./StatusSelect";
import type { PedidoStatus } from "@/types/database";

const ICONE_ENTREGA = { retirada: Store, entrega: Bike, mesa: UtensilsCrossed };

const ESTILO_STATUS: Record<PedidoStatus, string> = {
  recebido: "bg-benvenuto-gold/15 text-benvenuto-gold",
  em_preparo: "bg-benvenuto-red/15 text-benvenuto-red",
  saiu_entrega: "bg-blue-500/15 text-blue-400",
  finalizado: "bg-benvenuto-green/15 text-benvenuto-green",
  cancelado: "bg-benvenuto-cream/10 text-benvenuto-cream/40",
};

const LABEL_STATUS: Record<PedidoStatus, string> = {
  recebido: "Recebido",
  em_preparo: "Em preparo",
  saiu_entrega: "Saiu p/ entrega",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

export default async function PedidosPage() {
  const supabase = await createServerSupabase();
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*")
    .eq("deleted", false)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-benvenuto-cream">Pedidos</h1>
        <p className="mt-1 text-sm text-benvenuto-cream/50">Acompanhe e atualize o status de cada pedido.</p>
      </div>

      {(!pedidos || pedidos.length === 0) ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-benvenuto-gold/15 py-16 text-center">
          <ClipboardList size={32} className="mb-3 text-benvenuto-cream/25" />
          <p className="text-benvenuto-cream/45">Nenhum pedido ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido) => {
            const IconeEntrega = ICONE_ENTREGA[pedido.tipo_entrega as keyof typeof ICONE_ENTREGA] ?? Store;
            return (
              <div
                key={pedido.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-benvenuto-gold/10 bg-benvenuto-charcoal p-4 transition-colors hover:border-benvenuto-gold/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-benvenuto-black text-benvenuto-cream/60">
                    <IconeEntrega size={17} />
                  </div>
                  <div>
                    <p className="font-semibold text-benvenuto-cream">
                      {pedido.codigo} — {pedido.cliente_nome}
                    </p>
                    <p className="text-xs text-benvenuto-cream/50">
                      {new Date(pedido.created_at).toLocaleString("pt-BR")} ·{" "}
                      <span className="font-medium text-benvenuto-gold">
                        {Number(pedido.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ESTILO_STATUS[pedido.status as PedidoStatus]}`}>
                    {LABEL_STATUS[pedido.status as PedidoStatus]}
                  </span>
                  <StatusSelect id={pedido.id} statusAtual={pedido.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
