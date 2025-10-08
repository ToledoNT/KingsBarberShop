"use client";
import React from "react";
import Button from "../ui/Button";
import { Procedimento, ProcedimentoCardProps } from "@/app/interfaces/profissionaisInterface";

const ProcedimentoCard: React.FC<ProcedimentoCardProps> = ({ procedimento, onEdit, onDelete }) => (
  <div className="bg-[#2A2A2A] rounded-xl p-4 flex justify-between items-center shadow hover:shadow-lg transition">
    <div>
      <p className="font-semibold">{procedimento.nome}</p>
      <p className="text-gray-400">R$ {procedimento.valor.toFixed(2)}</p>
    </div>
    <div className="flex gap-2">
      <Button onClick={() => onEdit(procedimento)} variant="primary" className="text-sm">Editar</Button>
      <Button onClick={() => onDelete(procedimento.id)} variant="secondary" className="text-sm">Remover</Button>
    </div>
  </div>
);

export default ProcedimentoCard;