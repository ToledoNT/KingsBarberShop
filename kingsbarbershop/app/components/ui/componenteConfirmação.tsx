// components/ui/componenteConfirmação.tsx - VERSÃO CORRIGIDA
"use client";

import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  type: "info" | "warning" | "error";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  type,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-yellow-500",
          text: "text-yellow-600",
          border: "border-yellow-500",
          button: "bg-yellow-500 hover:bg-yellow-600",
        };
      case "error":
        return {
          bg: "bg-red-500",
          text: "text-red-600",
          border: "border-red-500",
          button: "bg-red-500 hover:bg-red-600",
        };
      default:
        return {
          bg: "bg-[#FFA500]",
          text: "text-[#FFA500]",
          border: "border-[#FFA500]",
          button: "bg-[#FFA500] hover:bg-[#FF8C00]",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] border border-gray-700 rounded-xl mx-4 max-w-md w-full shadow-2xl">
        {/* CABEÇALHO - SEM BORDA E SEM LÂMPADA */}
        <div className="p-6">
          <div className="flex items-center justify-center">
            <h2 className={`text-xl font-bold text-white text-center`}>
              {title}
            </h2>
          </div>
        </div>

        {/* MENSAGEM - SEM SCROLL E SEM OVERFLOW */}
        <div className="px-6 pb-6">
          {message}
        </div>

        {/* BOTÕES - SEM BORDA SUPERIOR */}
        <div className="flex">
          <button
            onClick={onCancel}
            className="flex-1 py-4 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium rounded-bl-xl"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 text-white font-medium rounded-br-xl transition-colors ${styles.button}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}