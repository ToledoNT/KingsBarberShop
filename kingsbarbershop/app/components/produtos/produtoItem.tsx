import { IProduto } from "@/app/interfaces/produtosInterface";
import { useState } from "react";

interface ProdutoItemProps {
  produto: IProduto;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (produto: IProduto, status: IProduto["status"]) => void;
  getStatusColor: (status: IProduto["status"]) => string;
}

export const ProdutoItem = ({
  produto,
  onEdit,
  onDelete,
  onUpdateStatus,
  getStatusColor
}: ProdutoItemProps) => {

  const [mostrarOpcoesStatus, setMostrarOpcoesStatus] = useState(false);

  // ============================
  // 🔥 LÓGICA DE PERMISSÃO
  // ============================

  let opcoesValidas: IProduto["status"][] = [];

  if (produto.status === "disponivel") {
    opcoesValidas = ["vendido", "consumido", "pendente"];
  } else if (produto.status === "pendente") {
    opcoesValidas = ["vendido"];
  } else if (produto.status === "consumido" || produto.status === "vendido") {
    opcoesValidas = [];
  }

  const statusBloqueado = opcoesValidas.length === 0;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:border-gray-600">
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-1">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FFA500] to-[#FF8C00] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">📦</span>
          </div>

          <div>
            <span className="text-white font-medium block">{produto.nome}</span>
            <span className="text-gray-400 text-sm">{produto.categoria ?? "—"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
          
          <span className="text-[#FFA500] font-bold text-lg">
            {produto.preco != null
              ? produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
              : "-"
            }
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700/50 text-gray-300">
            {produto.estoque ?? 0} itens
          </span>

          <div className="relative">

            {/* ⬇️ BOTÃO DE STATUS COM NOME DO USUÁRIO */}
            <button
              onClick={() => {
                if (!statusBloqueado) setMostrarOpcoesStatus(!mostrarOpcoesStatus);
              }}
              className={`px-3 py-2 rounded-full text-xs font-semibold border ${getStatusColor(produto.status)} flex items-center gap-2 transition-all duration-300 hover:scale-105
                ${statusBloqueado ? "opacity-50 cursor-not-allowed" : ""}
              `}
              disabled={statusBloqueado}
            >
              <span className="capitalize">
                {produto.status}
                {produto.status === "pendente" && produto.usuarioPendente
                  ? ` (${produto.usuarioPendente})`
                  : ""}
              </span>

              <span className="text-xs">▼</span>
            </button>

            {mostrarOpcoesStatus && opcoesValidas.length > 0 && (
              <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-40 backdrop-blur-sm">
                {opcoesValidas.map((status) => (
                  <button
                    key={`status-${status}-${produto.id}`}
                    onClick={() => {
                      onUpdateStatus(produto, status);
                      setMostrarOpcoesStatus(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm capitalize hover:bg-gray-700 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${getStatusColor(status)}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
        
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gray-700 rounded-xl text-sm hover:bg-gray-600 transition-colors flex items-center gap-2 flex-1 sm:flex-none justify-center"
        >
          ✏️ <span className="hidden sm:inline">Editar</span>
        </button>

        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 rounded-xl text-sm hover:bg-red-700 transition-colors flex items-center gap-2 flex-1 sm:flex-none justify-center"
        >
          🗑️ <span className="hidden sm:inline">Excluir</span>
        </button>

      </div>
    </div>
  );
};