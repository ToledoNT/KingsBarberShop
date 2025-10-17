// hook/useAuthLoginAdmin.ts
"use client";

import { useState, useEffect } from "react";
import { LoginData, UseAuthReturn } from "../interfaces/loginInterface";
import { AuthService } from "../api/authAdmin";

const authService = new AuthService();

export function useAuth(): UseAuthReturn {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);

      authService.verifyToken(storedToken).then((valid) => {
        if (!valid) {
          localStorage.removeItem("token");
          setToken(null);
          setIsAuthenticated(false);
        }
      }).catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setIsAuthenticated(false);
      });
    }
  }, []);

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Login attempt:", data.email, data.password);

      const res = await authService.login(data);

      if (!res?.token) throw new Error("Token não retornou do servidor");

      setToken(res.token);
      localStorage.setItem("token", res.token);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || err.message || "Erro ao logar");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return { login, logout, token, loading, error, isAuthenticated };
}