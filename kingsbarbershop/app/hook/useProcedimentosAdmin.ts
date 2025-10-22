import { useState, useEffect, useRef, useCallback } from "react";
import { Procedimento } from "../interfaces/profissionaisInterface";
import { ProcedimentoService } from "../api/procedimentoAdmin";

const procedimentoService = new ProcedimentoService();

export function useProcedimentosAdmin() {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    fetchProcedimentos();
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchProcedimentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await procedimentoService.fetchProcedimentos();
      if (mounted.current) setProcedimentos(data);
    } catch (err: any) {
      console.error(err);
      if (mounted.current) setError(err.message || "Erro ao carregar procedimentos");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const addProcedimento = useCallback(async (p: Omit<Procedimento, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const novo = await procedimentoService.createProcedimento(p);
      if (mounted.current) setProcedimentos(prev => [...prev, novo]);
      return novo;
    } catch (err: any) {
      console.error(err);
      if (mounted.current) setError(err.message || "Erro ao adicionar procedimento");
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const updateProcedimento = useCallback(async (id: string, p: Omit<Procedimento, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const atualizado = await procedimentoService.updateProcedimento(id, p);
      if (atualizado && mounted.current) {
        setProcedimentos(prev =>
          prev.map(item => (item.id === id ? atualizado : item))
        );
      }
      return atualizado;
    } catch (err: any) {
      console.error(err);
      if (mounted.current) setError(err.message || "Erro ao atualizar procedimento");
      return null;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const removeProcedimento = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await procedimentoService.deleteProcedimento(id);
      if (mounted.current) setProcedimentos(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      console.error(err);
      if (mounted.current) setError(err.message || "Erro ao remover procedimento");
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const getProcedimentosByProfissional = useCallback(
    (profissionalId: string) => procedimentos.filter(p => p.profissionalId === profissionalId),
    [procedimentos]
  );

  return {
    procedimentos,
    addProcedimento,
    updateProcedimento,
    removeProcedimento,
    loading,
    error,
    fetchProcedimentos,
    getProcedimentosByProfissional,
  };
}