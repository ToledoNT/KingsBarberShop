"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/app/api/authAdmin";

// Serviço de autenticação
const authService = new AuthService();

// Interface para as props do componente
interface CadeadoAcessoProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

/**
 * Componente de Cadeado de Acesso
 */
function CadeadoAcesso({ 
  children, 
  fallback, 
  loadingComponent
}: CadeadoAcessoProps) {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      try {
        const valid = await authService.verifyToken();
        if (!valid) {
          console.warn("Token inválido ou expirado. Redirecionando para login...");
          router.replace("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Erro na verificação de token:", err);
        router.replace("/login");
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Componente de Loading padrão
  const DefaultLoading = () => (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500] mx-auto mb-4"></div>
        <p className="text-sm text-gray-400">Verificando autenticação...</p>
      </div>
    </div>
  );

  // Renderização condicional
  if (authLoading) {
    return loadingComponent || <DefaultLoading />;
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  // Se autenticado, renderiza o conteúdo children
  return <>{children}</>;
}

export default CadeadoAcesso;