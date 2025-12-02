import { IProduto } from "@/app/interfaces/produtosInterface";
import { ProdutoItem } from "./produtoItem";

interface ListaProdutosProps {
  produtos: IProduto[];
  produtosTotal: number;
  ordenacao: string;
  onEdit: (produto: IProduto) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (produto: IProduto, status: IProduto["status"]) => void;
  getStatusColor: (status: string | undefined) => string;
  onLimparFiltros: () => void;
  filtrosAtivos: boolean;
  mostrarAlerta: (mensagem: string, callback: () => void) => void; // ✅ Adicionar aqui
}


const NenhumProduto = ({ 
  filtrosAtivos, 
  onLimparFiltros 
}: { 
  filtrosAtivos: boolean; 
  onLimparFiltros: () => void;
}) => (
  <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-700 rounded-xl max-w-md mx-auto w-full bg-gray-900/20 backdrop-blur-sm">
    <div className="text-6xl mb-4 opacity-70 animate-pulse">📦</div>
    <p className="text-lg font-semibold text-gray-200 mb-2">Nenhum produto encontrado</p>
    <p className="text-gray-400 text-sm mb-6">
      {filtrosAtivos ? "Ajuste os filtros para ver mais resultados" : "Adicione seu primeiro produto"}
    </p>
    {filtrosAtivos && (
      <button 
        onClick={onLimparFiltros} 
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold rounded-xl transition-all flex items-center gap-2 mx-auto shadow-md"
      >
        <span>🔄</span>
        Limpar Filtros
      </button>
    )}
  </div>
);

export const ListaProdutos = ({
  produtos,
  produtosTotal,
  ordenacao,
  onEdit,
  onDelete,
  onUpdateStatus,
  getStatusColor,
  onLimparFiltros,
  filtrosAtivos
}: ListaProdutosProps) => {
  return (
    <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-2xl p-5 shadow-2xl flex flex-col backdrop-blur-sm flex-1 min-h-0">
      <div className="flex justify-between items-center mb-5 flex-shrink-0">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span className="text-[#FFA500]">📋</span>
          Produtos 
          <span className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-lg ml-2">
            {produtos.length} de {produtosTotal}
          </span>
        </h3>
        <div className="text-sm text-gray-400 hidden sm:block">
          Ordenado por: {ordenacao}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {produtos.length === 0 ? (
          <NenhumProduto 
            filtrosAtivos={filtrosAtivos} 
            onLimparFiltros={onLimparFiltros} 
          />
        ) : (
          <div className="grid gap-4 sm:gap-5 pb-3">
            {produtos.map((prd: IProduto, index) => (
              <div key={prd.id ?? index}>
                <ProdutoItem 
                  produto={prd} 
                  onEdit={() => onEdit(prd)} 
                  onDelete={() => onDelete(prd.id)}
                  onUpdateStatus={onUpdateStatus}
                  getStatusColor={getStatusColor}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};