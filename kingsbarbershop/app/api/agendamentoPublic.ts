import axios from "axios";

// =====================
// Interface Agendamento
// =====================
export interface Agendamento {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  data: string;        // YYYY-MM-DD
  hora: string;        // HH:mm
  servico: string;     // "corte", "barba", "combo"
  barbeiro: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

// =====================
// Axios config
// =====================
const api = axios.create({
  baseURL: "http://localhost:4001/api",
  headers: { "Content-Type": "application/json" },
});

// =====================
// Serviço de Agendamento
// =====================
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
      const res = await api.post("/appointments/create", data);
      console.log(data);
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
}
