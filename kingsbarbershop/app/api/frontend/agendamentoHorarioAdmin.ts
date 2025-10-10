import axios from "axios";
import { HorarioDisponivel } from "../../interfaces/agendamentoInterface";

const api = axios.create({
  baseURL: "http://localhost:4001/api",
  headers: { "Content-Type": "application/json" },
});

export class HorarioService {
  async fetchHorariosDisponiveis(barbeiro: string, data: string): Promise<HorarioDisponivel[]> {
    try {
      const res = await api.get<{ status: boolean; data: HorarioDisponivel[] }>("/horarios-disponiveis", {
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
        console.log(horario)
      const res = await api.post("/horarios-disponiveis/create", horario);
      if (res.data && res.data.status === false) throw new Error(res.data.message);
      return res.data.data || res.data;
    } catch (err: any) {
      console.error(err);
      if (err.response?.data) throw new Error(err.response.data.message || "Erro ao criar horário");
      if (err.message) throw err;
      throw new Error("Erro desconhecido ao criar horário");
    }
  }

  async updateHorarioDisponivel(id: string, horario: Partial<HorarioDisponivel>): Promise<HorarioDisponivel> {
    try {
      const res = await api.put(`/horarios-disponiveis/update/${id}`, horario);
      return res.data.data || res.data;
    } catch (err: any) {
      console.error(err);
      if (err.response?.data) throw new Error(err.response.data.message || "Erro ao atualizar horário");
      if (err.message) throw err;
      throw new Error("Erro desconhecido ao atualizar horário");
    }
  }

  async deleteHorarioDisponivel(id: string): Promise<void> {
    try {
      await api.delete(`/horarios-disponiveis/delete/${id}`);
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || err.message || "Erro ao deletar horário");
    }
  }

  async fetchHorarioById(id: string): Promise<HorarioDisponivel | null> {
    try {
      const res = await api.get(`/horarios-disponiveis/${id}`);
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}