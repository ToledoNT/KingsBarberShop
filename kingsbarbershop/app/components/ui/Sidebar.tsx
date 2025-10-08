"use client";
import { useState } from "react";
import { Home, Calendar, DollarSign, FileText, Users } from "lucide-react";
import { MenuItem } from "@/app/interfaces/agendamentoInterface";

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: Home, path: "/admin" },
  { name: "Agendamentos", icon: Calendar, path: "/admin/agendamentos" },
  { name: "Financeiro", icon: DollarSign, path: "/admin/financeiro" },
  { name: "Profissionais", icon: Users, path: "/admin/profissionais" },];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-[#1B1B1B] text-[#E5E5E5] h-screen transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex flex-col`}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && <span className="font-bold text-lg">Admin</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-[#FFA500]">
          {collapsed ? ">" : "<"}
        </button>
      </div>
      <nav className="flex flex-col mt-4 gap-2">
        {menuItems.map(item => (
          <a key={item.name} href={item.path} className="flex items-center gap-3 p-3 hover:bg-[#2A2A2A] rounded">
            <item.icon size={20} />
            {!collapsed && <span>{item.name}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}