// app/dashboard/page.tsx
"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Table from "@/app/components/ui/Table";
import DashboardCard from "../components/dashboard/DashBoardCard";

export default function AdminHome() {
  const [collapsed, setCollapsed] = useState(false);

  // Dados mockados - você pode substituir pela sua API
  const agendamentos = [
    { id: 1, nome: "João Silva", barbeiro: "Carlos", data: "2024-01-15", hora: "10:00", servico: "Corte", valor: 35, status: "confirmado" },
    { id: 2, nome: "Maria Santos", barbeiro: "Ana", data: "2024-01-15", hora: "12:00", servico: "Barba", valor: 25, status: "confirmado" },
    { id: 3, nome: "Pedro Oliveira", barbeiro: "Carlos", data: "2024-01-16", hora: "14:00", servico: "Corte + Barba", valor: 50, status: "cancelado" },
    { id: 4, nome: "Ana Costa", barbeiro: "Ana", data: "2024-01-16", hora: "16:00", servico: "Corte", valor: 35, status: "confirmado" },
    { id: 5, nome: "Lucas Pereira", barbeiro: "Carlos", data: "2024-01-17", hora: "09:00", servico: "Barba", valor: 25, status: "cancelado" },
  ];

  // Calcular métricas
  const dashboardMetrics = useMemo(() => {
    const mesAtual = "2024-01"; // Você pode ajustar para o mês atual
    
    const agendamentosMes = agendamentos.filter(ag => 
      ag.data.startsWith(mesAtual)
    );
    
    const faturamentoMes = agendamentosMes
      .filter(ag => ag.status === "confirmado")
      .reduce((total, ag) => total + ag.valor, 0);
    
    const cancelamentosMes = agendamentosMes
      .filter(ag => ag.status === "cancelado").length;
    
    const totalAgendamentosMes = agendamentosMes.length;
    
    const agendamentosHoje = agendamentos.filter(ag => 
      ag.data === "2024-01-15" && ag.status === "confirmado"
    ).length;

    return [
      { 
        title: "Agendamentos Hoje", 
        value: agendamentosHoje,
        icon: "📅"
      },
      { 
        title: "Agendamentos Mensais", 
        value: totalAgendamentosMes,
        icon: "📊"
      },
      { 
        title: "Faturamento Mensal", 
        value: `R$ ${faturamentoMes.toLocaleString('pt-BR')}`,
        icon: "💰"
      },
      { 
        title: "Cancelamentos Mensais", 
        value: cancelamentosMes,
        icon: "❌"
      },
    ];
  }, []);

  // Colunas para a tabela de agendamentos
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
          value === "cancelado" ? "bg-red-500 text-white" : 
          "bg-yellow-500 text-black"
        }`}>
          {value === "confirmado" ? "Confirmado" : 
           value === "cancelado" ? "Cancelado" : "Pendente"}
        </span>
      )
    },
  ];

  // Dados para gráficos (você pode integrar com uma biblioteca como Chart.js)
  const dadosGrafico = {
    faturamentoMensal: [
      { mes: "Jan", valor: 3500 },
      { mes: "Fev", valor: 4200 },
      { mes: "Mar", valor: 3800 },
    ],
    agendamentosMensais: [
      { mes: "Jan", agendamentos: 45, cancelamentos: 5 },
      { mes: "Fev", agendamentos: 52, cancelamentos: 3 },
      { mes: "Mar", agendamentos: 48, cancelamentos: 7 },
    ]
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 flex flex-col gap-6 md:gap-8 p-4 md:p-6 overflow-y-auto h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#FFA500]">
            Dashboard
          </h1>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {dashboardMetrics.map((metric, index) => (
            <DashboardCard 
              key={metric.title} 
              title={metric.title} 
              value={metric.value}
              icon={metric.icon}
              className={index === 2 ? "border-l-4 border-l-green-500" : ""}
            />
          ))}
        </div>

        {/* Seção de Gráficos e Estatísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card de Faturamento Mensal */}
          <div className="bg-[#1B1B1B] p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-[#FFA500] flex items-center gap-2">
              💰 Faturamento Mensal
            </h3>
            <div className="space-y-3">
              {dadosGrafico.faturamentoMensal.map((item) => (
                <div key={item.mes} className="flex justify-between items-center p-3 bg-[#0D0D0D] rounded-lg">
                  <span className="font-medium">{item.mes}</span>
                  <span className="text-green-400 font-bold">
                    R$ {item.valor.toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center text-sm">
                <span>Média Mensal:</span>
                <span className="text-green-400 font-bold">R$ 3.833</span>
              </div>
            </div>
          </div>

          {/* Card de Agendamentos vs Cancelamentos */}
          <div className="bg-[#1B1B1B] p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-[#FFA500] flex items-center gap-2">
              📊 Estatísticas Mensais
            </h3>
            <div className="space-y-4">
              {dadosGrafico.agendamentosMensais.map((item) => (
                <div key={item.mes} className="bg-[#0D0D0D] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.mes}</span>
                    <span className="text-sm text-gray-400">
                      Taxa de cancelamento: {((item.cancelamentos / item.agendamentos) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-green-400">Agendamentos</span>
                        <span>{item.agendamentos}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(item.agendamentos / 60) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-red-400">Cancelamentos</span>
                        <span>{item.cancelamentos}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(item.cancelamentos / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela de Agendamentos Recentes */}
        <section className="bg-[#1B1B1B] p-6 rounded-xl shadow flex-1 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-[#FFA500]">
              Agendamentos Recentes
            </h2>
            <span className="text-sm text-gray-400">
              Total: {agendamentos.length} agendamentos
            </span>
          </div>
          <div className="min-w-[600px]">
            <Table columns={columns} data={agendamentos} />
          </div>
        </section>
      </main>
    </div>
  );
}