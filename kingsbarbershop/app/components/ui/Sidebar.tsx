"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Home, Calendar, DollarSign, Users, LogOut } from "lucide-react";
import { useAuth } from "@/app/hook/useAuthLoginAdmin";

export type MenuItem = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
  adminOnly?: boolean;
  barberOnly?: boolean; 
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: Home, path: "/dashboard", adminOnly: true },
  { name: "Agendamentos", icon: Calendar, path: "/agendamentos" },
  { name: "Financeiro", icon: DollarSign, path: "/financeiro", adminOnly: true },
  { name: "Profissionais", icon: Users, path: "/profissionais" },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState(""); // Adicionando o estado para armazenar o role
  const { logout } = useAuth();
  const pathname = usePathname();

  // ------------------- Check User Role -------------------
  const checkUserRole = useCallback(() => {
    let userRole = "";

    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        userRole = parsedUser.role?.toLowerCase() || "";
      }

      setRole(userRole); // Definindo o role no estado
    } catch (err) {
      console.error("Erro ao verificar role:", err);
    }
  }, []);

  useEffect(() => {
    checkUserRole();

    // Atualiza o role caso o localStorage mude
    const handleStorageChange = () => {
      checkUserRole();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkUserRole]);

  // ------------------- Filter Menu -------------------
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Mostrar itens para ADMIN
      if (item.adminOnly && role !== "admin") return false;
      // Mostrar itens para BARBEIRO
      if (item.barberOnly && role !== "barbeiro") return false;
      return true;
    });
  }, [role]);

  // ------------------- Handlers -------------------
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      // Limpar dados do usuário no localStorage ao fazer logout
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  }, [logout]);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const handleLinkClick = useCallback(() => {
    if (window.innerWidth < 768) setMobileOpen(false);
  }, []);

  // ------------------- Render -------------------
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          bg-[#1B1B1B] text-[#E5E5E5] transition-all duration-300
          ${collapsed ? "w-16" : "w-64"} md:static fixed h-screen z-50
          overflow-y-auto ${mobileOpen ? "left-0" : "-left-full"} md:left-0
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A] flex-shrink-0">
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg">Sistema</span>
              <span className={`text-xs mt-1 ${role === "admin" ? "text-green-400" : "text-blue-400"}`}>
                {role === "admin" ? "Administrador" : "Usuário"}
              </span>
            </div>
          )}
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
          {filteredMenuItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative
                  hover:bg-[#2A2A2A] text-[#E5E5E5] ${active ? "bg-[#2A2A2A]" : ""}
                `}
              >
                {active && !collapsed && (
                  <div className="absolute -left-1 w-1 h-6 bg-[#FFA500] rounded-full"></div>
                )}

                <div className="text-[#FFA500]">
                  <Icon size={20} />
                </div>

                {!collapsed && (
                  <span className="flex items-center gap-2">
                    {item.name}
                    {item.adminOnly && active && (
                      <span className="text-xs text-orange-400" title="Apenas administradores">
                        ●
                      </span>
                    )}
                    {item.barberOnly && active && (
                      <span className="text-xs text-orange-400" title="Apenas barbeiros">
                        ●
                      </span>
                    )}
                  </span>
                )}

                {collapsed && item.adminOnly && (
                  <div className="absolute left-12 bg-orange-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Admin
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        <div className="p-2 border-t border-[#2A2A2A] mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 hover:bg-[#2A2A2A] rounded-lg transition-all text-red-400 hover:text-red-300 w-full"
          >
            <LogOut size={20} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {!mobileOpen && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-[#FFA500] text-black p-2 rounded-lg"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>
      )}
    </>
  );
}