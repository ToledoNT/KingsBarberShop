// components/ModalConfirmacaoStatus.tsx
"use client";

import { IProduto } from "@/app/interfaces/produtosInterface";
import React, { useState, useEffect } from "react";

interface ModalConfirmacaoStatusProps {
  produto: IProduto | null;
  novoStatus: IProduto["status"];
  usuarioPendente: string;
  onUsuarioPendenteChange: (usuario: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModalConfirmacaoStatus: React.FC<ModalConfirmacaoStatusProps> = ({
  produto,
  novoStatus,
  usuarioPendente,
  onUsuarioPendenteChange,
  onConfirm,
  onCancel
}) => {
  const [localUsuarioPendente, setLocalUsuarioPendente] = useState(usuarioPendente);
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalUsuarioPendente(usuarioPendente);
  }, [usuarioPendente]);

  const handleUsuarioChange = (value: string) => {
    setLocalUsuarioPendente(value);
    onUsuarioPendenteChange(value);
    
    if (error && value.trim()) {
      setError("");
    }
  };

  const validateForm = (): boolean => {
    if (novoStatus === "pendente" && !localUsuarioPendente.trim()) {
      setError("Por favor, informe o nome do usuário para o status Pendente");
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const getStatusInfo = () => {
    switch (novoStatus) {
      case "disponivel":
        return {
          title: "Marcar como Disponível",
          icon: "🟢",
          description: "O produto estará disponível para uso ou venda.",
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30"
        };
      case "vendido":
        return {
          title: "Marcar como Vendido",
          icon: "💰",
          description: "O produto será marcado como vendido e não estará mais disponível.",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30"
        };
      case "consumido":
        return {
          title: "Marcar como Consumido",
          icon: "📦",
          description: "O produto será marcado como consumido/utilizado.",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30"
        };
      case "pendente":
        return {
          title: "Marcar como Pendente",
          icon: "⏳",
          description: "O produto ficará pendente para um usuário específico.",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30"
        };
      default:
        return {
          title: "Alterar Status",
          icon: "📝",
          description: "Alterar o status do produto.",
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30"
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (!produto) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl w-full max-w-md">
        {/* Header */}
        <div className={`p-6 border-b ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{statusInfo.icon}</span>
            <div>
              <h2 className={`text-xl font-semibold ${statusInfo.color}`}>
                {statusInfo.title}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Confirmar alteração de status do produto
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações do Produto */}
          <div className="bg-[#0D0D0D] border border-[#333] rounded-lg p-4">
            <h3 className="font-medium text-white mb-2">Produto Selecionado:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Nome:</span>
                <span className="text-white font-medium">{produto.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Categoria:</span>
                <span className="text-white">{produto.categoria}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status Atual:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  produto.status === "disponivel" ? "bg-green-500/20 text-green-400" :
                  produto.status === "vendido" ? "bg-blue-500/20 text-blue-400" :
                  produto.status === "consumido" ? "bg-purple-500/20 text-purple-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {produto.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Novo Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                  {novoStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Descrição da Ação */}
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              {statusInfo.description}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Esta ação pode afetar a disponibilidade e o controle de estoque do produto.
            </p>
          </div>

          {/* Campo de Usuário Pendente (condicional) */}
          {novoStatus === "pendente" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Usuário *
              </label>
              <input
                type="text"
                value={localUsuarioPendente}
                onChange={(e) => handleUsuarioChange(e.target.value)}
                className={`w-full px-4 py-3 bg-[#0D0D0D] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                  error 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-[#333] focus:ring-yellow-500"
                }`}
                placeholder="Digite o nome do usuário responsável"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Informe o nome da pessoa para quem o produto está reservado.
              </p>
            </div>
          )}

          {/* Aviso para outros status */}
          {novoStatus !== "pendente" && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Atenção</p>
                  <p className="text-yellow-300 text-sm mt-1">
                    Ao confirmar, o status do produto será alterado permanentemente. 
                    {novoStatus === "vendido" || novoStatus === "consumido" ? 
                      " O produto não estará mais disponível para uso." : 
                      " O produto voltará a ficar disponível."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer com botões */}
        <div className="flex justify-end gap-3 p-6 border-t border-[#333]">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-300 border border-[#333] rounded-lg hover:bg-[#333] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-3 rounded-lg text-white transition-colors flex items-center gap-2 ${
              novoStatus === "disponivel" ? "bg-green-600 hover:bg-green-700" :
              novoStatus === "vendido" ? "bg-blue-600 hover:bg-blue-700" :
              novoStatus === "consumido" ? "bg-purple-600 hover:bg-purple-700" :
              "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirmar Alteração
          </button>
        </div>
      </div>
    </div>
  );
};