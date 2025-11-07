"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "@/app/components/ui/Sidebar";
import { AuthService } from "../api/authAdmin";
import { useDashboard } from "../hook/useDashboard";
import MetricasDiarias from "../components/dashboard/MetricasDiarias";
import MetricasMensais from "../components/dashboard/MetricasMensais";
import MetricasAnuais from "../components/dashboard/MetricasAnuais";
import { Notification } from "../components/ui/componenteNotificacao";
import HeaderDashboard from "../components/dashboard/HeraderDashboard";

const authService = new AuthService();

// ---------- Status Map ----------
const statusMap: Record<string, { bg: string; text: string }> = {
  Pago: { bg: "bg-green-600/20", text: "text-green-400" },
  Pendente: { bg: "bg-yellow-600/20", text: "text-yellow-400" },
  Cancelado: { bg: "bg-red-600/20", text: "text-red-400" },
  "Não Compareceu": { bg: "bg-orange-700/20", text: "text-orange-400" },
  Agendado: { bg: "bg-blue-600/20", text: "text-blue-400" },
  "Em andamento": { bg: "bg-purple-600/20", text: "text-purple-400" },
  Concluído: { bg: "bg-green-600/20", text: "text-green-300" },
  default: { bg: "bg-gray-700/20", text: "text-gray-400" },
};

// ---------- Helper ----------
const formatarDataBrasileiraUTC = (dataISO: string) => {
  const d = new Date(dataISO);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const formatarHorario = (hora: string) => hora;

// ---------- Componente Agendamentos Table ----------
interface Agendamento {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  data: string;
  inicio: string;
  fim: string;
  status: string;
  servicoNome?: string;
  servicoPreco?: number;
  profissionalNome?: string;
}

interface AgendamentosTableProps {
  agendamentos: Agendamento[];
}

const AgendamentosTable = ({ agendamentos }: AgendamentosTableProps) => {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const agendamentosFiltrados = agendamentos.filter(
    (a) =>
      (filtroStatus === "todos" || a.status === filtroStatus) &&
      [a.nome, a.telefone, a.profissionalNome, a.servicoNome]
        .join(" ")
        .toLowerCase()
        .includes(busca.toLowerCase())
  );

  return (
    <div className="bg-[#1E1E1E]/90 p-4 sm:p-6 rounded-3xl shadow-2xl border border-gray-700/20 backdrop-blur-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Agendamentos</h2>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5">
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
          <input
            type="text"
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2 rounded-xl bg-gray-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/70 shadow-md text-sm sm:text-base"
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gray-900/60 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/70 shadow-md text-sm sm:text-base"
          >
            <option value="todos">Todos</option>
            {Object.keys(statusMap)
              .filter((s) => s !== "default")
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden flex flex-col gap-4">
        <AnimatePresence>
          {agendamentosFiltrados.length > 0 ? (
            agendamentosFiltrados.map((a) => {
              const statusStyle = statusMap[a.status] || statusMap.default;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#1B1B1B]/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-700/30 hover:scale-[1.02] hover:shadow-amber-400/40 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center rounded-full shadow-md text-base sm:text-lg">
                        {a.nome?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-white font-semibold text-sm sm:text-base truncate">{a.nome}</div>
                    </div>
                    <div
                      className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold ${statusStyle.bg} ${statusStyle.text} shadow-inner`}
                    >
                      {a.status}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-gray-200 text-xs sm:text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-amber-400">📞</span>
                      <span className="font-medium">{a.telefone}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-amber-400">💇</span>
                      <span className="font-medium">{a.profissionalNome}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-amber-400">🗓</span>
                      <span className="font-medium">{a.data}</span>
                      <span className="text-gray-400 mx-1">|</span>
                      <span className="font-medium">{formatarHorario(a.inicio)} - {formatarHorario(a.fim)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-amber-400">💰</span>
                      <span className="font-medium">{a.servicoNome}</span>
                      <span className="text-gray-400 mx-1">-</span>
                      <span className="font-bold text-amber-400">R$ {a.servicoPreco?.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm sm:text-base">
              Nenhum agendamento encontrado 😶
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-[#111111] rounded-2xl shadow-2xl overflow-hidden text-sm sm:text-base">
          <thead className="bg-gray-800/50 backdrop-blur-sm">
            <tr className="text-gray-300 uppercase text-xs sm:text-sm tracking-wide">
              {["Cliente", "Telefone", "Profissional", "Data", "Horário", "Serviço", "Valor", "Status"].map((h) => (
                <th key={h} className="px-3 sm:px-4 py-2 sm:py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {agendamentosFiltrados.length > 0 ? (
                agendamentosFiltrados.map((a) => {
                  const statusStyle = statusMap[a.status] || statusMap.default;
                  return (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                    >
                      <td className="px-2 sm:px-3 py-2 flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center rounded-full shadow-md text-xs sm:text-sm">
                          {a.nome?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-semibold truncate">{a.nome}</span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-gray-200 font-mono">{a.telefone}</td>
                      <td className="px-2 sm:px-3 py-2 text-gray-200">{a.profissionalNome}</td>
                      <td className="px-2 sm:px-3 py-2 text-white font-semibold">{a.data}</td>
                      <td className="px-2 sm:px-3 py-2 font-mono text-amber-300">{formatarHorario(a.inicio)} - {formatarHorario(a.fim)}</td>
                      <td className="px-2 sm:px-3 py-2 text-gray-200">{a.servicoNome}</td>
                      <td className="px-2 sm:px-3 py-2 font-bold text-amber-400">R$ {a.servicoPreco?.toFixed(2)}</td>
                      <td className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${statusStyle.bg} ${statusStyle.text} shadow-inner`}>{a.status}</td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 sm:py-10 text-gray-400 text-sm sm:text-base">Nenhum agendamento encontrado 😶</td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------- Dashboard ----------
function DashboardConteudo() {
  const router = useRouter();
  const { data: dashboardData, loading: dataLoading, refetch } = useDashboard();

  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success" as "info" | "success" | "warning" | "error",
  });

  useEffect(() => {
    const verifyAuth = async () => {
      setLoadingAuth(true);
      try {
        const valid = await authService.verifyToken();
        if (!valid) return router.replace("/login");

        const storedRole = localStorage.getItem("userRole");
        if (storedRole !== "ADMIN") router.replace("/agendamentos");
        else setIsAuthenticated(true);
      } catch (err) {
        console.error("Erro na verificação de token:", err);
        router.replace("/login");
      } finally {
        setLoadingAuth(false);
      }
    };
    verifyAuth();
  }, [router]);

  const showNotification = useCallback(
    (message: string, type: "info" | "success" | "warning" | "error" = "success") => {
      setNotification({ isOpen: true, message, type });
    },
    []
  );

  const closeNotification = () =>
    setNotification((prev) => ({ ...prev, isOpen: false }));

  const handleRefresh = async () => {
    try {
      await refetch();
      showNotification("Dashboard atualizado com sucesso!", "success");
    } catch {
      showNotification("Erro ao atualizar dashboard", "error");
    }
  };

  if (loadingAuth || dataLoading)
    return (
      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
      </div>
    );

  if (!isAuthenticated) return null;

  if (!dashboardData)
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="text-4xl mb-3 text-blue-400">📊</div>
          <h1 className="text-xl font-bold text-blue-400 mb-2">Sem Dados</h1>
          <p className="text-sm text-gray-300">Nenhum dado disponível</p>
        </div>
      </div>
    );

  const { metrics, agendamentos } = dashboardData;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <aside className="flex-shrink-0 h-auto lg:h-screen lg:sticky top-0 z-20">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <HeaderDashboard onRefresh={handleRefresh} />

        <div className="my-4 sm:my-6 flex flex-col gap-4">
          <MetricasDiarias {...metrics.diario} />
          <MetricasMensais {...metrics.mensal} />
          <MetricasAnuais
            agendamentosAnuais={metrics.anual.agendamentosAnuais ?? metrics.anual.agendamentosAno ?? 0}
            faturamentoAnual={metrics.anual.faturamentoAnual ?? 0}
            anoAtual={metrics.anual.anoAtual ?? new Date().getFullYear()}
          />
        </div>

        <AgendamentosTable
          agendamentos={agendamentos.map((a) => ({
            ...a,
            data: formatarDataBrasileiraUTC(a.data),
          }))}
        />
      </main>

      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
}

export default DashboardConteudo;