"use client";

import { useMemo } from "react";
import MetricCard from "./MetricaCard";
import { MetricasAnuaisProps } from "@/app/interfaces/dashboardInterface";

const MetricasAnuais = ({
  agendamentosAnuais = 0,
  faturamentoAnual = 0,
  anoAtual = new Date().getFullYear(),
}: MetricasAnuaisProps) => {

  const faturamentoFormatado = useMemo(() => {
    return `R$ ${faturamentoAnual.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [faturamentoAnual]);

  const mediaMensalFormatada = useMemo(() => {
    const media = faturamentoAnual / 12;
    return `R$ ${media.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [faturamentoAnual]);

  return (
    <div className="mb-6 flex-shrink-0">
      <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-green-400">📊</span>
          Visão Anual
          <span className="text-sm bg-green-500/90 text-white px-3 py-1 rounded-full">
            ANUAL {anoAtual}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <MetricCard
            title="📅 TOTAL AGENDAMENTOS"
            value={agendamentosAnuais}
            subtitle="Agendamentos no ano"
            icon="📈"
            color="green"
            period="yearly"
          />

          <MetricCard
            title="💰 FATURAMENTO ANUAL"
            value={faturamentoFormatado}
            subtitle="Receita anual consolidada"
            icon="💰"
            color="orange"
            period="yearly"
          />

          <MetricCard
            title="📊 MÉDIA MENSAL"
            value={mediaMensalFormatada}
            subtitle="Faturamento médio por mês"
            icon="📅"
            color="teal"
            period="yearly"
          />
        </div>
      </div>
    </div>
  );
};

export default MetricasAnuais;