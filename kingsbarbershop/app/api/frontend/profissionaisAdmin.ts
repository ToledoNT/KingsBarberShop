import axios from "axios";
import { Profissional } from "../../interfaces/profissionaisInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "http://localhost:4001/api", 
  headers: { "Content-Type": "application/json" },
});

export class ProfissionalService {
  async fetchProfissionais(): Promise<Profissional[]> {
    try {
      const res = await api.get<ResponseTemplateInterface<Profissional[]>>("/profissional/getall");
      return res.data.data || [];
    } catch (err) {
      console.error("Erro ao buscar profissionais:", err);
      return [];
    }
  }

  async createProfissional(data: Partial<Profissional>): Promise<Profissional> {
    try {
      const res = await api.post<ResponseTemplateInterface<Profissional>>("/profissional/create", data);
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error("Erro ao criar profissional:", err);
      throw new Error(err.response?.data?.message || "Erro ao criar profissional");
    }
  }

  async updateProfissional(id: string, data: Partial<Profissional>): Promise<Profissional | null> {
    try {
      const res = await api.put<ResponseTemplateInterface<Profissional>>(`/profissional/update/${id}`, data);
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error("Erro ao atualizar profissional:", err);
      return null;
    }
  }

  async deleteProfissional(id: string): Promise<void> {
    try {
      const res = await api.delete<ResponseTemplateInterface<null>>(`/profissional/delete/${id}`);
      if (!res.data.status) throw new Error(res.data.message);
    } catch (err: any) {
      console.error("Erro ao deletar profissional:", err);
      throw new Error(err.response?.data?.message || "Erro ao deletar profissional");
    }
  }

  async fetchProfissionalById(id: string): Promise<Profissional | null> {
    try {
      const res = await api.get<ResponseTemplateInterface<Profissional>>(`/profissional/${id}`);
      return res.data.data || null;
    } catch (err) {
      console.error("Erro ao buscar profissional por ID:", err);
      return null;
    }
  }
}
