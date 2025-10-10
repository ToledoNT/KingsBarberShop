// app/api/frontend/authAdmin.ts
import { LoginData, LoginResponse } from "@/app/interfaces/loginInterface";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

interface AuthApiResponse {
  status: boolean;
  data?: LoginResponse;
  message?: string;
}

export class AuthService {
  // Login
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      console.log("Login attempt:", data.username, data.password);

      const response = await api.post<AuthApiResponse>("/backend/auth", data);

      if (!response.data.status) {
        throw new Error(response.data.message || "Erro ao realizar login");
      }

      return response.data.data!;
    } catch (err: any) {
      console.error("AuthService.login error:", err);
      throw new Error(
        err.response?.data?.message || err.message || "Erro desconhecido ao logar"
      );
    }
  }

  // Verifica token
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await api.get<AuthApiResponse>("/backend/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.status === true;
    } catch (err) {
      console.error("AuthService.verifyToken error:", err);
      return false;
    }
  }
}
