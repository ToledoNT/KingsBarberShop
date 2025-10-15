"use client";

import { useState, useEffect } from "react";
import {
  Agendamento,
  HorarioDisponivel,
  Barbeiro,
  Procedimento,
} from "../interfaces/agendamentoInterface";
import { ProfissionalService } from "../api/frontend/profissionaisAdmin";
import { AppointmentService } from "../api/frontend/agendamentoAdmin";
import { HorarioService } from "../api/frontend/agendamentoHorarioAdmin";
import { Profissional } from "../../app/interfaces/profissionaisInterface";

const appointmentService = new AppointmentService();
const profissionalService = new ProfissionalService();
const horarioService = new HorarioService();

type FormState = {
  barbeiro: string;
  data: string | null;
};

export function useAgendamentosAdmin() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [procedimentosBarbeiro, setProcedimentosBarbeiro] = useState<Procedimento[]>([]);
  const [form, setForm] = useState<FormState>({ barbeiro: "", data: null });

  const fetchBarbeiros = async () => {
    try {
      const response = await profissionalService.fetchProfissionais();
      if (Array.isArray(response)) {
        setBarbeiros(response.map((b: Profissional) => ({
          id: b.id,
          nome: b.nome,
          horarios: b.horarios || [],
        })));
      }
    } catch (err: any) {
      console.error("Erro ao buscar barbeiros:", err);
    }
  };

  const fetchAgendamentos = async () => {
    try {
      const data = await appointmentService.fetchAppointments();
      setAgendamentos(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar agendamentos:", err);
    }
  };

  const fetchTodosHorarios = async () => {
    try {
      const data = await horarioService.fetchAllHorarios();
      setHorarios(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar horários:", err);
      setHorarios([]);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
    fetchBarbeiros();
    fetchTodosHorarios();
  }, []);

  // --- CRUD Agendamentos ---
  const addAgendamento = async (a: Agendamento) => {
    try {
      const newA = await appointmentService.createAppointment(a);
      setAgendamentos(prev => [...prev, newA]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateAgendamento = async (id: string, a: Partial<Agendamento>) => {
    try {
      await appointmentService.updateAppointment(id, a);
      setAgendamentos(prev => prev.map(item => (item.id === id ? { ...item, ...a } : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const removeAgendamento = async (id: string) => {
    try {
      await appointmentService.deleteAppointment(id);
      setAgendamentos(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD Horários ---
  const addHorario = async (h: Partial<HorarioDisponivel>) => {
    try {
      const response = await horarioService.createHorarioDisponivel(h);

      // Normaliza para sempre ter o profissional completo
      const normalizeHorario = (horario: HorarioDisponivel) => ({
        ...horario,
        profissional: horario.profissional || { id: h.profissional?.id || "", nome: h.profissional?.nome || "Sem profissional" },
      });

      if (Array.isArray(response)) {
        setHorarios(prev => [...prev, ...response.map(normalizeHorario)]);
      } else {
        setHorarios(prev => [...prev, normalizeHorario(response)]);
      }

      return response;
    } catch (err) {
      console.error(err);
    }
  };

  const removeHorario = async (id: string) => {
    try {
      await horarioService.deleteHorarioDisponivel(id);
      setHorarios(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

const toggleHorarioDisponivel = async (h: HorarioDisponivel) => {
  if (!h.id) return;

  try {
    const updated = await horarioService.updateHorario(h.id, {
      disponivel: !h.disponivel
    });

    setHorarios(prev =>
      prev.map(item => (item.id === h.id ? { ...item, disponivel: updated.disponivel } : item))
    );
  } catch (err) {
    console.error("Erro ao atualizar disponibilidade do horário:", err);
    alert("Erro ao atualizar disponibilidade. Veja o console.");
  }
};

  useEffect(() => {
    if (!form.barbeiro) return setProcedimentosBarbeiro([]);
    const fetchProcedimentos = async () => {
      try {
        const prof = await profissionalService.fetchProfissionalById(form.barbeiro);
        setProcedimentosBarbeiro(prof?.procedimentos || []);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchProcedimentos();
  }, [form.barbeiro]);

  return {
    agendamentos,
    addAgendamento,
    updateAgendamento,
    removeAgendamento,
    horarios,
    addHorario,
    removeHorario,
    toggleHorarioDisponivel,
    barbeiros,
    procedimentosBarbeiro,
    form,
    setForm,
    fetchBarbeiros,
    fetchAgendamentos,
    fetchTodosHorarios,
  };
}