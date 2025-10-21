import ProgressBar from "./ProgressBar";


interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string;
  progress?: { value: number; max: number; color: string };
  period: 'daily' | 'monthly' | 'yearly';
}

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color,
  progress,
  period
}: MetricCardProps) => {
  const periodBadges = {
    daily: { text: 'HOJE', color: 'bg-blue-500/90 text-white' },
    monthly: { text: 'MÊS', color: 'bg-purple-500/90 text-white' },
    yearly: { text: 'ANO', color: 'bg-green-500/90 text-white' }
  };

  const colorConfigs = {
    blue: {
      border: 'border-l-4 border-l-blue-500',
      glow: 'hover:shadow-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400'
    },
    green: {
      border: 'border-l-4 border-l-green-500',
      glow: 'hover:shadow-green-500/20',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    orange: {
      border: 'border-l-4 border-l-orange-500',
      glow: 'hover:shadow-orange-500/20',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400'
    },
    purple: {
      border: 'border-l-4 border-l-purple-500',
      glow: 'hover:shadow-purple-500/20',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400'
    },
    red: {
      border: 'border-l-4 border-l-red-500',
      glow: 'hover:shadow-red-500/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400'
    },
    teal: {
      border: 'border-l-4 border-l-teal-500',
      glow: 'hover:shadow-teal-500/20',
      iconBg: 'bg-teal-500/20',
      iconColor: 'text-teal-400'
    }
  };

  const config = colorConfigs[color as keyof typeof colorConfigs] || colorConfigs.blue;

  return (
    <div className={`
      bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-6 
      transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden
      ${config.border} ${config.glow}
    `}>
      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="absolute top-3 right-3 z-10">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${periodBadges[period].color}`}>
          {periodBadges[period].text}
        </span>
      </div>
      
      <div className="flex justify-between items-start relative z-1">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
          
          {progress && (
            <div className="mt-4">
              <ProgressBar 
                value={progress.value} 
                max={progress.max} 
                color={progress.color}
              />
            </div>
          )}
        </div>
        <div className={`text-3xl p-3 rounded-xl ${config.iconBg} ${config.iconColor} backdrop-blur-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;