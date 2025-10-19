"use client";

import React, { useState, useMemo } from "react";
import { AgendamentoHorarioProps, HorarioDisponivel } from "../../interfaces/agendamentoInterface";
import Button from "../ui/Button";
import { FaTrash, FaFilter, FaUser, FaCalendarAlt } from "react-icons/fa";

export const AgendamentoHorario: React.FC<AgendamentoHorarioProps> = ({
  horarios,
  onToggleDisponivel,
  onRemoveHorario,
}) => {
  const [openProfissionais, setOpenProfissionais] = useState<{ [nome: string]: boolean }>({});
  const [filtros, setFiltros] = useState({
    profissional: "todos",
    data: "",
    disponivel: "todos" as "todos" | "disponivel" | "indisponivel"
  });

  const formatarHora = (hora?: string) => hora?.slice(0, 5) || "";
  
  // CORREÇÃO: Função simplificada e correta para formatar data
  const formatarData = (dataISO: string) => {
    if (!dataISO || typeof dataISO !== 'string') return "";
    
    // Se a data já está no formato YYYY-MM-DD (do banco), converte para DD/MM/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) {
      const [ano, mes, dia] = dataISO.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    
    // Para datas que podem vir com timezone do backend
    try {
      const d = new Date(dataISO);
      if (isNaN(d.getTime())) return dataISO;
      
      // CORREÇÃO: Usa UTC para evitar problemas de fuso horário
      const dia = String(d.getUTCDate()).padStart(2, "0");
      const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
      const ano = d.getUTCFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dataISO;
    }
  };

  // CORREÇÃO: Função para comparar datas - versão simplificada
  const datasSaoIguais = (data1: string, data2: string): boolean => {
    if (!data1 || !data2 || typeof data1 !== 'string' || typeof data2 !== 'string') return false;
    
    // Converte ambas para YYYY-MM-DD para comparação
    const normalizarData = (data: string): string => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return data; // Já está no formato correto
      }
      
      try {
        const d = new Date(data);
        if (isNaN(d.getTime())) return '';
        
        // CORREÇÃO: Usa UTC para normalização
        const ano = d.getUTCFullYear();
        const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dia = String(d.getUTCDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
      } catch {
        return '';
      }
    };

    const data1Normalizada = normalizarData(data1);
    const data2Normalizada = normalizarData(data2);
    
    return data1Normalizada === data2Normalizada && data1Normalizada !== '';
  };

  // Filtra e agrupa horários
  const horariosFiltradosEAgrupados = useMemo(() => {
    let horariosFiltrados = horarios;

    // Filtro por profissional
    if (filtros.profissional !== "todos") {
      horariosFiltrados = horariosFiltrados.filter(h => 
        h.profissional?.nome === filtros.profissional
      );
    }

    // Filtro por data
    if (filtros.data) {
      horariosFiltrados = horariosFiltrados.filter(h => 
        datasSaoIguais(h.data, filtros.data)
      );
    }

    // Filtro por disponibilidade
    if (filtros.disponivel !== "todos") {
      const disponivel = filtros.disponivel === "disponivel";
      horariosFiltrados = horariosFiltrados.filter(h => h.disponivel === disponivel);
    }

    // Agrupa por profissional e data
    const grouped: Record<string, Record<string, HorarioDisponivel[]>> = {};
    horariosFiltrados.forEach((h) => {
      const nome = h.profissional?.nome || "Sem profissional";
      const dataFormatada = formatarData(h.data);

      if (!grouped[nome]) grouped[nome] = {};
      if (!grouped[nome][dataFormatada]) grouped[nome][dataFormatada] = [];
      grouped[nome][dataFormatada].push(h);
    });

    return grouped;
  }, [horarios, filtros]);

  // Lista de profissionais únicos para o filtro
  const profissionaisUnicos = useMemo(() => {
    const profissionais = horarios.map(h => h.profissional?.nome).filter(Boolean);
    return [...new Set(profissionais)] as string[];
  }, [horarios]);

  const totalHorarios = Object.values(horariosFiltradosEAgrupados).reduce((total, dias) => 
    total + Object.values(dias).reduce((sum, horarios) => sum + horarios.length, 0), 0
  );

  // Handler para data
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dataSelecionada = e.target.value;
    setFiltros(prev => ({ ...prev, data: dataSelecionada }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="bg-[#2A2A2A] rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FaFilter className="text-orange-400" />
            Filtros
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 flex items-center gap-1">
              <FaUser className="text-orange-400" />
              Profissional
            </label>
            <select
              value={filtros.profissional}
              onChange={(e) => setFiltros(prev => ({ ...prev, profissional: e.target.value }))}
              className="p-2 rounded-lg bg-[#1F1F1F] border border-gray-600 text-sm hover:border-orange-400 transition-colors"
            >
              <option value="todos">Todos os profissionais</option>
              {profissionaisUnicos.map(profissional => (
                <option key={profissional} value={profissional}>{profissional}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 flex items-center gap-1">
              <FaCalendarAlt className="text-orange-400" />
              Data
            </label>
            <input
              type="date"
              value={filtros.data}
              onChange={handleDataChange}
              className="p-2 rounded-lg bg-[#1F1F1F] border border-gray-600 text-sm hover:border-orange-400 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Disponibilidade</label>
            <select
              value={filtros.disponivel}
              onChange={(e) => setFiltros(prev => ({ ...prev, disponivel: e.target.value as any }))}
              className="p-2 rounded-lg bg-[#1F1F1F] border border-gray-600 text-sm hover:border-orange-400 transition-colors"
            >
              <option value="todos">Todos</option>
              <option value="disponivel">Disponíveis</option>
              <option value="indisponivel">Indisponíveis</option>
            </select>
          </div>
        </div>

        {/* Contador e ações */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-gray-700 gap-2">
          <span className="text-xs text-gray-400">
            {totalHorarios} horário{totalHorarios !== 1 ? 's' : ''} encontrado{totalHorarios !== 1 ? 's' : ''}
          </span>
          <Button
            variant="secondary"
            onClick={() => setFiltros({ profissional: "todos", data: "", disponivel: "todos" })}
            className="text-xs"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Lista de Horários */}
      <div className="flex flex-col gap-4 max-h-[24rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent p-2">
        {Object.keys(horariosFiltradosEAgrupados).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">
              {horarios.length === 0 
                ? "Nenhum horário disponível." 
                : "Nenhum horário encontrado com os filtros atuais."
              }
            </p>
          </div>
        ) : (
          Object.entries(horariosFiltradosEAgrupados).map(([profissional, dias]) => (
            <div
              key={profissional}
              className="bg-[#2A2A2A] rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-700"
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
                <span className="flex items-center gap-2">
                  <FaUser className="text-yellow-400" />
                  {profissional}
                  <span className="text-sm text-gray-400 font-normal">
                    ({Object.values(dias).reduce((total, horarios) => total + horarios.length, 0)} horários)
                  </span>
                </span>
                <span className="text-yellow-400 text-sm sm:text-base">
                  {openProfissionais[profissional] ? "▲" : "▼"}
                </span>
              </h2>

              {openProfissionais[profissional] &&
                Object.entries(dias).map(([data, horariosDia]) => (
                  <div key={data} className="ml-1 sm:ml-4 mb-4">
                    <h3 className="font-medium text-yellow-400 mb-2 text-sm sm:text-base flex items-center gap-2">
                      <FaCalendarAlt />
                      {data}
                      <span className="text-xs text-gray-400">({horariosDia.length} horários)</span>
                    </h3>

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
                              className="text-[0.7rem] sm:text-xs flex items-center justify-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 hover:bg-red-600/20 hover:text-red-400 transition-colors"
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
          ))
        )}
      </div>
    </div>
  );
};