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
    className="bg-[#2A2A2A] rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
    onClick={() => onSelect(profissional)}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold">{profissional.nome}</p>
        <p className="text-gray-400 text-sm">{profissional.email}</p>
        <p className="text-gray-400 text-sm">{profissional.telefone}</p>
        <p className="text-gray-400 text-sm mt-1">
          {profissional.procedimentos.length} procedimento(s)
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onEdit(profissional);
          }}
          variant="primary"
          className="text-sm"
        >
          Editar
        </Button>
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onDelete(profissional.id);
          }}
          variant="secondary"
          className="text-sm"
        >
          Remover
        </Button>
      </div>
    </div>
  </div>
);

export default ProfissionalCard;
