import { LoginData, LoginResult, VerifyTokenResponse } from "@/app/interfaces/loginInterface";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  // Permitir envio de cookies
  headers: { "Content-Type": "application/json" },
});

export class AuthService {
  // ---------------- LOGIN ----------------
  async login(data: LoginData): Promise<LoginResult> {
    try {
      console.log("Tentando fazer login com os dados:", data); // Log para ver os dados enviados

      // Envia a requisição de login
      const response = await api.post<{ status: boolean; data?: LoginResult; message?: string }>("/auth/login", data);

      console.log("Resposta de login:", response.data);  // Log para ver a resposta

      if (!response.data.status || !response.data.data) {
        throw new Error(response.data.message || "Erro ao realizar login");
      }

      // Retorna os dados do usuário após login bem-sucedido
      return response.data.data;
    } catch (err) {
      console.error("Erro durante o login:", err);  // Log para ver o erro
      throw err;
    }
  }

  // ---------------- VERIFICAR TOKEN ----------------2
  async verifyToken(): Promise<boolean> {
    try {
      console.log("Verificando token...");

      // Envia a requisição para verificar se o token JWT é válido
      const response = await api.get<VerifyTokenResponse>("/auth/verify");

      console.log("Resposta da verificação do token:", response.data);  // Log para ver a resposta

      return response.data.status === true;  // Verifica se o status é verdadeiro
    } catch (err) {
      console.error("Erro ao verificar o token:", err);
      return false;  // Retorna false em caso de erro
    }
  }

  // ---------------- LOGOUT ----------------
  async logout(): Promise<void> {
    try {
      console.log("Fazendo logout...");

      // Envia requisição para fazer logout
      await api.post("/auth/logout");

      // O backend deve limpar o cookie de autenticação automaticamente
      console.log("Logout realizado com sucesso.");
    } catch (err: any) {
      console.error("Erro durante o logout:", err);
      throw err;  // Lança o erro em caso de falha
    }
  }
}