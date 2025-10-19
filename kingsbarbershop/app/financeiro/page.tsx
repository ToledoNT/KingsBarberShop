"use client";

import React, { useState, useMemo } from "react";
import { IFinanceiro } from "@/app/interfaces/financeiroInterface";
import { useFinanceiro } from "@/app/hook/useFinanceiroHook";
import FinanceiroCard from "@/app/components/financeiro/financeiroCard";
import Sidebar from "@/app/components/ui/Sidebar";

export default function FinanceiroPage() {
  const { financeiros, loading, error } = useFinanceiro();

  // Estado para filtros
  const [busca, setBusca] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  // Modal de novo movimento
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clienteNome: "",
    procedimento: "",
    valor: "",
    status: "pendente" as "pendente" | "Pago",
  });

  // Sidebar colapsável
  const [collapsed, setCollapsed] = useState(false);

  // Função para formatar data no padrão brasileiro
  const formatarDataBR = (dataString: string) => {
    if (!dataString) return "";
    const data = new Date(dataString + 'T00:00:00'); // Adiciona horário para evitar problemas de fuso
    return data.toLocaleDateString('pt-BR');
  };

  // Filtragem de movimentos
  const movimentosFiltrados = useMemo(() => {
    const inicio = dataInicial ? new Date(dataInicial) : null;
    const fim = dataFinal ? new Date(dataFinal) : null;

    return financeiros.filter((mov: IFinanceiro) => {
      const termo = busca.toLowerCase();
      const nomeMatch = mov.clienteNome.toLowerCase().includes(termo);
      const procedimentoMatch = (mov.procedimento ?? "")
        .toLowerCase()
        .includes(termo);

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

  const handleNovoMovimento = () => setShowForm(true);
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ clienteNome: "", procedimento: "", valor: "", status: "pendente" });
    setShowForm(false);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancelForm = () => {
    setShowForm(false);
    setFormData({ clienteNome: "", procedimento: "", valor: "", status: "pendente" });
  };

  // Limpar filtros
  const handleLimparFiltros = () => {
    setBusca("");
    setDataInicial("");
    setDataFinal("");
  };

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

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FFA500] mb-2">Financeiro</h1>
          <p className="text-gray-400">Gerencie seus movimentos financeiros de forma organizada</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FFA500] bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-[#FFA500] text-lg">💰</span>
              </div>
              <p className="text-gray-400 text-sm">Valor Total</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {totais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-green-500 text-lg">📊</span>
              </div>
              <p className="text-gray-400 text-sm">Total de Movimentos</p>
            </div>
            <p className="text-2xl font-bold text-white">{movimentosFiltrados.length}</p>
          </div>

          <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-blue-500 text-lg">⏱️</span>
              </div>
              <p className="text-gray-400 text-sm">Período Selecionado</p>
            </div>
            <p className="text-sm font-semibold text-white">
              {dataInicial || dataFinal 
                ? `${dataInicial ? formatarDataBR(dataInicial) : "Início"} à ${dataFinal ? formatarDataBR(dataFinal) : "Fim"}` 
                : "Todos os períodos"}
            </p>
          </div>
        </div>

        {/* Seção de Filtros - MELHORADA */}
        <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Filtros e Busca</h2>
              <p className="text-gray-400 text-sm">
                Filtre os movimentos por nome, procedimento ou data
              </p>
            </div>
        
          </div>

          <div className="space-y-4">
            {/* Barra de Busca */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Buscar por cliente ou procedimento..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0D0D0D] border border-[#333] focus:outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-20 transition-all duration-200"
              />
            </div>

            {/* Filtros de Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] focus:outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-20 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] focus:outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-20 transition-all duration-200"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleLimparFiltros}
                  className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>🔄</span>
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Status dos Filtros */}
            {(busca || dataInicial || dataFinal) && (
              <div className="bg-[#0D0D0D] rounded-lg p-3 border border-[#333]">
                <p className="text-sm text-gray-400 mb-2">Filtros ativos:</p>
                <div className="flex flex-wrap gap-2">
                  {busca && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFA500] bg-opacity-20 text-[#FFA500] rounded-full text-sm">
                      Busca: "{busca}"
                      <button onClick={() => setBusca("")} className="hover:text-white">×</button>
                    </span>
                  )}
                  {dataInicial && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full text-sm">
                      De: {formatarDataBR(dataInicial)}
                      <button onClick={() => setDataInicial("")} className="hover:text-white">×</button>
                    </span>
                  )}
                  {dataFinal && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full text-sm">
                      Até: {formatarDataBR(dataFinal)}
                      <button onClick={() => setDataFinal("")} className="hover:text-white">×</button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Novo Movimento */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-[#FFA500] mb-4">
                Novo Movimento Financeiro
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  type="text"
                  name="clienteNome"
                  value={formData.clienteNome}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome do Cliente"
                  className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] focus:outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-20 text-white transition-all duration-200"
                />
                <textarea
                  name="procedimento"
                  value={formData.procedimento}
                  onChange={handleInputChange}
                  placeholder="Procedimento"
                  className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] focus:outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-20 text-white transition-all duration-200 resize-none"
                  rows={3}
                />
                <input
                  type="number"
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  required
                  placeholder="Valor"
                  step="0.01"
                  min="0"
                  className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] focus:outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-20 text-white transition-all duration-200"
                />
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#FFA500] hover:bg-[#FF8C00] text-black font-semibold rounded-lg transition-all duration-200"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Movimentos */}
        <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-[#333] rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Movimentos Registrados</h2>
              <p className="text-gray-400 text-sm">
                {movimentosFiltrados.length} movimento{movimentosFiltrados.length !== 1 ? 's' : ''} encontrado{movimentosFiltrados.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
            </div>
          ) : movimentosFiltrados.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[#333] rounded-lg">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-400 text-lg mb-2">Nenhum movimento encontrado</p>
              <p className="text-gray-500 text-sm">
                {busca || dataInicial || dataFinal 
                  ? "Tente ajustar os filtros para ver mais resultados" 
                  : "Comece adicionando seu primeiro movimento financeiro"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {movimentosFiltrados.map((mov: IFinanceiro) => (
                <FinanceiroCard key={mov.id} mov={mov} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}