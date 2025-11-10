"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/ui/Sidebar";
import Button from "../components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import { useAgendamentosAdmin } from "../hook/useAgendamentoAdmin";
import {
  Agendamento,
  StatusAgendamento,
  HorarioDisponivel,
} from "../interfaces/agendamentoInterface";
import { AgendamentoHorario } from "../components/agendamento/AgendamentoHorario";
import AgendamentoPrivadoForm from "../components/agendamento/AgendamentoPrivadoForm";
import { AgendamentosGrid } from "../components/agendamento/AgendamentosGrid";
import { AuthService } from "../api/authAdmin";
import { ConfirmDialog } from "../components/ui/componenteConfirmação";
import { Notification } from "../components/ui/componenteNotificacao";

const authService = new AuthService();

const mapToAgendamento = (a: Agendamento): Agendamento => ({
  ...a,
  id: a.id || "",
  servicoId: a.servicoId || "",
  servicoNome: a.servicoNome || "",
  servicoPreco: a.servicoPreco ?? 0,
  profissionalId: a.profissionalId || "",
  profissionalNome: a.profissionalNome || "",
  status: a.status || StatusAgendamento.PENDENTE,
  criadoEm: a.criadoEm || new Date().toISOString(),
  atualizadoEm: a.atualizadoEm || new Date().toISOString(),
});

// ------------------- COMPONENTE TIMEPICKER PROFISSIONAL -------------------
interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, label }) => {
  const [hours, setHours] = useState("08");
  const [minutes, setMinutes] = useState("00");

  // Gerar horas de 00 até 23
  const hoursOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Gerar minutos de 00 até 59
  const minutesOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(h || '08');
      setMinutes(m || '00');
    }
  }, [value]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHours = e.target.value;
    setHours(newHours);
    onChange(`${newHours}:${minutes}`);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = e.target.value;
    setMinutes(newMinutes);
    onChange(`${hours}:${newMinutes}`);
  };

  const formatTimeLabel = (time: string) => {
    if (!time) return "Selecione o horário";
    const [h, m] = time.split(':');
    return `${h}h${m}m`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      
      <div className="flex gap-2">
        {/* Seletor de Horas */}
        <div className="flex-1">
          <div className="relative">
            <select
              value={hours}
              onChange={handleHoursChange}
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm backdrop-blur-sm appearance-none cursor-pointer"
            >
              {hoursOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}h
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="flex items-center justify-center">
          <span className="text-gray-400 font-bold">:</span>
        </div>

        {/* Seletor de Minutos */}
        <div className="flex-1">
          <div className="relative">
            <select
              value={minutes}
              onChange={handleMinutesChange}
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm backdrop-blur-sm appearance-none cursor-pointer"
            >
              {minutesOptions.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}m
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Preview do horário selecionado */}
      {value && (
        <div className="text-xs text-gray-400 text-center mt-1">
          Selecionado: <span className="text-[#FFA500] font-medium">{formatTimeLabel(value)}</span>
        </div>
      )}
    </div>
  );
};

// ------------------- COMPONENT PRINCIPAL -------------------
export default function CriarAgendamentoPage() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gerandoHorarios, setGerandoHorarios] = useState(false);

  const {
    agendamentos,
    addAgendamento,
    updateAgendamento,
    removeAgendamento,
    horarios,
    addHorario,
    removeHorario,
    toggleHorarioDisponivel,
    barbeiros,
    form,
    setForm,
    fetchBarbeiros,
    createHorarioIndividual, // ✅ JÁ ESTÁ NO SEU HOOK
  } = useAgendamentosAdmin();

  const [collapsed, setCollapsed] = useState(false);
  const [tabs, setTabs] = useState({
    agendamento: "gerenciar" as "criar" | "gerenciar",
    horario: "exibir" as "exibir" | "criar",
  });
  const [selectedAgendamento, setSelectedAgendamento] =
    useState<Agendamento | null>(null);
  
  const [filtros, setFiltros] = useState({
    status: StatusAgendamento.AGENDADO as "todos" | StatusAgendamento,
    data: "",
    barbeiro: "todos",
  });

  // Estados para horário individual
  const [novoHorario, setNovoHorario] = useState({
    inicio: "",
    fim: "",
  });

  // Estados para notificações e confirmações
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: "info" | "success" | "warning" | "error";
  }>({ isOpen: false, message: "", type: "info" });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "warning" | "error";
    onConfirm: (() => void) | null;
    onCancel?: () => void;
    position?: { top: number; left: number };
    color?: { bg: string; text: string };
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  // ------------------- FUNÇÕES DE NOTIFICAÇÃO -------------------
  const notify = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    setNotification({ isOpen: true, message: msg, type });
  };

  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: "info" | "warning" | "error" = "info",
    onCancel?: () => void,
    position?: { top: number; left: number }
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      onCancel: onCancel || (() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))),
      position,
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const handleConfirm = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    closeConfirmDialog();
  };

  // ------------------- VERIFICAÇÃO DE TOKEN -------------------
  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };

    verifyAuth();
    fetchBarbeiros();
  }, [router]);

  // ------------------- FILTRAGEM -------------------
  const agendamentosFiltrados = useMemo(() => {
    let filtrados = agendamentos.map(mapToAgendamento);

    if (filtros.status !== "todos")
      filtrados = filtrados.filter((ag) => ag.status === filtros.status);
    if (filtros.data) {
      const dataFiltro = new Date(filtros.data).toISOString().split("T")[0];
      filtrados = filtrados.filter(
        (ag) =>
          ag.data
            ? new Date(ag.data).toISOString().split("T")[0] === dataFiltro
            : false
      );
    }
    if (filtros.barbeiro !== "todos")
      filtrados = filtrados.filter((ag) => ag.profissionalId === filtros.barbeiro);

    return filtrados;
  }, [agendamentos, filtros]);

  // ------------------- HORÁRIOS -------------------
  const handleGenerateHorarios = async () => {
    if (!form.barbeiro || !form.data) {
      notify("Preencha barbeiro e data.", "warning");
      return;
    }

    const barbeiro = barbeiros.find((b) => b.id === form.barbeiro);
    if (!barbeiro) {
      notify("Barbeiro não encontrado.", "error");
      return;
    }

    const dataParaBackend = new Date(form.data).toISOString().split("T")[0];

    try {
      setGerandoHorarios(true);
      await addHorario({
        profissional: barbeiro,
        data: dataParaBackend,
      } as HorarioDisponivel);
      setTabs({ ...tabs, horario: "exibir" });
      notify("Horários gerados com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao gerar horários:", err);
      notify("Erro ao gerar horários. Verifique o console.", "error");
    } finally {
      setGerandoHorarios(false);
    }
  };

  const handleAddHorarioIndividual = async () => {
    if (!form.barbeiro || !form.data || !novoHorario.inicio || !novoHorario.fim) {
      notify("Preencha barbeiro, data e horários.", "warning");
      return;
    }

    // Validar se horário de início é antes do fim
    if (novoHorario.inicio >= novoHorario.fim) {
      notify("Horário de início deve ser anterior ao horário de fim.", "warning");
      return;
    }

    const barbeiro = barbeiros.find((b) => b.id === form.barbeiro);
    if (!barbeiro) {
      notify("Barbeiro não encontrado.", "error");
      return;
    }

    const dataParaBackend = new Date(form.data).toISOString().split("T")[0];

    try {
      // ✅ AGORA USANDO O HOOK CORRETO QUE JÁ EXISTE
      await createHorarioIndividual({
        profissional: barbeiro,
        data: dataParaBackend,
        inicio: novoHorario.inicio,
        fim: novoHorario.fim,
        disponivel: true,
      });

      setNovoHorario({ inicio: "", fim: "" });
      notify("Horário individual adicionado com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao adicionar horário individual:", err);
      notify("Erro ao adicionar horário individual.", "error");
    }
  };

  const handleRemoveHorario = async (id?: string) => {
    if (id) {
      await removeHorario(id);
    }
  };

  // ------------------- AGENDAMENTOS -------------------
  const handleSaveAgendamento = async (a: Agendamento) => {
    const payload: Agendamento = { ...a, inicio: a.inicio || a.hora, fim: a.fim || a.hora };
    try {
      if (payload.id) {
        await updateAgendamento(payload.id, payload);
        notify("Agendamento atualizado com sucesso!", "success");
      } else {
        await addAgendamento(payload);
        notify("Agendamento criado com sucesso!", "success");
      }
      setSelectedAgendamento(null);
      setTabs({ ...tabs, agendamento: "gerenciar" });
    } catch (err) {
      console.error("Erro ao salvar agendamento:", err);
      notify("Erro ao salvar agendamento.", "error");
    }
  };

  const handleDeleteAgendamento = async (id: string) => {
    confirm(
      "Excluir Agendamento",
      "Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.",
      () => removeAgendamento(id),
      "error"
    );
  };

  const statusColors: Record<StatusAgendamento, { bg: string; text: string }> = {
    [StatusAgendamento.PENDENTE]: { bg: "bg-gray-500", text: "text-white" },
    [StatusAgendamento.AGENDADO]: { bg: "bg-blue-600", text: "text-white" },
    [StatusAgendamento.EM_ANDAMENTO]: { bg: "bg-orange-500", text: "text-white" },
    [StatusAgendamento.CONCLUIDO]: { bg: "bg-green-600", text: "text-white" },
    [StatusAgendamento.CANCELADO]: { bg: "bg-red-600", text: "text-white" },
    [StatusAgendamento.NAO_COMPARECEU]: { bg: "bg-gray-700", text: "text-white" },
  };

  const handleUpdateStatusAgendamento = async (
    id: string,
    status: StatusAgendamento,
    elementRef: HTMLElement | null
  ) => {
    const rect = elementRef?.getBoundingClientRect();
    const position = rect
      ? { top: rect.top + window.scrollY, left: rect.left + rect.width / 2 }
      : undefined;

    const color = statusColors[status] || { bg: "bg-gray-500", text: "text-white" };
    setConfirmDialog({
      isOpen: true,
      title: "Atualizar Status",
      message: `Deseja realmente mudar para ${status}?`,
      type: "info",
      color,
      onConfirm: async () => {
        await updateAgendamento(id, { status });
        notify("Status atualizado!", "success");
      },
      onCancel: () => setConfirmDialog(prev => ({ ...prev, isOpen: false })),
      position,
    });
  };

  // ------------------- BLOQUEIO DE RENDER -------------------
  if (loading) return <Loader fullScreen={true} />;
  if (!isAuthenticated) return null;

  // ------------------- JSX -------------------
  return (
    <>
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={handleConfirm}
        onCancel={closeConfirmDialog}
      />

      {/* Conteúdo principal */}
      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
        <aside className="flex-shrink-0 h-screen lg:sticky top-0 z-20">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex-shrink-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1 flex items-center gap-2 sm:gap-3">
                      <span className="text-3xl sm:text-4xl">📅</span>
                      <span className="truncate">Agendamentos</span>
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base truncate">
                      Gerencie horários e agendamentos do sistema
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Container principal */}
            <div className="flex-1 flex flex-col min-h-0 gap-6">
              {/* ---------------- HORÁRIOS ---------------- */}
              <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm">
                {/* Header Horários */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
                      <span className="text-[#FFA500]">⏰</span>
                      Horários
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Gerencie a disponibilidade de horários dos profissionais
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant={tabs.horario === "exibir" ? "primary" : "secondary"}
                      onClick={() => setTabs({ ...tabs, horario: "exibir" })}
                      className="px-4 py-3 min-w-[140px] text-sm font-medium flex-1 sm:flex-none justify-center"
                    >
                      <span>👁️</span>
                      <span>Ver Horários</span>
                    </Button>
                    <Button
                      variant={tabs.horario === "criar" ? "primary" : "secondary"}
                      onClick={() => setTabs({ ...tabs, horario: "criar" })}
                      className="px-4 py-3 min-w-[140px] text-sm font-medium flex-1 sm:flex-none justify-center"
                    >
                      <span>➕</span>
                      <span>Criar Horário</span>
                    </Button>
                  </div>
                </div>

                {/* Conteúdo Horários */}
                {tabs.horario === "criar" && (
                  <div className="space-y-6">
                    {/* Seção de horário individual */}
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#FFA500] mb-4 flex items-center gap-2">
                        <span>🕒</span>
                        Criar Horário Individual
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Profissional
                          </label>
                          <select
                            value={form.barbeiro || ""}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, barbeiro: e.target.value }))
                            }
                            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm backdrop-blur-sm"
                          >
                            <option value="">Selecione um profissional</option>
                            {barbeiros.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.nome}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Data
                          </label>
                          <input
                            type="date"
                            value={form.data ? new Date(form.data).toISOString().split("T")[0] : ""}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, data: new Date(e.target.value) }))
                            }
                            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm backdrop-blur-sm"
                          />
                        </div>

                        {/* Timepicker profissional para Início */}
                        <TimePicker
                          value={novoHorario.inicio}
                          onChange={(time) => setNovoHorario({ ...novoHorario, inicio: time })}
                          label="Hora Início"
                        />

                        {/* Timepicker profissional para Fim */}
                        <TimePicker
                          value={novoHorario.fim}
                          onChange={(time) => setNovoHorario({ ...novoHorario, fim: time })}
                          label="Hora Fim"
                        />
                      </div>

                      {/* Visualização do horário selecionado */}
                      {(novoHorario.inicio || novoHorario.fim) && (
                        <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm">Horário selecionado:</span>
                            <div className="flex items-center gap-2">
                              <span className="bg-[#FFA500] text-black px-3 py-1 rounded-lg font-medium text-sm">
                                {novoHorario.inicio ? formatTimeForDisplay(novoHorario.inicio) : "--:--"}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className="bg-[#FFA500] text-black px-3 py-1 rounded-lg font-medium text-sm">
                                {novoHorario.fim ? formatTimeForDisplay(novoHorario.fim) : "--:--"}
                              </span>
                            </div>
                          </div>
                          {novoHorario.inicio && novoHorario.fim && (
                            <div className="mt-2 text-xs text-gray-400 text-center sm:text-left">
                              Duração: {calculateDuration(novoHorario.inicio, novoHorario.fim)}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={handleAddHorarioIndividual}
                          variant="primary"
                          className="px-6 py-3 text-sm font-medium bg-[#FFA500] hover:bg-[#ffb733] text-black"
                          disabled={!form.barbeiro || !form.data || !novoHorario.inicio || !novoHorario.fim || novoHorario.inicio >= novoHorario.fim}
                        >
                          <span className="mr-2">➕</span>
                          Adicionar Horário Individual
                        </Button>
                      </div>
                      
                      {(!form.barbeiro || !form.data) && (
                        <div className="text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg border border-gray-700 mt-4">
                          ⚠️ Selecione um profissional e uma data para adicionar horários
                        </div>
                      )}
                      
                      {novoHorario.inicio && novoHorario.fim && novoHorario.inicio >= novoHorario.fim && (
                        <div className="text-xs text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-700 mt-4">
                          ⚠️ O horário de início deve ser anterior ao horário de fim
                        </div>
                      )}
                    </div>

                    {/* Seção de geração automática de horários */}
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#FFA500] mb-4 flex items-center gap-2">
                        <span>🔧</span>
                        Gerar Horários Automaticamente
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Profissional
                          </label>
                          <select
                            value={form.barbeiro || ""}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, barbeiro: e.target.value }))
                            }
                            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm backdrop-blur-sm"
                          >
                            <option value="">Selecione um profissional</option>
                            {barbeiros.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.nome}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Data
                          </label>
                          <input
                            type="date"
                            value={form.data ? new Date(form.data).toISOString().split("T")[0] : ""}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, data: new Date(e.target.value) }))
                            }
                            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={handleGenerateHorarios}
                          variant="primary"
                          className="px-6 py-3 text-sm font-medium w-full md:w-auto justify-center"
                          disabled={!form.barbeiro || !form.data || gerandoHorarios}
                        >
                          {gerandoHorarios ? (
                            <Loader size={24} color="#FFA500" />
                          ) : (
                            <>
                              <span className="mr-2">🔧</span>
                              Gerar Horários Automaticamente
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {(!form.barbeiro || !form.data) && (
                        <div className="text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg border border-gray-700 mt-4">
                          ⚠️ Selecione um profissional e uma data para gerar horários
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {tabs.horario === "exibir" && (
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 transition-all duration-300 max-h-[600px] rounded-lg">
                      <AgendamentoHorario
                        horarios={horarios}
                        onToggleDisponivel={toggleHorarioDisponivel}
                        onRemoveHorario={handleRemoveHorario}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ---------------- AGENDAMENTOS ---------------- */}
              <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm">
                {/* Header Agendamentos */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
                      <span className="text-[#FFA500]">📋</span>
                      Agendamentos
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Gerencie os agendamentos dos clientes
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant={tabs.agendamento === "gerenciar" ? "primary" : "secondary"}
                      onClick={() => {
                        setTabs({ ...tabs, agendamento: "gerenciar" });
                        if (tabs.agendamento === "criar") setSelectedAgendamento(null);
                      }}
                      className="px-4 py-3 min-w-[140px] text-sm font-medium flex-1 sm:flex-none justify-center"
                    >
                      <span>👁️</span>
                      <span>Ver Agendamentos</span>
                    </Button>
                    <Button
                      variant={tabs.agendamento === "criar" ? "primary" : "secondary"}
                      onClick={() => {
                        setTabs({ ...tabs, agendamento: "criar" });
                        setSelectedAgendamento(null);
                      }}
                      className="px-4 py-3 min-w-[140px] text-sm font-medium flex-1 sm:flex-none justify-center"
                    >
                      <span>➕</span>
                      <span>Criar Agendamento</span>
                    </Button>
                  </div>
                </div>

                {/* Conteúdo Agendamentos */}
                <div className="flex-1 flex flex-col min-h-0">
                  {tabs.agendamento === "criar" && (
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#FFA500] mb-4 sm:mb-6 flex items-center gap-2">
                        <span>{selectedAgendamento ? "✏️" : "🆕"}</span>
                        {selectedAgendamento ? "Editar Agendamento" : "Novo Agendamento"}
                      </h3>
                      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 transition-all duration-300 max-h-[600px] rounded-lg">
                        <AgendamentoPrivadoForm
                          agendamento={selectedAgendamento || undefined}
                          onSave={handleSaveAgendamento}
                          onCancel={() => setTabs({ ...tabs, agendamento: "gerenciar" })}
                          barbeiros={barbeiros}
                          horarios={horarios}
                        />
                      </div>
                    </div>
                  )}

                  {tabs.agendamento === "gerenciar" && (
                    <>
                      {/* Filtros */}
                      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-6 mb-6 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                          <h4 className="text-base font-semibold text-white flex items-center gap-2">
                            <span className="text-[#FFA500]">🎯</span>
                            Filtros
                          </h4>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setFiltros({ 
                                status: StatusAgendamento.AGENDADO, 
                                data: "", 
                                barbeiro: "todos" 
                              })
                            }
                            className="px-4 py-2 text-sm"
                          >
                            <span className="mr-2">🔄</span>
                            Limpar Filtros
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                              Status
                            </label>
                            <select
                              value={filtros.status}
                              onChange={(e) =>
                                setFiltros((prev) => ({
                                  ...prev,
                                  status: e.target.value as any,
                                }))
                              }
                              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
                            >
                              <option value="todos">Todos os status</option>
                              <option value={StatusAgendamento.PENDENTE}>Pendente</option>
                              <option value={StatusAgendamento.AGENDADO}>Agendado</option>
                              <option value={StatusAgendamento.EM_ANDAMENTO}>Em Andamento</option>
                              <option value={StatusAgendamento.CONCLUIDO}>Concluído</option>
                              <option value={StatusAgendamento.CANCELADO}>Cancelado</option>
                              <option value={StatusAgendamento.NAO_COMPARECEU}>Não Compareceu</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                              Profissional
                            </label>
                            <select
                              value={filtros.barbeiro}
                              onChange={(e) =>
                                setFiltros((prev) => ({ ...prev, barbeiro: e.target.value }))
                              }
                              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
                            >
                              <option value="todos">Todos os profissionais</option>
                              {barbeiros.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.nome}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                              Data
                            </label>
                            <input
                              type="date"
                              value={filtros.data}
                              onChange={(e) =>
                                setFiltros((prev) => ({ ...prev, data: e.target.value }))
                              }
                              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Grid de Agendamentos */}
                      <div className="rounded-lg">
                        <AgendamentosGrid
                          agendamentos={agendamentosFiltrados}
                          onStatusChange={(id, status, elementRef) => {
                            handleUpdateStatusAgendamento(id, status, elementRef ?? null);
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Loader full screen */}
      {gerandoHorarios && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader size={60} color="#FFA500" />
        </div>
      )}

      {/* Estilos customizados para scrollbar */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4B5563;
          border-radius: 10px;
        }
        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: #1F2937;
          border-radius: 10px;
        }
        .scrollbar-thumb-gray-500::-webkit-scrollbar-thumb:hover {
          background-color: #6B7280;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #4B5563 #1F2937;
        }
      `}</style>
    </>
  );
}

// Função auxiliar para calcular duração
function calculateDuration(start: string, end: string): string {
  const startTime = new Date(`2000-01-01T${start}`);
  const endTime = new Date(`2000-01-01T${end}`);
  const diff = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h${minutes}min`;
  }
}

// Função para formatar hora para display
function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}