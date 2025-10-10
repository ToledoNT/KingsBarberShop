import { useState, useEffect } from "react";
import { Agendamento, HorarioDisponivel } from "../interfaces/agendamentoInterface";
import { ProfissionalService } from "../api/frontend/profissionaisAdmin";
import { AppointmentService } from "../api/frontend/agendamentoAdmin";
import { HorarioService } from "../api/frontend/agendamentoHorarioAdmin";

const appointmentService = new AppointmentService();
const profissionalService = new ProfissionalService();
const horarioService = new HorarioService(); 

export function useAgendamentosAdmin() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [barbeiros, setBarbeiros] = useState<{ nome: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ barbeiro: "", data: "" });

  const fetchBarbeiros = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profissionalService.fetchProfissionais();
      setBarbeiros(data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar barbeiros");
    } finally {
      setLoading(false);
    }
  };

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

  const fetchHorariosDisponiveis = async (barbeiro: string, data: string) => {
    setLoading(true);
    setError(null);
    try {
      const horariosData = await horarioService.fetchHorariosDisponiveis(barbeiro, data);
      setHorarios(horariosData);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar horários");
    } finally {
      setLoading(false);
    }
  };

  const addAgendamento = async (novo: Agendamento) => {
    setLoading(true);
    setError(null);
    try {
      const criado = await appointmentService.createAppointment(novo);
      setAgendamentos((prev) => [...prev, criado]);
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar agendamento");
    } finally {
      setLoading(false);
    }
  };

  const updateAgendamento = async (id: string, atualizado: Agendamento) => {
    setLoading(true);
    setError(null);
    try {
      const atualizadoServidor = await appointmentService.updateAppointment(id, atualizado);
      if (!atualizadoServidor) throw new Error("Falha ao atualizar agendamento");
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? atualizadoServidor : a))
      );
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar agendamento");
    } finally {
      setLoading(false);
    }
  };

  const removeAgendamento = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await appointmentService.deleteAppointment(id);
      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      setError(err.message || "Erro ao remover agendamento");
    } finally {
      setLoading(false);
    }
  };

  const addHorario = async (novo: HorarioDisponivel) => {
    setLoading(true);
    setError(null);
    try {
      const criado = await horarioService.createHorarioDisponivel(novo);
      setHorarios((prev) => [...prev, criado]);
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar horário");
    } finally {
      setLoading(false);
    }
  };

  const updateHorario = async (id: string, atualizado: HorarioDisponivel) => {
    setLoading(true);
    setError(null);
    try {
      const atualizadoServidor = await horarioService.updateHorarioDisponivel(id, atualizado);
      setHorarios((prev) => prev.map((h) => (h.id === id ? atualizadoServidor : h)));
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar horário");
    } finally {
      setLoading(false);
    }
  };

  const removeHorario = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await horarioService.deleteHorarioDisponivel(id);
      setHorarios((prev) => prev.filter((h) => h.id !== id));
    } catch (err: any) {
      setError(err.message || "Erro ao remover horário");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
    fetchBarbeiros();
  }, []);

  useEffect(() => {
    if (form.barbeiro && form.data) {
      fetchHorariosDisponiveis(form.barbeiro, form.data);
    } else {
      setHorarios([]);
    }
  }, [form.barbeiro, form.data]);

  return {
    agendamentos,
    barbeiros,
    horarios,
    loading,
    error,
    form,
    setForm,
    fetchAgendamentos,
    fetchBarbeiros,
    fetchHorariosDisponiveis,
    addAgendamento,
    updateAgendamento,
    removeAgendamento,
    addHorario,
    updateHorario,
    removeHorario,
  };
}