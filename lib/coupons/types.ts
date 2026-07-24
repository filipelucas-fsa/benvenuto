// ===== MODEL =====
// Tipos que espelham as tabelas novas criadas em 0003_coupons.sql.
// Camada puramente de dados — sem regra de negócio aqui.

export type TipoDesconto = "fixo" | "percentual";
export type EscopoProdutos = "todos" | "categorias" | "produtos";

export interface Cupom {
  id: string;
  nome_interno: string;
  codigo: string;
  tipo_desconto: TipoDesconto;
  valor_desconto: number;
  descricao: string | null;
  ativo: boolean;
  data_inicio: string | null;
  data_fim: string | null;
  limite_uso: number | null;
  valor_minimo: number;
  escopo_produtos: EscopoProdutos;
  acumulativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CupomComRelacionamentos extends Cupom {
  categoria_ids: string[];
  produto_ids: string[];
  produto_excluido_ids: string[];
  usos_atuais: number;
}

export interface ItemParaValidacao {
  produtoId: string;
  categoriaId: string;
  precoUnitario: number;
  quantidade: number;
}

export interface ResultadoValidacaoCupom {
  valido: boolean;
  mensagem: string;
  cupom?: Cupom;
  descontoAplicado?: number;
  novoSubtotal?: number;
}

export interface DadosNovoCupom {
  nome_interno: string;
  codigo: string;
  tipo_desconto: TipoDesconto;
  valor_desconto: number;
  descricao: string | null;
  ativo: boolean;
  data_inicio: string | null;
  data_fim: string | null;
  limite_uso: number | null;
  valor_minimo: number;
  escopo_produtos: EscopoProdutos;
  acumulativo: boolean;
  categoria_ids: string[];
  produto_ids: string[];
  produto_excluido_ids: string[];
}
