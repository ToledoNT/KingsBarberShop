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
  ticketMedio: string;
  taxaConclusao: string;
  taxaCancelamento: string;
  totalConcluidos: number;
  totalNaoCompareceu: number;
  totalCancelados: number;
  totalAgendados: number;
  metrics: any;
}

export interface MetricasAnuaisProps {
  agendamentosAnuais: number;
  faturamentoAnual: number;
  anoAtual: number;
}

// Interfaces do dashboard - CORRIGIDAS
export interface IDashboardMetrics {
  agendamentosHoje: number;
  agendamentosMensais: number;
  faturamentoMensal: number;
  cancelamentosMensais: number;
  naoCompareceuMensais: number;
}

export interface IAppointment {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  data: string;
  inicio: string;
  fim: string;
  servicoId: string;
  profissionalId: string;
  status: string;
  servicoNome: string;
  servicoPreco: number;
  profissionalNome: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface IFinance {
  id: string;
  agendamentoId: string;
  clienteNome: string;
  valor: number;
  status: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface IRelatorio {
  id: string;
  mesAno: string;
  agendamentos: number;
  faturamento: number;
  cancelados: number;
  naoCompareceu: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DashboardResponse {
  metrics: IDashboardMetrics;
  agendamentos: IAppointment[];
  financeiro: IFinance[];
  relatorios: IRelatorio[];
}
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});