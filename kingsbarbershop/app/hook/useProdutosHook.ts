import { useState, useEffect, useRef, useCallback } from "react";
import { ProductService } from "../api/produtosApi";
import { IProduto } from "../interfaces/produtosInterface";

const produtoService = new ProductService();

export function useProdutos() {
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);

  // 📌 Buscar todos os produtos
  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await produtoService.fetchProdutos();
      if (mounted.current) setProdutos(data);
    } catch (err: any) {
      console.error(err);
      if (mounted.current)
        setError(err.message || "Erro ao carregar produtos");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchProdutos(); 
    return () => {
      mounted.current = false;
    };
  }, [fetchProdutos]);

  // 📌 Adicionar novo produto
  const addProduto = useCallback(async (p: Omit<IProduto, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const novo = await produtoService.createProduto(p);
      if (mounted.current) setProdutos((prev) => [...prev, novo]);
      return novo;
    } catch (err: any) {
      console.error(err);
      if (mounted.current)
        setError(err.message || "Erro ao adicionar produto");
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  // 📌 Atualizar produto
const updateProduto = useCallback(
  async (id: string, p: Partial<Omit<IProduto, "id">>) => {
    setLoading(true);
    setError(null);

    try {
      const atualizado = await produtoService.updateProduto(id, p);
      if (atualizado && mounted.current) {
        setProdutos((prev) =>
          prev.map((item) => (item.id === id ? atualizado : item))
        );
      }
      return atualizado;
    } catch (err: any) {
      console.error(err);
      if (mounted.current)
        setError(err.message || "Erro ao atualizar produto");
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  },
  []
);


  // 📌 Remover produto
  const removeProduto = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await produtoService.deleteProduto(id);
      if (mounted.current) {
        setProdutos((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err: any) {
      console.error(err);
      if (mounted.current)
        setError(err.message || "Erro ao remover produto");
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  return {
    produtos,
    addProduto,
    updateProduto,
    removeProduto,
    fetchProdutos,
    loading,
    error,
  };
}