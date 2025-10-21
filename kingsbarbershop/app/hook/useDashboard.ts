import { useState, useEffect } from "react";
import { DashboardResponse, DashboardService } from "../api/dashboardAdmin";

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dashboardService = new DashboardService();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result: DashboardResponse = await dashboardService.getDashboardData();
      setData(result);
    } catch (err: any) {
      console.error("Erro ao buscar dados do dashboard:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}