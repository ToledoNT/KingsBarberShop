import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardResponse } from "../interfaces/dashboardInterface";
import { DashboardService } from "../api/dashboardAdmin";

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dashboardService = useMemo(() => new DashboardService(), []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardService.getDashboardData();
      setData(result);
    } catch (err: any) {
      console.error("Erro ao buscar dados do dashboard:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [dashboardService]);

  useEffect(() => {
    let mounted = true;
    fetchDashboardData();
    return () => { mounted = false; };
  }, [fetchDashboardData]);

  const refetch = fetchDashboardData;

  return useMemo(() => ({ data, loading, error, refetch }), [data, loading, error, refetch]);
}