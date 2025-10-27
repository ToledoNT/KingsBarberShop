import { LoginData, LoginResult, VerifyTokenResponse } from "@/app/interfaces/loginInterface";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
});

export class AuthService {
  // ---------------- LOGIN ----------------
  async login(data: LoginData): Promise<LoginResult> {
    const response = await api.post<{ status: boolean; data?: LoginResult; message?: string }>("/auth/login", data);

    // Verifica a resposta para garantir que o login foi bem-sucedido
    if (!response.data.status || !response.data.data) {
      throw new Error(response.data.message || "Erro ao realizar login");
    }

    // ✅ Retorna apenas os dados do usuário (LoginResult), sem o status
    return response.data.data;
  }

  // ---------------- VERIFICAR TOKEN ----------------
  async verifyToken(): Promise<boolean> {
    try {
      const response = await api.get<VerifyTokenResponse>("/auth/verify");
      return response.data.status === true;
    } catch (err) {
      console.error("AuthService.verifyToken error:", err);
      return false;
    }
  }

  // ---------------- LOGOUT ----------------
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
      // ✅ O token será removido automaticamente pelo backend ao limpar o cookie
    } catch (err: any) {
      console.error("AuthService.logout error:", err);
      throw err;
    }
  }
}
