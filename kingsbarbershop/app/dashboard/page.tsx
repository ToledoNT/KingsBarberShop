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
import CadeadoAcesso from "../components/ui/LockAccess"; // ✅ Import default
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

// Componente de Aviso de Permissão compacto
const AvisoPermissao = () => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="text-center max-w-md mx-auto">
      {/* Cadeado animado menor */}
      <div className="relative mb-4">
        <div className="text-5xl animate-bounce text-yellow-400">
          🔒
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-yellow-400 rounded-full animate-ping opacity-20"></div>
        </div>
      </div>
      
      {/* Texto compacto */}
      <h1 className="text-2xl font-bold text-yellow-400 mb-3">
        Acesso Restrito
      </h1>
      
      <div className="space-y-2 text-sm text-gray-300 mb-4">
        <p>Área exclusiva para administradores</p>
        <p>Permissões insuficientes</p>
      </div>

      {/* Container menor */}
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-400/5 blur-lg rounded-full"></div>
        <div className="relative bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-lg text-yellow-300 font-medium">
            Dashboard Administrativo
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Componente de Erro Geral compacto
const ErroCarregamento = ({ error }: { error: string }) => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="text-center max-w-md mx-auto">
      <div className="text-4xl mb-3 text-red-400">
        ❌
      </div>
      <h1 className="text-xl font-bold text-red-400 mb-2">
        Erro ao Carregar
      </h1>
      <p className="text-sm text-gray-300">
        {error}
      </p>
    </div>
  </div>
);

// Componente de Dados Não Encontrados compacto
const DadosNaoEncontrados = () => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="text-center max-w-md mx-auto">
      <div className="text-4xl mb-3 text-blue-400">
        📊
      </div>
      <h1 className="text-xl font-bold text-blue-400 mb-2">
        Sem Dados
      </h1>
      <p className="text-sm text-gray-300">
        Nenhum dado disponível
      </p>
    </div>
  </div>
);

// COMPONENTE PRINCIPAL PROTEGIDO PELO CADEADO
function DashboardConteudo() {
  const { data: dashboardData, loading: dataLoading, error, refetch } = useDashboard();

  const [collapsed, setCollapsed] = useState(false);

  if (dataLoading) return <LoadingSpinner />;

  // Função para renderizar o conteúdo baseado no estado
  const renderConteudo = () => {
    // Verifica se é erro de permissão (403)
    const isPermissionError = error && (error.includes('403') || error.includes('permissão') || error.includes('autorização') || error.includes('não autorizado'));
    
    if (error) {
      if (isPermissionError) {
        return <AvisoPermissao />;
      }
      return <ErroCarregamento error={error} />;
    }

    if (!dashboardData) {
      return <DadosNaoEncontrados />;
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
      <>
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
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <aside className="flex-shrink-0 h-screen lg:sticky top-0 z-20">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
          {renderConteudo()}
        </main>
      </div>
    </div>
  );
}

// COMPONENTE PRINCIPAL COM CADEADO DE ACESSO
export default function AdminHome() {
  return (
    <CadeadoAcesso>
      <DashboardConteudo />
    </CadeadoAcesso>
  );
}