export interface FinanceiroCardProps {
  mov: IFinanceiro;
  onEdit: (mov: IFinanceiro) => void;
  onDelete: (id?: string) => void;
}

export interface IFinanceiro {
  id?: string;
  agendamentoId: string;
  clienteNome: string;        
  procedimento?: string;
  valor: number;
  status?: "Pago" | "pendente"; 
  criadoEm?: Date;
  atualizadoEm?: Date;
}