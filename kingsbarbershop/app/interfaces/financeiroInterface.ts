export interface FinanceiroMov {
  id: string;
  clienteNome: string;
  procedimento: string;
  valor: number;
  data: string;
  profissionalId: string;
  pago?: boolean; 
}

export interface FinanceiroCardProps {
  mov: FinanceiroMov;
  onEdit: (mov: FinanceiroMov) => void;
  onDelete: (id?: string) => void;
}