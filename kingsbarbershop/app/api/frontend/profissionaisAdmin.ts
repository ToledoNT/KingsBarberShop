import axios from "axios";
import { Profissional } from "../../interfaces/profissionaisInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "http://localhost:4001/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export class ProfissionalService {
  async fetchProfissionais(signal?: AbortSignal): Promise<Profissional[]> {
    try {
      const res = await api.request<ResponseTemplateInterface<Profissional[]>>({
        url: "/profissional/getall",
        method: "GET",
        ...(signal ? { signal } as any : {}),
      });
      console.log(res);
      return res.data.data ?? [];
    } catch (err: any) {
      if (err.name === "CanceledError" || err.name === "AbortError") return [];
      console.error("Erro ao buscar profissionais:", err);
      return [];
    }
  }

  async createProfissional(data: Partial<Profissional>): Promise<Profissional> {
    const res = await api.post<ResponseTemplateInterface<Profissional>>(
      "/profissional/create",
      data
    );
    if (!res.data.status) throw new Error(res.data.message);
    return res.data.data!;
  }

  async updateProfissional(id: string, data: Partial<Profissional>): Promise<Profissional | null> {
    try {
      const res = await api.put<ResponseTemplateInterface<Profissional>>(
        `/profissional/update/${id}`,
        data
      );
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data ?? null;
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
      throw new Error(err.message || "Erro ao deletar profissional");
    }
  }

  async fetchProfissionalById(id: string): Promise<Profissional | null> {
    try {
      const res = await api.get<ResponseTemplateInterface<Profissional>>(`/profissional/${id}`);
      return res.data.data ?? null;
    } catch (err: any) {
      console.error("Erro ao buscar profissional por ID:", err);
      return null;
    }
  }
}