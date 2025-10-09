"use client";

import React, { useEffect, useState } from "react";
import { Agendamento, AgendamentoPrivadoFormProps, StatusAgendamento, HorarioDisponivel } from "@/app/interfaces/agendamentoInterface";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { formatPhoneNumber, validateEmail } from "@/app/utils/validators";
import { useAgendamentosAdmin } from "@/app/hook/useAgendamentoAdmin";

export default function AgendamentoPrivadoForm({
  agendamento,
  onSave,
  onCancel,
}: AgendamentoPrivadoFormProps) {
  const { barbeiros, horarios: todosHorarios, loading } = useAgendamentosAdmin();

  const [form, setForm] = useState<Agendamento>({
    nome: "",
    telefone: "",
    email: "",
    barbeiro: "",
    data: "",
    hora: "",
    servico: "",
    status: StatusAgendamento.PENDENTE,
  });

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([]);

  // Atualiza horários disponíveis quando barbeiro ou data mudarem
  useEffect(() => {
    if (form.barbeiro && form.data) {
      const filtrados = todosHorarios.filter(
        (h) => h.barbeiro === form.barbeiro && h.data === form.data
      );
      setHorariosDisponiveis(filtrados);
    } else {
      setHorariosDisponiveis([]);
    }
  }, [form.barbeiro, form.data, todosHorarios]);

  // Inicializa formulário caso tenha agendamento
  useEffect(() => {
    if (agendamento) {
      setForm({ ...agendamento });
    }
  }, [agendamento]);

  // Funções para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    handleChange({ target: { name: "telefone", value: formattedPhone } } as React.ChangeEvent<HTMLInputElement>);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      alert("Email inválido!");
      return;
    }
    await onSave(form);
  };

  return (
    <div className="w-full flex justify-center mt-6 mb-12">
      <div className="w-full max-w-md p-6 sm:p-8 bg-[#1B1B1B] rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          {agendamento ? "Editar Agendamento" : "Agende um horário"}
        </h2>

        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            name="nome"
            type="text"
            value={form.nome}
            placeholder="Nome"
            onChange={handleChange}
            required
          />
          <Input
            name="telefone"
            type="tel"
            value={form.telefone}
            placeholder="Telefone"
            onChange={handlePhoneChange}
            required
          />
          <Input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <Select
            name="barbeiro"
            value={form.barbeiro}
            onChange={handleChange}
            options={barbeiros.map((b) => ({ value: b.nome, label: b.nome }))}
            placeholder="Selecione o barbeiro"
            required
          />
          <Input
            name="data"
            type="date"
            value={form.data}
            onChange={handleChange}
            required
            disabled={!form.barbeiro}
          />
          <Select
            name="hora"
            value={form.hora}
            onChange={handleChange}
            options={horariosDisponiveis.map((h) => ({ value: h.inicio, label: h.inicio }))}
            placeholder={horariosDisponiveis.length === 0 ? "Nenhum horário disponível" : "Selecione o horário"}
            required
            disabled={!form.barbeiro || !form.data || horariosDisponiveis.length === 0}
          />
          <Select
            name="servico"
            value={form.servico}
            onChange={handleChange}
            options={[
              { value: "corte", label: "Corte" },
              { value: "barba", label: "Barba" },
              { value: "combo", label: "Combo Corte + Barba" },
            ]}
            placeholder="Selecione o serviço"
            required
          />
          <div className="flex justify-end gap-3 mt-4">
            {onCancel && (
              <Button variant="secondary" type="button" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" loading={loading}>
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}