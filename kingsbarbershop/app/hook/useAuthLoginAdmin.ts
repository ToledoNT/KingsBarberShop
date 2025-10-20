"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginData, UseAuthReturn, LoginResponse } from "../interfaces/loginInterface";
import { AuthService } from "../api/authAdmin";

const authService = new AuthService();

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // ------------------- LOGIN -------------------
const login = async (data: LoginData) => {
  setLoading(true);
  setError(null);

  try {
    // 🔹 Aqui recebe o objeto direto
    const res = await authService.login(data);
    
    // 🔹 Salva token do objeto
    const token = res.token;
    if (!token) throw new Error("Token não recebido");

    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    router.push("/dashboard");
  } catch (err: any) {
    const message = err?.response?.data?.message || err.message || "Erro ao logar";
    setError(message);
    setIsAuthenticated(false);
    throw new Error(message);
  } finally {
    setLoading(false);
  }
};



  // ------------------- LOGOUT -------------------
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- VERIFY -------------------
  const verify = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        router.push("/login");
        return;
      }

      const valid: boolean = await authService.verifyToken(); 
      setIsAuthenticated(valid);

      if (!valid) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch (err) {
      console.error("Verify token error:", err);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- AO MONTAR -------------------
  useEffect(() => {
    verify();
  }, []);

  return {
    login,
    logout,
    verify,
    loading,
    error,
    isAuthenticated,
  };
}
