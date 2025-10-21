import React from "react";
import { Procedimento, ProcedimentoCardProps } from "@/app/interfaces/profissionaisInterface";
import Button from "../ui/Button";

export default function ProcedimentoCard({ procedimento, onEdit, onDelete }: ProcedimentoCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-3 sm:p-4 lg:p-5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl w-full flex flex-col justify-between h-full min-h-[180px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg truncate leading-tight">
            {procedimento.nome}
          </h3>
        </div>
        <div className="flex-shrink-0">
          <div className="text-xs sm:text-sm text-[#FFA500] bg-[#FFA500]/10 px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-semibold whitespace-nowrap">
            R$ {procedimento.valor.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Informações */}
      <div className="flex flex-col gap-2 mb-4 flex-1">
        <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
          <span className="text-[#FFA500] flex-shrink-0">💰</span>
          <p className="text-gray-300 truncate">
            Valor: <span className="text-white font-semibold">R$ {procedimento.valor.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
          <span className="flex-shrink-0">📋</span>
          <p className="truncate">Procedimento cadastrado</p>
        </div>
      </div>

      {/* Botões */}
      <div className="flex flex-col xs:flex-row gap-2 mt-auto">
        <Button
          onClick={() => onEdit(procedimento)}
          variant="primary"
          className="px-2 py-2 text-xs sm:text-sm rounded-lg flex-1 justify-center min-h-[40px]"
        >
          <span className="mr-1 hidden xs:inline">✏️</span>
          Editar
        </Button>
        <Button
          onClick={() => onDelete(procedimento.id)}
          variant="secondary"
          className="px-2 py-2 text-xs sm:text-sm rounded-lg flex-1 justify-center min-h-[40px]"
        >
          <span className="mr-1 hidden xs:inline">🗑️</span>
          Excluir
        </Button>
      </div>
    </div>
  );
}