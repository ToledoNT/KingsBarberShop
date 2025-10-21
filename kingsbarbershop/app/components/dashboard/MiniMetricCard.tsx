// components/MiniMetricCard.tsx
interface MiniMetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string;
  period: 'daily' | 'monthly' | 'yearly';
}

const MiniMetricCard = ({ title, value, subtitle, icon, color, period }: MiniMetricCardProps) => {
  const periodIcons = {
    daily: '🕒',
    monthly: '📅',
    yearly: '📊'
  };

  const colorConfigs = {
    green: {
      border: 'border-l-2 border-l-green-500',
      iconColor: 'text-green-400'
    },
    yellow: {
      border: 'border-l-2 border-l-yellow-500',
      iconColor: 'text-yellow-400'
    },
    red: {
      border: 'border-l-2 border-l-red-500',
      iconColor: 'text-red-400'
    },
    blue: {
      border: 'border-l-2 border-l-blue-500',
      iconColor: 'text-blue-400'
    },
    purple: {
      border: 'border-l-2 border-l-purple-500',
      iconColor: 'text-purple-400'
    },
    orange: {
      border: 'border-l-2 border-l-orange-500',
      iconColor: 'text-orange-400'
    }
  };

  const config = colorConfigs[color as keyof typeof colorConfigs] || colorConfigs.green;

  return (
    <div className={`
      bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-4 
      transition-all duration-300 hover:shadow-lg hover:scale-105 relative
      ${config.border}
    `}>
      <div className="absolute top-2 right-2 text-xs opacity-70">
        {periodIcons[period]}
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold text-gray-400">{title}</p>
          <p className="text-xl font-bold text-white mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`text-2xl ${config.iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MiniMetricCard;