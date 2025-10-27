import { useState, useEffect, useCallback } from "react";
import { DashboardResponse } from "@/app/interfaces/dashboardInterface";
import axios from "axios";

// Serviço do Dashboard
class DashboardService {
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

const dashboardService = new DashboardService();

// Hook para consumir dados do dashboard
export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardService.getDashboardData();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
