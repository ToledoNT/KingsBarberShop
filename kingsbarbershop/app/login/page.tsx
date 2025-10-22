"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hook/useAuthLoginAdmin";
import Button from "../components/ui/Button";
import { LoginData } from "../interfaces/loginInterface";

const FullScreenLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-16 h-16 border-4 border-t-[#FFA500] border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
  </div>
);

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading, error } = useAuth();
  const [form, setForm] = useState<LoginData>({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const checkUserRoleAndRedirect = () => {
        try {
          const userData = localStorage.getItem('user');
          const token = localStorage.getItem('token');
          
          let isAdmin = false;

          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              const userRole = parsedUser.role?.toLowerCase();
              isAdmin = userRole === 'admin' || userRole === 'administrador';
            } catch (error) {
              console.error('Erro ao verificar role:', error);
            }
          }

          if (!isAdmin && token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const tokenRole = payload.role?.toLowerCase();
              isAdmin = tokenRole === 'admin' || tokenRole === 'administrador';
            } catch (error) {
              console.error('Erro ao decodificar token:', error);
            }
          }

          if (isAdmin) {
            router.push("/dashboard");
          } else {
            router.push("/agendamentos");
          }
        } catch (err) {
          console.error('Erro ao redirecionar:', err);
          router.push("/agendamentos");
        }
      };

      checkUserRoleAndRedirect();
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const savedLockout = localStorage.getItem("loginLockout");
    if (savedLockout) {
      const lockoutTime = parseInt(savedLockout, 10);
      if (Date.now() < lockoutTime) {
        setLockoutUntil(lockoutTime);
      } else {
        localStorage.removeItem("loginLockout");
        localStorage.removeItem("loginAttempts");
      }
    }
    
    const savedAttempts = localStorage.getItem("loginAttempts");
    if (savedAttempts) setAttempts(parseInt(savedAttempts, 10));
  }, []);

  const isValidForm = (email: string, password: string) => {
    const hasValidEmail = email.includes('@') && email.includes('.') && email.length > 5;
    const hasValidPassword = password.length >= 6;
    return hasValidEmail && hasValidPassword;
  };

  useEffect(() => {
    if (touched.email && touched.password) {
      if (!isValidForm(form.email, form.password)) {
        setValidationError("Verifique se o email é válido e a senha tem pelo menos 6 caracteres");
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [form.email, form.password, touched.email, touched.password]);

  const isLocked = lockoutUntil !== null && Date.now() < lockoutUntil;
  
  const canSubmit = !isLocked &&
    form.email.length > 0 &&
    form.password.length > 0 &&
    !loading &&
    !isSubmitting;

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    localStorage.setItem("loginAttempts", newAttempts.toString());

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_TIME;
      setLockoutUntil(lockoutTime);
      localStorage.setItem("loginLockout", lockoutTime.toString());
    }
  };

  const handleSuccessfulAttempt = () => {
    setAttempts(0);
    localStorage.removeItem("loginAttempts");
    localStorage.removeItem("loginLockout");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({ email: true, password: true });
    
    if (!canSubmit || isLocked) return;

    if (!isValidForm(form.email, form.password)) {
      setValidationError("Verifique seus dados e tente novamente");
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);
    
    try {
      const trimmedForm: LoginData = {
        email: form.email.trim(),
        password: form.password.trim(),
      };
      
      await login(trimmedForm);
      handleSuccessfulAttempt();
    } catch (err: any) {
      handleFailedAttempt();
      if (!error) {
        setValidationError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setForm(prev => ({ 
      ...prev, 
      [name]: name === 'email' ? value.replace(/[<>]/g, "") : value 
    }));
    
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  useEffect(() => {
    if (!isLocked) document.getElementById("email")?.focus();
  }, [isLocked]);

  const getLockoutTimeLeft = () => {
    if (!lockoutUntil) return 0;
    return Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A2E] to-[#16213E] flex items-center justify-center p-4 relative">
      {loading && <FullScreenLoader />}

      <div className="relative w-full max-w-md z-10">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative bg-[#1B1B1B]/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl p-8 sm:p-10 flex flex-col gap-8 transform transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFA500]/10"
          noValidate
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFA500] to-[#FF6B35] bg-clip-text text-transparent">
              Acesso Restrito
            </h1>
            <p className="text-gray-400 text-sm">Faça login para continuar</p>
          </div>

          {isLocked && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
              <p className="text-yellow-400 text-sm">
                Muitas tentativas. Tente novamente em {getLockoutTimeLeft()} minutos.
              </p>
            </div>
          )}

          {(error || validationError) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-red-400 text-sm">{error || validationError}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-4 rounded-2xl bg-[#2A2A2A]/80 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 transition-all duration-300"
                required
                disabled={loading || isLocked}
                autoComplete="email"
              />
              {touched.email && form.email && !form.email.includes('@') && (
                <p className="text-red-400 text-xs">Digite um email válido</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Senha
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-4 rounded-2xl bg-[#2A2A2A]/80 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 transition-all duration-300"
                required
                disabled={loading || isLocked}
                maxLength={100}
                autoComplete="current-password"
              />
              {touched.password && form.password.length < 6 && (
                <p className="text-red-400 text-xs">Mínimo 6 caracteres</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!canSubmit || isSubmitting}
          >
            {isLocked 
              ? "Acesso Temporariamente Bloqueado" 
              : isSubmitting 
                ? "Verificando..." 
                : "Entrar"
            }
          </Button>
        </form>
      </div>
    </div>
  );
}