"use client";
import Sidebar from "@/app/components/ui/Sidebar";
import DashboardCard from "@/app/components/ui/DashboardCard";
import Table from "@/app/components/ui/Table";

export default function AdminHome() {
  // Dados mockados (substituir com API)
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
      <Sidebar />

      <main className="flex-1 p-8 flex flex-col gap-8">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {dashboardMetrics.map(metric => (
            <DashboardCard key={metric.title} title={metric.title} value={metric.value} />
          ))}
        </div>

        {/* Tabela de Agendamentos */}
        <section className="bg-[#1B1B1B] p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Agendamentos</h2>
          <Table columns={columns} data={agendamentos} />
        </section>
      </main>
    </div>
  );
}