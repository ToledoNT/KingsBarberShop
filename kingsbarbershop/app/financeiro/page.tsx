"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IFinanceiro } from "@/app/interfaces/financeiroInterface";
import { useFinanceiro } from "@/app/hook/useFinanceiroHook";
import FinanceiroCard from "@/app/components/financeiro/financeiroCard";
import Sidebar from "@/app/components/ui/Sidebar";
import { AuthService } from "../api/authAdmin";

const authService = new AuthService();

export default function FinanceiroPage() {
  const router = useRouter();
  const { financeiros, loading: loadingFinanceiros, error, fetchFinanceiros } = useFinanceiro();

  const [busca, setBusca] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<"data" | "valor" | "cliente">("data");
  const [showFilters, setShowFilters] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ------------------- AUTENTICAÇÃO -------------------
  useEffect(() => {
    const verifyAuth = async () => {
      setLoadingAuth(true);
      try {
        const valid = await authService.verifyToken();
        if (!valid) {
          router.replace("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Erro na verificação de token:", err);
        router.replace("/login");
      } finally {
        setLoadingAuth(false);
      }
    };

    verifyAuth();
  }, [router]);

  // ------------------- FORMATAR DATA -------------------
  const formatarDataBR = (dataString: string) => {
    if (!dataString) return "";
    const data = new Date(dataString + "T00:00:00");
    return data.toLocaleDateString("pt-BR");
  };

  // ------------------- FILTRAGEM E ORDENAÇÃO -------------------
  const movimentosFiltrados = useMemo(() => {
    const inicio = dataInicial ? new Date(dataInicial) : null;
    const fim = dataFinal ? new Date(dataFinal) : null;

    let filtrados = financeiros.filter((mov: IFinanceiro) => {
      const termo = busca.toLowerCase();
      const nomeMatch = mov.clienteNome?.toLowerCase().includes(termo) || false;
      const procedimentoMatch = (mov.procedimento ?? "").toLowerCase().includes(termo);

      const dataMov = mov.criadoEm ? new Date(mov.criadoEm) : null;
      const dataMatch =
        !dataMov || 
        ((!inicio || dataMov >= inicio) && (!fim || dataMov <= fim));

      const statusMatch = filtroStatus === "todos" || mov.status === filtroStatus;

      return (nomeMatch || procedimentoMatch) && dataMatch && statusMatch;
    });

    // Ordenação
    filtrados.sort((a, b) => {
      switch (ordenacao) {
        case "valor":
          return (b.valor || 0) - (a.valor || 0);
        case "cliente":
          return (a.clienteNome || "").localeCompare(b.clienteNome || "");
        case "data":
        default:
          const dataA = a.criadoEm ? new Date(a.criadoEm).getTime() : 0;
          const dataB = b.criadoEm ? new Date(b.criadoEm).getTime() : 0;
          return dataB - dataA;
      }
    });

    return filtrados;
  }, [financeiros, busca, dataInicial, dataFinal, filtroStatus, ordenacao]);

  // ------------------- CÁLCULOS -------------------
  const totais = useMemo(() => {
    const receitas = movimentosFiltrados
      .filter(mov => mov.status === "Pago")
      .reduce((acc, mov) => acc + (mov.valor || 0), 0);
    
    const pendentes = movimentosFiltrados
      .filter(mov => mov.status === "pendente")
      .reduce((acc, mov) => acc + (mov.valor || 0), 0);

    return {
      receitas,
      pendentes,
      total: receitas + pendentes,
      quantidade: movimentosFiltrados.length,
      quantidadePagos: movimentosFiltrados.filter(m => m.status === "Pago").length,
      quantidadePendentes: movimentosFiltrados.filter(m => m.status === "pendente").length,
    };
  }, [movimentosFiltrados]);

  const handleLimparFiltros = () => {
    setBusca("");
    setDataInicial("");
    setDataFinal("");
    setFiltroStatus("todos");
    setOrdenacao("data");
    setShowFilters(false);
  };

  const handleAtualizarDados = () => {
    fetchFinanceiros();
  };

  // ------------------- BLOQUEIO DE RENDER -------------------
  if (loadingAuth || loadingFinanceiros) {
    return (
      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFA500]"></div>
          <p className="text-gray-400">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
        <div className="text-red-400 text-center max-w-md px-4">
          <div className="text-6xl mb-4">💸</div>
          <p className="text-xl font-semibold mb-2">Erro ao carregar dados</p>
          <p className="text-sm mb-6 text-gray-300">{error}</p>
          <button 
            onClick={handleAtualizarDados}
            className="px-6 py-3 bg-[#FFA500] text-black rounded-lg font-semibold hover:bg-[#FF8C00] transition-colors w-full"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // ------------------- JSX -------------------
  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <aside className="flex-shrink-0 h-screen lg:sticky top-0 z-20">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex-shrink-0">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1 flex items-center gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl">💎</span>
                    <span className="truncate">Financeiro</span>
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base truncate">
                    Gerencie seus movimentos financeiros
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all flex items-center gap-2 text-sm font-medium flex-1 sm:flex-none justify-center"
                  >
                    <span>🎯</span>
                    <span className="sm:hidden">Filtros</span>
                    <span className="hidden sm:inline">{showFilters ? "Ocultar" : "Filtros"}</span>
                  </button>
                  <button 
                    onClick={handleAtualizarDados}
                    className="px-4 py-3 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-black rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
                  >
                    <span>🔄</span>
                    <span className="sm:hidden">Atualizar</span>
                    <span className="hidden sm:inline">Atualizar</span>
                  </button>
                </div>
              </div>

              {/* Busca Mobile */}
              <div className="sm:hidden">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm"
                  />
                  {busca && (
                    <button
                      onClick={() => setBusca("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 flex-shrink-0">
            <ResumoCard
              emoji="💰"
              titulo="Receitas"
              valor={totais.receitas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              cor="green"
              descricao={`${totais.quantidadePagos} pagos`}
            />
            <ResumoCard
              emoji="⏳"
              titulo="Pendentes"
              valor={totais.pendentes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              cor="yellow"
              descricao={`${totais.quantidadePendentes} aguardando`}
            />
            <ResumoCard
              emoji="📊"
              titulo="Total Geral"
              valor={totais.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              cor="blue"
              descricao={`${totais.quantidade} movimentos`}
            />
          </div>

          {/* Filtros - Mobile Toggle */}
          {(showFilters || window.innerWidth >= 640) && (
            <div className="mb-4 sm:mb-6 flex-shrink-0">
              <Filtros
                busca={busca}
                setBusca={setBusca}
                dataInicial={dataInicial}
                setDataInicial={setDataInicial}
                dataFinal={dataFinal}
                setDataFinal={setDataFinal}
                filtroStatus={filtroStatus}
                setFiltroStatus={setFiltroStatus}
                ordenacao={ordenacao}
                setOrdenacao={setOrdenacao}
                handleLimparFiltros={handleLimparFiltros}
                isMobile={window.innerWidth < 640}
              />
            </div>
          )}

          {/* Container dos registros com scroll fixo */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm">
              {movimentosFiltrados.length === 0 ? (
                <NenhumMovimento 
                  busca={busca} 
                  dataInicial={dataInicial} 
                  dataFinal={dataFinal} 
                  onLimparFiltros={handleLimparFiltros}
                />
              ) : (
                <>
                  {/* Header da lista */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                      <span className="text-[#FFA500]">📋</span>
                      Movimentos
                      <span className="text-xs sm:text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg ml-2">
                        {movimentosFiltrados.length}
                      </span>
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-400">
                      Ordenado por: {
                        ordenacao === "data" ? "Data" : 
                        ordenacao === "valor" ? "Valor" : "Cliente"
                      }
                    </div>
                  </div>

                  {/* Lista */}
                  <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar scroll-smooth">
                    <div className="grid gap-3 sm:gap-4 pb-2">
                      {movimentosFiltrados.map((mov: IFinanceiro) => (
                        <FinanceiroCard key={mov.id} mov={mov} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------- COMPONENTES AUXILIARES ----------

const ResumoCard = ({
  emoji,
  titulo,
  valor,
  cor,
  descricao,
}: {
  emoji: string;
  titulo: string;
  valor: string | number;
  cor: string;
  descricao?: string;
}) => {
  const corClasses = {
    green: "from-green-600/10 to-green-700/10 border-green-500/20 text-green-400",
    yellow: "from-yellow-600/10 to-yellow-700/10 border-yellow-500/20 text-yellow-400",
    blue: "from-blue-600/10 to-blue-700/10 border-blue-500/20 text-blue-400",
  }[cor];

  return (
    <div className={`bg-gradient-to-br ${corClasses} border rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-2xl sm:text-3xl">{emoji}</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <p className="text-gray-300 text-xs sm:text-sm font-medium">{titulo}</p>
        <p className="text-lg sm:text-2xl font-bold text-white truncate">{valor}</p>
        {descricao && (
          <p className="text-xs text-gray-400 opacity-80">{descricao}</p>
        )}
      </div>
    </div>
  );
};

const Filtros = ({
  busca,
  setBusca,
  dataInicial,
  setDataInicial,
  dataFinal,
  setDataFinal,
  filtroStatus,
  setFiltroStatus,
  ordenacao,
  setOrdenacao,
  handleLimparFiltros,
  isMobile = false
}: any) => (
  <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Busca - Desktop */}
      {!isMobile && (
        <div>
          <label className="block text-sm text-gray-300 mb-3 font-medium">🔍 Buscar</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por cliente, procedimento..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
            />
            {busca && (
              <button
                onClick={() => setBusca("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Filtros de Data e Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3 font-medium">📅 Data Inicial</label>
          <input
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3 font-medium">📅 Data Final</label>
          <input
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3 font-medium">🎯 Status</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
          >
            <option value="todos">Todos os status</option>
            <option value="Pago">Pagos</option>
            <option value="pendente">Pendentes</option>
          </select>
        </div>
      </div>

      {/* Ordenação e Limpar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <label className="block text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3 font-medium">📊 Ordenar por</label>
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as "data" | "valor" | "cliente")}
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
          >
            <option value="data">Data</option>
            <option value="valor">Valor</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleLimparFiltros}
            className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base font-medium w-full backdrop-blur-sm"
          >
            <span className="text-sm sm:text-lg">🔄</span>
            Limpar
          </button>
        </div>
      </div>
    </div>
  </div>
);

const NenhumMovimento = ({ busca, dataInicial, dataFinal, onLimparFiltros }: any) => (
  <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-700 rounded-xl sm:rounded-2xl max-w-md mx-auto w-full bg-gray-900/30 backdrop-blur-sm px-4">
    <div className="text-6xl sm:text-7xl mb-4 sm:mb-6 opacity-60">💸</div>
    <p className="text-lg sm:text-xl font-semibold text-gray-300 mb-2 sm:mb-3">Nenhum movimento encontrado</p>
    <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 max-w-xs mx-auto">
      {busca || dataInicial || dataFinal
        ? "Tente ajustar os filtros para ver mais resultados"
        : "Comece adicionando seu primeiro movimento financeiro"
      }
    </p>
    {(busca || dataInicial || dataFinal) && (
      <button
        onClick={onLimparFiltros}
        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm"
      >
        <span>🔄</span>
        Limpar Filtros
      </button>
    )}
  </div>
);