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
  const { financeiros, loading: loadingFinanceiros, error } = useFinanceiro();

  const [busca, setBusca] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [collapsed, setCollapsed] = useState(false);

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

  // ------------------- FILTRAGEM -------------------
  const movimentosFiltrados = useMemo(() => {
    const inicio = dataInicial ? new Date(dataInicial) : null;
    const fim = dataFinal ? new Date(dataFinal) : null;

    return financeiros.filter((mov: IFinanceiro) => {
      const termo = busca.toLowerCase();
      const nomeMatch = mov.clienteNome.toLowerCase().includes(termo);
      const procedimentoMatch = (mov.procedimento ?? "").toLowerCase().includes(termo);

      const dataMov = mov.criadoEm ? new Date(mov.criadoEm) : null;
      const dataMatch =
        !dataMov || ((!inicio || dataMov >= inicio) && (!fim || dataMov <= fim));

      return (nomeMatch || procedimentoMatch) && dataMatch;
    });
  }, [financeiros, busca, dataInicial, dataFinal]);

  const totais = useMemo(
    () => movimentosFiltrados.reduce((acc, mov) => acc + mov.valor, 0),
    [movimentosFiltrados]
  );

  const handleLimparFiltros = () => {
    setBusca("");
    setDataInicial("");
    setDataFinal("");
  };

  // ------------------- BLOQUEIO DE RENDER -------------------
  if (loadingAuth || loadingFinanceiros) {
    return (
      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl">Erro ao carregar dados</p>
          <p className="text-sm mt-2">{error}</p>
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
        <main className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
          <div className="mb-6 flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1">
              Financeiro
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Gerencie seus movimentos financeiros de forma organizada
            </p>
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 flex-shrink-0">
            <ResumoCard
              emoji="💰"
              titulo="Valor Total"
              valor={totais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              cor="#FFA500"
            />
            <ResumoCard
              emoji="📊"
              titulo="Total de Movimentos"
              valor={movimentosFiltrados.length}
              cor="green"
            />
            <ResumoCard
              emoji="⏱️"
              titulo="Período Selecionado"
              valor={
                dataInicial || dataFinal
                  ? `${dataInicial ? formatarDataBR(dataInicial) : "Início"} à ${
                      dataFinal ? formatarDataBR(dataFinal) : "Fim"
                    }`
                  : "Todos os períodos"
              }
              cor="blue"
            />
          </div>

          {/* Filtros */}
          <div className="mb-6 flex-shrink-0">
            <Filtros
              busca={busca}
              setBusca={setBusca}
              dataInicial={dataInicial}
              setDataInicial={setDataInicial}
              dataFinal={dataFinal}
              setDataFinal={setDataFinal}
              handleLimparFiltros={handleLimparFiltros}
            />
          </div>

          {/* Container dos registros com scroll fixo */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-4 shadow-md flex flex-col">
              {movimentosFiltrados.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <NenhumMovimento busca={busca} dataInicial={dataInicial} dataFinal={dataFinal} />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar scroll-smooth">
                  <div className="flex flex-col gap-3 pb-2">
                    {movimentosFiltrados.map((mov: IFinanceiro) => (
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

// ---------- COMPONENTES AUXILIARES ----------

const ResumoCard = ({
  emoji,
  titulo,
  valor,
  cor,
}: {
  emoji: string;
  titulo: string;
  valor: string | number;
  cor: string;
}) => (
  <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 shadow-md">
    <div className="flex items-center gap-2">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          cor === "#FFA500"
            ? "bg-[#FFA500] bg-opacity-20"
            : cor === "green"
            ? "bg-green-500 bg-opacity-20"
            : "bg-blue-500 bg-opacity-20"
        }`}
      >
        <span
          className={`text-lg ${
            cor === "#FFA500"
              ? "text-[#FFA500]"
              : cor === "green"
              ? "text-green-500"
              : "text-blue-500"
          }`}
        >
          {emoji}
        </span>
      </div>
      <p className="text-gray-400 text-sm">{titulo}</p>
    </div>
    <p className="text-base sm:text-lg font-bold text-white break-all text-right">{valor}</p>
  </div>
);

const Filtros = ({
  busca,
  setBusca,
  dataInicial,
  setDataInicial,
  dataFinal,
  setDataFinal,
  handleLimparFiltros,
}: any) => (
  <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-lg p-4 shadow-md">
    <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
      <div className="flex-1">
        <label className="block text-sm text-gray-400 mb-2">Buscar</label>
        <input
          type="text"
          placeholder="Buscar por cliente ou procedimento..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] text-white focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] text-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Data Inicial</label>
          <input
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] text-white focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Data Final</label>
          <input
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] text-white focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] text-sm"
          />
        </div>
      </div>
      
      <button
        onClick={handleLimparFiltros}
        className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium"
      >
        <span>🔄</span>
        <span>Limpar</span>
      </button>
    </div>
  </div>
);

const NenhumMovimento = ({ busca, dataInicial, dataFinal }: any) => (
  <div className="text-center py-12 border-2 border-dashed border-[#333] rounded-lg max-w-md mx-auto w-full">
    <div className="text-6xl mb-4">📊</div>
    <p className="text-gray-400 text-lg mb-2">Nenhum movimento encontrado</p>
    <p className="text-gray-500 text-sm">
      {busca || dataInicial || dataFinal
        ? "Tente ajustar os filtros para ver mais resultados"
        : "Comece adicionando seu primeiro movimento financeiro"}
    </p>
  </div>
);
