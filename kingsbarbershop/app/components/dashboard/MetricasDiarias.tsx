import { useMemo } from "react";
import MetricCard from "./MetricaCard";
import { MetricasDiariasProps } from "@/app/interfaces/dashboardInterface";

const MetricasDiarias = ({ agendamentosHoje, faturamentoHoje, concluidosHoje }: MetricasDiariasProps) => {
  const performanceHoje = useMemo(
    () => (agendamentosHoje > 0 ? `${Math.round((concluidosHoje / agendamentosHoje) * 100)}%` : '0%'),
    [agendamentosHoje, concluidosHoje]
  );

  const faturamentoFormatado = useMemo(
    () => `R$ ${faturamentoHoje.toLocaleString('pt-BR')}`,
    [faturamentoHoje]
  );

  return (
    <div className="mb-6 flex-shrink-0">
      <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-blue-400">🕒</span>
          Métricas de Hoje
          <span className="text-sm bg-blue-500/90 text-white px-3 py-1 rounded-full">
            DIÁRIO
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            title="📅 AGENDAMENTOS HOJE"
            value={agendamentosHoje}
            subtitle={`${concluidosHoje} concluídos hoje`}
            icon="🎯"
            color="blue"
            period="daily"
          />
          
          <MetricCard
            title="💰 FATURAMENTO HOJE"
            value={faturamentoFormatado}
            subtitle="Receita do dia"
            icon="💸"
            color="green"
            period="daily"
          />
          
          <MetricCard
            title="✅ SERVIÇOS HOJE"
            value={concluidosHoje}
            subtitle="Concluídos hoje"
            icon="✔️"
            color="teal"
            period="daily"
          />
          
          <MetricCard
            title="📊 PERFORMANCE HOJE"
            value={performanceHoje}
            subtitle="Taxa de conclusão diária"
            icon="📈"
            color="purple"
            period="daily"
          />
        </div>
      </div>
    </div>
  );
};

export default MetricasDiarias;