import axios from "axios";

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

export class DashboardService {
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await api.get<{ status: boolean; data: DashboardResponse; message?: string }>("/dashboard/metrics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.status || !response.data.data) {
        throw new Error(response.data.message || "Erro ao buscar dados do dashboard");
      }

      return response.data.data;
    } catch (err: any) {
      console.error("DashboardService.getDashboardData error:", err);
      throw err;
    }
  }
}