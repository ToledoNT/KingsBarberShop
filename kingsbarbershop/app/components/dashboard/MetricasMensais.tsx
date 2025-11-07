"use client";

import { useMemo } from "react";
import MetricCard from "./MetricaCard";
import MiniMetricCard from "./MiniMetricCard";

interface MetricasMensaisProps {
  agendamentosMes?: number;
  faturamentoMensal?: number;
  ticketMedio?: number;
  taxaSucesso?: number; // ✅ Adicionada
  taxaCancelamento?: number;
  totalConcluidos?: number;
  totalNaoCompareceu?: number;
  totalCancelados?: number;
  totalAgendados?: number;
  // Recebendo metrics inteiro para fallback
  metrics?: {
    mensal?: {
      agendamentosMes?: number;
    };
  };
}

const MetricasMensais = ({
  agendamentosMes = 0,
  faturamentoMensal = 0,
  ticketMedio = 0,
  taxaSucesso = 0, // ✅ valor padrão
  taxaCancelamento = 0,
  totalConcluidos = 0,
  totalNaoCompareceu = 0,
  totalCancelados = 0,
  totalAgendados = 0,
  metrics
}: MetricasMensaisProps) => {

  const agendamentosProgress = useMemo(() => ({
    value: agendamentosMes,
    max: metrics?.mensal?.agendamentosMes ?? agendamentosMes,
    color: "bg-gradient-to-r from-purple-400 to-indigo-400"
  }), [agendamentosMes, metrics?.mensal?.agendamentosMes]);

  const faturamentoFormatado = useMemo(
    () => `R$ ${faturamentoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    [faturamentoMensal]
  );

  const ticketFormatado = useMemo(
    () => `Ticket médio: R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    [ticketMedio]
  );

  const taxaSucessoStr = useMemo(() => `${taxaSucesso}%`, [taxaSucesso]);
  const taxaCancelamentoStr = useMemo(() => `${taxaCancelamento}%`, [taxaCancelamento]);

  return (
    <div className="mb-6 flex-shrink-0">
      <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-purple-400">📅</span>
          Visão Mensal
          <span className="text-sm bg-purple-500/90 text-white px-3 py-1 rounded-full">
            MENSAL
          </span>
        </h2>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            title="📅 AGENDAMENTOS MÊS"
            value={agendamentosMes}
            subtitle={`${metrics?.mensal?.agendamentosMes ?? agendamentosMes} previstos`}
            icon="📋"
            color="purple"
            progress={agendamentosProgress}
            period="monthly"
          />

          <MetricCard
            title="💰 FATURAMENTO MENSAL"
            value={faturamentoFormatado}
            subtitle={ticketFormatado}
            icon="💎"
            color="orange"
            period="monthly"
          />

          <MetricCard
            title="✅ TAXA DE SUCESSO"
            value={taxaSucessoStr} // ✅ usar taxaSucesso
            subtitle={`${totalConcluidos} concluídos`}
            icon="🚀"
            color="green"
            period="monthly"
          />

          <MetricCard
            title="📉 TAXA DE CANCEL."
            value={taxaCancelamentoStr}
            subtitle={`${totalCancelados} cancelamentos`}
            icon="📊"
            color="red"
            period="monthly"
          />
        </div>

        {/* Métricas secundárias */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <MiniMetricCard
            title="Concluídos"
            value={totalConcluidos}
            subtitle={`${taxaSucessoStr} de sucesso`} // ✅ usar taxaSucesso
            icon="✅"
            color="green"
            period="monthly"
          />

          <MiniMetricCard
            title="Não Compareceram"
            value={totalNaoCompareceu}
            subtitle={`${taxaCancelamentoStr} do total`}
            icon="⚠️"
            color="yellow"
            period="monthly"
          />

          <MiniMetricCard
            title="Cancelamentos"
            value={totalCancelados}
            subtitle={`${taxaCancelamentoStr} taxa`}
            icon="❌"
            color="red"
            period="monthly"
          />
<MiniMetricCard
  title="Agendados"
  value={agendamentosMes ?? 0} 
  subtitle="Em aberto"
  icon="⏳"
  color="blue"
  period="monthly"
/>



        </div>
      </div>
    </div>
  );
};

export default MetricasMensais;