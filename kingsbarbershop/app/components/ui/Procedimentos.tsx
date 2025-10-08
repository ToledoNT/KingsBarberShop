"use client";

import React, { useState } from "react";
import Table from "./Table";
import Input from "./Input";
import { Procedimento, ProcedimentosProps } from "@/app/interfaces/procedimenttosInterface";

export default function Procedimentos({
  procedimentos,
  novoProcedimento,
  setNovoProcedimento,
  addProcedimento,
  updateProcedimento,
  removeProcedimento,
}: ProcedimentosProps) {
  const [editando, setEditando] = useState<string | null>(null);

  const handleAddOrSave = () => {
    if (!novoProcedimento.nome || novoProcedimento.valor === undefined) return;

    if (editando) {
      updateProcedimento(editando, novoProcedimento);
      setEditando(null);
    } else {
      addProcedimento(novoProcedimento);
    }

    setNovoProcedimento({ nome: "", valor: 0 });
  };

  const handleEdit = (p: Procedimento) => {
    if (!p.id) return;
    setEditando(p.id);
    setNovoProcedimento({ nome: p.nome, valor: p.valor });
  };

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Valor", accessor: "valor" },
    { header: "Ações", accessor: "acoes" },
  ];

  const data = procedimentos.map(p => ({
    ...p,
    acoes: (
      <div className="flex gap-1">
        <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-blue-600 rounded text-xs">Editar</button>
        <button onClick={() => p.id && removeProcedimento(p.id)} className="px-3 py-1 bg-red-600 rounded text-xs">Remover</button>
      </div>
    ),
  }));

  return (
    <section className="bg-[#1B1B1B] p-3 rounded-xl shadow flex flex-col gap-2">
      <h2 className="text-base font-semibold text-[#FFA500]">Procedimentos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        <Input
          name="nome"
          value={novoProcedimento.nome || ""}
          onChange={e => setNovoProcedimento({ ...novoProcedimento, nome: e.target.value })}
          placeholder="Nome do Procedimento"
          required
        />
        <Input
          name="valor"
          type="number"
          value={novoProcedimento.valor || 0}
          onChange={e => setNovoProcedimento({ ...novoProcedimento, valor: Number(e.target.value) })}
          placeholder="Valor"
          required
        />
      </div>

      <button
        onClick={handleAddOrSave}
        className="bg-green-600 px-4 py-2 rounded text-sm"
      >
        {editando ? "Salvar Alterações" : "Adicionar Procedimento"}
      </button>

      <Table columns={columns} data={data} />
    </section>
  );
}