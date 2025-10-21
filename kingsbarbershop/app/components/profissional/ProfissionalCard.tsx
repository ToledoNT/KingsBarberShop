"use client";

import React from "react";
import Button from "../ui/Button";
import { ProfissionalCardProps } from "@/app/interfaces/profissionaisInterface";

const ProfissionalCard: React.FC<ProfissionalCardProps> = ({
  profissional,
  onSelect,
  onEdit,
  onDelete,
  isSelected
}) => (
  <div
    className={`bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border rounded-xl p-3 sm:p-4 lg:p-5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer w-full flex flex-col justify-between h-full min-h-[200px] ${
      isSelected 
        ? "border-[#FFA500] shadow-lg shadow-[#FFA500]/20" 
        : "border-gray-700 hover:border-gray-600"
    }`}
    onClick={() => onSelect(profissional)}
  >
    {/* Header com indicador de seleção */}
    <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3 mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg truncate leading-tight">
          {profissional.nome}
        </h3>
        {isSelected && (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-[#FFA500] rounded-full animate-pulse flex-shrink-0"></div>
            <span className="text-xs text-[#FFA500] font-medium truncate">Selecionado</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg whitespace-nowrap">
          {profissional.procedimentos?.length ?? 0} proc.
        </div>
      </div>
    </div>

    {/* Informações */}
    <div className="flex flex-col gap-2 mb-4 flex-1">
      <div className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
        <span className="text-[#FFA500] flex-shrink-0 mt-0.5">📧</span>
        <p className="break-words line-clamp-2">{profissional.email}</p>
      </div>
      <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
        <span className="text-[#FFA500] flex-shrink-0">📞</span>
        <p className="truncate">{profissional.telefone}</p>
      </div>
      <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
        <span className="flex-shrink-0">📋</span>
        <p className="truncate">{profissional.procedimentos?.length ?? 0} procedimento(s)</p>
      </div>
    </div>

    {/* Botões */}
    <div className="flex flex-col xs:flex-row gap-2 mt-auto">
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onEdit(profissional);
        }}
        variant="primary"
        className="px-2 py-2 text-xs sm:text-sm rounded-lg flex-1 justify-center min-h-[40px]"
      >
        <span className="mr-1 hidden xs:inline">✏️</span>
        Editar
      </Button>
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onDelete(profissional.id);
        }}
        variant="secondary"
        className="px-2 py-2 text-xs sm:text-sm rounded-lg flex-1 justify-center min-h-[40px]"
      >
        <span className="mr-1 hidden xs:inline">🗑️</span>
        Remover
      </Button>
    </div>
  </div>
);

export default ProfissionalCard;