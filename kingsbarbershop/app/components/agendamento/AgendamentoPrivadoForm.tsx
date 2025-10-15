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
  Procedimento,
  AgendamentoPrivadoFormProps,
} from "../../interfaces/agendamentoInterface";
import { useAgendamentosAdmin } from "../../hook/useAgendamentoAdmin";

registerLocale("pt-BR", ptBR);

const AgendamentoPrivadoForm: React.FC<AgendamentoPrivadoFormProps> = ({
  agendamento,
  onSave,
  onCancel,
}) => {
  const {
    barbeiros,
    form,
    setForm,
    fetchBarbeiroDados,
    horarios,
    procedimentosBarbeiro,
  } = useAgendamentosAdmin();

  const [localForm, setLocalForm] = useState<AgendamentoForm>({
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
      setLocalForm({
        nome: agendamento.nome,
        telefone: agendamento.telefone,
        email: agendamento.email,
        barbeiro: agendamento.barbeiro,
        data: agendamento.data ? new Date(agendamento.data) : null,
        hora: agendamento.hora,
        servico: agendamento.servico,
        status: agendamento.status ?? StatusAgendamento.PENDENTE,
      });

      setForm({
        barbeiro: agendamento.barbeiro ?? "",
        data: agendamento.data ? new Date(agendamento.data) : null,
      });
    }
  }, [agendamento, setForm]);

  const handleBarbeiroChange = async (barbeiroId: string) => {
    setLocalForm((prev) => ({ ...prev, barbeiro: barbeiroId, hora: "", servico: "" }));
    setForm((prev) => ({ ...prev, barbeiro: barbeiroId }));
    if (barbeiroId) await fetchBarbeiroDados(barbeiroId);
  };

  const handleDataChange = (data: Date | null) => {
    setLocalForm((prev) => ({ ...prev, data, hora: "", servico: "" }));
    setForm((prev) => ({ ...prev, data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // -------------------------------
  // Validação completa dos campos
  // -------------------------------
  const erros: string[] = [];
  if (!localForm.nome.trim()) erros.push("Nome");
  if (!localForm.telefone.trim()) erros.push("Telefone");
  if (!localForm.email.trim()) erros.push("Email");
  if (!localForm.barbeiro) erros.push("Barbeiro");
  if (!localForm.data) erros.push("Data");
  if (!localForm.hora) erros.push("Horário");
  if (!localForm.servico) erros.push("Serviço");

  if (erros.length > 0) {
    alert(`Preencha todos os campos obrigatórios: ${erros.join(", ")}`);
    return;
  }

  const dataString = localForm.data!.toISOString().split("T")[0];

  const horarioSelecionado = horarios.find((h) => h.id === localForm.hora);

  const payload: Agendamento = {
    id: agendamento?.id,
    nome: localForm.nome.trim(),
    telefone: localForm.telefone.trim(),
    email: localForm.email.trim(),
    barbeiro: localForm.barbeiro,
    data: dataString,
    hora: localForm.hora,
    servico: localForm.servico,
    status: localForm.status,
    inicio: horarioSelecionado?.inicio ?? "",
    fim: horarioSelecionado?.fim ?? "",
  };

  console.log("Payload enviado:", payload); // Depuração

  await onSave(payload);
};


  return (
    <div className="w-full flex justify-center mt-6 mb-12">
      <div className="w-full max-w-md p-6 sm:p-8 bg-[#1B1B1B] rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          {agendamento ? "Editar Agendamento" : "Novo Agendamento"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            name="nome"
            value={localForm.nome}
            placeholder="Nome"
            onChange={(e) => setLocalForm({ ...localForm, nome: e.target.value })}
            required
          />

          <Input
            name="telefone"
            value={localForm.telefone}
            placeholder="Telefone"
            onChange={(e) =>
              setLocalForm({ ...localForm, telefone: e.target.value.replace(/\D/g, "") })
            }
            required
          />

          <Input
            name="email"
            value={localForm.email}
            placeholder="Email"
            onChange={(e) => setLocalForm({ ...localForm, email: e.target.value })}
            required
          />

          <Select
            name="barbeiro"
            value={localForm.barbeiro}
            onChange={(e) => handleBarbeiroChange(e.target.value)}
            options={barbeiros.map((b) => ({ value: b.id, label: b.nome }))}
            placeholder="Selecione o barbeiro"
            required
          />

          <DatePicker
            selected={localForm.data}
            onChange={handleDataChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            className="w-full p-2 rounded-md bg-[#2B2B2B] text-white border-none"
            locale="pt-BR"
          />

          <Select
            name="hora"
            value={localForm.hora}
            onChange={(e) => setLocalForm({ ...localForm, hora: e.target.value })}
            options={horarios
              .filter((h): h is HorarioDisponivel & { id: string } => !!h.disponivel && !!h.id)
              .map((h) => ({ value: h.id, label: h.label! }))}
            placeholder="Selecione o horário"
            required
          />

          <Select
            name="servico"
            value={localForm.servico}
            onChange={(e) => setLocalForm({ ...localForm, servico: e.target.value })}
            options={procedimentosBarbeiro
              .filter((p): p is Procedimento & { id: string } => !!p.id)
              .map((p) => ({ value: p.id, label: p.label! }))}
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
