import { useState, useRef, useCallback, useEffect } from "react";
import { Profissional } from "../interfaces/profissionaisInterface";
import { ProfissionalService } from "../api/profissionaisAdmin";

const service = new ProfissionalService();

export function useProfissionaisAdmin() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);
  const controllerRef = useRef<AbortController | null>(null);

  // Cleanup quando desmontar
  useEffect(() => {
    mounted.current = true;

    // Ao montar, já busca os profissionais
    fetchProfissionais();

    return () => {
      mounted.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const fetchProfissionais = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Cancela qualquer requisição anterior
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await service.fetchProfissionais(controller.signal);
      // ⚠️ garante acesso correto ao axios (res.data.data)
      const data = response ?? [];
      if (mounted.current) setProfissionais(data);
      return data;
    } catch (err: any) {
      if (mounted.current) setError(err.message || "Erro ao carregar profissionais");
      console.error(err);
      return [];
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const addProfissional = useCallback(async (p: Omit<Profissional, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const novo = await service.createProfissional(p);
      if (mounted.current) setProfissionais((prev) => [...prev, novo]);
      return novo;
    } catch (err: any) {
      if (mounted.current) setError(err.message || "Erro ao adicionar profissional");
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const updateProfissional = useCallback(async (id: string, p: Partial<Profissional>) => {
    setLoading(true);
    setError(null);
    try {
      const atualizado = await service.updateProfissional(id, p);
      if (atualizado && mounted.current) {
        setProfissionais((prev) =>
          prev.map((item) => (item.id === id ? atualizado : item))
        );
      }
      return atualizado;
    } catch (err: any) {
      if (mounted.current) setError(err.message || "Erro ao atualizar profissional");
      return null;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const removeProfissional = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await service.deleteProfissional(id);
      if (mounted.current)
        setProfissionais((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      if (mounted.current) setError(err.message || "Erro ao remover profissional");
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  return {
    profissionais,
    loading,
    error,
    fetchProfissionais,
    addProfissional,
    updateProfissional,
    removeProfissional,
  };
}