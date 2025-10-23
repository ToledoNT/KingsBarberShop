"use client";

import { useMemo } from "react";
import MetricCard from "./MetricaCard";
import MiniMetricCard from "./MiniMetricCard";
import { MetricasMensaisProps } from "@/app/interfaces/dashboardInterface";

const MetricasMensais = ({
  agendamentosMes,
  faturamentoMensal,
  ticketMedio,
  taxaConclusao,
  taxaCancelamento,
  totalConcluidos,
  totalNaoCompareceu,
  totalCancelados,
  totalAgendados,
  metrics
}: MetricasMensaisProps) => {

  const agendamentosProgress = useMemo(() => ({
    value: agendamentosMes,
    max: metrics.agendamentosMensais,
    color: "bg-gradient-to-r from-purple-400 to-indigo-400"
  }), [agendamentosMes, metrics.agendamentosMensais]);

  const faturamentoFormatado = useMemo(
    () => `R$ ${faturamentoMensal.toLocaleString('pt-BR')}`,
    [faturamentoMensal]
  );

  const ticketFormatado = useMemo(
    () => `Ticket: R$ ${ticketMedio}`,
    [ticketMedio]
  );

  const taxaConclusaoStr = useMemo(() => `${taxaConclusao}%`, [taxaConclusao]);
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            title="📅 AGENDAMENTOS MÊS"
            value={agendamentosMes}
            subtitle={`${metrics.agendamentosMensais} previstos`}
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
            value={taxaConclusaoStr}
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

        {/* Métricas Secundárias Mensais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <MiniMetricCard
            title="Concluídos"
            value={totalConcluidos}
            subtitle={`${taxaConclusaoStr} de sucesso`}
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
            value={totalAgendados}
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