import { useState, useEffect } from "react";
import { Procedimento } from "../interfaces/profissionaisInterface";
import { ProcedimentoService } from "../api/frontend/procedimentoAdmin";

const procedimentoService = new ProcedimentoService();

export function useProcedimentosAdmin() {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProcedimentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await procedimentoService.fetchProcedimentos();
      setProcedimentos(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar procedimentos");
    } finally {
      setLoading(false);
    }
  };

  const addProcedimento = async (p: Omit<Procedimento, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const novo = await procedimentoService.createProcedimento(p);
      setProcedimentos(prev => [...prev, novo]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao adicionar procedimento");
    } finally {
      setLoading(false);
    }
  };

  const updateProcedimento = async (id: string, p: Omit<Procedimento, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const atualizado = await procedimentoService.updateProcedimento(id, p);
      if (atualizado) {
        setProcedimentos(prev =>
          prev.map(item => (item.id === id ? atualizado : item))
        );
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao atualizar procedimento");
    } finally {
      setLoading(false);
    }
  };

  const removeProcedimento = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await procedimentoService.deleteProcedimento(id);
      setProcedimentos(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao remover procedimento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedimentos();
  }, []);

  const getProcedimentosByProfissional = (profissionalId: string) => {
    return procedimentos.filter(p => p.profissionalId === profissionalId);
  };

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
