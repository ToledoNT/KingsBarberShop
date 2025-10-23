export interface FinanceiroCardProps {
  mov: IFinanceiro;
  onEdit?: (mov: IFinanceiro) => void;
  onDelete?: (id: string) => void;
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

export interface FinanceiroCardProps {
  mov: IFinanceiro;
}

export interface FiltrosProps {
  busca: string;
  setBusca: React.Dispatch<React.SetStateAction<string>>;
  dataInicial: string;
  setDataInicial: React.Dispatch<React.SetStateAction<string>>;
  dataFinal: string;
  setDataFinal: React.Dispatch<React.SetStateAction<string>>;
  filtroStatus: "todos" | "Pago" | "pendente";
  setFiltroStatus: React.Dispatch<React.SetStateAction<"todos" | "Pago" | "pendente">>;
  ordenacao: "data" | "valor" | "cliente";
  setOrdenacao: React.Dispatch<React.SetStateAction<"data" | "valor" | "cliente">>;
  handleLimparFiltros: () => void;
}