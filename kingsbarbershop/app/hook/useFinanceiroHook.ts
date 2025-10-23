import { useState, useEffect, useCallback } from "react";
import { IFinanceiro } from "../interfaces/financeiroInterface";
import { FinanceiroService } from "../api/financeiro-api-";

const financeiroService = new FinanceiroService();

export function useFinanceiro() {
  const [financeiros, setFinanceiros] = useState<IFinanceiro[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceiros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeiroService.fetchFinanceiros();
      setFinanceiros(data);
    } catch (err: any) {
      console.error("Erro ao buscar lançamentos financeiros:", err);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinanceiros();
  }, [fetchFinanceiros]);

  return {
    financeiros,
    loading,
    error,
    fetchFinanceiros,
  };
}