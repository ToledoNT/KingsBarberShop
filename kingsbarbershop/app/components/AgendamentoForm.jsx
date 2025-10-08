"use client";

import { useState, useEffect } from "react";
import Button from "./Button";

const barbeiros = [
  { nome: "João", horarios: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
  { nome: "Carlos", horarios: ["10:00", "11:30", "13:00", "16:00"] },
  { nome: "Ana", horarios: ["09:30", "12:00", "15:00", "17:00"] },
];

const horariosOcupados = {
  "João": { "2025-10-08": ["09:00", "14:00"] },
  "Carlos": { "2025-10-08": ["11:30"] },
  "Ana": { "2025-10-08": ["12:00", "15:00"] },
};

export default function AgendamentoForm() {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    data: "",
    hora: "",
    servico: "",
    barbeiro: "",
  });

  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  // Atualiza horários disponíveis quando barbeiro ou data mudarem
  useEffect(() => {
    if (!form.barbeiro || !form.data) {
      setHorariosDisponiveis([]);
      setForm((prev) => ({ ...prev, hora: "" }));
      return;
    }

    const selecionado = barbeiros.find((b) => b.nome === form.barbeiro);
    const ocupados = horariosOcupados[form.barbeiro]?.[form.data] || [];
    const disponiveis = selecionado
      ? selecionado.horarios.filter((h) => !ocupados.includes(h))
      : [];

    setHorariosDisponiveis(disponiveis);
    setForm((prev) => ({ ...prev, hora: "" }));
  }, [form.barbeiro, form.data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Agendamento feito para ${form.nome} com ${form.barbeiro} em ${form.data} às ${form.hora}`
    );
  };

  return (
    <div className="w-full flex justify-center mt-6 mb-12">
      <div className="w-full max-w-md p-6 sm:p-8 bg-[#1B1B1B] rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Agende seu horário
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
          {["nome", "telefone", "email"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : field === "telefone" ? "tel" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              className="p-3 rounded bg-[#0D0D0D] text-[#E5E5E5] border border-[#333] focus:outline-none focus:border-[#FFA500]"
              required
            />
          ))}

          {/* Seleciona Barbeiro */}
          <select
            name="barbeiro"
            value={form.barbeiro}
            onChange={handleChange}
            className="p-3 rounded bg-[#0D0D0D] text-[#E5E5E5] border border-[#333] focus:outline-none focus:border-[#FFA500]"
            required
          >
            <option value="">Selecione o barbeiro</option>
            {barbeiros.map((b) => (
              <option key={b.nome} value={b.nome}>
                {b.nome}
              </option>
            ))}
          </select>

          {/* Seleciona Data */}
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            className="p-3 rounded bg-[#0D0D0D] text-[#E5E5E5] border border-[#333] focus:outline-none focus:border-[#FFA500]"
            required
            disabled={!form.barbeiro}
          />

          {/* Seleciona Horário */}
          <select
            name="hora"
            value={form.hora}
            onChange={handleChange}
            className="p-3 rounded bg-[#0D0D0D] text-[#E5E5E5] border border-[#333] focus:outline-none focus:border-[#FFA500]"
            disabled={!form.barbeiro || !form.data || horariosDisponiveis.length === 0}
            required
          >
            <option value="">
              {horariosDisponiveis.length === 0
                ? "Nenhum horário disponível"
                : "Selecione o horário"}
            </option>
            {horariosDisponiveis.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          {/* Seleciona Serviço */}
          <select
            name="servico"
            value={form.servico}
            onChange={handleChange}
            className="p-3 rounded bg-[#0D0D0D] text-[#E5E5E5] border border-[#333] focus:outline-none focus:border-[#FFA500]"
            required
          >
            <option value="">Selecione o serviço</option>
            <option value="corte">Corte</option>
            <option value="barba">Barba</option>
            <option value="combo">Combo Corte + Barba</option>
          </select>

          <Button type="submit">Confirmar Agendamento</Button>
        </form>
      </div>
    </div>
  );
}