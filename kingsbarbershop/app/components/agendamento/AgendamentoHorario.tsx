"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { HorarioDisponivel } from "@/app/interfaces/agendamentoInterface";
import { useAgendamentosAdmin } from "@/app/hook/useAgendamentoAdmin";

export default function Horarios() {
  const { horarios, addHorario, updateHorario, removeHorario, setForm } = useAgendamentosAdmin();

  const [novoHorario, setNovoHorario] = useState<HorarioDisponivel>({
    id: "",
    barbeiro: "",
    data: "",
    inicio: "",
    fim: "",
  });
  const [editandoHorarioId, setEditandoHorarioId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"exibir" | "criar">("exibir");

  const handleAddOrUpdateHorario = async () => {
    if (!novoHorario.barbeiro || !novoHorario.data || !novoHorario.inicio || !novoHorario.fim) return;

    const horarioFormatado: HorarioDisponivel = {
      ...novoHorario,
      id: editandoHorarioId || `${novoHorario.barbeiro}-${novoHorario.data}-${novoHorario.inicio}`,
    };

    try {
      if (editandoHorarioId) {
        await updateHorario(editandoHorarioId, horarioFormatado);
        setEditandoHorarioId(null);
      } else {
        await addHorario(horarioFormatado);
      }

      setNovoHorario({ id: "", barbeiro: "", data: "", inicio: "", fim: "" });
      setActiveTab("exibir");
      setForm({ barbeiro: horarioFormatado.barbeiro, data: horarioFormatado.data });
    } catch (err) {
      console.error("Erro ao salvar horário:", err);
      alert("Não foi possível salvar o horário.");
    }
  };

  const handleEditHorario = (h: HorarioDisponivel) => {
    setEditandoHorarioId(h.id || null);
    setNovoHorario(h);
    setActiveTab("criar");
  };

  const handleRemoveHorario = async (id: string) => {
    try {
      await removeHorario(id);
    } catch (err) {
      console.error("Erro ao remover horário:", err);
      alert("Não foi possível remover o horário.");
    }
  };

  return (
    <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 md:p-6 flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeTab === "exibir" ? "primary" : "secondary"}
          onClick={() => setActiveTab("exibir")}
        >
          Exibir Horários
        </Button>
        <Button
          variant={activeTab === "criar" ? "primary" : "secondary"}
          onClick={() => setActiveTab("criar")}
        >
          Criar Horário
        </Button>
      </div>

      {activeTab === "exibir" && (
        <div className="flex flex-col gap-2 mt-4">
          {horarios.length === 0 ? (
            <p className="text-gray-400">Nenhum horário disponível.</p>
          ) : (
            horarios.map((h) => (
              <div
                key={h.id}
                className="bg-[#2A2A2A] rounded-xl p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow hover:shadow-lg transition gap-2"
              >
                <div>
                  <p className="font-semibold">{h.barbeiro}</p>
                  <p className="text-gray-400">
                    {h.data} - {h.inicio} às {h.fim}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                  <Button onClick={() => handleEditHorario(h)} variant="primary" className="text-sm">
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleRemoveHorario(h.id!)}
                    variant="secondary"
                    className="text-sm"
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "criar" && (
        <div className="bg-[#2A2A2A] rounded-xl p-4 shadow flex flex-col gap-3 mt-4">
          <h3 className="font-semibold text-lg">{editandoHorarioId ? "Editar Horário" : "Criar Horário"}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Barbeiro"
              value={novoHorario.barbeiro}
              onChange={(e) => setNovoHorario((prev) => ({ ...prev, barbeiro: e.target.value }))}
              className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
            />
            <input
              type="date"
              value={novoHorario.data}
              onChange={(e) => setNovoHorario((prev) => ({ ...prev, data: e.target.value }))}
              className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
            />
            {/* Forçar formato 24h */}
            <input
              type="time"
              value={novoHorario.inicio}
              onChange={(e) => setNovoHorario((prev) => ({ ...prev, inicio: e.target.value }))}
              className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
              step={60} // força minutos inteiros e 24h
            />
            <input
              type="time"
              value={novoHorario.fim}
              onChange={(e) => setNovoHorario((prev) => ({ ...prev, fim: e.target.value }))}
              className="flex-1 p-2 rounded bg-[#1B1B1B] border border-gray-700"
              step={60} // força minutos inteiros e 24h
            />
            <Button onClick={handleAddOrUpdateHorario} variant="primary" fullWidth={false}>
              {editandoHorarioId ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}