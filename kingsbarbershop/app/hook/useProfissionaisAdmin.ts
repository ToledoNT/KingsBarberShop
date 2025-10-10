"use client";

import { useState, useEffect } from "react";
import { Profissional } from "../interfaces/profissionaisInterface";
import { ProfissionalService } from "../api/frontend/profissionaisAdmin";

const service = new ProfissionalService();

export function useProfissionaisAdmin() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfissionais = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.fetchProfissionais();
      setProfissionais(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar profissionais");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfissionais();
  }, []);

  const addProfissional = async (p: Omit<Profissional, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const novo = await service.createProfissional(p);
      setProfissionais(prev => [...prev, novo]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao adicionar profissional");
    } finally {
      setLoading(false);
    }
  };

  const updateProfissional = async (id: string, p: Omit<Profissional, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const atualizado = await service.updateProfissional(id, p);
      if (atualizado) {
        // Atualiza o estado com o profissional atualizado
        setProfissionais(prev =>
          prev.map(item => (item.id === id ? atualizado : item))
        );
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao atualizar profissional");
    } finally {
      setLoading(false);
    }
  };

  const removeProfissional = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await service.deleteProfissional(id);
      setProfissionais(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao remover profissional");
    } finally {
      setLoading(false);
    }
  };

  return {
    profissionais,
    addProfissional,
    updateProfissional,
    removeProfissional,
    loading,
    error,
    fetchProfissionais,
  };
}