import React from "react";
import { FinanceiroCardProps } from "@/app/interfaces/financeiroInterface";
import { formatarData, formatarValor, getStatusClasses } from "@/app/utils/financeiroUtils";

export default function FinanceiroCard({ mov }: FinanceiroCardProps) {
  return (
    <div className="bg-[#1B1B1B] border border-[#333] rounded-lg p-3 hover:border-[#FFA500] hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1 sm:gap-0">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm sm:text-base">{mov.clienteNome}</h3>
          {mov.procedimento && <p className="text-gray-300 text-xs sm:text-sm mt-0.5">{mov.procedimento}</p>}
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <p className="text-sm sm:text-base font-bold text-white">{formatarValor(mov.valor)}</p>
          {mov.status && (
            <span
              className={`px-2 py-0.5 text-[0.65rem] sm:text-xs rounded-full font-semibold ${getStatusClasses(mov.status)}`}
            >
              {mov.status}
            </span>
          )}
        </div>
      </div>

      <div className="text-xs sm:text-sm text-gray-400 mt-1">
        <span>{formatarData(mov.criadoEm)}</span>
      </div>
    </div>
  );
}