"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/ui/Sidebar";
import Button from "../components/ui/Button";
import Loader from "@/app/components/ui/Loader"; // Loader importado
import { useAgendamentosAdmin } from "../hook/useAgendamentoAdmin";
import {
  Agendamento,
  StatusAgendamento,
  HorarioDisponivel,
} from "../interfaces/agendamentoInterface";
import { AgendamentoHorario } from "../components/agendamento/AgendamentoHorario";
import AgendamentoPrivadoForm from "../components/agendamento/AgendamentoPrivadoForm";
import { AgendamentosGrid } from "../components/agendamento/AgendamentosGrid";
import { FaUser, FaCalendarAlt } from "react-icons/fa";
import { AuthService } from "../api/authAdmin";

// ------------------- INSTÂNCIA AUTH -------------------
const authService = new AuthService();

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

  const notify = (msg: string) => alert(msg);

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
    if (!form.barbeiro || !form.data) return notify("Preencha barbeiro e data.");
    const barbeiro = barbeiros.find((b) => b.id === form.barbeiro);
    if (!barbeiro) return notify("Barbeiro não encontrado.");
    const dataParaBackend = new Date(form.data).toISOString().split("T")[0];

    try {
      await addHorario({
        profissional: barbeiro,
        data: dataParaBackend,
      } as HorarioDisponivel);
      setTabs({ ...tabs, horario: "exibir" });
    } catch (err) {
      console.error("Erro ao gerar horários:", err);
      notify("Erro ao gerar horários. Veja o console.");
    }
  };
  const handleRemoveHorario = async (id?: string) => {
    if (id) await removeHorario(id);
  };

  // ------------------- AGENDAMENTOS -------------------
  const handleSaveAgendamento = async (a: Agendamento) => {
    const payload: Agendamento = { ...a, inicio: a.inicio || a.hora, fim: a.fim || a.hora };
    if (payload.id) await updateAgendamento(payload.id, payload);
    else await addAgendamento(payload);
    setSelectedAgendamento(null);
    setTabs({ ...tabs, agendamento: "gerenciar" });
  };
  const handleDeleteAgendamento = async (id: string) => await removeAgendamento(id);
  const handleUpdateStatusAgendamento = async (
    id: string,
    status: StatusAgendamento
  ) => {
    try {
      await updateAgendamento(id, { status });
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- BLOQUEIO DE RENDER -------------------
  if (loading) return <Loader fullScreen={true} />;
  if (!isAuthenticated) return null;

  // ------------------- JSX -------------------
  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 flex flex-col gap-6 md:gap-8 p-4 md:p-6 overflow-y-auto h-screen">
        <h1 className="text-2xl md:text-3xl font-bold text-[#FFA500] mb-4">
          Agendamentos
        </h1>

        {/* ---------------- HORÁRIOS ---------------- */}
        <section className="bg-[#1F1F1F] rounded-3xl shadow-lg p-4 md:p-6 flex flex-col gap-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#FFA500]">Horários</h2>

          <div className="flex flex-wrap gap-3 mt-3">
            {(["exibir", "criar"] as const).map((tab) => (
              <Button
                key={tab}
                variant={tabs.horario === tab ? "primary" : "secondary"}
                onClick={() => setTabs({ ...tabs, horario: tab })}
                className="w-full sm:w-auto"
              >
                {tab === "exibir" ? "Exibir Horários" : "Criar Horário"}
              </Button>
            ))}
          </div>

          {tabs.horario === "criar" && (
            <div className="flex flex-col sm:flex-row gap-3 mt-3 flex-wrap items-center">
              <select
                value={form.barbeiro || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, barbeiro: e.target.value }))
                }
                className="p-2 rounded-lg bg-[#2F2F2F] border border-gray-600 hover:border-orange-400 transition w-full sm:w-auto"
              >
                <option value="">Selecione Barbeiro</option>
                {barbeiros.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={
                  form.data ? new Date(form.data).toISOString().split("T")[0] : ""
                }
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, data: new Date(e.target.value) }))
                }
                className="p-2 rounded-lg bg-[#2F2F2F] border border-gray-600 hover:border-orange-400 transition w-full sm:w-auto"
              />
              <Button
                onClick={handleGenerateHorarios}
                variant="primary"
                className="w-full sm:w-auto"
              >
                Gerar Horários
              </Button>
            </div>
          )}

          {tabs.horario === "exibir" && (
            <div className="overflow-x-auto mt-3">
              <AgendamentoHorario
                horarios={horarios}
                onToggleDisponivel={toggleHorarioDisponivel}
                onRemoveHorario={handleRemoveHorario}
              />
            </div>
          )}
        </section>

        {/* ---------------- AGENDAMENTOS ---------------- */}
        <section className="bg-[#1F1F1F] rounded-3xl shadow-lg p-4 md:p-6 flex flex-col gap-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#FFA500]">Agendamentos</h2>

          <div className="flex flex-wrap gap-3 mt-3">
            {(["gerenciar", "criar"] as const).map((tab) => (
              <Button
                key={tab}
                variant={tabs.agendamento === tab ? "primary" : "secondary"}
                onClick={() => {
                  setTabs({ ...tabs, agendamento: tab });
                  if (tab === "criar") setSelectedAgendamento(null);
                }}
                className="w-full sm:w-auto"
              >
                {tab === "gerenciar" ? "Gerenciar Agendamentos" : "Criar Agendamento"}
              </Button>
            ))}
          </div>

          {tabs.agendamento === "gerenciar" && (
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-gray-700 mt-3">
              <div className="flex justify-end mb-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setFiltros({ status: "todos", data: "", barbeiro: "todos" })
                  }
                  className="text-sm"
                >
                  Limpar Filtros
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Status</label>
                  <select
                    value={filtros.status}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        status: e.target.value as any,
                      }))
                    }
                    className="p-2 rounded-lg bg-[#1F1F1F] border border-gray-600 text-sm hover:border-orange-400 transition-colors"
                  >
                    <option value="todos">Todos os status</option>
                    <option value={StatusAgendamento.AGENDADO}>Agendado</option>
                    <option value={StatusAgendamento.EM_ANDAMENTO}>Em Andamento</option>
                    <option value={StatusAgendamento.CONCLUIDO}>Concluído</option>
                    <option value={StatusAgendamento.CANCELADO}>Cancelado</option>
                    <option value={StatusAgendamento.NAO_COMPARECEU}>Não Compareceu</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400 flex items-center gap-1">
                    <FaUser className="text-orange-400" /> Barbeiro
                  </label>
                  <select
                    value={filtros.barbeiro}
                    onChange={(e) =>
                      setFiltros((prev) => ({ ...prev, barbeiro: e.target.value }))
                    }
                    className="p-2 rounded-lg bg-[#1F1F1F] border border-gray-600 text-sm hover:border-orange-400 transition-colors"
                  >
                    <option value="todos">Todos os barbeiros</option>
                    {barbeiros.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400 flex items-center gap-1">
                    <FaCalendarAlt className="text-orange-400" /> Data
                  </label>
                  <input
                    type="date"
                    value={filtros.data}
                    onChange={(e) =>
                      setFiltros((prev) => ({ ...prev, data: e.target.value }))
                    }
                    className="p-2 rounded-lg bg-[#1F1F1F] border border-gray-600 text-sm hover:border-orange-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto mt-3">
            {tabs.agendamento === "criar" && (
              <AgendamentoPrivadoForm
                agendamento={selectedAgendamento || undefined}
                onSave={handleSaveAgendamento}
                onCancel={() => setTabs({ ...tabs, agendamento: "gerenciar" })}
                barbeiros={barbeiros}
                horarios={horarios}
              />
            )}
            {tabs.agendamento === "gerenciar" && (
              <AgendamentosGrid
                agendamentos={agendamentosFiltrados}
                onStatusChange={handleUpdateStatusAgendamento}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}