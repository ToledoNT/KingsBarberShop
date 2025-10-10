"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import { useAgendamentosAdmin } from "../hook/useAgendamentoAdmin";
import { Agendamento, HorarioDisponivel, StatusAgendamento } from "../interfaces/agendamentoInterface";
import AgendamentoPrivadoForm from "../components/agendamento/AgendamentoPrivadoForm";
import Button from "../components/ui/Button";

export default function CriarAgendamentoPage() {
  const {
    agendamentos,
    addAgendamento,
    updateAgendamento,
    removeAgendamento,
    horarios,
    addHorario,
    updateHorario,
    removeHorario,
  } = useAgendamentosAdmin();

  const [collapsed, setCollapsed] = useState(false);
  const [activeAgendamentoTab, setActiveAgendamentoTab] = useState<"exibir" | "criar">("exibir");
  const [activeHorarioTab, setActiveHorarioTab] = useState<"exibir" | "criar">("exibir");
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);

  const [novoHorario, setNovoHorario] = useState<HorarioDisponivel>({
    id: "",
    barbeiro: "",
    data: "",
    inicio: "",
    fim: "",
  });
  const [editandoHorarioId, setEditandoHorarioId] = useState<string | null>(null);

  // --- Funções Horários ---
  const handleAddOrUpdateHorario = async () => {
    if (!novoHorario.barbeiro || !novoHorario.data || !novoHorario.inicio || !novoHorario.fim) return;

    const horarioFormatado: HorarioDisponivel = {
      ...novoHorario,
      id: editandoHorarioId || String(Date.now()),
    };

    try {
      if (editandoHorarioId) await updateHorario(editandoHorarioId, horarioFormatado);
      else await addHorario(horarioFormatado);

      setNovoHorario({ id: "", barbeiro: "", data: "", inicio: "", fim: "" });
      setEditandoHorarioId(null);
      setActiveHorarioTab("exibir");
    } catch (err) {
      console.error("Erro ao salvar horário:", err);
      alert("Não foi possível salvar o horário.");
    }
  };

  const handleEditHorario = (h: HorarioDisponivel) => {
    setEditandoHorarioId(h.id || null);
    setNovoHorario(h);
    setActiveHorarioTab("criar");
  };

  const handleRemoveHorario = async (id: string) => {
    try {
      await removeHorario(id);
    } catch (err) {
      console.error("Erro ao remover horário:", err);
      alert("Não foi possível remover o horário.");
    }
  };

  // --- Funções Agendamento ---
  const handleSaveAgendamento = async (a: Agendamento) => {
    try {
      if (a.id) await updateAgendamento(a.id, a);
      else await addAgendamento(a);

      setSelectedAgendamento(null);
      setActiveAgendamentoTab("exibir");
    } catch (err) {
      console.error("Erro ao salvar agendamento:", err);
      alert("Não foi possível salvar o agendamento.");
    }
  };

  const handleEditAgendamento = (a: Agendamento) => {
    setSelectedAgendamento(a);
    setActiveAgendamentoTab("criar");
  };

  const handleDeleteAgendamento = async (id?: string) => {
    if (!id) return;
    try {
      await removeAgendamento(id);
    } catch (err) {
      console.error("Erro ao deletar agendamento:", err);
      alert("Não foi possível deletar o agendamento.");
    }
  };

  const handleConcluirAgendamento = async (a: Agendamento) => {
    if (!a.id) return;
    try {
      await updateAgendamento(a.id, { ...a, status: StatusAgendamento.CONCLUIDO });
    } catch (err) {
      console.error("Erro ao concluir agendamento:", err);
      alert("Não foi possível concluir o agendamento.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído": return "bg-green-600 text-white";
      case "Pendente": return "bg-yellow-600 text-white";
      case "Cancelado": return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`flex-1 h-screen overflow-y-auto p-4 md:p-6 transition-all ${collapsed ? "md:ml-12" : "md:ml-24"}`}>
        <h1 className="text-3xl font-bold text-[#FFA500] mb-6">Painel Administrativo</h1>

        <div className="flex flex-col gap-8">
          {/* Horários */}
          <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 md:p-6 flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant={activeHorarioTab === "exibir" ? "primary" : "secondary"} onClick={() => setActiveHorarioTab("exibir")}>Exibir Horários</Button>
              <Button variant={activeHorarioTab === "criar" ? "primary" : "secondary"} onClick={() => setActiveHorarioTab("criar")}>Criar Horário</Button>
            </div>

            {activeHorarioTab === "exibir" && (
              <div className="flex flex-col gap-2 mt-4">
                {horarios.length === 0 ? (
                  <p className="text-gray-400">Nenhum horário disponível.</p>
                ) : (
                  horarios.map(h => (
                    <div key={h.id} className="bg-[#2A2A2A] rounded-xl p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow hover:shadow-lg transition gap-2">
                      <div>
                        <p className="font-semibold">{h.barbeiro}</p>
                        <p className="text-gray-400">{h.data} - {h.inicio} às {h.fim}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                        <Button onClick={() => handleEditHorario(h)} variant="primary" className="text-sm">Editar</Button>
                        <Button onClick={() => handleRemoveHorario(h.id!)} variant="secondary" className="text-sm">Deletar</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeHorarioTab === "criar" && (
              <div className="bg-[#2A2A2A] rounded-xl p-4 shadow flex flex-col gap-3 mt-4">
                <h3 className="font-semibold text-lg">{editandoHorarioId ? "Editar Horário" : "Criar Horário"}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    placeholder="Barbeiro"
                    value={novoHorario.barbeiro}
                    onChange={(e) => setNovoHorario(prev => ({ ...prev, barbeiro: e.target.value }))}
                    className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
                  />
                  <input
                    type="date"
                    value={novoHorario.data}
                    onChange={(e) => setNovoHorario(prev => ({ ...prev, data: e.target.value }))}
                    className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
                  />
                  <input
                    type="time"
                    value={novoHorario.inicio}
                    onChange={(e) => setNovoHorario(prev => ({ ...prev, inicio: e.target.value }))}
                    className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
                  />
                  <input
                    type="time"
                    value={novoHorario.fim}
                    onChange={(e) => setNovoHorario(prev => ({ ...prev, fim: e.target.value }))}
                    className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
                  />
                  <Button onClick={handleAddOrUpdateHorario} variant="primary" fullWidth={false}>
                    {editandoHorarioId ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Agendamentos */}
          <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 md:p-6 flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant={activeAgendamentoTab === "exibir" ? "primary" : "secondary"} onClick={() => setActiveAgendamentoTab("exibir")}>Exibir Agendamentos</Button>
              <Button variant={activeAgendamentoTab === "criar" ? "primary" : "secondary"} onClick={() => setActiveAgendamentoTab("criar")}>Criar Agendamento</Button>
            </div>

            {activeAgendamentoTab === "criar" && (
              <AgendamentoPrivadoForm
                agendamento={selectedAgendamento || undefined}
                onSave={handleSaveAgendamento}
                onCancel={() => setActiveAgendamentoTab("exibir")}
              />
            )}

            {activeAgendamentoTab === "exibir" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {agendamentos.length === 0 ? (
                  <p className="text-gray-400">Nenhum agendamento disponível.</p>
                ) : (
                  agendamentos.map(a => (
                    <div key={a.id} className="bg-[#2A2A2A] rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <h3 className="font-semibold text-lg">{a.nome}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(a.status || "Pendente")}`}>
                          {a.status || "Pendente"}
                        </div>
                      </div>
                      <p className="text-gray-400">{a.barbeiro}</p>
                      <p>{a.data} - {a.hora}</p>
                      <p>{a.servico}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Button onClick={() => handleEditAgendamento(a)} variant="primary" className="text-sm">Editar</Button>
                        <Button onClick={() => handleConcluirAgendamento(a)} variant="primary" className="text-sm">Concluir</Button>
                        <Button onClick={() => handleDeleteAgendamento(a.id)} variant="secondary" className="text-sm">Deletar</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}