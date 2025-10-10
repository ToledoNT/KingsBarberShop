import axios from "axios";
import { Procedimento } from "../../interfaces/profissionaisInterface";

const api = axios.create({
  baseURL: "http://localhost:4001/api",
  headers: { "Content-Type": "application/json" },
});

export class ProcedimentoService {
  async fetchProcedimentos(): Promise<Procedimento[]> {
    try {
      const res = await api.get<{ status: boolean; data: Procedimento[] }>("/procedimentos/all");
      return res.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async createProcedimento(data: Partial<Procedimento>): Promise<Procedimento> {
    try {
      console.log(data);
      const res = await api.post("/procedimentos/create", data);
      if (res.data && res.data.status === false) throw new Error(res.data.message);
      return res.data.data || res.data;
    } catch (err: any) {
      console.error(err);
      if (err.response?.data) throw new Error(err.response.data.message || "Erro ao criar procedimento");
      if (err.message) throw err;
      throw new Error("Erro desconhecido ao criar procedimento");
    }
  }

  async updateProcedimento(id: string, data: Partial<Procedimento>): Promise<Procedimento | null> {
    try {
      const res = await api.put(`/procedimentos/update/${id}`, data);
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async deleteProcedimento(id: string): Promise<void> {
    try {
      await api.delete(`/procedimentos/delete/${id}`);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || "Erro ao deletar procedimento");
    }
  }

  async fetchProcedimentoById(id: string): Promise<Procedimento | null> {
    try {
      const res = await api.get(`/procedimentos/${id}`);
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}