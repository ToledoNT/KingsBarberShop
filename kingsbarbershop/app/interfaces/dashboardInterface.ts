export interface DashboardCardProps {
  title: string;
  value: string | number;
  color?: string;
}

export interface AgendamentoItem {
  nome: string;
  telefone: string;
  profissionalNome: string;
  data: string;
  inicio: string;
  fim: string;
  servicoNome: string;
  servicoPreco: number;
  status: string;
  horario?: string; 
}

export interface AgendamentosTableProps {
  agendamentos: AgendamentoItem[];
}

export interface HeaderDashboardProps {
  onRefresh: () => void;
}

export interface MetricasDiariasProps {
  agendamentosHoje: number;
  faturamentoHoje: number;
  concluidosHoje: number;
}

export interface MetricasMensaisProps {
  agendamentosMes: number;
  faturamentoMensal: number;
  ticketMedio: number;         
  taxaConclusao: number;       
  taxaCancelamento: number;     
  totalConcluidos: number;
  totalNaoCompareceu: number;
  totalCancelados: number;
  totalAgendados: number;
  metrics?: any;                
}

export interface MetricasAnuaisProps {
  agendamentosAnuais: number;
  faturamentoAnual: number;
  anoAtual: number; // obrigatório
}

export interface DashboardResponse {
  metrics: any;
  agendamentos: any[];
  financeiro: any[];
  relatorios: any[];
}