"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Home, Calendar, DollarSign, Users, LogOut } from "lucide-react";
import { useAuth } from "@/app/hook/useAuthLoginAdmin";

type MenuItem = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
  adminOnly?: boolean;
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
  setCollapsed: any;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();

  // Verifica se o usuário é admin baseado na role - otimizado
  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        // Verificação mais eficiente
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAdmin(false);
          return;
        }

        // Tenta pegar do user primeiro (mais rápido)
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            const userRole = parsedUser.role?.toLowerCase();
            if (userRole === 'admin' || userRole === 'administrador') {
              setIsAdmin(true);
              return;
            }
          } catch (error) {
            console.error('Erro ao parsear user:', error);
          }
        }

        // Fallback: decodificar token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const tokenRole = payload.role?.toLowerCase();
          if (tokenRole === 'admin' || tokenRole === 'administrador') {
            setIsAdmin(true);
            return;
          }
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
        }

        setIsAdmin(false);
      } catch (error) {
        console.error("Erro ao verificar admin:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();

    // Debounce para evitar múltiplas verificações
    let timeoutId: NodeJS.Timeout;
    const handleStorageChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkAdminStatus, 100);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(timeoutId);
    };
  }, []);

  // UseMemo para otimizar o filtro dos itens
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      if (item.adminOnly && !isAdmin) {
        return false;
      }
      return true;
    });
  }, [isAdmin]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  // Função para verificar se o item está ativo
  const isActive = (path: string) => {
    return pathname === path;
  };

  // Fechar sidebar mobile ao clicar em um link
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(false);
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
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg">Sistema</span>
              {!collapsed && isAdmin && (
                <span className="text-xs text-green-400 mt-1">Administrador</span>
              )}
              {!collapsed && !isAdmin && (
                <span className="text-xs text-blue-400 mt-1">Usuário</span>
              )}
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
            const IconComponent = item.icon;
            
            return (
              <a
                key={item.name}
                href={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative
                  hover:bg-[#2A2A2A] text-[#E5E5E5]
                  ${active ? 'bg-[#2A2A2A]' : ''}
                `}
              >
                {/* Ponto indicador para itens ativos */}
                {active && !collapsed && (
                  <div className="absolute -left-1 w-1 h-6 bg-[#FFA500] rounded-full"></div>
                )}
                
                {/* Ícone - sempre laranja */}
                <div className="text-[#FFA500]">
                  <IconComponent size={20} />
                </div>
                
                {!collapsed && (
                  <span className="flex items-center gap-2">
                    {item.name}
                    {/* Indicador de admin (apenas quando está ativo) */}
                    {item.adminOnly && active && (
                      <span className="text-xs text-orange-400" title="Apenas administradores">
                        ●
                      </span>
                    )}
                  </span>
                )}
                
                {/* Tooltip para itens admin quando collapsed */}
                {collapsed && item.adminOnly && (
                  <div className="absolute left-12 bg-orange-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Admin
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Botão de Logout */}
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

      {/* Botão mobile */}
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