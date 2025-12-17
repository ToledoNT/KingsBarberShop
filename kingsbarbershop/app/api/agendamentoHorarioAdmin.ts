import axios from "axios";
import { HorarioDisponivel } from "../interfaces/agendamentoInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "https://www.kingsbarber.com.br/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


export class HorarioService {
  async fetchAllHorarios(): Promise<HorarioDisponivel[]> {
    try {
      const res = await api.get<ResponseTemplateInterface<HorarioDisponivel[]>>("/horario/getall");
      return res.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

 async createHorarioDisponivel(horario: Partial<HorarioDisponivel>): Promise<HorarioDisponivel | HorarioDisponivel[]> {
  try {
    const res = await api.post("/horario/create", horario);
    const data = res.data as ResponseTemplateInterface<HorarioDisponivel | HorarioDisponivel[]>;

    if (!data.status) throw new Error(data.message);

    return data.data; 
  } catch (err: any) {
    console.error(err);
    const msg = err?.response?.data?.message || err?.message || "Erro desconhecido ao criar horário";
    throw new Error(msg);
  }
}

  async updateHorario(id: string, horario: Partial<HorarioDisponivel>): Promise<HorarioDisponivel> {
    try {
      const res = await api.put<ResponseTemplateInterface<HorarioDisponivel>>(
        `/horario/update/${id}`,
        horario
      );
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || err.message || "Erro desconhecido ao atualizar horário");
    }
  }

  async deleteHorarioDisponivel(id: string): Promise<void> {
    try {
      const res = await api.delete<ResponseTemplateInterface<null>>(`/horario/delete/${id}`);
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

   async createHorarioIndividual(
  horario: Partial<HorarioDisponivel>
): Promise<HorarioDisponivel> {
  try {
    const res = await api.post<ResponseTemplateInterface<HorarioDisponivel>>(
      "/horario/create-individual",
      horario
    );

    const data = res.data as ResponseTemplateInterface<HorarioDisponivel>;

    if (!data.status) {
      throw new Error(data.message || "Falha ao criar horário individual");
    }

    const horarioCriado =
      (data.data as any)?.data || data.data || (res.data as any)?.data?.data;

    if (!horarioCriado) {
      throw new Error("Horário criado inválido ou vazio.");
    }

    return horarioCriado;
  } catch (err: any) {
    console.error("❌ Erro ao criar horário individual:", err);
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Erro desconhecido ao criar horário individual";
    throw new Error(msg);
    }
  }
}