"use client";

import { useState } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import DashboardCard from "@/app/components/ui/DashboardCard";
import Table from "@/app/components/ui/Table";

export default function AdminHome() {
  const [collapsed, setCollapsed] = useState(false);

  const dashboardMetrics = [
    { title: "Agendamentos Hoje", value: 12 },
    { title: "Procedimentos", value: 25 },
    { title: "Receita Mensal", value: "R$ 3.500" },
  ];

  const agendamentos = [
    { nome: "João", barbeiro: "Carlos", data: "2025-10-08", hora: "10:00", servico: "Corte" },
    { nome: "Maria", barbeiro: "Ana", data: "2025-10-08", hora: "12:00", servico: "Barba" },
  ];

  const columns = [
    { header: "Cliente", accessor: "nome" },
    { header: "Barbeiro", accessor: "barbeiro" },
    { header: "Data", accessor: "data" },
    { header: "Hora", accessor: "hora" },
    { header: "Serviço", accessor: "servico" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 flex flex-col gap-6 md:gap-8 p-4 md:p-6 overflow-y-auto h-screen">
        {/* Cards do Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {dashboardMetrics.map((metric) => (
            <DashboardCard key={metric.title} title={metric.title} value={metric.value} />
          ))}
        </div>

        {/* Tabela de Agendamentos */}
        <section className="bg-[#1B1B1B] p-4 md:p-6 rounded-xl shadow flex-1 overflow-x-auto">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-[#FFA500]">Agendamentos</h2>
          <div className="min-w-[500px]">
            <Table columns={columns} data={agendamentos} />
          </div>
        </section>
      </main>
    </div>
  );
}