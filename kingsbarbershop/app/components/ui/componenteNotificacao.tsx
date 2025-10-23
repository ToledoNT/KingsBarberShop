import { useEffect, useState } from "react";

interface NotificationProps {
  isOpen: boolean;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  isOpen,
  message,
  type = "info",
  onClose,
  duration = 4000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Aguarda animação de saída
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    info: {
      gradient: "from-blue-500/10 via-blue-600/5 to-blue-700/10",
      border: "border-blue-400/20",
      glow: "shadow-lg shadow-blue-500/10",
      icon: "💡",
      title: "Informação",
      iconBg: "bg-blue-500/20 text-blue-300"
    },
    success: {
      gradient: "from-green-500/10 via-green-600/5 to-green-700/10", 
      border: "border-green-400/20",
      glow: "shadow-lg shadow-green-500/10",
      icon: "✅",
      title: "Sucesso!",
      iconBg: "bg-green-500/20 text-green-300"
    },
    warning: {
      gradient: "from-yellow-500/10 via-yellow-600/5 to-yellow-700/10",
      border: "border-yellow-400/20", 
      glow: "shadow-lg shadow-yellow-500/10",
      icon: "⚠️",
      title: "Atenção",
      iconBg: "bg-yellow-500/20 text-yellow-300"
    },
    error: {
      gradient: "from-red-500/10 via-red-600/5 to-red-700/10",
      border: "border-red-400/20",
      glow: "shadow-lg shadow-red-500/10", 
      icon: "❌",
      title: "Erro",
      iconBg: "bg-red-500/20 text-red-300"
    }
  };

  const config = typeConfig[type];

  return (
    <div className={`
      fixed top-4 right-4 left-4 sm:left-auto z-[100] max-w-sm mx-auto sm:mx-0
      transition-all duration-500 ease-out
      ${isVisible ? 'animate-in slide-in-from-right-full' : 'animate-out slide-out-to-right-full'}
    `}>
      <div className={`
        relative border rounded-2xl p-4 backdrop-blur-xl
        bg-gradient-to-br ${config.gradient}
        ${config.border} ${config.glow}
        transform transition-transform duration-300
        hover:scale-[1.02] hover:shadow-xl
      `}>
        {/* Barra de progresso animada */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl overflow-hidden bg-white/10">
          <div 
            className="h-full bg-current opacity-50 rounded-full"
            style={{ 
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>

        <div className="flex items-start gap-3">
          {/* Ícone com animação */}
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
            ${config.iconBg} backdrop-blur-sm
            animate-pulse
          `}>
            <span className="text-lg">{config.icon}</span>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0 pt-1">
            <h4 className="text-white font-semibold text-sm mb-1">
              {config.title}
            </h4>
            <p className="text-white/80 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Botão fechar elegante */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className={`
              flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
              bg-white/5 hover:bg-white/10 border border-white/10
              transition-all duration-200
              text-white/60 hover:text-white hover:scale-110
              text-sm
            `}
          >
            ✕
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};