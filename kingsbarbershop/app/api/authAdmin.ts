import { LoginData, LoginResult, VerifyTokenResponse } from "@/app/interfaces/loginInterface";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  // Isso permite que os cookies sejam enviados
  headers: { "Content-Type": "application/json" },
});


export class AuthService {
  // ---------------- LOGIN ----------------
async login(data: LoginData): Promise<LoginResult> {
  const response = await api.post<{ status: boolean; data?: LoginResult; message?: string }>("/auth/login", data);

  if (!response.data.status || !response.data.data) {
    throw new Error(response.data.message || "Erro ao realizar login");
  }

  return response.data.data;  // Retorna apenas os dados do usuário
}

  // ---------------- VERIFICAR TOKEN ----------------
async verifyToken(): Promise<boolean> {
  try {
    const response = await api.get<VerifyTokenResponse>("/auth/verify");
    return response.data.status === true;  // Verifica se o status é verdadeiro
  } catch (err) {
    console.error("AuthService.verifyToken error:", err);
    return false;  // Retorna false em caso de erro
  }
}


  // ---------------- LOGOUT ----------------
async logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
    // O backend deve limpar o cookie de autenticação automaticamente
  } catch (err: any) {
    console.error("AuthService.logout error:", err);
    throw err;  // Lança o erro em caso de falha
  }
}

}
