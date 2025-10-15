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
  data: Date | null;
};

export function useAgendamentosAdmin() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [procedimentosBarbeiro, setProcedimentosBarbeiro] = useState<Procedimento[]>([]);
  const [form, setForm] = useState<FormState>({ barbeiro: "", data: null });

  // ---------------------------
  // Fetch inicial
  // ---------------------------
  useEffect(() => {
    fetchAgendamentos();
    fetchBarbeiros();
    fetchTodosHorarios();
  }, []);

  // ---------------------------
  // Funções de Fetch
  // ---------------------------
  const fetchBarbeiros = async () => {
    try {
      const response = await profissionalService.fetchProfissionais();
      if (Array.isArray(response)) {
        setBarbeiros(
          response.map((b: Profissional) => ({
            id: b.id,
            nome: b.nome,
            horarios: b.horarios || [],
          }))
        );
      }
    } catch (err) {
      console.error("Erro ao buscar barbeiros:", err);
    }
  };

  const fetchAgendamentos = async () => {
    try {
      const data = await appointmentService.fetchAppointments();
      setAgendamentos(data || []);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    }
  };

  const fetchTodosHorarios = async () => {
    try {
      const data = await horarioService.fetchAllHorarios();
      setHorarios(data || []);
    } catch (err) {
      console.error("Erro ao buscar horários:", err);
      setHorarios([]);
    }
  };

  // ---------------------------
  // Buscar dados do barbeiro (horários e procedimentos)
  // ---------------------------
type BarbeiroDadosResponse = {
  barbeiroId: string;
  horarios: HorarioDisponivel[];
  procedimentos: Procedimento[];
};

const fetchBarbeiroDados = async (barbeiroId: string) => {
  if (!barbeiroId) {
    setHorarios([]);
    setProcedimentosBarbeiro([]);
    return;
  }

  try {
    // ⚡ Tipando o retorno da API
    const res: BarbeiroDadosResponse = await profissionalService.fetchHorariosByProfissional(barbeiroId);

    // Mapear horários com fallback seguro
    const horariosConvertidos = res.horarios
      .filter((h): h is HorarioDisponivel & { id: string } => !!h.id) // garante id
      .map((h) => ({
        ...h,
        label: h.label ?? `${h.inicio} - ${h.fim}`,
        disponivel: h.disponivel ?? true,
      }));

    // Mapear procedimentos com label seguro
    const procedimentosConvertidos = res.procedimentos
      .filter((p): p is Procedimento & { id: string } => !!p.id) // garante id
      .map((p) => ({
        ...p,
        label: p.label ?? `${p.nome} - R$${p.valor.toFixed(2)}`,
      }));

    setHorarios(horariosConvertidos);
    setProcedimentosBarbeiro(procedimentosConvertidos);

    // Reset form para hora e serviço
    setForm((prev) => ({ ...prev, hora: "", servico: "" }));
  } catch (err) {
    console.error("Erro ao buscar dados do barbeiro:", err);
    setHorarios([]);
    setProcedimentosBarbeiro([]);
  }
};

  // ---------------------------
  // CRUD Agendamentos
  // ---------------------------
  const addAgendamento = async (a: Agendamento) => {
    try {
      const newA = await appointmentService.createAppointment(a);
      setAgendamentos((prev) => [...prev, newA]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateAgendamento = async (id: string, a: Partial<Agendamento>) => {
    try {
      await appointmentService.updateAppointment(id, a);
      setAgendamentos((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...a } : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeAgendamento = async (id: string) => {
    try {
      await appointmentService.deleteAppointment(id);
      setAgendamentos((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------
  // CRUD Horários
  // ---------------------------
  const addHorario = async (h: Partial<HorarioDisponivel>) => {
    try {
      const response = await horarioService.createHorarioDisponivel(h);

      const normalizeHorario = (horario: HorarioDisponivel) => ({
        ...horario,
        profissional:
          horario.profissional || {
            id: h.profissional?.id || "",
            nome: h.profissional?.nome || "Sem profissional",
          },
      });

      if (Array.isArray(response)) {
        setHorarios((prev) => [...prev, ...response.map(normalizeHorario)]);
      } else {
        setHorarios((prev) => [...prev, normalizeHorario(response)]);
      }

      return response;
    } catch (err) {
      console.error(err);
    }
  };

  const removeHorario = async (id: string) => {
    try {
      await horarioService.deleteHorarioDisponivel(id);
      setHorarios((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHorarioDisponivel = async (h: HorarioDisponivel) => {
    if (!h.id) return;
    try {
      const updated = await horarioService.updateHorario(h.id, {
        disponivel: !h.disponivel,
      });
      setHorarios((prev) =>
        prev.map((item) =>
          item.id === h.id ? { ...item, disponivel: updated.disponivel } : item
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar disponibilidade do horário:", err);
      alert("Erro ao atualizar disponibilidade. Veja o console.");
    }
  };

  // ---------------------------
  // Retorno do hook
  // ---------------------------
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
    fetchBarbeiroDados, 
  };
}