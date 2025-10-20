"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hook/useAuthLoginAdmin";
import Button from "../components/ui/Button";
import { LoginData } from "../interfaces/loginInterface";

// Loader customizado full-screen
const FullScreenLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-16 h-16 border-4 border-t-[#FFA500] border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
  </div>
);

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutos

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading, error } = useAuth();
  const [form, setForm] = useState<LoginData>({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  useEffect(() => {
    const savedLockout = localStorage.getItem("loginLockout");
    if (savedLockout) {
      const lockoutTime = parseInt(savedLockout, 10);
      if (Date.now() < lockoutTime) setLockoutUntil(lockoutTime);
      else {
        localStorage.removeItem("loginLockout");
        localStorage.removeItem("loginAttempts");
      }
    }
    const savedAttempts = localStorage.getItem("loginAttempts");
    if (savedAttempts) setAttempts(parseInt(savedAttempts, 10));
  }, []);

  const isValidForm = (email: string, password: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && password.length >= 8;
  };

  const errors = {
    general:
      touched.email &&
      touched.password &&
      !isValidForm(form.email, form.password)
        ? "Verifique seus dados e tente novamente"
        : null,
  };

  const isLocked: boolean = lockoutUntil !== null && Date.now() < lockoutUntil;
  const canSubmit =
    !isLocked &&
    form.email.length > 0 &&
    form.password.length > 0 &&
    !errors.general &&
    !loading;

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
    if (!canSubmit || isLocked) return;

    setIsSubmitting(true);
    try {
      await login(form);
      handleSuccessfulAttempt();
    } catch {
      handleFailedAttempt();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    if (name === "email") sanitizedValue = value.replace(/[<>]/g, "");
    if (name === "password" && value.length > 100) return;
    setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
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
      {/* Loader centralizado */}
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

          {(error || errors.general) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-red-400 text-sm">{error || errors.general}</p>
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
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!canSubmit || isSubmitting}
          >
            {isLocked ? "Acesso Temporariamente Bloqueado" : isSubmitting ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}