import React from "react";
import { FinanceiroCardProps } from "@/app/interfaces/financeiroInterface";

const FinanceiroCard: React.FC<FinanceiroCardProps> = ({ mov }) => (
  <div className="bg-[#2A2A2A] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow hover:shadow-lg transition">
    <div className="flex flex-col gap-1">
      <p className="font-semibold text-lg">{mov.clienteNome}</p>
      <p className="text-gray-400">{mov.procedimento}</p>
      <p className="text-gray-400 text-sm">{mov.criadoEm ? new Date(mov.criadoEm).toLocaleString() : "-"}</p>
    </div>

    <div className="mt-3 sm:mt-0 flex flex-col items-start sm:items-end">
      <p className="font-bold text-green-500 text-lg">R$ {mov.valor.toFixed(2)}</p>
    </div>
  </div>
);

export default FinanceiroCard;
