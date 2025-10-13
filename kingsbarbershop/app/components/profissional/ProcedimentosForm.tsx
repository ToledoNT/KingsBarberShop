"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import ProcedimentoCard from "./ProcedimentoCard";
import { Procedimento, ProcedimentosProfissionaisProps } from "@/app/interfaces/profissionaisInterface";

export const ProcedimentosProfissionais: React.FC<ProcedimentosProfissionaisProps> = ({
  procedimentos,
  novoProcedimento,
  setNovoProcedimento,
  addProcedimento,
  updateProcedimento,
  removeProcedimento
}) => {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Função para adicionar ou atualizar procedimento
  const handleSubmit = async () => {
    if (!novoProcedimento.nome || novoProcedimento.valor <= 0 || !novoProcedimento.profissionalId) return;

    setLoading(true);

    try {
      if (editandoId) {
        await updateProcedimento(editandoId, novoProcedimento);
        setEditandoId(null);
      } else {
        await addProcedimento(novoProcedimento);
      }

      setNovoProcedimento({ nome: "", valor: 0, profissionalId: novoProcedimento.profissionalId });
    } catch (err) {
      console.error("Erro ao salvar procedimento:", err);
    } finally {
      setLoading(false);
    }
  };

  // Preparar o formulário para edição
  const handleEdit = (proc: Procedimento) => {
    setNovoProcedimento({ nome: proc.nome, valor: proc.valor, profissionalId: proc.profissionalId });
    setEditandoId(proc.id);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Formulário */}
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          type="text"
          placeholder="Nome do procedimento"
          className="flex-1 p-2 rounded-lg bg-[#1B1B1B] text-white placeholder-gray-400"
          value={novoProcedimento.nome}
          onChange={(e) =>
            setNovoProcedimento({ ...novoProcedimento, nome: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Valor"
          className="w-full sm:w-24 p-2 rounded-lg bg-[#1B1B1B] text-white placeholder-gray-400"
          value={novoProcedimento.valor}
          onChange={(e) =>
            setNovoProcedimento({ ...novoProcedimento, valor: Number(e.target.value) })
          }
        />
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="px-4 py-2 text-sm w-full sm:w-auto"
          disabled={loading}
        >
          {editandoId ? "Atualizar" : "Adicionar"}
        </Button>
      </div>

      {/* Lista de Procedimentos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {procedimentos.length === 0 ? (
          <p className="text-gray-400 text-center">Nenhum procedimento cadastrado.</p>
        ) : (
          procedimentos.map((proc) => (
            <ProcedimentoCard
              key={proc.id}
              procedimento={proc}
              onEdit={handleEdit}
              onDelete={() => removeProcedimento(proc.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
