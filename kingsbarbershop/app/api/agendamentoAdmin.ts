import axios from "axios";
import { Agendamento } from "../interfaces/agendamentoInterface";

const api = axios.create({
  baseURL: "http://localhost:4001/api",
  headers: { "Content-Type": "application/json" },
});

export class AppointmentService {
  async fetchAppointments(): Promise<Agendamento[]> {
    try {
      const res = await api.get<{ status: boolean; data: Agendamento[] }>("/appointments/all");
      return res.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async createAppointment(data: Partial<Agendamento>): Promise<Agendamento> {
    try {
      console.log(data)
      const res = await api.post("/appointments/create", data);
      if (res.data && res.data.status === false) throw new Error(res.data.message);
      return res.data.data || res.data;
    } catch (err: any) {
      console.error(err);
      if (err.response?.data) throw new Error(err.response.data.message || "Erro ao criar agendamento");
      if (err.message) throw err;
      throw new Error("Erro desconhecido ao criar agendamento");
    }
  }

  async updateAppointment(id: string, data: Partial<Agendamento>): Promise<Agendamento | null> {
    try {
      const res = await api.put(`/appointments/update/${id}`, data);
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async deleteAppointment(id: string): Promise<void> {
    try {
      await api.delete(`/appointments/delete/${id}`);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || "Erro ao deletar agendamento");
    }
  }

  async fetchAppointmentById(id: string): Promise<Agendamento | null> {
    try {
      const res = await api.get(`/appointments/${id}`);
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async fetchHorariosDisponiveis(barbeiro: string, data: string): Promise<string[]> {
    try {
      const res = await api.get<{ status: boolean; data: string[] }>(`/appointments/horarios-disponiveis`, {
        params: { barbeiro, data },
      });
      return res.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}