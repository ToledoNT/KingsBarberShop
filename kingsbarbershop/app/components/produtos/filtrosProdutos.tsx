const Filtros = ({ 
  filtros, 
  onFiltroChange, 
  onLimparFiltros, 
  categoriasDisponiveis, 
  totalFiltrado, 
  totalProdutos 
}: { 
  filtros: { busca: string; categoria: string; ordenacao: string }; 
  onFiltroChange: (campo: string, valor: any) => void; 
  onLimparFiltros: () => void; 
  categoriasDisponiveis: string[]; 
  totalFiltrado: number; 
  totalProdutos: number; 
}) => {
  return (
    <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h4 className="text-base font-semibold text-white flex items-center gap-2">
          <span className="text-[#FFA500]">🎯</span>
          Filtros
        </h4>
        <button 
          onClick={onLimparFiltros}
          className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
        >
          <span>🔄</span>
          Limpar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            🔍 Buscar
          </label>
          <input 
            type="text" 
            placeholder="Nome do produto..." 
            value={filtros.busca} 
            onChange={(e) => onFiltroChange("busca", e.target.value)} 
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            🏷️ Categoria
          </label>
          <select 
            value={filtros.categoria} 
            onChange={(e) => onFiltroChange("categoria", e.target.value)} 
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
          >
            <option value="todos">Todas as categorias</option>
            {categoriasDisponiveis.map((categoria) => (
              <option key={`categoria-${categoria}`} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          {categoriasDisponiveis.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Nenhuma categoria cadastrada ainda
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            📊 Ordenar
          </label>
          <select 
            value={filtros.ordenacao} 
            onChange={(e) => onFiltroChange("ordenacao", e.target.value)} 
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
          >
            <option value="nome">Nome</option>
            <option value="preco">Preço</option>
            <option value="estoque">Estoque</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            📋 Resultados
          </label>
          <div className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/30 border border-gray-700 text-white text-sm sm:text-base">
            {totalFiltrado} de {totalProdutos} produtos
          </div>
        </div>
      </div>
    </div>
  );
};