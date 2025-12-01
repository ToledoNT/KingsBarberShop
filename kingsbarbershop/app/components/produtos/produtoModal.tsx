// components/ProdutoModal.tsx
"use client";

import { IProduto } from "@/app/interfaces/produtosInterface";
import React, { useState, useEffect } from "react";

interface ProdutoModalProps {
  initial?: IProduto;
  onClose: () => void;
  onSave: (produto: Partial<IProduto>) => void;
  categoriasSugeridas: string[];
}

export const ProdutoModal: React.FC<ProdutoModalProps> = ({
  initial,
  onClose,
  onSave,
  categoriasSugeridas
}) => {
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    preco: "",
    estoque: "",
    descricao: "",
    status: "disponivel" as IProduto["status"],
    usuarioPendente: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [categoriasLocais, setCategoriasLocais] = useState<string[]>([]);

  useEffect(() => {
    setCategoriasLocais(categoriasSugeridas);
  }, [categoriasSugeridas]);

useEffect(() => {
  if (initial) {
    setFormData((prev) => ({
      nome: initial.nome ?? prev.nome,
      categoria: initial.categoria ?? prev.categoria,
      preco: initial.preco != null ? initial.preco.toString() : prev.preco,
      estoque: initial.estoque != null ? initial.estoque.toString() : prev.estoque,
      descricao: initial.descricao ?? prev.descricao,
      status: initial.status ?? prev.status,
      usuarioPendente: initial.usuarioPendente ?? prev.usuarioPendente
    }));
  }
}, [initial]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = "Categoria é obrigatória";
    }

    const preco = parseFloat(formData.preco.replace(",", "."));
    if (!formData.preco || isNaN(preco) || preco <= 0) {
      newErrors.preco = "Preço deve ser um número maior que zero";
    }

    const estoque = parseInt(formData.estoque);
    if (!formData.estoque || isNaN(estoque) || estoque < 0) {
      newErrors.estoque = "Estoque deve ser um número válido";
    }

    if (formData.status === "pendente" && !formData.usuarioPendente.trim()) {
      newErrors.usuarioPendente = "Usuário pendente é obrigatório quando status é 'Pendente'";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleAddCategoria = () => {
    if (novaCategoria.trim() && !categoriasLocais.includes(novaCategoria)) {
      const novasCategorias = [...categoriasLocais, novaCategoria.trim()].sort();
      setCategoriasLocais(novasCategorias);
      handleChange("categoria", novaCategoria.trim());
      setNovaCategoria("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const produtoData: Partial<IProduto> = {
        nome: formData.nome.trim(),
        categoria: formData.categoria.trim(),
        preco: parseFloat(formData.preco.replace(",", ".")),
        estoque: parseInt(formData.estoque),
        descricao: formData.descricao.trim(),
        status: formData.status,
        usuarioPendente: formData.status === "pendente" ? formData.usuarioPendente.trim() : ""
      };

      await onSave(produtoData);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333]">
          <h2 className="text-xl font-semibold text-white">
            {initial ? "Editar Produto" : "Novo Produto"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#333] rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              className={`w-full px-4 py-3 bg-[#0D0D0D] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                errors.nome 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-[#333] focus:ring-blue-500"
              }`}
              placeholder="Digite o nome do produto"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-400">{errors.nome}</p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria *
            </label>
            <div className="space-y-3">
              <select
                value={formData.categoria}
                onChange={(e) => handleChange("categoria", e.target.value)}
                className={`w-full px-4 py-3 bg-[#0D0D0D] border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.categoria 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-[#333] focus:ring-blue-500"
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {categoriasLocais.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>

              {/* Adicionar nova categoria */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  placeholder="Ou digite uma nova categoria"
                  className="flex-1 px-4 py-3 bg-[#0D0D0D] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddCategoria}
                  disabled={!novaCategoria.trim()}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
            {errors.categoria && (
              <p className="mt-1 text-sm text-red-400">{errors.categoria}</p>
            )}
          </div>

          {/* Preço e Estoque */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preço (R$) *
              </label>
              <input
                type="text"
                value={formData.preco}
                onChange={(e) => handleChange("preco", e.target.value.replace(/[^0-9,.]/g, ""))}
                className={`w-full px-4 py-3 bg-[#0D0D0D] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.preco 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-[#333] focus:ring-blue-500"
                }`}
                placeholder="0,00"
              />
              {errors.preco && (
                <p className="mt-1 text-sm text-red-400">{errors.preco}</p>
              )}
            </div>

            {/* Estoque */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estoque *
              </label>
              <input
                type="number"
                value={formData.estoque}
                onChange={(e) => handleChange("estoque", e.target.value)}
                className={`w-full px-4 py-3 bg-[#0D0D0D] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.estoque 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-[#333] focus:ring-blue-500"
                }`}
                placeholder="0"
                min="0"
              />
              {errors.estoque && (
                <p className="mt-1 text-sm text-red-400">{errors.estoque}</p>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Digite uma descrição para o produto (opcional)"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="disponivel">Disponível</option>
              <option value="vendido">Vendido</option>
              <option value="consumido">Consumido</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>

          {/* Usuário Pendente (apenas quando status for "pendente") */}
          {formData.status === "pendente" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usuário Pendente *
              </label>
              <input
                type="text"
                value={formData.usuarioPendente}
                onChange={(e) => handleChange("usuarioPendente", e.target.value)}
                className={`w-full px-4 py-3 bg-[#0D0D0D] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.usuarioPendente 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-[#333] focus:ring-blue-500"
                }`}
                placeholder="Digite o nome do usuário"
              />
              {errors.usuarioPendente && (
                <p className="mt-1 text-sm text-red-400">{errors.usuarioPendente}</p>
              )}
            </div>
          )}

          {/* Footer com botões */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#333]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-300 border border-[#333] rounded-lg hover:bg-[#333] disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {initial ? "Atualizar" : "Criar"} Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};