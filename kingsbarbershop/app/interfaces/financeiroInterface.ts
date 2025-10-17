export interface FinanceiroCardProps {
  mov: IFinanceiro;
  onEdit: (mov: IFinanceiro) => void;
  onDelete: (id?: string) => void;
}

// src/interfaces/financeiroInterface.ts
export interface IFinanceiro {
  id?: string;
  agendamentoId: string;
  clienteNome: string;        
  procedimento?: string; // opcional se quiser preencher depois
  valor: number;
  status?: "Pago";        // igual ao backend
  criadoEm?: Date;
  atualizadoEm?: Date;
}