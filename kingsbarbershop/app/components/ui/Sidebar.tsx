"use client";

import { useState } from "react";
import { Home, Calendar, DollarSign, Users, LogOut } from "lucide-react";
import { useAuth } from "@/app/hook/useAuthLoginAdmin";

type MenuItem = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Agendamentos", icon: Calendar, path: "/agendamentos" },
  { name: "Financeiro", icon: DollarSign, path: "/financeiro" },
  { name: "Profissionais", icon: Users, path: "/profissionais" },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: any;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth(); // pega função de logout do hook

  const handleLogout = async () => {
    try {
      await logout(); // chama a função do hook
      // Redirecionamento já é feito dentro do hook
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          bg-[#1B1B1B] text-[#E5E5E5]
          transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}
          md:static fixed h-screen z-50
          overflow-y-auto
          ${mobileOpen ? "left-0" : "-left-full"} md:left-0
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A] flex-shrink-0">
          {!collapsed && <span className="font-bold text-lg">Admin</span>}
          <button
            onClick={() => {
              if (window.innerWidth < 768) setMobileOpen(!mobileOpen);
              else setCollapsed(!collapsed);
            }}
            className="text-[#FFA500] hover:scale-110 transition"
          >
            {collapsed ? ">" : "<"}
          </button>
        </div>

        <nav className="flex flex-col mt-4 gap-2 flex-grow overflow-y-auto px-2">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="flex items-center gap-3 p-3 hover:bg-[#2A2A2A] rounded transition"
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </a>
          ))}
        </nav>

        {/* Botão de Logout */}
        <div className="p-2 border-t border-[#2A2A2A] mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 hover:bg-[#2A2A2A] rounded transition text-red-400 hover:text-red-300 w-full"
          >
            <LogOut size={20} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Botão mobile */}
      {!mobileOpen && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-[#FFA500] text-black p-2 rounded"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>
      )}
    </>
  );
}
