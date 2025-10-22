import { useState, useRef, useCallback, useEffect } from "react";
import { Profissional } from "../interfaces/profissionaisInterface";
import { ProfissionalService } from "../api/profissionaisAdmin";

export function useProfissionaisAdmin() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);
  const controllerRef = useRef<AbortController | null>(null);
  const serviceRef = useRef(new ProfissionalService());

  useEffect(() => {
    mounted.current = true;
    fetchProfissionais();

    return () => {
      mounted.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const fetchProfissionais = useCallback(async () => {
    if (!mounted.current) return;
    setLoading(true);
    setError(null);

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const data = await serviceRef.current.fetchProfissionais(controller.signal) ?? [];
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
      const novo = await serviceRef.current.createProfissional(p);
      if (mounted.current) setProfissionais(prev => [...prev, novo]);
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
      const atualizado = await serviceRef.current.updateProfissional(id, p);
      if (atualizado && mounted.current) {
        setProfissionais(prev =>
          prev.map(item => item.id === id ? atualizado : item)
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
      const response = await serviceRef.current.deleteProfissional(id);

      if (!response.status) {
        if (mounted.current) setError(response.message);
        return { success: false, message: response.message };
      }

      if (mounted.current) setProfissionais(prev => prev.filter(item => item.id !== id));

      return { success: true, message: "Profissional deletado com sucesso!" };
    } catch (err: any) {
      if (mounted.current) setError(err.message || "Erro ao remover profissional");
      return { success: false, message: err.message };
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