"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Button from "../components/ui/Button";
import { useAgendamentosAdmin } from "../hook/useAgendamentoAdmin";
import {
  Agendamento,
  StatusAgendamento,
  HorarioDisponivel,
} from "../interfaces/agendamentoInterface";
import { AgendamentoHorario } from "../components/agendamento/AgendamentoHorario";
import AgendamentoPrivadoForm from "../components/agendamento/AgendamentoPrivadoForm";
import { AgendamentosGrid } from "../components/agendamento/AgendamentosGrid";

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
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const notify = (msg: string) => alert(msg);

  // ------------------- HORÁRIOS -------------------
  const handleGenerateHorarios = async () => {
    if (!form.barbeiro || !form.data) return notify("Preencha barbeiro e data.");
    const barbeiro = barbeiros.find((b) => b.id === form.barbeiro);
    if (!barbeiro) return notify("Barbeiro não encontrado.");
    const dataISO = new Date(new Date(form.data).setHours(0, 0, 0, 0)).toISOString();

    try {
      await addHorario({ profissional: barbeiro, data: dataISO } as HorarioDisponivel);
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

  const handleDeleteAgendamento = async (id: string) => {
    await removeAgendamento(id);
  };

  const handleUpdateStatusAgendamento = async (id: string, status: StatusAgendamento) => {
    try {
      await updateAgendamento(id, { status });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // ------------------- EFFECTS -------------------
  useEffect(() => {
    fetchBarbeiros();
  }, []);

  // ------------------- JSX -------------------
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0D0D0D] text-[#E5E5E5] overflow-hidden">
      {/* Sidebar responsiva */}
      <div className="w-full md:w-auto">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <main
        className={`flex-1 h-screen overflow-y-auto p-4 md:p-6 transition-all ${
          collapsed ? "md:ml-12" : "md:ml-24"
        }`}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6 text-center md:text-left">
          Painel Admin
        </h1>

        <div className="flex flex-col gap-8">
          {/* ---------------- HORÁRIOS ---------------- */}
          <section className="bg-[#1F1F1F] rounded-3xl shadow-lg p-4 md:p-6 flex flex-col gap-5">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
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
                  onChange={(e) => setForm((prev) => ({ ...prev, barbeiro: e.target.value }))}
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
                  value={form.data ? new Date(form.data).toISOString().split("T")[0] : ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, data: new Date(e.target.value) }))}
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

            <div className="overflow-x-auto">
              {tabs.horario === "exibir" && (
                <AgendamentoHorario
                  horarios={horarios}
                  onToggleDisponivel={toggleHorarioDisponivel}
                  onRemoveHorario={handleRemoveHorario}
                />
              )}
            </div>
          </section>

          {/* ---------------- AGENDAMENTOS ---------------- */}
          <section className="bg-[#1F1F1F] rounded-3xl shadow-lg p-4 md:p-6 flex flex-col gap-5">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
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

            <div className="overflow-x-auto">
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
                  agendamentos={agendamentos.map(mapToAgendamento)}
                  onStatusChange={handleUpdateStatusAgendamento}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
