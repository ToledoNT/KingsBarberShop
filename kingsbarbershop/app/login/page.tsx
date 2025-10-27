"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hook/useAuthLoginAdmin";
import Button from "../components/ui/Button";
import { LoginData } from "../interfaces/loginInterface";

const FullScreenLoader = React.memo(() => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-16 h-16 border-4 border-t-[#FFA500] border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
  </div>
));

FullScreenLoader.displayName = 'FullScreenLoader';

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
  const emailInputRef = useRef<HTMLInputElement>(null);

const checkUserRoleAndRedirect = useCallback(() => {
  try {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    let isAdminOrBarbeiro = false;

    if (userData) {
      const parsedUser = JSON.parse(userData);
      const userRole = parsedUser.role?.toUpperCase();  // Converte para maiúsculo uma vez
      isAdminOrBarbeiro = ['ADMIN', 'BARBEIRO'].includes(userRole);
    }

    if (!isAdminOrBarbeiro && token) {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const tokenRole = payload.role?.toUpperCase(); 
      isAdminOrBarbeiro = ['ADMIN', 'BARBEIRO'].includes(tokenRole);
    }

    // Redireciona para o dashboard ou agendamentos
    router.push(isAdminOrBarbeiro ? "/dashboard" : "/agendamentos");

  } catch (err) {
    console.error('Erro ao verificar role e redirecionar:', err);
    router.push("/agendamentos");
  }
}, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      checkUserRoleAndRedirect();
    }
  }, [isAuthenticated, checkUserRoleAndRedirect]);

  useEffect(() => {
    const initializeAuth = () => {
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
    };

    initializeAuth();
  }, []);

  const isValidForm = useCallback((email: string, password: string) => {
    const hasValidEmail = email.includes('@') && email.includes('.') && email.length > 5;
    const hasValidPassword = password.length >= 6;
    return hasValidEmail && hasValidPassword;
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (touched.email && touched.password) {
        if (!isValidForm(form.email, form.password)) {
          setValidationError("Verifique se o email é válido e a senha tem pelo menos 6 caracteres");
        } else {
          setValidationError(null);
        }
      } else {
        setValidationError(null);
      }
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [form.email, form.password, touched.email, touched.password, isValidForm]);

  const isLocked = useMemo(() => 
    lockoutUntil !== null && Date.now() < lockoutUntil, 
    [lockoutUntil]
  );
  
  const canSubmit = useMemo(() => 
    !isLocked &&
    form.email.length > 0 &&
    form.password.length > 0 &&
    !loading &&
    !isSubmitting,
    [isLocked, form.email, form.password, loading, isSubmitting]
  );

  const handleFailedAttempt = useCallback(() => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    localStorage.setItem("loginAttempts", newAttempts.toString());

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_TIME;
      setLockoutUntil(lockoutTime);
      localStorage.setItem("loginLockout", lockoutTime.toString());
    }
  }, [attempts]);

  const handleSuccessfulAttempt = useCallback(() => {
    setAttempts(0);
    localStorage.removeItem("loginAttempts");
    localStorage.removeItem("loginLockout");
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [canSubmit, isLocked, form, isValidForm, login, handleSuccessfulAttempt, handleFailedAttempt, error]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setForm(prev => ({ 
      ...prev, 
      [name]: name === 'email' ? value.replace(/[<>]/g, "") : value 
    }));
    
    if (validationError) {
      setValidationError(null);
    }
  }, [validationError]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  useEffect(() => {
    if (!isLocked && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isLocked]);

  const getLockoutTimeLeft = useCallback(() => {
    if (!lockoutUntil) return 0;
    return Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
  }, [lockoutUntil]);

  const shouldShowEmailError = useMemo(() => 
    touched.email && form.email && !form.email.includes('@'),
    [touched.email, form.email]
  );

  const shouldShowPasswordError = useMemo(() => 
    touched.password && form.password.length < 6,
    [touched.password, form.password]
  );

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
                ref={emailInputRef}
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
              {shouldShowEmailError && (
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
              {shouldShowPasswordError && (
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