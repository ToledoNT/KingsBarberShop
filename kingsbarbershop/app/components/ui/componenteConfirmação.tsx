// components/ui/componenteConfirmacao.tsx
"use client";

import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  type: "info" | "warning" | "error";
  onConfirm: () => void;
  onCancel: () => void;
  position?: { top: number; left: number }; 
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  type,
  onConfirm,
  onCancel,
  position,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  // Define cores dos botões conforme tipo
  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return { button: "bg-yellow-500 hover:bg-yellow-600" };
      case "error":
        return { button: "bg-red-500 hover:bg-red-600" };
      default:
        return { button: "bg-[#FFA500] hover:bg-[#FF8C00]" };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className="z-50 flex"
      style={{
        position: position ? "absolute" : "fixed",
        top: position?.top || 0,
        left: position?.left || 0,
        transform: position ? "translate(-50%, 0)" : undefined,
        width: "100%",
        justifyContent: "center",
        padding: "0.5rem",
        backgroundColor: position ? "transparent" : "rgba(0,0,0,0.7)",
        backdropFilter: position ? undefined : "blur(5px)",
        overflowY: "auto",
      }}
    >
      <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] border border-gray-700 rounded-xl max-w-md w-full shadow-2xl h-fit">
        {/* CABEÇALHO */}
        <div className="p-6">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-bold text-white text-center">{title}</h2>
          </div>
        </div>

        {/* MENSAGEM */}
        <div className="px-6 pb-6">{message}</div>

        {/* BOTÕES */}
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