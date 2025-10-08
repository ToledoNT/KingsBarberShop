"use client";

import React, { useEffect } from "react";
import { Agendamento } from "@/app/interfaces/agendamentoInterface";
import { useAgendamentoForm } from "@/app/hook/useAgendamentoPublicHook";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { validateEmail } from "@/app/utils/validators";

interface AgendamentoPrivadoFormProps {
  agendamento?: Agendamento;
  onSave: (a: Agendamento) => Promise<void>;
  onCancel?: () => void;
}

export default function AgendamentoPrivadoForm({
  agendamento,
  onSave,
  onCancel,
}: AgendamentoPrivadoFormProps) {
  const { form, setForm, handleChange, handleSubmit, barbeiros, horariosDisponiveis, loading } =
    useAgendamentoForm();

  // Inicializa o form
  useEffect(() => {
    if (agendamento) {
      const { id, status, criadoEm, atualizadoEm, ...formData } = agendamento;
      setForm(formData);
    } else {
      setForm({
        nome: "",
        telefone: "",
        email: "",
        barbeiro: "",
        data: "",
        hora: "",
        servico: "",
      });
    }
  }, [agendamento, setForm]);

  const onSubmit = async (formData: typeof form) => {
    if (!validateEmail(formData.email)) {
      alert("Email inválido!");
      return;
    }

    const agendamentoToSave: Agendamento = agendamento
      ? { ...agendamento, ...formData }
      : { ...formData, status: "Pendente" };

    await onSave(agendamentoToSave);
  };

  return (
    <div className="w-full flex justify-center mt-6 mb-12">
      <div className="w-full max-w-md p-6 sm:p-8 bg-[#1B1B1B] rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          {agendamento ? "Editar Agendamento" : "Agende um horário"}
        </h2>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input name="nome" type="text" value={form.nome} placeholder="Nome" onChange={handleChange} required />
          <Input name="telefone" type="tel" value={form.telefone} placeholder="Telefone" onChange={handleChange} required />
          <Input name="email" type="email" value={form.email} placeholder="Email" onChange={handleChange} required />

          <Select
            name="barbeiro"
            value={form.barbeiro}
            onChange={handleChange}
            options={barbeiros.map((b) => ({ value: b.nome, label: b.nome }))}
            placeholder="Selecione o barbeiro"
            required
          />

          <Input name="data" type="date" value={form.data} onChange={handleChange} required disabled={!form.barbeiro} />

          <Select
            name="hora"
            value={form.hora}
            onChange={handleChange}
            options={horariosDisponiveis.map((h) => ({ value: h, label: h }))}
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