"use client";

import { useState, useEffect } from "react";
import { Agendamento, AgendamentoModalProps } from "@/app/interfaces/agendamentoInterface";
import Select from "@/app/components/ui/Select";

export default function AgendamentoModal({
  agendamento,
  onClose,
  onSave,
  horariosDisponiveis = [],
}: AgendamentoModalProps) {
  // Não renderiza modal se não houver agendamento
  if (!agendamento) return null;

  const [localAgendamento, setLocalAgendamento] = useState<Agendamento>(agendamento);

  useEffect(() => {
    setLocalAgendamento(agendamento);
  }, [agendamento]);

  // Filtra horários do barbeiro
  const horariosDoBarbeiro = horariosDisponiveis.filter(
    (h) => h.barbeiro === localAgendamento.barbeiro
  );

  // Transforma em opções para o Select
  const horarioOptions = horariosDoBarbeiro.map((h) => ({
    value: h.inicio,
    label: `${h.data} ${h.inicio} - ${h.fim}`,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#1B1B1B] rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white font-bold text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Editar Agendamento</h2>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(localAgendamento);
          }}
        >
          <input
            type="text"
            value={localAgendamento.nome}
            onChange={(e) =>
              setLocalAgendamento({ ...localAgendamento, nome: e.target.value })
            }
            className="p-2 rounded bg-[#2A2A2A] text-white"
            placeholder="Nome"
            required
          />

          <input
            type="text"
            value={localAgendamento.telefone}
            onChange={(e) =>
              setLocalAgendamento({ ...localAgendamento, telefone: e.target.value })
            }
            className="p-2 rounded bg-[#2A2A2A] text-white"
            placeholder="Telefone"
            required
          />

          <input
            type="email"
            value={localAgendamento.email}
            onChange={(e) =>
              setLocalAgendamento({ ...localAgendamento, email: e.target.value })
            }
            className="p-2 rounded bg-[#2A2A2A] text-white"
            placeholder="Email"
            required
          />

          <input
            type="text"
            value={localAgendamento.barbeiro}
            onChange={(e) =>
              setLocalAgendamento({ ...localAgendamento, barbeiro: e.target.value })
            }
            className="p-2 rounded bg-[#2A2A2A] text-white"
            placeholder="Barbeiro"
            required
          />

          <input
            type="date"
            value={localAgendamento.data}
            onChange={(e) =>
              setLocalAgendamento({ ...localAgendamento, data: e.target.value })
            }
            className="p-2 rounded bg-[#2A2A2A] text-white"
            required
          />

          {/* Select de horários */}
          <Select
            name="hora"
            value={localAgendamento.hora}
            onChange={(e) =>
              setLocalAgendamento({ ...localAgendamento, hora: e.target.value })
            }
            options={horarioOptions}
            placeholder="Selecione o horário"
            required
          />

          <input
            type="text"
            value={localAgendamento.servico}
            onChange={(e) =>
              setLocalAgendamento({ ...localAgendamento, servico: e.target.value })
            }
            className="p-2 rounded bg-[#2A2A2A] text-white"
            placeholder="Serviço"
            required
          />

          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}