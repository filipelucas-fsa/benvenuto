import { create } from "zustand";
import type { Produto } from "@/types/database";

export interface CartItem {
  produto: Produto;
  quantidade: number;
  observacao: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (produto: Produto) => void;
  removeItem: (produtoId: string) => void;
  updateQuantidade: (produtoId: string, quantidade: number) => void;
  updateObservacao: (produtoId: string, observacao: string) => void;
  clear: () => void;
  subtotal: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  addItem: (produto) =>
    set((state) => {
      const existente = state.items.find((i) => i.produto.id === produto.id);
      if (existente) {
        return {
          items: state.items.map((i) =>
            i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
          ),
          isOpen: true,
        };
      }
      return {
        items: [...state.items, { produto, quantidade: 1, observacao: "" }],
        isOpen: true,
      };
    }),
  removeItem: (produtoId) =>
    set((state) => ({ items: state.items.filter((i) => i.produto.id !== produtoId) })),
  updateQuantidade: (produtoId, quantidade) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.produto.id === produtoId ? { ...i, quantidade } : i))
        .filter((i) => i.quantidade > 0),
    })),
  updateObservacao: (produtoId, observacao) =>
    set((state) => ({
      items: state.items.map((i) => (i.produto.id === produtoId ? { ...i, observacao } : i)),
    })),
  clear: () => set({ items: [] }),
  subtotal: () =>
    get().items.reduce((acc, i) => {
      const preco = i.produto.preco_promocional ?? i.produto.preco;
      return acc + preco * i.quantidade;
    }, 0),
}));
