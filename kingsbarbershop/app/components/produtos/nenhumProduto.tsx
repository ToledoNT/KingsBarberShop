interface NenhumProdutoProps {
  filtrosAtivos: boolean;
  onLimparFiltros: () => void;
}

export const NenhumProduto = ({ filtrosAtivos, onLimparFiltros }: NenhumProdutoProps) => (
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