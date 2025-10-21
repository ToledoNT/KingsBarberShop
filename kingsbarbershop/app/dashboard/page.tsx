"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/ui/Sidebar";
import { AuthService } from "../api/authAdmin";
import { useDashboard } from "../hook/useDashboard";
import HeaderDashboard from "../components/dashboard/HeraderDashboard";
import MetricasDiarias from "../components/dashboard/MetricasDiarias";
import MetricasMensais from "../components/dashboard/MetricasMensais";
import MetricasAnuais from "../components/dashboard/MetricasAnuais";
import AgendamentosTable from "../components/dashboard/AgendamentosTabs";

// Serviço de autenticação
const authService = new AuthService();

/* 
  ✅ Corrige erro de fuso horário UTC: lê apenas a parte da data (YYYY-MM-DD)
  Isso impede que o navegador subtraia 3 horas (UTC-3) e mude o dia.
*/
const formatarDataBrasileira = (isoString: string) => {
  if (!isoString) return "Data inválida";
  const partes = isoString.split("T")[0].split("-");
  if (partes.length !== 3) return "Data inválida";
  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
};

/*
  ✅ Formata horário brasileiro — aceita tanto "20:30" quanto "2025-10-20T20:30:00.000Z"
*/
const formatarHorarioBrasileiro = (valor?: string) => {
  if (!valor) return "Hora inválida";

  // Caso já venha só a hora simples
  if (/^\d{2}:\d{2}$/.test(valor)) return valor;

  // Caso venha formato ISO completo
  const data = new Date(valor);
  if (isNaN(data.getTime())) return "Hora inválida";
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

// Componente de Loading
const LoadingSpinner = () => (
  <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
  </div>
);

export default function AdminHome() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { data: dashboardData, loading: dataLoading, error, refetch } = useDashboard();

  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      try {
        const valid = await authService.verifyToken();
        if (!valid) router.replace("/login");
        else setIsAuthenticated(true);
      } catch (err) {
        console.error("Erro na verificação de token:", err);
        router.replace("/login");
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const loading = authLoading || dataLoading;
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl">Erro ao carregar dados</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={refetch} 
            className="mt-4 px-6 py-3 bg-[#FFA500] text-black rounded-lg font-semibold hover:bg-[#FF8C00] transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
        <div className="text-gray-400 text-center">
          <p className="text-xl">Nenhum dado encontrado</p>
          <button 
            onClick={refetch} 
            className="mt-4 px-6 py-3 bg-[#FFA500] text-black rounded-lg font-semibold hover:bg-[#FF8C00] transition-colors"
          >
            Recarregar Dados
          </button>
        </div>
      </div>
    );
  }

  const { metrics, agendamentos, financeiro, relatorios } = dashboardData;

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const dataIgual = (data1: Date, data2: Date) =>
    data1.getDate() === data2.getDate() &&
    data1.getMonth() === data2.getMonth() &&
    data1.getFullYear() === data2.getFullYear();

  const agendamentosOrdenados = [...agendamentos].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  // Métricas diárias
  const agendamentosHoje = agendamentos.filter(a => dataIgual(new Date(a.data), hoje)).length;
  const faturamentoHoje = financeiro
    .filter(f => dataIgual(new Date(f.criadoEm), hoje) && f.status === "Pago")
    .reduce((acc, curr) => acc + curr.valor, 0);
  const concluidosHoje = agendamentos.filter(a => dataIgual(new Date(a.data), hoje) && a.status === "Concluído").length;

  // Métricas mensais
  const agendamentosMes = agendamentos.filter(a => {
    const d = new Date(a.data);
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  }).length;

  const faturamentoMensal = financeiro
    .filter(f => {
      const d = new Date(f.criadoEm);
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual && f.status === "Pago";
    })
    .reduce((acc, curr) => acc + curr.valor, 0);

  // Totais gerais
  const totalConcluidos = agendamentos.filter(a => a.status === "Concluído").length;
  const totalCancelados = agendamentos.filter(a => a.status === "Cancelado").length;
  const totalNaoCompareceu = agendamentos.filter(a => a.status === "Não Compareceu").length;
  const totalAgendados = agendamentos.filter(a => a.status === "Agendado").length;

  const relatorioAnual = relatorios.find(r => new Date(r.mesAno).getFullYear() === anoAtual);
  const faturamentoAnual = relatorioAnual?.faturamento || 0;
  const agendamentosAnuais = relatorioAnual?.agendamentos || 0;

  const totalProcessados = totalConcluidos + totalCancelados + totalNaoCompareceu;
  const ticketMedio = totalConcluidos > 0 ? (faturamentoMensal / totalConcluidos).toFixed(2) : "0.00";
  const taxaCancelamento = totalProcessados > 0 ? ((totalCancelados / totalProcessados) * 100).toFixed(1) : "0.0";
  const taxaNaoCompareceu = totalProcessados > 0 ? ((totalNaoCompareceu / totalProcessados) * 100).toFixed(1) : "0.0";
  const taxaConclusao = totalProcessados > 0 ? ((totalConcluidos / totalProcessados) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <aside className="flex-shrink-0 h-screen lg:sticky top-0 z-20">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
          <HeaderDashboard onRefresh={refetch} />

          <MetricasDiarias 
            agendamentosHoje={agendamentosHoje}
            faturamentoHoje={faturamentoHoje}
            concluidosHoje={concluidosHoje}
          />

          <MetricasMensais
            agendamentosMes={agendamentosMes}
            faturamentoMensal={faturamentoMensal}
            ticketMedio={ticketMedio}
            taxaConclusao={taxaConclusao}
            taxaCancelamento={taxaCancelamento}
            totalConcluidos={totalConcluidos}
            totalNaoCompareceu={totalNaoCompareceu}
            totalCancelados={totalCancelados}
            totalAgendados={totalAgendados}
            metrics={metrics}
          />

          <MetricasAnuais
            agendamentosAnuais={agendamentosAnuais}
            faturamentoAnual={faturamentoAnual}
            anoAtual={anoAtual}
          />

          <AgendamentosTable 
            agendamentos={agendamentosOrdenados.map(a => ({
              ...a,
              data: formatarDataBrasileira(a.data),
              inicio: formatarHorarioBrasileiro(a.inicio),
              fim: formatarHorarioBrasileiro(a.fim),
            }))} 
          />
        </main>
      </div>
    </div>
  );
}
