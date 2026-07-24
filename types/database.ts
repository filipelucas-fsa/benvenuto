// Tipos gerados manualmente a partir de supabase/migrations/0001_init.sql.
// Em produção, prefira gerar via `supabase gen types typescript`.

export type PedidoStatus =
  | "recebido"
  | "em_preparo"
  | "saiu_entrega"
  | "finalizado"
  | "cancelado";

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Produto {
  id: string;
  categoria_id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  preco_promocional: number | null;
  imagem_url: string | null;
  disponivel: boolean;
  destaque: boolean;
  badge_texto: string | null;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface Pedido {
  id: string;
  codigo: string;
  cliente_nome: string;
  cliente_telefone: string;
  tipo_entrega: "retirada" | "entrega" | "mesa";
  endereco_entrega: string | null;
  status: PedidoStatus;
  observacoes: string | null;
  subtotal: number;
  taxa_entrega: number;
  total: number;
  created_at: string;
}

export interface PedidoItem {
  id: string;
  pedido_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  observacao: string | null;
}

export interface Configuracoes {
  id: number;
  nome_restaurante: string;
  telefone: string | null;
  whatsapp: string | null;
  endereco: string | null;
  horarios: Record<string, string>;
  instagram: string | null;
  facebook: string | null;
  logo_url: string | null;
  hero_imagem_url: string | null;
}

export interface GaleriaItem {
  id: string;
  imagem_url: string;
  legenda: string | null;
  ordem: number;
  ativo: boolean;
}

export interface Avaliacao {
  id: string;
  autor_nome: string;
  nota: number;
  comentario: string | null;
  fonte: "manual" | "google";
  aprovado: boolean;
  created_at: string;
}

// Interface mínima compatível com o tipo genérico esperado pelo @supabase/ssr.
export interface Database {
  public: {
    Tables: {
      categorias: { Row: Categoria; Insert: Partial<Categoria>; Update: Partial<Categoria> };
      produtos: { Row: Produto; Insert: Partial<Produto>; Update: Partial<Produto> };
      pedidos: { Row: Pedido; Insert: Partial<Pedido>; Update: Partial<Pedido> };
      pedido_itens: { Row: PedidoItem; Insert: Partial<PedidoItem>; Update: Partial<PedidoItem> };
      configuracoes: { Row: Configuracoes; Insert: Partial<Configuracoes>; Update: Partial<Configuracoes> };
      galeria: { Row: GaleriaItem; Insert: Partial<GaleriaItem>; Update: Partial<GaleriaItem> };
      avaliacoes: { Row: Avaliacao; Insert: Partial<Avaliacao>; Update: Partial<Avaliacao> };
    };
  };
}
