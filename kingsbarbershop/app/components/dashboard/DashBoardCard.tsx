interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: string;
  className?: string;
}

export default function DashboardCard({ title, value, icon, className = "" }: DashboardCardProps) {
  return (
    <div className={`bg-[#1B1B1B] p-6 rounded-xl shadow border border-[#333] hover:border-[#FFA500] transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        {icon && (
          <div className="text-2xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}