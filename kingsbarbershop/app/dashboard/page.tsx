"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/ui/Sidebar";
import Table from "@/app/components/ui/Table";
import DashboardCard from "../components/dashboard/DashBoardCard";
import { AuthService } from "../api/authAdmin";

const authService = new AuthService();

export default function AdminHome() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  const verifyAuth = async () => {
    setLoading(true);
    try {
      const valid = await authService.verifyToken(); // ✅ sem token
      if (!valid) {
        router.replace("/login");
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Erro na verificação de token:", err);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  verifyAuth();
}, [router]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0D0D0D] text-[#E5E5E5]">
        <span>Carregando...</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // MOCK DATA
  const agendamentos = [
    { id: 1, nome: "João Silva", barbeiro: "Carlos", data: "2024-01-15", hora: "10:00", servico: "Corte", valor: 35, status: "confirmado" },
    { id: 2, nome: "Maria Santos", barbeiro: "Ana", data: "2024-01-15", hora: "12:00", servico: "Barba", valor: 25, status: "confirmado" },
    { id: 3, nome: "Pedro Oliveira", barbeiro: "Carlos", data: "2024-01-16", hora: "14:00", servico: "Corte + Barba", valor: 50, status: "cancelado" },
    { id: 4, nome: "Ana Costa", barbeiro: "Ana", data: "2024-01-16", hora: "16:00", servico: "Corte", valor: 35, status: "confirmado" },
    { id: 5, nome: "Lucas Pereira", barbeiro: "Carlos", data: "2024-01-17", hora: "09:00", servico: "Barba", valor: 25, status: "cancelado" },
  ];

  const dashboardMetrics = [
    { title: "Agendamentos Hoje", value: 2, icon: "📅" },
    { title: "Agendamentos Mensais", value: 5, icon: "📊" },
    { title: "Faturamento Mensal", value: "R$ 170", icon: "💰" },
    { title: "Cancelamentos Mensais", value: 2, icon: "❌" },
  ];

  const columns = [
    { header: "Cliente", accessor: "nome" },
    { header: "Barbeiro", accessor: "barbeiro" },
    { header: "Data", accessor: "data" },
    { header: "Hora", accessor: "hora" },
    { header: "Serviço", accessor: "servico" },
    {
      header: "Status",
      accessor: "status",
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value === "confirmado" ? "bg-green-500 text-white" :
          value === "cancelado" ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
        }`}>
          {value === "confirmado" ? "Confirmado" : value === "cancelado" ? "Cancelado" : "Pendente"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 flex flex-col gap-6 md:gap-8 p-4 md:p-6 overflow-y-auto h-screen">
        <h1 className="text-3xl font-bold text-[#FFA500] mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {dashboardMetrics.map(metric => (
            <DashboardCard key={metric.title} {...metric} />
          ))}
        </div>

        <section className="bg-[#1B1B1B] p-6 rounded-xl shadow flex-1 overflow-x-auto mt-6">
          <h2 className="text-lg md:text-xl font-bold text-[#FFA500] mb-4">Agendamentos Recentes</h2>
          <Table columns={columns} data={agendamentos} />
        </section>
      </main>
    </div>
  );
}