interface HeaderProps {
  produtosCount: number;
  buscaValue: string;
  onBuscaChange: (valor: string) => void;
  onNovoProduto: () => void;
  onAtualizarLista: () => void;
}

export const Header = ({
  produtosCount,
  buscaValue,
  onBuscaChange,
  onNovoProduto,
  onAtualizarLista
}: HeaderProps) => (
  <div className="mb-6 sm:mb-8 flex-shrink-0">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1 flex items-center gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl">📦</span>
            <span className="truncate">Produtos</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base truncate">
            Gerencie seu catálogo de produtos ({produtosCount} produtos)
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={onNovoProduto} 
            className="px-4 py-3 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-black rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
          >
            <span>➕</span>
            <span className="hidden sm:inline">Novo Produto</span>
          </button>
          <button 
            onClick={onAtualizarLista} 
            className="px-4 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Busca Mobile */}
      <div className="sm:hidden mt-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={buscaValue} 
            onChange={(e) => onBuscaChange(e.target.value)} 
            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300" 
          />
        </div>
      </div>
    </div>
  </div>
);