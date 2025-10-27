import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginData, UseAuthReturn, LoginResult } from "../interfaces/loginInterface";
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
      // Tentamos logar com o serviço de backend
      const user: LoginResult = await authService.login(data);

      // Se o login for bem-sucedido, o token já estará no cookie HttpOnly
      setIsAuthenticated(true);
      router.push("/dashboard"); // Redireciona para o painel após o login
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Erro ao logar";
      setError(message);
      setIsAuthenticated(false);
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
      // O token HttpOnly será removido automaticamente pelo backend ao limpar o cookie
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- VERIFY -------------------
  const verify = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verifica se o token no cookie HttpOnly é válido
      const valid: boolean = await authService.verifyToken();

      setIsAuthenticated(valid);

      if (!valid) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Erro na verificação do token:", err);
      setIsAuthenticated(false);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verify(); // Verifica o token ao carregar a página
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
