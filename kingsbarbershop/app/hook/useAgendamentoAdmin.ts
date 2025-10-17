"use client";

import { useState, useEffect } from "react";
import {
  Agendamento,
  HorarioDisponivel,
  Barbeiro,
  Procedimento,
  StatusAgendamento,
} from "../interfaces/agendamentoInterface";
import { ProfissionalService } from "../api/profissionaisAdmin";
import { AppointmentService } from "../api/agendamentoAdmin";
import { HorarioService } from "../api/agendamentoHorarioAdmin";
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
  };

  const fetchAgendamentos = async () => {
    const data = await appointmentService.fetchAppointments();
    setAgendamentos(data || []);
  };

  const fetchTodosHorarios = async () => {
    const data = await horarioService.fetchAllHorarios();
    setHorarios(data || []);
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

    const res: BarbeiroDadosResponse = await profissionalService.fetchHorariosByProfissional(barbeiroId);

    const horariosConvertidos = res.horarios
      .filter((h): h is HorarioDisponivel & { id: string } => !!h.id)
      .map((h) => ({
        ...h,
        label: h.label ?? `${h.inicio} - ${h.fim}`,
        disponivel: h.disponivel ?? true,
      }));

    const procedimentosConvertidos = res.procedimentos
      .filter((p): p is Procedimento & { id: string } => !!p.id)
      .map((p) => ({
        ...p,
        label: p.label ?? `${p.nome} - R$${p.valor.toFixed(2)}`,
      }));

    setHorarios(horariosConvertidos);
    setProcedimentosBarbeiro(procedimentosConvertidos);
    setForm((prev) => ({ ...prev, hora: "", servico: "" }));
  };

  // ---------------------------
  // CRUD Agendamentos
  // ---------------------------
  const addAgendamento = async (a: Agendamento) => {
    const newA = await appointmentService.createAppointment(a);
    setAgendamentos((prev) => [...prev, newA]);
  };

  const updateAgendamento = async (id: string, a: Partial<Agendamento>) => {
    await appointmentService.updateAppointment(id, a);
    setAgendamentos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...a } : item))
    );
  };

  const removeAgendamento = async (id: string) => {
    await appointmentService.deleteAppointment(id);
    setAgendamentos((prev) => prev.filter((item) => item.id !== id));
  };

  // ---------------------------
  // CRUD Horários
  // ---------------------------
  const addHorario = async (h: Partial<HorarioDisponivel>) => {
    const response = await horarioService.createHorarioDisponivel(h);

    const normalizeHorario = (horario: HorarioDisponivel) => ({
      ...horario,
      profissional: {
        id: horario.profissional?.id || h.profissional?.id || "",
        nome: horario.profissional?.nome || h.profissional?.nome || "Sem profissional",
        horarios: horario.profissional?.horarios || h.profissional?.horarios || [],
      },
      label: horario.label || `${horario.inicio || ""} - ${horario.fim || ""}`,
      disponivel: horario.disponivel ?? false,
    });

    if (Array.isArray(response)) {
      setHorarios((prev) => [...prev, ...response.map(normalizeHorario)]);
    } else {
      setHorarios((prev) => [...prev, normalizeHorario(response)]);
    }

    setTimeout(() => {
      fetchTodosHorarios();
    }, 500);

    return response;
  };

  const removeHorario = async (id: string) => {
    await horarioService.deleteHorarioDisponivel(id);
    setHorarios((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHorarioDisponivel = async (h: HorarioDisponivel) => {
    if (!h.id) return;
    const updated = await horarioService.updateHorario(h.id, {
      disponivel: !h.disponivel,
    });
    setHorarios((prev) =>
      prev.map((item) =>
        item.id === h.id ? { ...item, disponivel: updated.disponivel } : item
      )
    );
  };

  // ---------------------------
  // Atualizar apenas status
  // ---------------------------
// ---------------------------
// Atualizar apenas status
// ---------------------------
const handleUpdateStatusAgendamento = async (id: string, status: StatusAgendamento) => {
  try {
    // Envia só id + status
    const payload = { id, status };
    await appointmentService.updateAppointment(id, payload);

    // Atualiza localmente apenas o status
    setAgendamentos(prev =>
      prev.map(a => a.id === id ? { ...a, status } : a)
    );
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
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
    handleUpdateStatusAgendamento, // ✅ disponibiliza função de status
  };
}