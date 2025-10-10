import axios from "axios";
import { Profissional } from "../../interfaces/profissionaisInterface";

const api = axios.create({
  baseURL: "http://localhost:4001/api",
  headers: { "Content-Type": "application/json" },
});

export class ProfissionalService {
  async fetchProfissionais(): Promise<Profissional[]> {
    try {
      const res = await api.get<{ status: boolean; data: Profissional[] }>("/profissionais/all");
      return res.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async fetchBarbeiros(): Promise<{ nome: string }[]> {
    try {
      const res = await api.get<{ status: boolean; data: { nome: string }[] }>("/barbeiros/all"); // Substitua a URL conforme necessário
      return res.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async createProfissional(data: Partial<Profissional>): Promise<Profissional> {
    try {
      console.log(data);
      const res = await api.post("/profissionais/create", data);
      if (res.data && res.data.status === false) throw new Error(res.data.message);
      return res.data.data || res.data;
    } catch (err: any) {
      console.error(err);
      if (err.response?.data) throw new Error(err.response.data.message || "Erro ao criar profissional");
      if (err.message) throw err;
      throw new Error("Erro desconhecido ao criar profissional");
    }
  }

  async updateProfissional(id: string, data: Partial<Profissional>): Promise<Profissional | null> {
    try {
      const res = await api.put(`/profissionais/update/${id}`, data);
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async deleteProfissional(id: string): Promise<void> {
    try {
      await api.delete(`/profissionais/delete/${id}`);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || "Erro ao deletar profissional");
    }
  }

  async fetchProfissionalById(id: string): Promise<Profissional | null> {
    try {
      const res = await api.get(`/profissionais/${id}`);
      return res.data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}