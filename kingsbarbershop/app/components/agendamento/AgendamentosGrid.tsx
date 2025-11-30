"use client";

import { Agendamento, AgendamentosGridProps, StatusAgendamento } from "../../interfaces/agendamentoInterface";
import { Toaster } from "react-hot-toast";

export function AgendamentosGrid({ agendamentos, onStatusChange }: AgendamentosGridProps) {
  // Formata data para dd/mm/yyyy
  const formatarData = (dataISO?: string | null) => {
    if (!dataISO) return "—";
    const d = new Date(dataISO);
    if (isNaN(d.getTime())) return dataISO;
    const dataLocal = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    const dia = String(dataLocal.getDate()).padStart(2, "0");
    const mes = String(dataLocal.getMonth() + 1).padStart(2, "0");
    const ano = dataLocal.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Formata horário
  const formatarHorario = (inicio?: string | null, fim?: string | null) => {
    if (!inicio && !fim) return "—";
    if (inicio && fim) return `${inicio} às ${fim}`;
    return inicio || fim || "—";
  };

  // Retorna cor do status
  const getStatusColor = (status?: StatusAgendamento) => {
    switch (status) {
      case StatusAgendamento.PENDENTE:
        return "bg-yellow-400 text-black border-yellow-400"; // PENDENTE mais chamativo
      case StatusAgendamento.AGENDADO:
        return "bg-blue-600 text-white border-blue-600";
      case StatusAgendamento.EM_ANDAMENTO:
        return "bg-orange-500 text-white border-orange-500";
      case StatusAgendamento.CONCLUIDO:
        return "bg-green-600 text-white border-green-600";
      case StatusAgendamento.CANCELADO:
        return "bg-red-600 text-white border-red-600";
      case StatusAgendamento.NAO_COMPARECEU:
        return "bg-gray-700 text-white border-gray-700";
      default:
        return "bg-gray-500 text-white border-gray-500";
    }
  };

  // Opções de status para select
  const statusOptions = Object.values(StatusAgendamento).map((s) => ({
    value: s,
    label: s,
  }));

  // Status finais (não podem mais ser alterados)
  const statusFinais = [
    StatusAgendamento.CONCLUIDO,
    StatusAgendamento.CANCELADO,
    StatusAgendamento.NAO_COMPARECEU,
  ];

  // Altera status (respeitando status finais)
  const handleStatusChange = (agendamento: Agendamento, novoStatus: StatusAgendamento) => {
    if (agendamento.status && statusFinais.includes(agendamento.status)) return;
    onStatusChange?.(agendamento.id!, novoStatus);
  };

  if (agendamentos.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl bg-gray-900/30 backdrop-blur-sm mt-3">
        <div className="text-6xl mb-4 opacity-60">📅</div>
        <p className="text-lg font-semibold text-gray-300 mb-3">Nenhum agendamento encontrado</p>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Não há agendamentos para exibir com os filtros atuais
        </p>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-3">
        {agendamentos.map((a) => {
          if (!a.id) return null;
          const statusAtual = a.status || StatusAgendamento.AGENDADO;
          const isStatusFinal = statusFinais.includes(statusAtual);

          return (
            <div
              key={a.id}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl flex flex-col justify-between gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg sm:text-xl truncate">{a.nome || "—"}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {formatarData(a.data)} • {formatarHorario(a.inicio, a.fim)}
                  </p>
                </div>
                {isStatusFinal && (
                  <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-lg flex items-center gap-1 flex-shrink-0 ml-2">
                    🔒 Finalizado
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-300 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#FFA500]">📞</span>
                  <span>{a.telefone || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FFA500]">📧</span>
                  <span className="truncate">{a.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FFA500]">👤</span>
                  <span>{a.profissionalNome || a.barbeiro || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FFA500]">💼</span>
                  <span className="flex-1">{a.servicoNome || a.servico || "—"}</span>
                  <span className="text-green-400 font-semibold text-sm bg-green-500/10 px-2 py-1 rounded-lg">
                    R$ {(a.servicoPreco ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {onStatusChange && (
                <div className="flex justify-end pt-3 border-t border-gray-700">
                  <select
                    name={`status-${a.id}`}
                    value={statusAtual}
                    onChange={(e) => handleStatusChange(a, e.target.value as StatusAgendamento)}
                    disabled={isStatusFinal}
                    className={`px-3 py-2 rounded-lg font-medium border text-sm text-center transition-all duration-300 backdrop-blur-sm ${
                      getStatusColor(statusAtual)
                    } ${
                      isStatusFinal ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    {statusOptions.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className={getStatusColor(opt.value as StatusAgendamento)}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}