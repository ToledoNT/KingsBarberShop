"use client";

import { ReactNode, useMemo } from "react";
import { IProduto } from "@/app/interfaces/produtosInterface";
import { useProdutos } from "@/app/hook/useProdutosHook";

interface ResumoCardProps {
  emoji: string;
  titulo: string;
  valor: ReactNode;
  descricao?: string;
}

const ResumoCard = ({ emoji, titulo, valor, descricao }: ResumoCardProps) => (
  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-6 shadow-lg backdrop-blur-sm transition-all duration-300
                  hover:shadow-2xl hover:scale-105 hover:border-gray-500 cursor-pointer">
    <div className="flex items-center justify-between mb-4">
      <span className="text-3xl">{emoji}</span>
      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
        <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
      </div>
    </div>

    <p className="text-gray-400 text-sm font-medium mb-1">{titulo}</p>

    <div className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
      {valor}
    </div>

    {descricao && <p className="text-xs text-gray-500 leading-snug">{descricao}</p>}
  </div>
);

export const ResumoCards = () => {
  const { produtos = [] } = useProdutos();

  const totais = useMemo(() => {
    const acc = {
      totalValorDisponivel: 0,
      totalValorVendido: 0,
      totalValorPendente: 0,
      totalItens: 0,
      quantidade: 0,
      vendidos: 0,
      consumidos: 0,
      pendentes: 0,
    };

    produtos.forEach((p) => {
      const quantidade = Number(p.quantidade ?? p.estoque ?? 0);
      const preco = Number(p.preco ?? 0);

      switch (p.status) {
        case "vendido":
          acc.vendidos += quantidade;
          acc.totalValorVendido += preco * quantidade;
          break;
        case "consumido":
          acc.consumidos += quantidade;
          acc.totalValorDisponivel += preco * quantidade;
          acc.totalItens += quantidade;
          break;
        case "pendente":
          acc.pendentes += quantidade;
          acc.totalValorPendente += preco * quantidade;
          break;
        case "disponivel":
        default:
          acc.totalValorDisponivel += preco * quantidade;
          acc.totalItens += quantidade;
          break;
      }

      acc.quantidade += 1;
    });

    return acc;
  }, [produtos]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6">
      <ResumoCard
        key="card-valor-disponivel"
        emoji="💸"
        titulo="Valor disponível"
        valor={totais.totalValorDisponivel.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        descricao={`${totais.quantidade} produtos`}
      />
      <ResumoCard
        key="card-valor-vendido"
        emoji="✅"
        titulo="Valor vendido"
        valor={totais.totalValorVendido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      />
      <ResumoCard
        key="card-valor-pendente"
        emoji="⏳"
        titulo="Valor pendente"
        valor={totais.totalValorPendente.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      />
      <ResumoCard
        key="card-itens-estoque"
        emoji="📦"
        titulo="Itens em estoque"
        valor={totais.totalItens.toString()}
        descricao="Soma de todos os estoques"
      />
      <ResumoCard
        key="card-vendidos"
        emoji="✅"
        titulo="Vendidos"
        valor={totais.vendidos}
      />
      <ResumoCard
        key="card-consumidos"
        emoji="🍴"
        titulo="Consumidos"
        valor={totais.consumidos}
      />
      <ResumoCard
        key="card-pendentes"
        emoji="⏳"
        titulo="Pendentes"
        valor={totais.pendentes}
      />
      <ResumoCard
        key="card-acoes"
        emoji="⚙️"
        titulo="Ações"
        valor={<small className="text-sm text-gray-300">Crie, edite e atualize status</small>}
      />
    </div>
  );
};