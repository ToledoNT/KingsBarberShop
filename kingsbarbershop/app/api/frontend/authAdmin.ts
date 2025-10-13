// app/api/frontend/authAdmin.ts
import { LoginData, LoginResponse } from "@/app/interfaces/loginInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4001/api", 
  headers: { "Content-Type": "application/json" },
});

export class AuthService {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<ResponseTemplateInterface>("/auth/login", data);

    if (!response.data.status) {
      throw new Error(response.data.message || "Erro ao realizar login");
    }

    return response.data.data!;
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await api.get<ResponseTemplateInterface>("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.status === true;
    } catch (err) {
      console.error("AuthService.verifyToken error:", err);
      return false;
    }
  }
}