"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus, Trash2, Store, Bike, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { montarMensagemWhatsApp, gerarLinkWhatsApp } from "@/lib/whatsapp";

const formatarPreco = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const OPCOES_ENTREGA = [
  { valor: "retirada" as const, label: "Retirada", icone: Store },
  { valor: "entrega" as const, label: "Entrega", icone: Bike },
  { valor: "mesa" as const, label: "Na mesa", icone: UtensilsCrossed },
];

export default function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQuantidade, subtotal, clear } = useCart();
  const [nome, setNome] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"retirada" | "entrega" | "mesa">("retirada");
  const [endereco, setEndereco] = useState("");
  const [obs, setObs] = useState("");
  const [mostrarAvisoNome, setMostrarAvisoNome] = useState(false);
  const [mostrarAvisoEndereco, setMostrarAvisoEndereco] = useState(false);

  const numeroWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5575900000000";
  const totalItens = items.reduce((acc, i) => acc + i.quantidade, 0);

  const finalizarPedido = () => {
    const precisaEndereco = tipoEntrega === "entrega" && !endereco.trim();
    if (!nome.trim() || precisaEndereco || items.length === 0) {
      setMostrarAvisoNome(!nome.trim());
      setMostrarAvisoEndereco(precisaEndereco);
      return;
    }
    const mensagem = montarMensagemWhatsApp({
      nome,
      itens: items,
      tipoEntrega,
      endereco,
      observacoesGerais: obs,
    });
    window.open(gerarLinkWhatsApp(numeroWhatsApp, mensagem), "_blank");
    clear();
    close();
  };

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-benvenuto-charcoal shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-benvenuto-gold/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-benvenuto-cream">Seu pedido</h2>
            {totalItens > 0 && (
              <span className="rounded-full bg-benvenuto-red/15 px-2 py-0.5 text-xs font-semibold text-benvenuto-red">
                {totalItens} {totalItens === 1 ? "item" : "itens"}
              </span>
            )}
          </div>
          <button onClick={close} aria-label="Fechar carrinho" className="focus-ring rounded-full p-1 text-benvenuto-cream/70 transition-colors hover:bg-white/5 hover:text-benvenuto-cream">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="mt-14 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-benvenuto-black text-benvenuto-cream/30">
                <ShoppingBag size={28} />
              </div>
              <p className="text-sm text-benvenuto-cream/50">
                Seu carrinho está vazio.
                <br />Que tal uma pizza no forno a lenha? 🍕
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const precoUnitario = item.produto.preco_promocional ?? item.produto.preco;
                return (
                  <li
                    key={item.produto.id}
                    className="flex gap-3 rounded-xl border border-benvenuto-gold/5 bg-benvenuto-black/40 p-3 transition-colors hover:border-benvenuto-gold/15"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-benvenuto-black">
                      {item.produto.imagem_url ? (
                        <Image src={item.produto.imagem_url} alt={item.produto.nome} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl">🍕</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug text-benvenuto-cream">{item.produto.nome}</p>
                        <button
                          onClick={() => removeItem(item.produto.id)}
                          aria-label={`Remover ${item.produto.nome}`}
                          className="focus-ring shrink-0 text-benvenuto-cream/40 transition-colors hover:text-benvenuto-red"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-benvenuto-cream/50">
                        {formatarPreco(precoUnitario)} un.
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantidade(item.produto.id, item.quantidade - 1)}
                            aria-label="Diminuir quantidade"
                            className="focus-ring rounded-full border border-benvenuto-gold/20 p-1 text-benvenuto-cream/70 transition-colors hover:border-benvenuto-gold hover:text-benvenuto-gold"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-benvenuto-cream">{item.quantidade}</span>
                          <button
                            onClick={() => updateQuantidade(item.produto.id, item.quantidade + 1)}
                            aria-label="Aumentar quantidade"
                            className="focus-ring rounded-full border border-benvenuto-gold/20 p-1 text-benvenuto-cream/70 transition-colors hover:border-benvenuto-gold hover:text-benvenuto-gold"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-benvenuto-gold">
                          {formatarPreco(precoUnitario * item.quantidade)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {items.length > 0 && (
            <div className="mt-6 space-y-3">
              <div>
                <input
                  value={nome}
                  onChange={(e) => { setNome(e.target.value); if (e.target.value.trim()) setMostrarAvisoNome(false); }}
                  placeholder="Seu nome"
                  className={`focus-ring w-full rounded-lg border bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream placeholder:text-benvenuto-cream/30 ${
                    mostrarAvisoNome ? "border-benvenuto-red" : "border-benvenuto-gold/15"
                  }`}
                />
                {mostrarAvisoNome && <p className="mt-1 text-xs text-benvenuto-red">Informe seu nome pra continuar.</p>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {OPCOES_ENTREGA.map(({ valor, label, icone: Icone }) => (
                  <button
                    key={valor}
                    onClick={() => setTipoEntrega(valor)}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                      tipoEntrega === valor
                        ? "border-benvenuto-red bg-benvenuto-red text-benvenuto-cream"
                        : "border-benvenuto-gold/15 text-benvenuto-cream/60 hover:border-benvenuto-gold/30"
                    }`}
                  >
                    <Icone size={16} />
                    {label}
                  </button>
                ))}
              </div>

              {tipoEntrega === "entrega" && (
                <div>
                  <input
                    value={endereco}
                    onChange={(e) => { setEndereco(e.target.value); if (e.target.value.trim()) setMostrarAvisoEndereco(false); }}
                    placeholder="Endereço de entrega"
                    className={`focus-ring w-full rounded-lg border bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream placeholder:text-benvenuto-cream/30 ${
                      mostrarAvisoEndereco ? "border-benvenuto-red" : "border-benvenuto-gold/15"
                    }`}
                  />
                  {mostrarAvisoEndereco && <p className="mt-1 text-xs text-benvenuto-red">Informe o endereço de entrega.</p>}
                </div>
              )}
              <textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Observações (opcional)"
                rows={2}
                className="focus-ring w-full resize-none rounded-lg border border-benvenuto-gold/15 bg-benvenuto-black px-3 py-2.5 text-sm text-benvenuto-cream placeholder:text-benvenuto-cream/30"
              />
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-benvenuto-gold/10 px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm text-benvenuto-cream/60">
              <span>Subtotal ({totalItens} {totalItens === 1 ? "item" : "itens"})</span>
              <span className="font-display text-lg font-bold text-benvenuto-gold">{formatarPreco(subtotal())}</span>
            </div>
            <button
              onClick={finalizarPedido}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-benvenuto-green py-3.5 text-center font-semibold text-benvenuto-cream shadow-lg shadow-benvenuto-green/20 transition-transform hover:scale-[1.02] hover:bg-benvenuto-green-dark active:scale-95"
            >
              📲 Finalizar no WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
