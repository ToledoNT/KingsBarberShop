"use client";

import React from "react";
import { IFinanceiro } from "@/app/interfaces/financeiroInterface";

interface FinanceiroCardProps {
  mov: IFinanceiro;
}

export default function FinanceiroCard({ mov }: FinanceiroCardProps) {
  const formatarData = (dataString?: Date) => {
    if (!dataString) return "Data não informada";
    return new Date(dataString).toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor?: number) => {
    if (valor === undefined) return "R$ 0,00";
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getStatusClasses = (status?: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-700 text-white";
      default:
        return "bg-yellow-600 text-black";
    }
  };

  return (
    <div className="bg-[#1B1B1B] border border-[#333] rounded-xl p-5 hover:border-[#FFA500] hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg">{mov.clienteNome}</h3>
          {mov.procedimento && (
            <p className="text-gray-300 text-sm mt-1">{mov.procedimento}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-lg font-bold text-white">{formatarValor(mov.valor)}</p>
          {mov.status && (
            <span
              className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusClasses(mov.status)}`}
            >
              {mov.status}
            </span>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400 mt-2">
        <span>{formatarData(mov.criadoEm)}</span>
      </div>
    </div>
  );
}