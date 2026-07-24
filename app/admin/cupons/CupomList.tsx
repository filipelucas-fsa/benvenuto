"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Plus, Pencil, Trash2, Ticket } from "lucide-react";
import CupomModal from "./CupomModal";
import { alternarStatusCupomAction, excluirCupomAction } from "./actions";
import type { CupomComRelacionamentos } from "@/lib/coupons/types";
import type { Categoria, Produto } from "@/types/database";

const formatarPreco = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type FiltroStatus = "todos" | "ativos" | "inativos";

export default function CupomList({
  cupons,
  categorias,
  produtos,
}: {
  cupons: CupomComRelacionamentos[];
  categorias: Categoria[];
  produtos: Produto[];
}) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatus>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [cupomEmEdicao, setCupomEmEdicao] = useState<CupomComRelacionamentos | null>(null);
  const [isPending, startTransition] = useTransition();
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  const cupomsFiltrados = useMemo(() => {
    return cupons.filter((c) => {
      const combinaBusca =
        !busca ||
        c.codigo.toLowerCase().includes(busca.toLowerCase()) ||
        c.nome_interno.toLowerCase().includes(busca.toLowerCase());
      const combinaStatus =
        filtro === "todos" || (filtro === "ativos" ? c.ativo : !c.ativo);
      return combinaBusca && combinaStatus;
    });
  }, [cupons, busca, filtro]);

  const abrirNovo = () => {
    setCupomEmEdicao(null);
    setModalAberto(true);
  };

  const abrirEdicao = (cupom: CupomComRelacionamentos) => {
    setCupomEmEdicao(cupom);
    setModalAberto(true);
  };

  const alternarStatus = (cupom: CupomComRelacionamentos) => {
    setErroAcao(null);
    startTransition(async () => {
      const resultado = await alternarStatusCupomAction(cupom.id, !cupom.ativo);
      if (!resultado.sucesso) setErroAcao(resultado.mensagem);
    });
  };

  const excluir = (cupom: CupomComRelacionamentos) => {
    if (!confirm(`Excluir o cupom "${cupom.codigo}"?`)) return;
    setErroAcao(null);
    startTransition(async () => {
      const resultado = await excluirCupomAction(cupom.id);
      if (!resultado.sucesso) setErroAcao(resultado.mensagem);
    });
  };

  const descreverDesconto = (c: CupomComRelacionamentos) =>
    c.tipo_desconto === "percentual" ? `${c.valor_desconto}%` : formatarPreco(c.valor_desconto);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-benvenuto-cream/40" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por código ou nome…"
            className="focus-ring w-full rounded-lg border border-benvenuto-gold/15 bg-benvenuto-charcoal py-2.5 pl-10 pr-3 text-sm text-benvenuto-cream placeholder:text-benvenuto-cream/35"
          />
        </div>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as FiltroStatus)}
          className="rounded-lg border border-benvenuto-gold/15 bg-benvenuto-charcoal px-3 py-2.5 text-sm text-benvenuto-cream"
        >
          <option value="todos">Todos os status</option>
          <option value="ativos">Somente ativos</option>
          <option value="inativos">Somente inativos</option>
        </select>
        <button
          onClick={abrirNovo}
          className="focus-ring flex items-center gap-1.5 rounded-full bg-benvenuto-red px-4 py-2.5 text-sm font-semibold text-benvenuto-cream transition-transform hover:scale-[1.02]"
        >
          <Plus size={16} /> Novo cupom
        </button>
      </div>

      {erroAcao && (
        <p className="mb-4 rounded-lg bg-benvenuto-red/15 px-3 py-2 text-sm text-benvenuto-red">⚠ {erroAcao}</p>
      )}

      {cupomsFiltrados.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-benvenuto-gold/15 py-16 text-center">
          <Ticket size={32} className="mb-3 text-benvenuto-cream/25" />
          <p className="text-benvenuto-cream/45">
            {cupons.length === 0 ? "Nenhum cupom cadastrado ainda." : "Nenhum cupom encontrado com esse filtro."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-benvenuto-gold/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-benvenuto-charcoal/60 text-xs uppercase tracking-wide text-benvenuto-cream/45">
              <tr>
                <th className="px-5 py-3.5 font-medium">Código</th>
                <th className="px-5 py-3.5 font-medium">Nome interno</th>
                <th className="px-5 py-3.5 font-medium">Desconto</th>
                <th className="px-5 py-3.5 font-medium">Usos</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {cupomsFiltrados.map((c) => (
                <tr key={c.id} className="border-t border-benvenuto-gold/5 text-benvenuto-cream/85 transition-colors hover:bg-benvenuto-charcoal/40">
                  <td className="px-5 py-3.5 font-mono font-semibold text-benvenuto-gold">{c.codigo}</td>
                  <td className="px-5 py-3.5">{c.nome_interno}</td>
                  <td className="px-5 py-3.5">{descreverDesconto(c)}</td>
                  <td className="px-5 py-3.5 text-benvenuto-cream/60">
                    {c.usos_atuais}{c.limite_uso != null ? ` / ${c.limite_uso}` : ""}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => alternarStatus(c)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-40 ${
                        c.ativo ? "bg-benvenuto-green/15 text-benvenuto-green" : "bg-benvenuto-cream/10 text-benvenuto-cream/50"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${c.ativo ? "bg-benvenuto-green" : "bg-benvenuto-cream/40"}`} />
                      {c.ativo ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => abrirEdicao(c)} aria-label="Editar" className="text-benvenuto-cream/60 hover:text-benvenuto-gold">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => excluir(c)} aria-label="Excluir" className="text-benvenuto-cream/60 hover:text-benvenuto-red">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CupomModal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        cupomExistente={cupomEmEdicao}
        categorias={categorias}
        produtos={produtos}
      />
    </div>
  );
}
