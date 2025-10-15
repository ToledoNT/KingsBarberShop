"use client";

import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

import Select from "../ui/Select";
import Input from "../ui/Input";
import Button from "../ui/Button";
import {
  Agendamento,
  AgendamentoForm,
  HorarioDisponivel,
  StatusAgendamento,
  Barbeiro,
  Procedimento,
} from "../../interfaces/agendamentoInterface";

registerLocale("pt-BR", ptBR);

interface AgendamentoPrivadoFormProps {
  agendamento?: Agendamento | null;
  onSave: (a: Agendamento) => Promise<void> | void;
  onCancel: () => void;
  barbeiros: Barbeiro[];
  horarios: HorarioDisponivel[];
  procedimentos?: Procedimento[];
}

const AgendamentoPrivadoForm: React.FC<AgendamentoPrivadoFormProps> = ({
  agendamento,
  onSave,
  onCancel,
  barbeiros,
  horarios,
  procedimentos = [],
}) => {
  const [form, setForm] = useState<AgendamentoForm>({
    nome: agendamento?.nome ?? "",
    telefone: agendamento?.telefone ?? "",
    email: agendamento?.email ?? "",
    barbeiro: agendamento?.barbeiro ?? "",
    data: agendamento?.data ? new Date(agendamento.data) : null,
    hora: agendamento?.hora ?? "",
    servico: agendamento?.servico ?? "",
    status: agendamento?.status ?? StatusAgendamento.PENDENTE,
  });

  useEffect(() => {
    if (agendamento) {
      setForm({
        nome: agendamento.nome,
        telefone: agendamento.telefone,
        email: agendamento.email,
        barbeiro: agendamento.barbeiro,
        data: agendamento.data ? new Date(agendamento.data) : null,
        hora: agendamento.hora,
        servico: agendamento.servico,
        status: agendamento.status ?? StatusAgendamento.PENDENTE,
      });
    } else {
      setForm({
        nome: "",
        telefone: "",
        email: "",
        barbeiro: "",
        data: null,
        hora: "",
        servico: "",
        status: StatusAgendamento.PENDENTE,
      });
    }
  }, [agendamento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataString = form.data ? form.data.toISOString().split("T")[0] : "";
   const payload: Agendamento = {
  id: agendamento?.id,
  nome: form.nome,
  telefone: form.telefone,
  email: form.email,
  barbeiro: form.barbeiro,
  data: dataString,
  hora: form.hora,
  servico: form.servico,
  status: form.status,
  inicio: form.hora,   
  fim: form.hora,     
};


    await onSave(payload);
  };

  const formatarHorarioLabel = (h: HorarioDisponivel) =>
    `${h.inicio} - ${h.fim}`;

  return (
    <div className="w-full flex justify-center mt-6 mb-12">
      <div className="w-full max-w-md p-6 sm:p-8 bg-[#1B1B1B] rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          {agendamento ? "Editar Agendamento" : "Novo Agendamento"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            name="nome"
            value={form.nome}
            placeholder="Nome"
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />

          <Input
            name="telefone"
            value={form.telefone}
            placeholder="Telefone"
            onChange={(e) =>
              setForm({ ...form, telefone: e.target.value.replace(/\D/g, "") })
            }
            required
          />

          <Input
            name="email"
            value={form.email}
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <Select
            name="barbeiro"
            value={form.barbeiro}
            onChange={(e) =>
              setForm({ ...form, barbeiro: e.target.value, hora: "", servico: "" })
            }
            options={barbeiros.map((b) => ({ value: b.id, label: b.nome }))}
            placeholder="Selecione o barbeiro"
            required
          />

          <DatePicker
            selected={form.data}
            onChange={(d: Date | null) => setForm({ ...form, data: d })}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            className="w-full p-2 rounded-md bg-[#2B2B2B] text-white border-none"
            locale="pt-BR"
          />

          {/* Horários */}
          <Select
            name="hora"
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
            options={horarios
              .filter((h) => h.disponivel)
              .map((h) => ({
                value: `${h.inicio}-${h.fim}`,
                label: formatarHorarioLabel(h),
              }))}
            placeholder="Selecione o horário"
            required
          />

          {/* Serviços / Procedimentos */}
          <Select
            name="servico"
            value={form.servico}
            onChange={(e) => setForm({ ...form, servico: e.target.value })}
            options={procedimentos.map((p) => ({
              value: p.id,
              label: `${p.nome} - R$${p.valor.toFixed(2)}`,
            }))}
            placeholder="Selecione o serviço"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" type="button" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendamentoPrivadoForm;