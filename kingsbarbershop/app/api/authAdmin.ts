import { LoginData, LoginResult, VerifyTokenResponse } from "@/app/interfaces/loginInterface";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
});

export class AuthService {
  async login(data: LoginData): Promise<LoginResult> {
    const response = await api.post<{ status: boolean; data?: LoginResult; message?: string }>("/auth/login", data);

    if (!response.data.status || !response.data.data) {
      throw new Error(response.data.message || "Erro ao realizar login");
    }

    return response.data.data;
  }

  async verifyToken(): Promise<boolean> {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const response = await api.get<VerifyTokenResponse>("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.status === true;
  } catch (err) {
    console.error("AuthService.verifyToken error:", err);
    return false;
  }
}

async logout(): Promise<void> {
  try {
    const token = localStorage.getItem("token"); 
    console.log(token)
    if (!token) throw new Error("Token não encontrado");

    await api.post(
      "/auth/logout",
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, 
      }
    );

    localStorage.removeItem("token");
  } catch (err: any) {
    console.error("AuthService.logout error:", err);
    throw err; 
   }
  }
}