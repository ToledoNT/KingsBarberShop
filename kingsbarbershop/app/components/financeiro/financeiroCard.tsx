import React from "react";
import Button from "../ui/Button";


interface FinanceiroCardProps {
  mov: FinanceiroMov;
  onEdit: (mov: FinanceiroMov) => void;
  onDelete: (id?: string) => void;
}

const FinanceiroCard: React.FC<FinanceiroCardProps> = ({ mov, onEdit, onDelete }) => (
  <div className="bg-[#2A2A2A] rounded-xl p-4 flex justify-between items-center shadow hover:shadow-lg transition">
    <div>
      <p className="font-semibold">{mov.clienteNome}</p>
      <p className="text-gray-400">{mov.procedimento}</p>
      <p className="text-gray-400 text-sm">{new Date(mov.data).toLocaleString()}</p>
    </div>
    <div className="flex flex-col items-end">
      <p className="font-bold text-green-500">R$ {mov.valor.toFixed(2)}</p>
      <div className="flex gap-2 mt-1">
        <Button onClick={() => onEdit(mov)} variant="primary" className="text-sm">Editar</Button>
        <Button onClick={() => onDelete(mov.id)} variant="secondary" className="text-sm">Remover</Button>
      </div>
    </div>
  </div>
);

export default FinanceiroCard;