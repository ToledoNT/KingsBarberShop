"use client";

import { useState, useMemo } from "react";
import { AgendamentosTableProps } from "@/app/interfaces/dashboardInterface";
import { motion, AnimatePresence } from "framer-motion";

const formatStatus = (status: string) =>
  status
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const statusClasses: Record<string, string> = {
  cancelado: "bg-red-500 text-white",
  nao_compareceu: "bg-orange-500 text-white",
  em_andamento: "bg-amber-700 text-white",
  agendado: "bg-blue-500 text-white", // azul puro
  concluido: "bg-green-400 text-white",
  pago: "bg-green-600 text-white",
  pendente: "bg-amber-400 text-white",
  default: "bg-gray-600 text-white",
};


const tailwindClasses = `
  bg-red-500 bg-orange-500 bg-amber-700 bg-indigo-400 bg-green-400 bg-green-600 bg-amber-400 bg-gray-600
  text-white
`;

const AgendamentosTable = ({ agendamentos }: AgendamentosTableProps) => {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const agendamentosFiltrados = useMemo(() => {
    return agendamentos
      .filter(
        (a) =>
          filtroStatus === "todos" ||
          formatStatus(a.status) === formatStatus(filtroStatus)
      )
      .filter((a) =>
        [a.nome, a.telefone, a.profissionalNome, a.servicoNome]
          .join(" ")
          .toLowerCase()
          .includes(busca.toLowerCase())
      );
  }, [agendamentos, busca, filtroStatus]);

  const getStatusClass = (status: string) => {
    return statusClasses[formatStatus(status)] || statusClasses.default;
  };

  return (
    <div className="flex-1 flex flex-col gap-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          📋 Agendamentos
          <span className="text-sm text-gray-300 bg-gray-800/40 px-3 py-1 rounded-full shadow-inner">
            {agendamentosFiltrados.length}
          </span>
        </h2>

        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg text-base"
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg text-base"
          >
            <option value="todos">Todos</option>
            {Object.keys(statusClasses)
              .filter((s) => s !== "default")
              .map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden flex flex-col gap-4">
        <AnimatePresence>
          {agendamentosFiltrados.length > 0 ? (
            agendamentosFiltrados.map((a, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-[#1B1B1B] rounded-2xl p-4 shadow-xl border border-gray-700/20 backdrop-blur-sm hover:shadow-amber-400/30 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-extrabold flex items-center justify-center rounded-full shadow-md text-lg">
                      {a.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-white font-bold text-base truncate">
                      {a.nome}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-inner ${getStatusClass(
                      a.status
                    )}`}
                  >
                    {a.status}
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-gray-200 text-sm">
                  <span>
                    📞 <span className="font-medium">{a.telefone}</span>
                  </span>
                  <span>
                    💇 <span className="font-medium">{a.profissionalNome}</span>
                  </span>
                  <span>
                    🗓 <span className="font-medium">{a.data}</span> ⏰{" "}
                    <span className="font-medium">{a.horario}</span>
                  </span>
                  <span>
                    💰 <span className="font-medium">{a.servicoNome}</span> -{" "}
                    <span className="font-bold text-amber-400">
                      R$ {a.servicoPreco.toFixed(2)}
                    </span>
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 text-base">
              Nenhum agendamento encontrado 😶
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-[#111111] rounded-3xl shadow-2xl overflow-hidden text-base">
          <thead className="bg-gray-800/50 backdrop-blur-sm">
            <tr className="text-gray-300 uppercase text-sm tracking-wide">
              {[
                "Cliente",
                "Telefone",
                "Profissional",
                "Data",
                "Horário",
                "Serviço",
                "Valor",
                "Status",
              ].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {agendamentosFiltrados.length > 0 ? (
                agendamentosFiltrados.map((a, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer text-base"
                  >
                    <td className="px-3 py-2 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center rounded-full shadow-md text-sm">
                        {a.nome.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-semibold">{a.nome}</span>
                    </td>
                    <td className="px-3 py-2 text-gray-200 font-mono">{a.telefone}</td>
                    <td className="px-3 py-2 text-gray-200">{a.profissionalNome}</td>
                    <td className="px-3 py-2 text-white font-semibold">{a.data}</td>
                    <td className="px-3 py-2 font-mono text-amber-300">{a.horario}</td>
                    <td className="px-3 py-2 text-gray-200">{a.servicoNome}</td>
                    <td className="px-3 py-2 font-bold text-amber-400">
                      R$ {a.servicoPreco.toFixed(2)}
                    </td>
                    <td
                      className={`px-3 py-1 rounded-full text-sm font-semibold shadow-inner ${getStatusClass(
                        a.status
                      )}`}
                    >
                      {a.status}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 text-base">
                    Nenhum agendamento encontrado 😶
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgendamentosTable;