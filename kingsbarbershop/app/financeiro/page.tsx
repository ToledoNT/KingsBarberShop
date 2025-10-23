"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiltrosProps, IFinanceiro } from "@/app/interfaces/financeiroInterface";
import { useFinanceiro } from "@/app/hook/useFinanceiroHook";
import FinanceiroCard from "@/app/components/financeiro/financeiroCard";
import Sidebar from "@/app/components/ui/Sidebar";
import { AuthService } from "../api/authAdmin";
import { ResumoCard } from "../components/financeiro/resumoCard";

const authService = new AuthService();

export default function FinanceiroPage() {
  const router = useRouter();
  const { financeiros, loading: loadingFinanceiros, error, fetchFinanceiros } = useFinanceiro();

  const [busca, setBusca] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "Pago" | "pendente">("todos");
  const [ordenacao, setOrdenacao] = useState<"data" | "valor" | "cliente">("data");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ------------------- AUTENTICAÇÃO -------------------
  useEffect(() => {
    const verifyAuth = async () => {
      setLoadingAuth(true);
      try {
        const valid = await authService.verifyToken();
        if (!valid) router.replace("/login");
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

  // ------------------- FILTRAGEM E ORDENAÇÃO -------------------
  const movimentosFiltrados = useMemo(() => {
    const inicio = dataInicial ? new Date(dataInicial) : null;
    const fim = dataFinal ? new Date(dataFinal) : null;

    return financeiros
      .filter((mov) => {
        const termo = busca.toLowerCase();
        const nomeMatch = mov.clienteNome?.toLowerCase().includes(termo) ?? false;
        const procedimentoMatch = (mov.procedimento ?? "").toLowerCase().includes(termo);

        const dataMov = mov.criadoEm ? new Date(mov.criadoEm) : null;
        const dataMatch = !dataMov || ((!inicio || dataMov >= inicio) && (!fim || dataMov <= fim));

        const statusMatch = filtroStatus === "todos" || mov.status === filtroStatus;

        return (nomeMatch || procedimentoMatch) && dataMatch && statusMatch;
      })
      .sort((a, b) => {
        switch (ordenacao) {
          case "valor":
            return (b.valor ?? 0) - (a.valor ?? 0);
          case "cliente":
            return (a.clienteNome ?? "").localeCompare(b.clienteNome ?? "");
          case "data":
          default:
            return new Date(b.criadoEm ?? 0).getTime() - new Date(a.criadoEm ?? 0).getTime();
        }
      });
  }, [financeiros, busca, dataInicial, dataFinal, filtroStatus, ordenacao]);

  // ------------------- CÁLCULOS -------------------
  const totais = useMemo(() => {
    const receitas = movimentosFiltrados
      .filter((m) => m.status === "Pago")
      .reduce((acc, m) => acc + (m.valor ?? 0), 0);
    const pendentes = movimentosFiltrados
      .filter((m) => m.status === "pendente")
      .reduce((acc, m) => acc + (m.valor ?? 0), 0);

    const quantidadePagos = movimentosFiltrados.filter((m) => m.status === "Pago").length;
    const quantidadePendentes = movimentosFiltrados.filter((m) => m.status === "pendente").length;

    return {
      receitas,
      pendentes,
      total: receitas + pendentes,
      quantidade: movimentosFiltrados.length,
      quantidadePagos,
      quantidadePendentes,
    };
  }, [movimentosFiltrados]);

  const handleLimparFiltros = () => {
    setBusca("");
    setDataInicial("");
    setDataFinal("");
    setFiltroStatus("todos");
    setOrdenacao("data");
  };

  const handleAtualizarDados = () => fetchFinanceiros();

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

  // ------------------- JSX PRINCIPAL -------------------
  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col gap-4">
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
                  onClick={handleAtualizarDados}
                  className="px-4 py-3 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-black rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
                >
                  🔄 Atualizar
                </button>
              </div>
            </div>
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
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

          {/* Filtros */}
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
          />

          {/* Lista de movimentos */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm overflow-hidden">
              {movimentosFiltrados.length === 0 ? (
                <NenhumMovimento
                  busca={busca}
                  dataInicial={dataInicial}
                  dataFinal={dataFinal}
                  onLimparFiltros={handleLimparFiltros}
                />
              ) : (
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar scroll-smooth max-h-[calc(100vh-400px)]">
                  <div className="grid gap-3 sm:gap-4 pb-2">
                    {movimentosFiltrados.map((mov) => (
                      <FinanceiroCard key={mov.id} mov={mov} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------- COMPONENTES AUXILIARES COM TIPAGEM BÁSICA ----------

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
}: FiltrosProps) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  return (
    <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl mb-4 sm:mb-6">
      {/* ...restante do JSX igual... */}
    </div>
  );
};

interface NenhumMovimentoProps {
  busca: string;
  dataInicial: string;
  dataFinal: string;
  onLimparFiltros: () => void;
}

const NenhumMovimento = ({ busca, dataInicial, dataFinal, onLimparFiltros }: NenhumMovimentoProps) => (
  <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-700 rounded-xl sm:rounded-2xl max-w-md mx-auto w-full bg-gray-900/30 backdrop-blur-sm px-4">
    <div className="text-6xl sm:text-7xl mb-4 sm:mb-6 opacity-60">💸</div>
    <p className="text-lg sm:text-xl font-semibold text-gray-300 mb-2 sm:mb-3">Nenhum movimento encontrado</p>
    <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 max-w-xs mx-auto">
      {busca || dataInicial || dataFinal
        ? "Tente ajustar os filtros para ver mais resultados"
        : "Comece adicionando seu primeiro movimento financeiro"}
    </p>
    {(busca || dataInicial || dataFinal) && (
      <button
        onClick={onLimparFiltros}
        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm"
      >
        🔄 Limpar Filtros
      </button>
    )}
  </div>
);