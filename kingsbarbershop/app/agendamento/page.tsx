"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Table from "@/app/components/ui/Table";
import AgendamentoActions from "@/app/components/ui/AgendamentoActions";
import AgendamentoModal from "../components/ui/AgenteModal";
import Horarios from "../components/ui/Horarios";
import Procedimentos from "../components/ui/Procedimentos";
import { useAgendamentosAdmin } from "../hook/useAgendamentoAdmin";
import { Agendamento, HorarioDisponivel, Procedimento } from "../interfaces/agendamentoInterface";

export default function AgendamentosPage() {
  const {
    agendamentos,
    updateAgendamento,
    removeAgendamento,
    horarios,
    addHorario,
    updateHorario,
    removeHorario,
    procedimentos,
    addProcedimento,
    updateProcedimento,
    removeProcedimento,
    loading,
    error,
  } = useAgendamentosAdmin();

  const [selected, setSelected] = useState<Agendamento | null>(null);

  const [novoHorario, setNovoHorario] = useState<Omit<HorarioDisponivel, "id">>({
    barbeiro: "",
    data: "",
    inicio: "",
    fim: "",
  });

  const [novoProcedimento, setNovoProcedimento] = useState<Omit<Procedimento, "id">>({
    nome: "",
    valor: 0,
  });

  const handleEditAgendamento = (agendamento: Agendamento) => setSelected(agendamento);

  const handleSaveAgendamento = async (updated: Agendamento) => {
    if (!updated.id) return;
    await updateAgendamento(updated.id, updated);
    setSelected(null);
  };

  const handleDeleteAgendamento = async (id?: string) => {
    if (!id) return;
    await removeAgendamento(id);
  };

  const columns = [
    { header: "Cliente", accessor: "nome" },
    { header: "Telefone", accessor: "telefone" },
    { header: "Email", accessor: "email" },
    { header: "Barbeiro", accessor: "barbeiro" },
    { header: "Data", accessor: "data" },
    { header: "Hora", accessor: "hora" },
    { header: "Serviço", accessor: "servico" },
    { header: "Ações", accessor: "acoes" },
  ];

  const tableData = agendamentos.map(a => ({
    ...a,
    acoes: (
      <AgendamentoActions
        onEdit={() => handleEditAgendamento(a)}
        onDelete={() => handleDeleteAgendamento(a.id)}
      />
    ),
  }));

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <Sidebar />

      <main className="flex-1 p-3 flex flex-col gap-3 md:gap-4">
        <h1 className="text-lg md:text-xl font-bold text-[#FFA500] mb-1">
          Gerenciar Agendamentos
        </h1>

        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Lista de Agendamentos */}
        <section className="bg-[#1B1B1B] p-3 md:p-4 rounded-xl shadow overflow-x-auto">
          <h2 className="text-sm md:text-base font-semibold mb-1 text-[#E5E5E5]">
            Lista de Agendamentos
          </h2>
          <Table columns={columns} data={tableData} />
        </section>

        {/* Modal de Edição */}
        {selected && (
          <AgendamentoModal
            agendamento={selected}
            onClose={() => setSelected(null)}
            onSave={handleSaveAgendamento}
            horariosDisponiveis={horarios}
          />
        )}

        {/* Horários Disponíveis */}
        <Horarios
          horarios={horarios}
          novoHorario={novoHorario}
          setNovoHorario={setNovoHorario}
          addHorario={addHorario}
          updateHorario={updateHorario}
          removeHorario={removeHorario}
        />

        {/* Procedimentos */}
        <Procedimentos
          procedimentos={procedimentos}
          novoProcedimento={novoProcedimento}
          setNovoProcedimento={setNovoProcedimento}
          addProcedimento={addProcedimento}
          updateProcedimento={updateProcedimento}
          removeProcedimento={removeProcedimento}
        />
      </main>
    </div>
  );
}