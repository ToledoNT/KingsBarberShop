"use client";

import { useState, useEffect } from "react";
import { Agendamento, HorarioDisponivel } from "../interfaces/agendamentoInterface";
import { AppointmentService } from "../api/agendamentoPublic";
import { ProcedimentoService } from "../api/procedimento";
import { Procedimento } from "../interfaces/procedimenttosInterface";

const appointmentService = new AppointmentService();
const procedimentoService = new ProcedimentoService();

export function useAgendamentosAdmin() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===================== Agendamentos =====================
  const fetchAgendamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.fetchAppointments();
      setAgendamentos(data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const addAgendamento = async (novo: Partial<Agendamento>) => {
    setLoading(true);
    setError(null);
    try {
      const criado = await appointmentService.createAppointment(novo);
      setAgendamentos(prev => [...prev, criado]);
      return criado;
    } catch (err: any) {
      setError(err.message || "Erro ao criar agendamento");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAgendamento = async (id: string, atualizado: Partial<Agendamento>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await appointmentService.updateAppointment(id, atualizado);
      if (!updated) throw new Error("Falha ao atualizar agendamento");
      setAgendamentos(prev => prev.map(a => (a.id === id ? updated : a)));
      return updated;
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar agendamento");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAgendamento = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await appointmentService.deleteAppointment(id);
      setAgendamentos(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      setError(err.message || "Erro ao deletar agendamento");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===================== Horários =====================
  const addHorario = (novoHorario: Omit<HorarioDisponivel, "id">) => {
    setHorarios(prev => [...prev, { ...novoHorario, id: Date.now().toString() }]);
  };

  const updateHorario = (id: string, atualizado: Omit<HorarioDisponivel, "id">) => {
    setHorarios(prev => prev.map(h => (h.id === id ? { ...h, ...atualizado } : h)));
  };

  const removeHorario = (id: string) => {
    setHorarios(prev => prev.filter(h => h.id !== id));
  };

  // ===================== Procedimentos =====================
  const fetchProcedimentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await procedimentoService.fetchProcedimentos();
      setProcedimentos(data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar procedimentos");
    } finally {
      setLoading(false);
    }
  };

  const addProcedimento = async (novo: Partial<Procedimento>) => {
    setLoading(true);
    setError(null);
    try {
      const criado = await procedimentoService.createProcedimento(novo);
      setProcedimentos(prev => [...prev, criado]);
      return criado;
    } catch (err: any) {
      setError(err.message || "Erro ao criar procedimento");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProcedimento = async (id: string, atualizado: Partial<Procedimento>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await procedimentoService.updateProcedimento(id, atualizado);
      if (!updated) throw new Error("Falha ao atualizar procedimento");
      setProcedimentos(prev => prev.map(p => (p.id === id ? updated : p)));
      return updated;
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar procedimento");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProcedimento = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await procedimentoService.deleteProcedimento(id);
      setProcedimentos(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Erro ao deletar procedimento");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===================== Effect Inicial =====================
  useEffect(() => {
    fetchAgendamentos();
    fetchProcedimentos();
  }, []);

  return {
    agendamentos,
    addAgendamento,
    updateAgendamento,
    removeAgendamento,

    horarios,
    addHorario,
    updateHorario,
    removeHorario,

    procedimentos,
    addProcedimento,
    updateProcedimento,
    removeProcedimento,

    loading,
    error,
    fetchAgendamentos,
    fetchProcedimentos,
  };
}