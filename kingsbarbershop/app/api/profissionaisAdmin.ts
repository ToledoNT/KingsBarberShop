import axios from "axios";
import { BarbeiroDadosResponse, Profissional } from "../interfaces/profissionaisInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { HorarioDisponivel, Procedimento } from "@/app/interfaces/agendamentoInterface";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true, // ✅ importante para cookies HTTP-only
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

  async deleteProfissional(id: string): Promise<ResponseTemplateInterface<any>> {
    try {
      const res = await api.delete<ResponseTemplateInterface<any>>(
        `/profissional/delete/${id}`,
        {
          validateStatus: () => true, 
        }
      );

      return res.data;
    } catch (err: any) {
      console.error("Erro ao deletar profissional:", err);
      throw new Error(err.message || "Erro ao deletar profissional");
    }
  }

  // ---------------------------
  // Buscar horários e procedimentos de um barbeiro
  // ---------------------------
  async fetchHorariosByProfissional(profissionalId: string): Promise<BarbeiroDadosResponse> {
    try {
      const res = await api.get<ResponseTemplateInterface<BarbeiroDadosResponse>>(
        `/horario/barbeiro/${profissionalId}`
      );

      console.log(res);

      return {
        barbeiroId: res.data.data?.barbeiroId ?? profissionalId,
        horarios: res.data.data?.horarios ?? [],
        procedimentos: res.data.data?.procedimentos ?? [],
      };
    } catch (err) {
      console.error("Erro ao buscar horários do barbeiro:", err);
      return {
        barbeiroId: profissionalId,
        horarios: [],
        procedimentos: [],
      };
    }
  }
}