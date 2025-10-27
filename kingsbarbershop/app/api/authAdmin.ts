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
  try {

    const response = await api.post<{ status: boolean; data?: LoginResult; message?: string }>("/auth/login", data);


    if (!response.data.status || !response.data.data) {
      throw new Error(response.data.message || "Erro ao realizar login");
    }

    const role = response.data.data.role;
    localStorage.setItem("role", role);  

   localStorage.setItem("user", JSON.stringify(response.data.data));  

    return response.data.data;
  } catch (err) {
    console.error("Erro durante o login:", err);  
    throw err;
  }
}

  // ---------------- VERIFICAR TOKEN ----------------2
  async verifyToken(): Promise<boolean> {
    try {
      console.log("Verificando token...");

      const response = await api.get<VerifyTokenResponse>("/auth/verify");

      return response.data.status === true;  
    } catch (err) {
      console.error("Erro ao verificar o token:", err);
      return false;  
    }
  }

  // ---------------- LOGOUT ----------------
  async logout(): Promise<void> {
    try {
      console.log("Fazendo logout...");

      await api.post("/auth/logout");

      localStorage.removeItem("role"); 
      console.log("Logout realizado com sucesso.");
    } catch (err: any) {
      console.error("Erro durante o logout:", err);
      throw err; 
    }
  }
}