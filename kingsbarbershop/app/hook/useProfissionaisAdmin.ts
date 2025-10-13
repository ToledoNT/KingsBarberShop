"use client";

import { useState, useEffect } from "react";
import { Profissional, Procedimento } from "../interfaces/profissionaisInterface";
import { ProfissionalService } from "../api/frontend/profissionaisAdmin";

const service = new ProfissionalService();

export function useProfissionaisAdmin() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Buscar todos profissionais
  const fetchProfissionais = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.fetchProfissionais();
      setProfissionais(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao carregar profissionais");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfissionais();
  }, []);

  // 🔹 Adicionar profissional
  const addProfissional = async (
    p: Omit<Profissional, "id"> & { procedimentos?: Procedimento[] }
  ): Promise<Profissional> => {
    setLoading(true);
    setError(null);
    try {
      const novo: Profissional = await service.createProfissional({
        ...p,
        procedimentos: p.procedimentos ?? [],
      });

      setProfissionais((prev) => [...prev, novo]);
      return novo;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao adicionar profissional");
      throw err;
    } finally {
      setLoading(false);
    }
  };

const updateProfissional = async (
  id: string,
  p: Omit<Profissional, "id" | "procedimentos">
): Promise<Profissional | null> => {
  setLoading(true);
  setError(null);
  try {
    // o service retorna Profissional diretamente
    const atualizado = await service.updateProfissional(id, { ...p, id }); // Profissional

    if (!atualizado) {
      setError("Profissional não retornado pelo backend");
      return null;
    }

    // Atualiza estado
    setProfissionais((prev) =>
      prev.map((item) => (item.id === id ? atualizado : item))
    );

    return atualizado;
  } catch (err: any) {
    console.error("Erro ao atualizar profissional:", err);
    setError(err.message || "Erro ao atualizar profissional");
    return null;
  } finally {
    setLoading(false);
  }
};


  // 🔹 Remover profissional
  const removeProfissional = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await service.deleteProfissional(id);
      setProfissionais((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao remover profissional");
    } finally {
      setLoading(false);
    }
  };

  return {
    profissionais,
    fetchProfissionais,
    addProfissional,
    updateProfissional,
    removeProfissional,
    loading,
    error,
  };
}