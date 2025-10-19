"use client";

import { Agendamento, AgendamentosGridProps, StatusAgendamento } from "../../interfaces/agendamentoInterface";
import { Toaster, toast } from "react-hot-toast";

export function AgendamentosGrid({ agendamentos, onStatusChange }: AgendamentosGridProps) {
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

  const formatarHorario = (inicio?: string | null, fim?: string | null) => {
    if (!inicio && !fim) return "—";
    if (inicio && fim) return `${inicio} às ${fim}`;
    return inicio || fim || "—";
  };

  const getStatusColor = (status?: StatusAgendamento) => {
    switch (status) {
      case StatusAgendamento.AGENDADO: return "bg-blue-600 text-white border-blue-600";
      case StatusAgendamento.EM_ANDAMENTO: return "bg-orange-500 text-white border-orange-500";
      case StatusAgendamento.CONCLUIDO: return "bg-green-600 text-white border-green-600";
      case StatusAgendamento.CANCELADO: return "bg-red-600 text-white border-red-600";
      case StatusAgendamento.NAO_COMPARECEU: return "bg-gray-700 text-white border-gray-700";
      default: return "bg-gray-500 text-white border-gray-500";
    }
  };

  const statusOptions = Object.values(StatusAgendamento)
    .filter((s) => s !== StatusAgendamento.PENDENTE)
    .map((s) => ({ value: s, label: s }));

  // Status que quando atingidos, bloqueiam alterações
  const statusFinais = [
    StatusAgendamento.CONCLUIDO,
    StatusAgendamento.CANCELADO,
    StatusAgendamento.NAO_COMPARECEU
  ];

  const handleStatusChange = (agendamento: Agendamento, novoStatus: StatusAgendamento) => {
    // Se o status atual já é final, não permite mudança
    if (agendamento.status && statusFinais.includes(agendamento.status)) {
      return;
    }

    if (novoStatus === StatusAgendamento.CONCLUIDO || novoStatus === StatusAgendamento.CANCELADO || novoStatus === StatusAgendamento.NAO_COMPARECEU) {
      const acao = 
        novoStatus === StatusAgendamento.CONCLUIDO ? "concluir" :
        novoStatus === StatusAgendamento.CANCELADO ? "cancelar" :
        "marcar como não compareceu";
      
      toast.custom((t) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/50">
          <div className="bg-[#1F1F1F] text-white p-6 rounded-xl shadow-xl flex flex-col gap-4 w-96">
            <p className="text-center text-lg font-semibold">
              Deseja {acao} o agendamento do <strong>{agendamento.nome}</strong>?
            </p>

            <div className="flex justify-center gap-4 mt-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded-md transition"
                onClick={() => toast.dismiss(t.id)}
              >
                Cancelar
              </button>
              <button
                className={`px-4 py-2 rounded-md transition ${
                  novoStatus === StatusAgendamento.CONCLUIDO
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : novoStatus === StatusAgendamento.CANCELADO
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
                onClick={() => {
                  onStatusChange?.(agendamento.id!, novoStatus);
                  toast.dismiss(t.id);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      ), { duration: Infinity });
    } else {
      onStatusChange?.(agendamento.id!, novoStatus);
    }
  };

  if (agendamentos.length === 0) {
    return <p className="text-gray-400 mt-3">Nenhum agendamento encontrado.</p>;
  }

  return (
    <>
      <Toaster />
      <div className="text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
        {agendamentos.map((a) => {
          if (!a.id) return null;
          const statusAtual = a.status || StatusAgendamento.AGENDADO;
          
          // Verifica se o status atual é final (bloqueado)
          const isStatusFinal = statusFinais.includes(statusAtual);

          return (
            <div
              key={a.id}
              className="bg-[#2A2A2A] rounded-2xl shadow-md p-5 flex flex-col justify-between gap-4 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  {a.nome || "—"}
                </h3>
                {isStatusFinal && (
                  <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-md">
                    🔒 Finalizado
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 text-sm text-gray-300">
                <p><strong>Telefone:</strong> {a.telefone || "—"}</p>
                <p><strong>Email:</strong> {a.email || "—"}</p>
                <p><strong>Profissional:</strong> {a.profissionalNome || a.barbeiro || "—"}</p>
                <p><strong>Data:</strong> {formatarData(a.data)}</p>
                <p><strong>Horário:</strong> {formatarHorario(a.inicio, a.fim)}</p>
                <p>
                  <strong>Serviço:</strong> {a.servicoNome || a.servico || "—"} —{" "}
                  <span className="text-green-400">R$ {(a.servicoPreco ?? 0).toFixed(2)}</span>
                </p>
              </div>

              {onStatusChange && (
                <div className="flex justify-end">
                  <select
                    name={`status-${a.id}`}
                    value={statusAtual}
                    onChange={(e) => handleStatusChange(a, e.target.value as StatusAgendamento)}
                    disabled={isStatusFinal}
                    className={`w-36 px-3 py-2 rounded-lg font-medium border text-sm text-center transition-colors duration-200 ${
                      getStatusColor(statusAtual)
                    } ${
                      isStatusFinal 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:opacity-90'
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