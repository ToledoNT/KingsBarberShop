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
const login = async (data: LoginData): Promise<void> => {
  if (loading) return; // evita clique duplo

  setLoading(true);
  setError(null);

  try {
    const user: LoginResult = await authService.login(data);

    // 🔹 padroniza storage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userRole", user.role);

    setIsAuthenticated(true);

router.push("/agendamentos");
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err.message || "Erro ao logar";

    setError(message);
    setIsAuthenticated(false);

    throw err; // mantém compatibilidade com o LoginPage
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
      localStorage.removeItem("user");
      localStorage.removeItem("userRole"); 
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
      const valid: boolean = await authService.verifyToken();

      if (valid) {
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