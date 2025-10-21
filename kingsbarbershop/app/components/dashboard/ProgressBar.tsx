// components/ProgressBar.tsx
interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  height?: number;
}

const ProgressBar = ({ value, max, color, height = 12 }: ProgressBarProps) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <div 
      className="w-full bg-gray-700 rounded-full overflow-hidden shadow-inner"
      style={{ height: `${height}px` }}
    >
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;