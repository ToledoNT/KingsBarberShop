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

// ------------------- INSTÂNCIA AUTH -------------------
const authService = new AuthService();

// ------------------- COMPONENTE DE CONFIRMAÇÃO -------------------
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "info" | "warning" | "error";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type = "info"
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    info: "border-blue-500",
    warning: "border-yellow-500",
    error: "border-red-500"
  };

  const typeIcons = {
    info: "💡",
    warning: "⚠️",
    error: "❌"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-2 ${typeStyles[type]} rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full mx-auto shadow-2xl backdrop-blur-sm`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">{typeIcons[type]}</div>
          <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
        </div>

        {/* Message */}
        <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1 justify-center px-4 py-3 text-sm sm:text-base"
          >
            <span className="mr-2">↩️</span>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            className={`flex-1 justify-center px-4 py-3 text-sm sm:text-base ${
              type === 'error' ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            <span className="mr-2">✅</span>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

// ------------------- COMPONENTE DE NOTIFICAÇÃO -------------------
interface NotificationProps {
  isOpen: boolean;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  isOpen,
  message,
  type = "info",
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    info: "border-blue-500 bg-blue-500/10",
    success: "border-green-500 bg-green-500/10",
    warning: "border-yellow-500 bg-yellow-500/10",
    error: "border-red-500 bg-red-500/10"
  };

  const typeIcons = {
    info: "💡",
    success: "✅",
    warning: "⚠️",
    error: "❌"
  };

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-sm mx-auto sm:mx-0">
      <div className={`border rounded-xl p-4 backdrop-blur-sm ${typeStyles[type]} shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="text-lg">{typeIcons[type]}</div>
          <p className="text-white text-sm flex-1">{message}</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-lg"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------- HELPERS -------------------
export const mapToAgendamento = (a: Agendamento): Agendamento => ({
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

export const formatDate = (dataISO?: string | null) => {
  if (!dataISO) return "—";
  const d = new Date(dataISO);
  if (isNaN(d.getTime())) return dataISO;
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(
    d.getUTCMonth() + 1
  ).padStart(2, "0")}/${d.getUTCFullYear()}`;
};

// ------------------- COMPONENT -------------------
export default function CriarAgendamentoPage() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
  } = useAgendamentosAdmin();

  const [collapsed, setCollapsed] = useState(false);
  const [tabs, setTabs] = useState({
    agendamento: "gerenciar" as "criar" | "gerenciar",
    horario: "exibir" as "exibir" | "criar",
  });
  const [selectedAgendamento, setSelectedAgendamento] =
    useState<Agendamento | null>(null);
  const [filtros, setFiltros] = useState({
    status: "todos" as "todos" | StatusAgendamento,
    data: "",
    barbeiro: "todos",
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
  }>({ isOpen: false, title: "", message: "", type: "info", onConfirm: null });

  // ------------------- FUNÇÕES DE NOTIFICAÇÃO -------------------
  const notify = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    setNotification({ isOpen: true, message: msg, type });
  };

  const confirm = (title: string, message: string, onConfirm: () => void, type: "info" | "warning" | "error" = "info") => {
    setConfirmDialog({ isOpen: true, title, message, type, onConfirm });
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
      await addHorario({
        profissional: barbeiro,
        data: dataParaBackend,
      } as HorarioDisponivel);
      setTabs({ ...tabs, horario: "exibir" });
      notify("Horários gerados com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao gerar horários:", err);
      notify("Erro ao gerar horários. Verifique o console.", "error");
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

  const handleUpdateStatusAgendamento = async (
    id: string,
    status: StatusAgendamento
  ) => {
    try {
      await updateAgendamento(id, { status });
      notify("Status do agendamento atualizado!", "success");
    } catch (err) {
      console.error(err);
      notify("Erro ao atualizar status.", "error");
    }
  };

  // ------------------- BLOQUEIO DE RENDER -------------------
  if (loading) return <Loader fullScreen={true} />;
  if (!isAuthenticated) return null;

  // ------------------- JSX -------------------
  return (
    <>
      {/* Componentes de UI */}
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
                  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#FFA500] mb-4 sm:mb-6 flex items-center gap-2">
                      <span>🆕</span>
                      Criar Novos Horários
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Profissional
                        </label>
                        <select
                          value={form.barbeiro || ""}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, barbeiro: e.target.value }))
                          }
                          className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
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
                          value={
                            form.data ? new Date(form.data).toISOString().split("T")[0] : ""
                          }
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, data: new Date(e.target.value) }))
                          }
                          className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
                        />
                      </div>

                      <div className="space-y-2 flex flex-col justify-end">
                        <Button
                          onClick={handleGenerateHorarios}
                          variant="primary"
                          className="px-6 py-3 text-sm sm:text-base font-medium w-full justify-center"
                          disabled={!form.barbeiro || !form.data}
                        >
                          <span className="mr-2">⚡</span>
                          Gerar Horários
                        </Button>
                      </div>
                    </div>

                    {(!form.barbeiro || !form.data) && (
                      <div className="text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg border border-gray-700 mt-4">
                        ⚠️ Selecione um profissional e uma data para gerar horários
                      </div>
                    )}
                  </div>
                )}

                {tabs.horario === "exibir" && (
                  <div className="flex-1 flex flex-col min-h-0">
                    <AgendamentoHorario
                      horarios={horarios}
                      onToggleDisponivel={toggleHorarioDisponivel}
                      onRemoveHorario={handleRemoveHorario}
                    />
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
                      <AgendamentoPrivadoForm
                        agendamento={selectedAgendamento || undefined}
                        onSave={handleSaveAgendamento}
                        onCancel={() => setTabs({ ...tabs, agendamento: "gerenciar" })}
                        barbeiros={barbeiros}
                        horarios={horarios}
                      />
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
                              setFiltros({ status: "todos", data: "", barbeiro: "todos" })
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
                      <div className="flex-1">
                        <AgendamentosGrid
                          agendamentos={agendamentosFiltrados}
                          onStatusChange={handleUpdateStatusAgendamento}
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
    </>
  );
}