export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#1B1B1B] shadow-lg flex flex-col justify-between">
      <h3 className="text-lg text-[#A3A3A3]">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}