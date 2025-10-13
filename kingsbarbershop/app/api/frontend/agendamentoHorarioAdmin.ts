import axios from "axios";
import { HorarioDisponivel } from "../../interfaces/agendamentoInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "http://localhost:4001/api", 
  headers: { "Content-Type": "application/json" },
});

export class HorarioService {
  async fetchHorariosDisponiveis(barbeiro: string, data: string): Promise<HorarioDisponivel[]> {
    try {
      const res = await api.get<ResponseTemplateInterface<HorarioDisponivel[]>>("/horarios-disponiveis", {
        params: { barbeiro, data },
      });
      return res.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async createHorarioDisponivel(horario: Partial<HorarioDisponivel>): Promise<HorarioDisponivel> {
    try {
      const res = await api.post<ResponseTemplateInterface<HorarioDisponivel>>("/horarios-disponiveis/create", horario);
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || err.message || "Erro desconhecido ao criar horário");
    }
  }

  async updateHorarioDisponivel(id: string, horario: Partial<HorarioDisponivel>): Promise<HorarioDisponivel> {
    try {
      const res = await api.put<ResponseTemplateInterface<HorarioDisponivel>>(`/horarios-disponiveis/update/${id}`, horario);
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || err.message || "Erro desconhecido ao atualizar horário");
    }
  }

  async deleteHorarioDisponivel(id: string): Promise<void> {
    try {
      const res = await api.delete<ResponseTemplateInterface<null>>(`/horarios-disponiveis/delete/${id}`);
      if (!res.data.status) throw new Error(res.data.message);
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || err.message || "Erro ao deletar horário");
    }
  }

  async fetchHorarioById(id: string): Promise<HorarioDisponivel | null> {
    try {
      const res = await api.get<ResponseTemplateInterface<HorarioDisponivel>>(`/horarios-disponiveis/${id}`);
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}