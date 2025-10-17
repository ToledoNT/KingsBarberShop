// src/api/frontend/financeiroService.ts
import axios from "axios";
import { IFinanceiro } from "../interfaces/financeiroInterface";
import { ResponseTemplateInterface } from "../interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "http://localhost:4001/api", // ajuste conforme seu backend
  headers: { "Content-Type": "application/json" },
});

export class FinanceiroService {
  async fetchFinanceiros(): Promise<IFinanceiro[]> {
    try {
      const res = await api.get<ResponseTemplateInterface<IFinanceiro[]>>("/financeiro/getall");
      return res.data.data || [];
    } catch (err) {
      console.error("Erro ao buscar lançamentos financeiros:", err);
      return [];
    }
  }
}