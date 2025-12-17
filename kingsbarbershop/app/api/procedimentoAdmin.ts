import axios from "axios";
import { Procedimento } from "../interfaces/profissionaisInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "https://www.kingsbarber.com.br/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class ProcedimentoService {
  async fetchProcedimentos(): Promise<Procedimento[]> {
    try {
      const res = await api.get<ResponseTemplateInterface<Procedimento[]>>("/procedimento/getall");
      return res.data.data || [];
    } catch (err) {
      console.error("Erro ao buscar procedimentos:", err);
      return [];
    }
  }

  async createProcedimento(data: Partial<Procedimento>): Promise<Procedimento> {
    try {
      const res = await api.post<ResponseTemplateInterface<Procedimento>>("/procedimento/create", data);
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error("Erro ao criar procedimento:", err);
      throw new Error(err.response?.data?.message || "Erro ao criar procedimento");
    }
  }

  async updateProcedimento(id: string, data: Partial<Procedimento>): Promise<Procedimento | null> {
    try {
      const res = await api.put<ResponseTemplateInterface<Procedimento>>(`/procedimento/update/${id}`, data);
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error("Erro ao atualizar procedimento:", err);
      return null;
    }
  }

  async deleteProcedimento(id: string): Promise<void> {
    try {
      const res = await api.delete<ResponseTemplateInterface<null>>(`/procedimento/delete/${id}`);
      if (!res.data.status) throw new Error(res.data.message);
    } catch (err: any) {
      console.error("Erro ao deletar procedimento:", err);
      throw new Error(err.response?.data?.message || "Erro ao deletar procedimento");
    }
  }

  async fetchProcedimentoById(id: string): Promise<Procedimento | null> {
    try {
      const res = await api.get<ResponseTemplateInterface<Procedimento>>(`/procedimento/${id}`);
      return res.data.data || null;
    } catch (err) {
      console.error("Erro ao buscar procedimento por ID:", err);
      return null;
    }
  }
}