// src/hook/useFinanceiro.ts
import { useState, useEffect } from "react";
import { IFinanceiro } from "../interfaces/financeiroInterface";
import { FinanceiroService } from "../api/financeiro-api-";

const financeiroService = new FinanceiroService();

export function useFinanceiro() {
  const [financeiros, setFinanceiros] = useState<IFinanceiro[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceiros = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeiroService.fetchFinanceiros();
      setFinanceiros(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar lançamentos financeiros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceiros();
  }, []);

  return {
    financeiros,
    loading,
    error,
    fetchFinanceiros,
  };
}
