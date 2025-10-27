import axios from "axios";
import { DashboardResponse } from "@/app/interfaces/dashboardInterface";

export class DashboardService {
  private api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const response = await this.api.get<{
        status: boolean;
        data: DashboardResponse;
        message?: string;
      }>("/dashboard/metrics");

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

// Exporte o serviço
export const dashboardService = new DashboardService();