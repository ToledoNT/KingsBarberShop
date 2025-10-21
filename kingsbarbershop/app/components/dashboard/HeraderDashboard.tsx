// components/HeaderDashboard.tsx
interface HeaderDashboardProps {
  onRefresh: () => void;
}

const HeaderDashboard = ({ onRefresh }: HeaderDashboardProps) => {
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1">
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Visão completa do seu negócio em tempo real
        </p>
      </div>

      {/* Botão Atualizar */}
      <div className="mb-6 flex-shrink-0">
        <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">📅 Período Atual</p>
              <p className="font-bold text-white text-sm lg:text-base">
                {new Date().toLocaleDateString("pt-BR", { 
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <button 
              onClick={onRefresh} 
              className="px-4 py-3 bg-[#FFA500] text-black rounded-lg font-semibold hover:bg-[#FF8C00] transition-colors flex items-center gap-2 whitespace-nowrap text-sm"
            >
              🔄 Atualizar Dados
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderDashboard;