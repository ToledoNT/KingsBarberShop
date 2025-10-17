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
    horarios.forEach((h) => {
      const nome = h.profissional?.nome || "Sem profissional";
      const dataFormatada = formatarData(h.data);

      if (!grouped[nome]) grouped[nome] = {};
      if (!grouped[nome][dataFormatada]) grouped[nome][dataFormatada] = [];
      grouped[nome][dataFormatada].push(h);
    });
    return grouped;
  };

  const horariosPorProfissional = agruparHorarios();

  return (
    <div className="flex flex-col gap-4 max-h-[24rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent p-2">
      {Object.entries(horariosPorProfissional).map(([profissional, dias]) => (
        <div
          key={profissional}
          className="bg-[#2A2A2A] rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300"
        >
          <h2
            className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-3 cursor-pointer select-none flex justify-between items-center"
            onClick={() =>
              setOpenProfissionais((prev) => ({
                ...prev,
                [profissional]: !prev[profissional],
              }))
            }
          >
            <span>{profissional}</span>
            <span className="text-yellow-400 text-sm sm:text-base">
              {openProfissionais[profissional] ? "▲" : "▼"}
            </span>
          </h2>

          {openProfissionais[profissional] &&
            Object.entries(dias).map(([data, horariosDia]) => (
              <div key={data} className="ml-1 sm:ml-4 mb-4">
                <h3 className="font-medium text-yellow-400 mb-2 text-sm sm:text-base">{data}</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {horariosDia.map((h) => (
                    <div
                      key={h.id}
                      className={`flex flex-col justify-between p-2 sm:p-3 rounded-xl shadow hover:shadow-lg transition-all duration-200 ${
                        h.disponivel
                          ? "bg-green-600/20 border border-green-600/30"
                          : "bg-[#2F2F2F] hover:bg-[#3B3B3B]"
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-gray-200 font-medium text-center">
                        {formatarHora(h.inicio)} - {formatarHora(h.fim)}
                      </p>

                      <div className="flex flex-col sm:flex-row justify-between items-center mt-2 sm:mt-3 gap-2 sm:gap-0">
                        <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                          <input
                            type="checkbox"
                            checked={h.disponivel}
                            onChange={() => onToggleDisponivel(h)}
                            className="accent-orange-400 scale-90 sm:scale-100"
                          />
                          Disponível
                        </label>

                        <Button
                          onClick={() => onRemoveHorario(h.id)}
                          variant="secondary"
                          className="text-[0.7rem] sm:text-xs flex items-center justify-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5"
                        >
                          <FaTrash className="text-[0.65rem]" /> Excluir
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
        <p className="text-gray-400 text-sm text-center">Nenhum horário disponível.</p>
      )}
    </div>
  );
};