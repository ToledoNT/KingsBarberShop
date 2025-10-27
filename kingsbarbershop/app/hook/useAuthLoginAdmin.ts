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
    const user: LoginResult = await authService.login(data);

    // Armazenando todos os dados do usuário no localStorage
    localStorage.setItem("user", JSON.stringify(user)); // Armazenando o objeto completo

    setIsAuthenticated(true);
    router.push("/dashboard");
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
      localStorage.removeItem("userRole"); // Remove o role do localStorage
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

      if (valid) {
        // Se o token for válido, também verificamos o role armazenado
        const storedRole = localStorage.getItem("userRole");
        if (!storedRole) {
          setIsAuthenticated(false);
          router.push("/login");
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
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

  // Chama a função de verificação ao carregar a página
  useEffect(() => {
    verify(); // Verifica o token e o role ao carregar a página
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
