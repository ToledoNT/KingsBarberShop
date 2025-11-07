"use client";

import React, { useState, useMemo } from "react";
import { AgendamentoHorarioProps, HorarioDisponivel } from "../../interfaces/agendamentoInterface";
import Button from "../ui/Button";
import { FaTrash, FaUser, FaCalendarAlt } from "react-icons/fa";

export const AgendamentoHorario: React.FC<AgendamentoHorarioProps> = ({
  horarios,
  onToggleDisponivel,
  onRemoveHorario,
}) => {
  const [openProfissionais, setOpenProfissionais] = useState<{ [nome: string]: boolean }>({});
  const [filtros, setFiltros] = useState({
    profissional: "todos",
    data: "",
    disponivel: "todos" as "todos" | "disponivel" | "indisponivel",
  });

  const formatarHora = (hora?: string) => hora?.slice(0, 5) || "";

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) {
      const [ano, mes, dia] = dataISO.split("-");
      return `${dia}/${mes}/${ano}`;
    }
    try {
      const d = new Date(dataISO);
      if (isNaN(d.getTime())) return dataISO;
      const dia = String(d.getUTCDate()).padStart(2, "0");
      const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
      const ano = d.getUTCFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch {
      return dataISO;
    }
  };

  const datasSaoIguais = (data1: string, data2: string) => {
    if (!data1 || !data2) return false;
    const normalizarData = (d: string) =>
      /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : new Date(d).toISOString().split("T")[0];
    return normalizarData(data1) === normalizarData(data2);
  };

  const horariosFiltradosEAgrupados = useMemo(() => {
    let horariosFiltrados = horarios;

    // FILTROS
    if (filtros.profissional !== "todos") {
      horariosFiltrados = horariosFiltrados.filter(
        (h) => h.profissional?.nome === filtros.profissional
      );
    }
    if (filtros.data) {
      horariosFiltrados = horariosFiltrados.filter((h) =>
        datasSaoIguais(h.data, filtros.data)
      );
    }
    if (filtros.disponivel !== "todos") {
      const disponivel = filtros.disponivel === "disponivel";
      horariosFiltrados = horariosFiltrados.filter((h) => h.disponivel === disponivel);
    }

    // AGRUPAR POR PROFISSIONAL E DATA
    const grouped: Record<string, Record<string, HorarioDisponivel[]>> = {};
    horariosFiltrados.forEach((h) => {
      const nome = h.profissional?.nome || "Sem profissional";
      const dataFormatada = formatarData(h.data);
      if (!grouped[nome]) grouped[nome] = {};
      if (!grouped[nome][dataFormatada]) grouped[nome][dataFormatada] = [];
      grouped[nome][dataFormatada].push(h);
    });

    // ORDENAR HORÁRIOS POR HORA DE INÍCIO
    Object.values(grouped).forEach((dias) => {
      Object.values(dias).forEach((horariosDia) => {
        horariosDia.sort((a, b) => {
          const inicioA = a.inicio || "";
          const inicioB = b.inicio || "";
          return inicioA.localeCompare(inicioB);
        });
      });
    });

    return grouped;
  }, [horarios, filtros]);

  const profissionaisUnicos = useMemo(
    () => [...new Set(horarios.map((h) => h.profissional?.nome).filter(Boolean) as string[])],
    [horarios]
  );

  const totalHorarios = Object.values(horariosFiltradosEAgrupados).reduce(
    (total, dias) => total + Object.values(dias).reduce((sum, h) => sum + h.length, 0),
    0
  );

  const resetFiltros = () => {
    setFiltros({ profissional: "todos", data: "", disponivel: "todos" });
    setOpenProfissionais({});
  };

  return (
    <div className="space-y-6">
      {/* ---------------- FILTROS ---------------- */}
      <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="text-[#FFA500] text-lg">🎯</div>
            <h3 className="text-white font-semibold text-lg">Filtros</h3>
          </div>
          <Button
            variant="secondary"
            onClick={resetFiltros}
            className="px-4 py-2 text-sm"
          >
            <span className="mr-2">🔄</span>
            Limpar Filtros
          </Button>
        </div>

        {/* Grid de filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profissional */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
              <FaUser className="text-[#FFA500]" />
              Profissional
            </label>
            <select
              value={filtros.profissional}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, profissional: e.target.value }))
              }
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
            >
              <option value="todos">Todos os profissionais</option>
              {profissionaisUnicos.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
              <FaCalendarAlt className="text-[#FFA500]" />
              Data
            </label>
            <input
              type="date"
              value={filtros.data}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, data: e.target.value }))
              }
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
            />
          </div>

          {/* Disponibilidade */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Disponibilidade
            </label>
            <select
              value={filtros.disponivel}
              onChange={(e) =>
                setFiltros((prev) => ({
                  ...prev,
                  disponivel: e.target.value as any,
                }))
              }
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
            >
              <option value="todos">Todos</option>
              <option value="disponivel">Disponíveis</option>
              <option value="indisponivel">Indisponíveis</option>
            </select>
          </div>
        </div>

        {/* Contador */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Mostrando{" "}
            <span className="text-white font-semibold">{totalHorarios}</span>{" "}
            horário{totalHorarios !== 1 ? "s" : ""}
          </div>
          <div className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-lg">
            Total: {horarios.length}
          </div>
        </div>
      </div>

      {/* ---------------- HORÁRIOS ---------------- */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar scroll-smooth">
        {Object.keys(horariosFiltradosEAgrupados).length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl bg-gray-900/30 backdrop-blur-sm">
            <div className="text-6xl mb-4 opacity-60">📅</div>
            <p className="text-lg font-semibold text-gray-300 mb-3">
              {horarios.length === 0
                ? "Nenhum horário disponível"
                : "Nenhum horário encontrado"}
            </p>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              {horarios.length === 0
                ? "Comece adicionando horários ao sistema"
                : "Tente ajustar os filtros para ver mais resultados"}
            </p>
          </div>
        ) : (
          Object.entries(horariosFiltradosEAgrupados).map(([profissional, dias]) => (
            <div
              key={profissional}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
            >
              {/* Header do Profissional */}
              <div
                className="flex justify-between items-center cursor-pointer select-none mb-4"
                onClick={() =>
                  setOpenProfissionais((prev) => ({
                    ...prev,
                    [profissional]: !prev[profissional],
                  }))
                }
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#FFA500] text-xl">👤</div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">{profissional}</h2>
                    <p className="text-gray-400 text-sm">
                      {Object.values(dias).reduce(
                        (total, horarios) => total + horarios.length,
                        0
                      )}{" "}
                      horário
                      {Object.values(dias).reduce(
                        (total, horarios) => total + horarios.length,
                        0
                      ) !== 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="text-[#FFA500] text-lg">
                  {openProfissionais[profissional] ? "▲" : "▼"}
                </div>
              </div>

              {/* Lista de Horários */}
              {openProfissionais[profissional] && (
                <div className="space-y-4">
                  {Object.entries(dias).map(([data, horariosDia]) => (
                    <div key={data} className="border-l-2 border-[#FFA500] pl-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-[#FFA500]">📅</div>
                        <h3 className="font-semibold text-white text-sm sm:text-base">{data}</h3>
                        <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg">
                          {horariosDia.length} horário{horariosDia.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {horariosDia.map((h) => (
                          <div
                            key={h.id}
                            className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                              h.disponivel
                                ? "bg-green-600/10 border-green-500/30 hover:border-green-500/50"
                                : "bg-gray-800/30 border-gray-600 hover:border-gray-500"
                            }`}
                          >
                            <div className="text-center mb-3">
                              <p className="text-white font-semibold text-sm sm:text-base">
                                {formatarHora(h.inicio)} - {formatarHora(h.fim)}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer flex-1">
                                <input
                                  type="checkbox"
                                  checked={h.disponivel}
                                  onChange={() => onToggleDisponivel(h)}
                                  className="accent-[#FFA500] scale-110"
                                />
                                <span
                                  className={h.disponivel ? "text-green-400" : "text-gray-400"}
                                >
                                  {h.disponivel ? "Disponível" : "Indisponível"}
                                </span>
                              </label>

                              <Button
                                onClick={() => onRemoveHorario(h.id)}
                                variant="secondary"
                                className="px-2 py-1 text-xs hover:bg-red-600/20 hover:text-red-400 transition-colors flex items-center gap-1"
                              >
                                <FaTrash className="text-[0.65rem]" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};