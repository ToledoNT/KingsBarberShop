import React from "react";

export const ResumoCard = React.memo(({ emoji, titulo, valor, cor, descricao }: {
  emoji: string;
  titulo: string;
  valor: string | number;
  cor: string;
  descricao?: string;
}) => {
  const corClasses = {
    green: "from-green-600/10 to-green-700/10 border-green-500/20 text-green-400",
    yellow: "from-yellow-600/10 to-yellow-700/10 border-yellow-500/20 text-yellow-400",
    blue: "from-blue-600/10 to-blue-700/10 border-blue-500/20 text-blue-400",
  }[cor];

  return (
    <div className={`bg-gradient-to-br ${corClasses} border rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-2xl sm:text-3xl">{emoji}</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <p className="text-gray-300 text-xs sm:text-sm font-medium">{titulo}</p>
        <p className="text-lg sm:text-2xl font-bold text-white truncate">{valor}</p>
        {descricao && (
          <p className="text-xs text-gray-400 opacity-80">{descricao}</p>
        )}
      </div>
    </div>
  );
});