"use client";

export default function DashboardCard({ title, value, color = "#FFA500" }: DashboardCardProps) {
  return (
    <div className="bg-[#1B1B1B] rounded-xl p-6 flex flex-col gap-2 shadow">
      <span className="text-sm text-[#A3A3A3]">{title}</span>
      <span className="text-2xl font-bold" style={{ color }}>{value}</span>
    </div>
  );
}