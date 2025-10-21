// components/PieChart.tsx
interface PieChartProps {
  percentage: number;
  color: string;
  size?: number;
}

const PieChart = ({ percentage, color, size = 100 }: PieChartProps) => {
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg">{percentage}%</span>
      </div>
    </div>
  );
};

export default PieChart;