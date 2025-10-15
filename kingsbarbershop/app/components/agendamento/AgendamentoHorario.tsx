"use client";

import React, { useState } from "react";
import { AgendamentoHorarioProps, HorarioDisponivel } from "../../interfaces/agendamentoInterface";
import Button from "../ui/Button";
import { FaTrash } from "react-icons/fa";

export const AgendamentoHorario: React.FC<AgendamentoHorarioProps> = ({
  horarios,
  onToggleDisponivel,
  onRemoveHorario,
}) => {
  const [openProfissionais, setOpenProfissionais] = useState<{ [nome: string]: boolean }>({});

  const formatarHora = (hora?: string) => hora?.slice(0, 5) || "";
  const formatarData = (dataISO: string) => {
    if (!dataISO) return "";
    const d = new Date(dataISO);
    if (isNaN(d.getTime())) return dataISO;
    const dia = String(d.getUTCDate()).padStart(2, "0");
    const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
    const ano = d.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Agrupa horários por profissional e por data
  const agruparHorarios = () => {
    const grouped: Record<string, Record<string, HorarioDisponivel[]>> = {};
    horarios.forEach(h => {
      const nome = h.profissional?.nome || "Sem profissional"; // ✅ fallback
      const dataFormatada = formatarData(h.data);

      if (!grouped[nome]) grouped[nome] = {};
      if (!grouped[nome][dataFormatada]) grouped[nome][dataFormatada] = [];
      grouped[nome][dataFormatada].push(h);
    });
    return grouped;
  };

  const horariosPorProfissional = agruparHorarios();

  return (
    <div className="flex flex-col gap-4 max-h-[24rem] overflow-y-auto">
      {Object.entries(horariosPorProfissional).map(([profissional, dias]) => (
        <div key={profissional} className="bg-[#2A2A2A] rounded-2xl p-4 shadow-md hover:shadow-xl transition">
          <h2
            className="text-xl font-semibold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-3 cursor-pointer select-none"
            onClick={() => setOpenProfissionais(prev => ({ ...prev, [profissional]: !prev[profissional] }))}
          >
            {profissional} {openProfissionais[profissional] ? "▲" : "▼"}
          </h2>

          {openProfissionais[profissional] &&
            Object.entries(dias).map(([data, horariosDia]) => (
              <div key={data} className="ml-4 mb-4">
                <h3 className="font-medium text-yellow-400 mb-2">{data}</h3>
                <div className="flex flex-wrap gap-3">
                  {horariosDia.map(h => (
                    <div
                      key={h.id}
                      className={`flex flex-col justify-between p-3 rounded-xl shadow hover:shadow-lg transition ${
                        h.disponivel ? "bg-green-600/20" : "bg-[#2F2F2F] hover:bg-[#3B3B3B]"
                      }`}
                    >
                      <p className="text-sm text-gray-200 font-medium">
                        {formatarHora(h.inicio)} - {formatarHora(h.fim)}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={h.disponivel}
                            // ✅ chama a função de update no hook
                            onChange={() => onToggleDisponivel(h)}
                          />
                          Disponível
                        </label>
                        <Button
                          onClick={() => onRemoveHorario(h.id)}
                          variant="secondary"
                          className="text-xs ml-4 flex items-center gap-1"
                        >
                          <FaTrash /> Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ))}
      {Object.keys(horariosPorProfissional).length === 0 && (
        <p className="text-gray-400">Nenhum horário disponível.</p>
      )}
    </div>
  );
};