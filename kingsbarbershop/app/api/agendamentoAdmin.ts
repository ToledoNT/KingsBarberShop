import axios from "axios";
import { Agendamento } from "../interfaces/agendamentoInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export class AppointmentService {
  async fetchAppointments(): Promise<Agendamento[]> {
    try {
      const res = await api.get<ResponseTemplateInterface<Agendamento[]>>("/appointment/all");
      return res.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async createAppointment(data: Partial<Agendamento>): Promise<Agendamento> {
    try {
      const res = await api.post<ResponseTemplateInterface<Agendamento>>("/appointment/create", data);
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error(err);
      if (err.response?.data) throw new Error(err.response.data.message || "Erro ao criar agendamento");
      throw new Error(err.message || "Erro desconhecido ao criar agendamento");
    }
  }

  async updateAppointment(id: string, data: Partial<Agendamento>): Promise<Agendamento | null> {
    try {
      const res = await api.put<ResponseTemplateInterface<Agendamento>>("/appointment/update", { id, ...data });
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async deleteAppointment(id: string): Promise<void> {
    try {
      await api.delete<ResponseTemplateInterface<null>>(`/appointment/delete/${id}`);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || "Erro ao deletar agendamento");
    }
  }

  async fetchAppointmentById(id: string): Promise<Agendamento | null> {
    try {
      const res = await api.get<ResponseTemplateInterface<Agendamento>>(`/appointment/${id}`);
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async fetchHorariosDisponiveis(barbeiro: string, data: string): Promise<string[]> {
    try {
      const res = await api.get<ResponseTemplateInterface<string[]>>(`/appointment/horarios-disponiveis`, {
        params: { barbeiro, data },
      });
      return res.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}