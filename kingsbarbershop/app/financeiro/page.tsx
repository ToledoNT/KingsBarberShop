"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import { FinanceiroMov } from "../interfaces/financeiroInterface";

export default function FinanceiroPage() {
  const [movimentos, setMovimentos] = useState<FinanceiroMov[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroPago, setFiltroPago] = useState<"todos" | "pago" | "divida">("todos");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  // Dados de exemplo
  useEffect(() => {
    setMovimentos([
      { id: "1", clienteNome: "João", procedimento: "Corte", valor: 50, data: "2025-10-01T10:00:00", profissionalId: "p1", pago: true },
      { id: "2", clienteNome: "Maria", procedimento: "Barba", valor: 30, data: "2025-10-03T15:00:00", profissionalId: "p2", pago: false },
      { id: "3", clienteNome: "Pedro", procedimento: "Corte + Barba", valor: 70, data: "2025-10-05T12:30:00", profissionalId: "p1", pago: true },
    ]);
  }, []);

  // Filtrar movimentos
  const movimentosFiltrados = movimentos.filter(mov => {
    const buscaLower = busca.toLowerCase();
    const nomeMatch = mov.clienteNome.toLowerCase().includes(buscaLower);
    const procedimentoMatch = mov.procedimento.toLowerCase().includes(buscaLower);

    const pagoMatch =
      filtroPago === "todos" ? true :
      filtroPago === "pago" ? mov.pago :
      filtroPago === "divida" ? !mov.pago : true;

    const dataMatch =
      (!dataInicial || new Date(mov.data) >= new Date(dataInicial)) &&
      (!dataFinal || new Date(mov.data) <= new Date(dataFinal));

    return (nomeMatch || procedimentoMatch) && pagoMatch && dataMatch;
  });

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
            onChange={e => setBusca(e.target.value)}
            className="p-2 rounded bg-[#1B1B1B] border border-[#333] focus:outline-none focus:border-[#FFA500] flex-1"
          />
          <select
            value={filtroPago}
            onChange={e => setFiltroPago(e.target.value as any)}
            className="p-2 rounded bg-[#1B1B1B] border border-[#333] focus:outline-none focus:border-[#FFA500]"
          >
            <option value="todos">Todos</option>
            <option value="pago">Pagos</option>
            <option value="divida">Dívidas</option>
          </select>
          <input
            type="date"
            value={dataInicial}
            onChange={e => setDataInicial(e.target.value)}
            className="p-2 rounded bg-[#1B1B1B] border border-[#333] focus:outline-none focus:border-[#FFA500]"
          />
          <input
            type="date"
            value={dataFinal}
            onChange={e => setDataFinal(e.target.value)}
            className="p-2 rounded bg-[#1B1B1B] border border-[#333] focus:outline-none focus:border-[#FFA500]"
          />
        </div>

        {/* Lista de movimentos */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Movimentos Registrados</h2>
          {movimentosFiltrados.length === 0 ? (
            <p className="text-gray-400">Nenhum movimento encontrado.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {movimentosFiltrados.map(mov => (
                <li
                  key={mov.id}
                  className={`bg-[#1B1B1B] p-3 rounded shadow flex justify-between items-center ${
                    mov.pago ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
                  }`}
                >
                  <div>
                    <span className="font-semibold">{mov.clienteNome}</span> - {mov.procedimento}
                    <div className="text-gray-400 text-sm">{new Date(mov.data).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span>R$ {mov.valor.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded text-sm ${mov.pago ? "bg-green-600 text-black" : "bg-red-600 text-black"}`}>
                      {mov.pago ? "Pago" : "Dívida"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}