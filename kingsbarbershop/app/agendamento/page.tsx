"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import { useAgendamentosAdmin } from "../hook/useAgendamentoAdmin";
import { Agendamento, HorarioDisponivel } from "../interfaces/agendamentoInterface";
import AgendamentoPrivadoForm from "../components/agendamento/AgendamentoPrivadoForm";
import Button from "../components/ui/Button";

export default function CriarAgendamentoPage() {
  const { agendamentos, addAgendamento, updateAgendamento, removeAgendamento } =
    useAgendamentosAdmin();

  const [collapsed, setCollapsed] = useState(false);

  // Horários
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [novoHorario, setNovoHorario] = useState({ barbeiro: "", data: "", inicio: "", fim: "" });
  const [editandoHorario, setEditandoHorario] = useState<string | null>(null);
  const [activeHorarioTab, setActiveHorarioTab] = useState<"exibir" | "criar">("exibir");

  // Agendamentos
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [activeAgendamentoTab, setActiveAgendamentoTab] = useState<"exibir" | "criar">("exibir");

  // --- Funções Horários ---
  const handleAddOrUpdateHorario = () => {
    if (!novoHorario.barbeiro || !novoHorario.data || !novoHorario.inicio || !novoHorario.fim) return;

    if (editandoHorario) {
      setHorarios(prev =>
        prev.map(h => (h.id === editandoHorario ? { ...h, ...novoHorario } : h))
      );
      setEditandoHorario(null);
    } else {
      const id = String(Date.now());
      setHorarios(prev => [...prev, { ...novoHorario, id }]);
    }

    setNovoHorario({ barbeiro: "", data: "", inicio: "", fim: "" });
    setActiveHorarioTab("exibir");
  };

  const handleEditHorario = (h: HorarioDisponivel) => {
    setEditandoHorario(h.id || null);
    setNovoHorario({ barbeiro: h.barbeiro, data: h.data, inicio: h.inicio, fim: h.fim });
    setActiveHorarioTab("criar");
  };

  const handleRemoveHorario = (id: string) => setHorarios(prev => prev.filter(h => h.id !== id));

  // --- Funções Agendamentos ---
  const handleSaveAgendamento = async (a: Agendamento) => {
    if (a.id) await updateAgendamento(a.id, a);
    else await addAgendamento(a);

    setSelectedAgendamento(null);
    setActiveAgendamentoTab("exibir");
  };

  const handleEditAgendamento = (a: Agendamento) => {
    setSelectedAgendamento(a);
    setActiveAgendamentoTab("criar");
  };

  const handleDeleteAgendamento = async (id?: string) => {
    if (!id) return;
    await removeAgendamento(id);
  };

  const handleConcluirAgendamento = async (a: Agendamento) => {
    if (!a.id) return;
    await updateAgendamento(a.id, { ...a, status: "Concluído" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-600 text-white";
      case "Pendente":
        return "bg-yellow-600 text-white";
      case "Cancelado":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`flex-1 h-screen overflow-y-auto p-4 md:p-6 transition-all ${
          collapsed ? "md:ml-12" : "md:ml-24"
        }`}
      >
        <h1 className="text-3xl font-bold text-[#FFA500] mb-6">Painel Administrativo</h1>

        <div className="flex flex-col gap-8">

          {/* Horários Disponíveis */}
          <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 md:p-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeHorarioTab === "exibir" ? "primary" : "secondary"}
                  onClick={() => setActiveHorarioTab("exibir")}
                  fullWidth={false}
                >
                  Exibir Horários
                </Button>
                <Button
                  variant={activeHorarioTab === "criar" ? "primary" : "secondary"}
                  onClick={() => setActiveHorarioTab("criar")}
                  fullWidth={false}
                >
                  Criar Horário
                </Button>
              </div>
              {horarios.length === 0 && activeHorarioTab === "exibir" && (
                <p className="text-gray-400 mt-2 sm:mt-0">Nenhum horário disponível.</p>
              )}
            </div>

            {activeHorarioTab === "exibir" && horarios.length > 0 && (
              <div className="flex flex-col gap-2 mt-4">
                {horarios.map(h => (
                  <div
                    key={h.id}
                    className="bg-[#2A2A2A] rounded-xl p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow hover:shadow-lg transition gap-2"
                  >
                    <div>
                      <p className="font-semibold">{h.barbeiro}</p>
                      <p className="text-gray-400">{h.data} - {h.inicio} às {h.fim}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                      <Button onClick={() => handleEditHorario(h)} variant="primary" className="text-sm">
                        Editar
                      </Button>
                      <Button onClick={() => handleRemoveHorario(h.id!)} variant="secondary" className="text-sm">
                        Deletar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeHorarioTab === "criar" && (
              <div className="bg-[#2A2A2A] rounded-xl p-4 shadow flex flex-col gap-3 mt-4">
                <h3 className="font-semibold text-lg">{editandoHorario ? "Editar Horário" : "Criar Horário"}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    placeholder="Barbeiro"
                    value={novoHorario.barbeiro}
                    onChange={e => setNovoHorario(prev => ({ ...prev, barbeiro: e.target.value }))}
                    className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
                  />
                  <input
                    type="date"
                    value={novoHorario.data}
                    onChange={e => setNovoHorario(prev => ({ ...prev, data: e.target.value }))}
                    className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
                  />
                  <input
                    type="time"
                    value={novoHorario.inicio}
                    onChange={e => setNovoHorario(prev => ({ ...prev, inicio: e.target.value }))}
                    className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
                  />
                  <input
                    type="time"
                    value={novoHorario.fim}
                    onChange={e => setNovoHorario(prev => ({ ...prev, fim: e.target.value }))}
                    className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
                  />
                  <Button onClick={handleAddOrUpdateHorario} variant="primary" fullWidth={false}>
                    {editandoHorario ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Agendamentos */}
          <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 md:p-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeAgendamentoTab === "exibir" ? "primary" : "secondary"}
                  onClick={() => setActiveAgendamentoTab("exibir")}
                  fullWidth={false}
                >
                  Exibir Agendamentos
                </Button>
                <Button
                  variant={activeAgendamentoTab === "criar" ? "primary" : "secondary"}
                  onClick={() => setActiveAgendamentoTab("criar")}
                  fullWidth={false}
                >
                  Criar Agendamento
                </Button>
              </div>
              {agendamentos.length === 0 && activeAgendamentoTab === "exibir" && (
                <p className="text-gray-400 mt-2 sm:mt-0">Nenhum agendamento disponível.</p>
              )}
            </div>

            {/* Formulário */}
            {activeAgendamentoTab === "criar" && (
              <AgendamentoPrivadoForm
                agendamento={selectedAgendamento || undefined}
                onSave={handleSaveAgendamento}
                onCancel={() => setActiveAgendamentoTab("exibir")}
              />
            )}

            {/* Lista de Agendamentos */}
            {activeAgendamentoTab === "exibir" && agendamentos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {agendamentos.map(a => (
                  <div
                    key={a.id}
                    className="bg-[#2A2A2A] rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col gap-3"
                  >
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
                      <Button onClick={() => handleEditAgendamento(a)} variant="primary" className="text-sm">
                        Editar
                      </Button>
                      <Button onClick={() => handleConcluirAgendamento(a)} variant="primary" className="text-sm">
                        Concluir
                      </Button>
                      <Button onClick={() => handleDeleteAgendamento(a.id)} variant="secondary" className="text-sm">
                        Deletar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}