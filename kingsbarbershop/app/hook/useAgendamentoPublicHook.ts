"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { validateEmail } from "@/app/utils/validators";
import { Agendamento, AgendamentoFormData, Barbeiro } from "../interfaces/agendamentoInterface";
import { AppointmentService } from "../api/frontend/agendamentoAdmin";

const barbeiros: Barbeiro[] = [
  { nome: "João", horarios: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
  { nome: "Carlos", horarios: ["10:00", "11:30", "13:00", "16:00"] },
  { nome: "Ana", horarios: ["09:30", "12:00", "15:00", "17:00"] },
];

const horariosOcupados: Record<string, Record<string, string[]>> = {
  João: { "2025-10-08": ["09:00", "14:00"] },
  Carlos: { "2025-10-08": ["11:30"] },
  Ana: { "2025-10-08": ["12:00", "15:00"] },
};

const service = new AppointmentService();

export function useAgendamentoForm() {
  const [form, setForm] = useState<AgendamentoFormData>({
    nome: "",
    telefone: "",
    email: "",
    data: "",
    hora: "",
    servico: "",
    barbeiro: "",
  });

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!form.barbeiro || !form.data) {
      setHorariosDisponiveis([]);
      setForm(prev => ({ ...prev, hora: "" }));
      return;
    }

    const selecionado = barbeiros.find(b => b.nome === form.barbeiro);
    const ocupados = horariosOcupados[form.barbeiro]?.[form.data] || [];
    const disponiveis = selecionado
      ? selecionado.horarios.filter(h => !ocupados.includes(h))
      : [];

    setHorariosDisponiveis(disponiveis);
    setForm(prev => ({ ...prev, hora: "" }));
  }, [form.barbeiro, form.data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (callback?: (form: AgendamentoFormData) => void) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();

      const requiredFields: (keyof AgendamentoFormData)[] = [
        "nome",
        "telefone",
        "email",
        "data",
        "hora",
        "servico",
        "barbeiro",
      ];

      const emptyField = requiredFields.find(field => !form[field].trim());

      if (emptyField) {
        alert(`Preencha o campo: ${emptyField}`);
        return;
      }

      if (!validateEmail(form.email)) {
        alert("Email inválido!");
        return;
      }

      setLoading(true);
      try {
        const novoAgendamento: Partial<Agendamento> = { ...form };
        await service.createAppointment(novoAgendamento);
        if (callback) callback(form);
        alert("Agendamento criado com sucesso!");
      } catch (err: any) {
        alert(err.message || "Erro ao criar agendamento");
      } finally {
        setLoading(false);
      }
    };
  };

  return {
    form,
    setForm,
    handleChange,
    handleSubmit,
    barbeiros,
    horariosDisponiveis,
    loading,
  };
}