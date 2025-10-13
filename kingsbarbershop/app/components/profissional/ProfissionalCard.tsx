"use client";

import React from "react";
import Button from "../ui/Button";
import { ProfissionalCardProps } from "@/app/interfaces/profissionaisInterface";

const ProfissionalCard: React.FC<ProfissionalCardProps> = ({
  profissional,
  onSelect,
  onEdit,
  onDelete
}) => (
  <div
    className="bg-[#2A2A2A] rounded-2xl p-4 shadow hover:shadow-lg transition cursor-pointer w-full flex flex-col justify-between h-full"
    onClick={() => onSelect(profissional)}
  >
    {/* Informações */}
    <div className="flex flex-col gap-1 mb-4">
      <p className="font-semibold text-base text-white">{profissional.nome}</p>
      <p className="text-gray-400 text-sm break-all">{profissional.email}</p>
      <p className="text-gray-400 text-sm">{profissional.telefone}</p>
      <p className="text-gray-400 text-sm mt-1">
        {profissional.procedimentos?.length ?? 0} procedimento(s)
      </p>
    </div>

    {/* Botões */}
    <div className="flex justify-end sm:justify-between flex-wrap gap-2 mt-auto">
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onEdit(profissional);
        }}
        variant="primary"
        className="px-4 py-2 text-sm rounded-xl w-full sm:w-auto"
      >
        Editar
      </Button>
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onDelete(profissional.id);
        }}
        variant="secondary"
        className="px-4 py-2 text-sm rounded-xl w-full sm:w-auto"
      >
        Remover
      </Button>
    </div>
  </div>
);

export default ProfissionalCard;