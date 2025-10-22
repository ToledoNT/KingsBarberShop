import axios from "axios";
import { IFinanceiro } from "../interfaces/financeiroInterface";
import { ResponseTemplateInterface } from "../interfaces/response-templete-interface";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export class FinanceiroService {
  async fetchFinanceiros(): Promise<IFinanceiro[]> {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Você precisa estar logado para acessar o financeiro.");
      }

      const res = await api.get<ResponseTemplateInterface<IFinanceiro[]>>(
        "/financeiro/getall",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data || [];
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        status === 403
          ? "Acesso negado: apenas administradores podem acessar o financeiro."
          : status === 401
          ? "Sessão expirada. Faça login novamente."
          : "Erro ao buscar lançamentos financeiros.";

      // Lança o erro para ser tratado pelo componente
      throw new Error(message);
    }
  }
}