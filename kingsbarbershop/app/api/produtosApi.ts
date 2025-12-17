import axios from "axios";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { IProduto } from "../interfaces/produtosInterface";

const api = axios.create({
  baseURL: "https://www.kingsbarber.com.br/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


export class ProductService {
  async fetchProdutos(): Promise<IProduto[]> {
    try {
      const res = await api.get<ResponseTemplateInterface<IProduto[]>>("/produto/getall");
      console.log(res)
      return res.data.data || [];
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      return [];
    }
  }

  async createProduto(data: Partial<IProduto>): Promise<IProduto> {
    try {
      const res = await api.post<ResponseTemplateInterface<IProduto>>("/produto/create", data);
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error("Erro ao criar produto:", err);
      throw new Error(err.response?.data?.message || "Erro ao criar produto");
    }
  }

  async updateProduto(id: string, data: Partial<IProduto>): Promise<IProduto | null> {
    try {
      const res = await api.put<ResponseTemplateInterface<IProduto>>(`/produto/update/${id}`, data);
      if (!res.data.status) throw new Error(res.data.message);
      return res.data.data;
    } catch (err: any) {
      console.error("Erro ao atualizar produto:", err);
      return null;
    }
  }

  async deleteProduto(id: string): Promise<void> {
    try {
      const res = await api.delete<ResponseTemplateInterface<null>>(`/produto/delete/${id}`);
      if (!res.data.status) throw new Error(res.data.message);
    } catch (err: any) {
      console.error("Erro ao deletar produto:", err);
      throw new Error(err.response?.data?.message || "Erro ao deletar produto");
    }
  }

  async fetchProdutoById(id: string): Promise<IProduto | null> {
    try {
      const res = await api.get<ResponseTemplateInterface<IProduto>>(`/produto/${id}`);
      return res.data.data || null;
    } catch (err) {
      console.error("Erro ao buscar produto por ID:", err);
      return null;
    }
  }
}
