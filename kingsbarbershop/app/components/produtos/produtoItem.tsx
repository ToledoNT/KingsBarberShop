"use client";

import { IProduto } from "@/app/interfaces/produtosInterface";
import { useState, useEffect, useRef } from "react";

interface ProdutoItemProps {
  produto: IProduto;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (produto: IProduto, status: IProduto["status"]) => void;
  getStatusColor: (status: IProduto["status"]) => string;
}

const STATUS_POSSIVEIS: IProduto["status"][] = ["disponivel", "vendido", "consumido", "pendente"];

export const ProdutoItem = ({
  produto,
  onEdit,
  onDelete,
  onUpdateStatus,
  getStatusColor,
}: ProdutoItemProps) => {
  const [mostrarOpcoesStatus, setMostrarOpcoesStatus] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const opcoesValidas = STATUS_POSSIVEIS.filter((s) => {
    if (s === produto.status) return false;
    switch (produto.status) {
      case "vendido":
      case "consumido":
        return false;
      case "pendente":
        return s === "vendido";
      case "disponivel":
        return true;
      default:
        return false;
    }
  });

  const statusBloqueado = opcoesValidas.length === 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setMostrarOpcoesStatus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center
                    bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700
                    rounded-2xl p-5 shadow-md relative">
      {/* INFO DO PRODUTO */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">📦</span>
          </div>
          <div>
            <span className="text-white font-semibold block text-lg">{produto.nome}</span>
            <span className="text-gray-400 text-sm">{produto.categoria ?? "—"}</span>
          </div>
        </div>

        {/* PREÇO, ESTOQUE E STATUS */}
        <div className="flex flex-wrap gap-4 sm:gap-6 items-center relative" ref={statusRef}>
          <span className="text-yellow-400 font-bold text-lg">
            {produto.preco != null
              ? produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
              : "-"}
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-200">
            {produto.estoque ?? 0} itens
          </span>

          {/* BOTÃO STATUS PRINCIPAL */}
          <button
            onClick={() => !statusBloqueado && setMostrarOpcoesStatus(!mostrarOpcoesStatus)}
            className={`px-3 py-2 rounded-full text-xs font-semibold border ${getStatusColor(produto.status)} flex items-center gap-2 transition-all duration-300
              ${statusBloqueado ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={statusBloqueado}
          >
            <span className="capitalize">
              {produto.status}
              {produto.status === "pendente" && produto.usuarioPendente ? ` (${produto.usuarioPendente})` : ""}
            </span>
            <span className="text-xs">▼</span>
          </button>

          {/* DROPDOWN BONITINHO */}
          {mostrarOpcoesStatus && opcoesValidas.length > 0 && (
            <div className="absolute top-full left-0 mt-2 bg-[#1A1A1A] border border-gray-600 rounded-xl shadow-lg min-w-[160px] z-50 backdrop-blur-sm overflow-hidden">
              {opcoesValidas.map((status) => (
                <button
                  key={status}
                  onClick={() => { onUpdateStatus(produto, status); setMostrarOpcoesStatus(false); }}
                  className={`w-full text-left px-4 py-2 text-sm capitalize font-medium transition-all duration-200
                    ${getStatusColor(status)} hover:brightness-110`}
                  style={{ borderRadius: "0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AÇÕES */}
      <div className="flex items-center gap-3 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gray-700 rounded-xl text-sm hover:bg-gray-600 transition-colors flex items-center gap-2 justify-center flex-1 sm:flex-none"
        >
          ✏️ <span className="hidden sm:inline">Editar</span>
        </button>

        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 rounded-xl text-sm hover:bg-red-700 transition-colors flex items-center gap-2 justify-center flex-1 sm:flex-none"
        >
          🗑️ <span className="hidden sm:inline">Excluir</span>
        </button>
      </div>
    </div>
  );
};