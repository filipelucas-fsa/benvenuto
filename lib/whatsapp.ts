import type { CartItem } from "@/lib/store/cart";
import type { Cupom } from "@/lib/coupons/types";

interface DadosPedido {
  nome: string;
  itens: CartItem[];
  observacoesGerais?: string;
  tipoEntrega: "retirada" | "entrega" | "mesa";
  endereco?: string;
  cupom?: Cupom | null;
  desconto?: number;
}

const formatarPreco = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function montarMensagemWhatsApp(dados: DadosPedido): string {
  const linhas: string[] = [];
  linhas.push(`Olá! Meu nome é *${dados.nome}* e gostaria de fazer o seguinte pedido:`);
  linhas.push("");

  let subtotal = 0;
  dados.itens.forEach((item) => {
    const preco = item.produto.preco_promocional ?? item.produto.preco;
    const subtotalItem = preco * item.quantidade;
    subtotal += subtotalItem;
    linhas.push(`• ${item.quantidade}x ${item.produto.nome} — ${formatarPreco(subtotalItem)}`);
    if (item.observacao) linhas.push(`   obs: ${item.observacao}`);
  });

  linhas.push("");
  linhas.push(
    `*Entrega:* ${
      dados.tipoEntrega === "entrega"
        ? "Entrega"
        : dados.tipoEntrega === "mesa"
        ? "Na mesa"
        : "Retirada no local"
    }`
  );
  if (dados.tipoEntrega === "entrega" && dados.endereco) {
    linhas.push(`*Endereço:* ${dados.endereco}`);
  }
  if (dados.observacoesGerais) {
    linhas.push(`*Observações:* ${dados.observacoesGerais}`);
  }

  linhas.push("");
  const desconto = dados.desconto ?? 0;
  if (dados.cupom && desconto > 0) {
    linhas.push(`*Subtotal:* ${formatarPreco(subtotal)}`);
    linhas.push(`*Cupom:* ${dados.cupom.codigo}`);
    linhas.push(`*Desconto:* -${formatarPreco(desconto)}`);
    linhas.push(`*Total: ${formatarPreco(Math.max(0, subtotal - desconto))}*`);
  } else {
    linhas.push(`*Total: ${formatarPreco(subtotal)}*`);
  }

  return linhas.join("\n");
}

export function gerarLinkWhatsApp(numero: string, mensagem: string): string {
  const numeroLimpo = numero.replace(/\D/g, "");
  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
}
