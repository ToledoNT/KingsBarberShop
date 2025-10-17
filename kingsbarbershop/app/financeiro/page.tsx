"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import { IFinanceiro } from "../interfaces/financeiroInterface";
import { useFinanceiro } from "../hook/useFinanceiroHook";
import FinanceiroCard from "../components/financeiro/financeiroCard";

export default function FinanceiroPage() {
  const { financeiros, loading } = useFinanceiro();
  const [busca, setBusca] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  // Filtro simples por nome/procedimento e datas
  const movimentosFiltrados = financeiros.filter((mov: IFinanceiro) => {
    const buscaLower = busca.toLowerCase();
    const nomeMatch = mov.clienteNome.toLowerCase().includes(buscaLower);
    const procedimentoMatch = (mov.procedimento ?? "").toLowerCase().includes(buscaLower);
    const dataMatch =
      (!dataInicial || new Date(mov.criadoEm!) >= new Date(dataInicial)) &&
      (!dataFinal || new Date(mov.criadoEm!) <= new Date(dataFinal));

    return (nomeMatch || procedimentoMatch) && dataMatch;
  });

  const handleEdit = (mov: IFinanceiro) => {
    console.log("Editar:", mov);
  };

  const handleDelete = (id?: string) => {
    console.log("Remover:", id);
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <Sidebar collapsed={false} setCollapsed={() => {}} />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-[#FFA500] mb-6">Financeiro</h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por cliente ou procedimento"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="p-2 rounded bg-[#1B1B1B] border border-[#333] focus:outline-none focus:border-[#FFA500] flex-1"
          />
          <input
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            className="p-2 rounded bg-[#1B1B1B] border border-[#333] focus:outline-none focus:border-[#FFA500]"
          />
          <input
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            className="p-2 rounded bg-[#1B1B1B] border border-[#333] focus:outline-none focus:border-[#FFA500]"
          />
        </div>

        {/* Lista de movimentos */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Movimentos Registrados</h2>

          {loading ? (
            <p className="text-gray-400">Carregando...</p>
          ) : movimentosFiltrados.length === 0 ? (
            <p className="text-gray-400">Nenhum movimento encontrado.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {movimentosFiltrados.map((mov: IFinanceiro) => (
                <li key={mov.id}>
                  <FinanceiroCard
                    mov={mov}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
