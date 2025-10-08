"use client";

import React, { useState } from "react";
import Input from "./Input"; // ajuste conforme seu caminho
import Table from "./Table";
import { HorarioDisponivel } from "./AgenteModal";
import { HorariosProps } from "@/app/interfaces/agendamentoInterface";

export default function Horarios({
  horarios,
  novoHorario,
  setNovoHorario,
  addHorario,
  updateHorario,
  removeHorario,
}: HorariosProps) {
  const [editando, setEditando] = useState<string | null>(null);

  const handleAddOrSave = () => {
    if (!novoHorario.barbeiro || !novoHorario.data || !novoHorario.inicio || !novoHorario.fim) return;

    if (editando) {
      updateHorario(editando, novoHorario);
      setEditando(null);
    } else {
      addHorario(novoHorario);
    }

    setNovoHorario({ barbeiro: "", data: "", inicio: "", fim: "" });
  };

  const handleEdit = (h: HorarioDisponivel) => {
    setEditando(h.id || null);
    setNovoHorario({ barbeiro: h.barbeiro, data: h.data, inicio: h.inicio, fim: h.fim });
  };

  const columns = [
    { header: "Barbeiro", accessor: "barbeiro" },
    { header: "Data", accessor: "data" },
    { header: "Início", accessor: "inicio" },
    { header: "Fim", accessor: "fim" },
    { header: "Ações", accessor: "acoes" },
  ];

  const data = horarios.map(h => ({
    ...h,
    acoes: (
      <div className="flex gap-1">
        <button onClick={() => handleEdit(h)} className="px-3 py-1 bg-blue-600 rounded text-xs">Editar</button>
        {h.id && (
          <button onClick={() => removeHorario(h.id)} className="px-3 py-1 bg-red-600 rounded text-xs">Remover</button>
        )}
      </div>
    ),
  }));

  return (
    <section className="bg-[#1B1B1B] p-3 rounded-xl shadow flex flex-col gap-2">
      <h2 className="text-base font-semibold text-[#FFA500]">Horários Disponíveis</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-2">
        <Input
          name="barbeiro"
          type="text"
          value={novoHorario.barbeiro || ""}
          onChange={e => setNovoHorario({ ...novoHorario, barbeiro: e.target.value })}
          placeholder="Barbeiro"
          required
        />
        <Input
          name="data"
          type="date"
          value={novoHorario.data || ""}
          onChange={e => setNovoHorario({ ...novoHorario, data: e.target.value })}
          required
        />
        <Input
          name="inicio"
          type="time"
          value={novoHorario.inicio || ""}
          onChange={e => setNovoHorario({ ...novoHorario, inicio: e.target.value })}
          required
        />
        <Input
          name="fim"
          type="time"
          value={novoHorario.fim || ""}
          onChange={e => setNovoHorario({ ...novoHorario, fim: e.target.value })}
          required
        />
      </div>

      <button onClick={handleAddOrSave} className="bg-green-600 px-4 py-2 rounded text-sm">
        {editando ? "Salvar Alterações" : "Adicionar Horário"}
      </button>

      <Table columns={columns} data={data} />
    </section>
  );
}