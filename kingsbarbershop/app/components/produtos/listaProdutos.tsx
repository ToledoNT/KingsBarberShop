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
}

const NenhumProduto = ({ 
  filtrosAtivos, 
  onLimparFiltros 
}: { 
  filtrosAtivos: boolean; 
  onLimparFiltros: () => void;
}) => (
  <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-700 rounded-xl max-w-md mx-auto w-full bg-gray-900/30">
    <div className="text-6xl mb-4 opacity-60">📦</div>
    <p className="text-lg font-semibold text-gray-300 mb-2">Nenhum produto encontrado</p>
    <p className="text-gray-400 text-sm mb-6">
      {filtrosAtivos ? "Ajuste os filtros para ver mais resultados" : "Adicione seu primeiro produto"}
    </p>
    {filtrosAtivos && (
      <button 
        onClick={onLimparFiltros} 
        className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2 mx-auto"
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
    <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm flex-1 min-h-0">
      <div className="flex justify-between items-center mb-4 sm:mb-6 flex-shrink-0">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span className="text-[#FFA500]">📋</span>
          Produtos 
          <span className="text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg ml-2">
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
          <div className="grid gap-3 sm:gap-4 pb-2">
            {produtos.map((prd: IProduto, index) => (
              <ProdutoItem 
                key={prd.id ?? index}
                produto={prd} 
                onEdit={() => onEdit(prd)} 
                onDelete={() => onDelete(prd.id)}
                onUpdateStatus={onUpdateStatus}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};