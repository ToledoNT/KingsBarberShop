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
    <div className="space-y-6 w-full">
      {/* Formulário */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Nome do Procedimento
            </label>
            <input
              type="text"
              placeholder="Digite o nome do procedimento"
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
              value={novoProcedimento.nome}
              onChange={(e) =>
                setNovoProcedimento({ ...novoProcedimento, nome: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Valor (R$)
            </label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
              value={novoProcedimento.valor}
              onChange={(e) =>
                setNovoProcedimento({ ...novoProcedimento, valor: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2 flex flex-col justify-end">
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="px-6 py-3 text-sm sm:text-base font-medium w-full justify-center"
              disabled={loading || !novoProcedimento.nome || novoProcedimento.valor <= 0}
            >
              <span className="mr-2">{editandoId ? "💾" : "➕"}</span>
              {editandoId ? "Atualizar" : "Adicionar"} Procedimento
            </Button>
          </div>
        </div>

        {/* Mensagem de validação */}
        {(!novoProcedimento.nome || novoProcedimento.valor <= 0) && (
          <div className="text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg border border-gray-700">
            ⚠️ Preencha o nome e um valor maior que zero para adicionar
          </div>
        )}
      </div>

      {/* Lista de Procedimentos */}
      <div className="border-t border-gray-700 pt-6">
        <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-[#FFA500]">📋</span>
          Procedimentos Cadastrados
          <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg ml-2">
            {procedimentos.length}
          </span>
        </h4>

        {procedimentos.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-xl bg-gray-900/30 backdrop-blur-sm">
            <div className="text-4xl mb-3 opacity-60">📋</div>
            <p className="text-gray-400 text-sm">Nenhum procedimento cadastrado</p>
            <p className="text-gray-500 text-xs mt-1">Adicione o primeiro procedimento acima</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {procedimentos.map((proc) => (
              <ProcedimentoCard
                key={proc.id}
                procedimento={proc}
                onEdit={handleEdit}
                onDelete={() => removeProcedimento(proc.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};