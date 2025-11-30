import { HeaderDashboardProps } from "@/app/interfaces/dashboardInterface";
import { useMemo } from "react";
import { RefreshCcw } from "lucide-react";

const HeaderDashboard = ({ onRefresh }: HeaderDashboardProps) => {
  const hoje = useMemo(
    () =>
      new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    []
  );

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1 flex items-center gap-2 sm:gap-3">
          <span className="text-3xl sm:text-4xl">📊</span>
          <span className="truncate">Dashboard</span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base">
          Visão completa do seu negócio em tempo real
        </p>
      </div>

      {/* Botão Atualizar */}
      <div className="mb-6 flex-shrink-0">
        <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">📅 Período Atual</p>
              <p className="font-bold text-white text-sm lg:text-base">{hoje}</p>
            </div>
            <button
              onClick={onRefresh}
              className="px-4 py-3 bg-[#FFA500] text-black rounded-lg font-semibold hover:bg-[#FF8C00] transition-colors flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <RefreshCcw className="w-4 h-4" />
              Atualizar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderDashboard;
