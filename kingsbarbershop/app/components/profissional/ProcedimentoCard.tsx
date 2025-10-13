import React from "react";
import { Procedimento, ProcedimentoCardProps } from "@/app/interfaces/profissionaisInterface";
import Button from "../ui/Button";

export default function ProcedimentoCard({ procedimento, onEdit, onDelete }: ProcedimentoCardProps) {
  return (
    <div className="bg-[#262626] p-4 rounded-2xl shadow flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-[#FFA500]">{procedimento.nome}</h3>
        <p className="text-gray-300 mt-2">Valor: R$ {procedimento.valor.toFixed(2)}</p>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="secondary" onClick={() => onEdit(procedimento)}>
          Editar
        </Button>
        <Button variant="secondary" onClick={() => onDelete(procedimento.id)}>
          Excluir
        </Button>
      </div>
    </div>
  );
}