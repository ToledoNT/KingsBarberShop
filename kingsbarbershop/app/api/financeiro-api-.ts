import axios from "axios";
import { IFinanceiro } from "../interfaces/financeiroInterface";
import { ResponseTemplateInterface } from "../interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "https://www.kingsbarber.com.br/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class FinanceiroService {
  async fetchFinanceiros(): Promise<IFinanceiro[]> {
    try {
      const res = await api.get<ResponseTemplateInterface<IFinanceiro[]>>("/financeiro/getall");

      if (!res.data.status || !res.data.data) {
        throw new Error(res.data.message || "Erro ao buscar lançamentos financeiros.");
      }

      return res.data.data;
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        status === 403
          ? "Acesso negado: apenas administradores podem acessar o financeiro."
          : status === 401
          ? "Sessão expirada. Faça login novamente."
          : "Erro ao buscar lançamentos financeiros.";

      throw new Error(message);
    }
  }
}