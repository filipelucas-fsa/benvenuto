import { create } from "zustand";
import type { Produto } from "@/types/database";
import type { Cupom } from "@/lib/coupons/types";

export interface CartItem {
  produto: Produto;
  quantidade: number;
  observacao: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  cupomAplicado: Cupom | null;
  descontoAplicado: number;
  open: () => void;
  close: () => void;
  addItem: (produto: Produto) => void;
  removeItem: (produtoId: string) => void;
  updateQuantidade: (produtoId: string, quantidade: number) => void;
  updateObservacao: (produtoId: string, observacao: string) => void;
  aplicarCupom: (cupom: Cupom, desconto: number) => void;
  removerCupom: () => void;
  clear: () => void;
  subtotal: () => number;
  total: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  cupomAplicado: null,
  descontoAplicado: 0,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  addItem: (produto) =>
    set((state) => {
      const existente = state.items.find((i) => i.produto.id === produto.id);
      // Mudou o carrinho — o cupom precisa ser reavaliado (elegibilidade/mínimo podem mudar).
      const base = { cupomAplicado: null, descontoAplicado: 0 };
      if (existente) {
        return {
          ...base,
          items: state.items.map((i) =>
            i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
          ),
          isOpen: true,
        };
      }
      return {
        ...base,
        items: [...state.items, { produto, quantidade: 1, observacao: "" }],
        isOpen: true,
      };
    }),
  removeItem: (produtoId) =>
    set((state) => ({
      items: state.items.filter((i) => i.produto.id !== produtoId),
      cupomAplicado: null,
      descontoAplicado: 0,
    })),
  updateQuantidade: (produtoId, quantidade) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.produto.id === produtoId ? { ...i, quantidade } : i))
        .filter((i) => i.quantidade > 0),
      cupomAplicado: null,
      descontoAplicado: 0,
    })),
  updateObservacao: (produtoId, observacao) =>
    set((state) => ({
      items: state.items.map((i) => (i.produto.id === produtoId ? { ...i, observacao } : i)),
    })),
  aplicarCupom: (cupom, desconto) => set({ cupomAplicado: cupom, descontoAplicado: desconto }),
  removerCupom: () => set({ cupomAplicado: null, descontoAplicado: 0 }),
  clear: () => set({ items: [], cupomAplicado: null, descontoAplicado: 0 }),
  subtotal: () =>
    get().items.reduce((acc, i) => {
      const preco = i.produto.preco_promocional ?? i.produto.preco;
      return acc + preco * i.quantidade;
    }, 0),
  total: () => Math.max(0, get().subtotal() - get().descontoAplicado),
}));
