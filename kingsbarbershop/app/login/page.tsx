"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hook/useAuthLoginAdmin";
import Button from "../components/ui/Button";
import { LoginData } from "../interfaces/loginInterface";

const FullScreenLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-16 h-16 border-4 border-t-[#FFA500] border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin" />
  </div>
);

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutos

export default function LoginPage() {
  const { login, loading } = useAuth();

  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);

  /* =========================
     FOCUS
  ========================= */
  useEffect(() => {
    if (!lockoutUntil) {
      emailRef.current?.focus();
    }
  }, [lockoutUntil]);

  /* =========================
     RESTORE LOCKOUT
  ========================= */
  useEffect(() => {
    const savedAttempts = localStorage.getItem("loginAttempts");
    const savedLockout = localStorage.getItem("loginLockout");

    if (savedAttempts) {
      setAttempts(Number(savedAttempts));
    }

    if (savedLockout && Date.now() < Number(savedLockout)) {
      setLockoutUntil(Number(savedLockout));
    } else {
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("loginLockout");
    }
  }, []);

  const isLocked =
    lockoutUntil !== null && Date.now() < lockoutUntil;

  const minutesLeft = lockoutUntil
    ? Math.ceil((lockoutUntil - Date.now()) / 1000 / 60)
    : 0;

  /* =========================
     ATTEMPTS CONTROL
  ========================= */
  const failAttempt = () => {
    const next = attempts + 1;
    setAttempts(next);
    localStorage.setItem("loginAttempts", String(next));

    if (next >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_TIME;
      setLockoutUntil(until);
      localStorage.setItem("loginLockout", String(until));
    }
  };

  const successAttempt = () => {
    setAttempts(0);
    localStorage.removeItem("loginAttempts");
    localStorage.removeItem("loginLockout");
  };

  /* =========================
     VALIDATION
  ========================= */
  const isValid = () => {
    if (!form.email.includes("@")) return false;
    if (!form.email.includes(".")) return false;
    if (form.password.length < 6) return false;
    return true;
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (isLocked) {
      setError(
        `Muitas tentativas. Tente novamente em ${minutesLeft} minutos.`
      );
      return;
    }

    if (!isValid()) {
      setError("Dados inválidos");
      return;
    }

    setError(null);

    try {
      await login({
        email: form.email.trim(),
        password: form.password.trim(),
      });

      successAttempt();
      // ✅ redirect acontece dentro do hook
    } catch (err: any) {
      failAttempt();
      setError("Usuário ou senha inválidos");
    }
  };

  /* =========================
     INPUT HANDLERS
  ========================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const disabled = loading || isLocked;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D0D0D] via-[#1A1A2E] to-[#16213E] p-4">
      {loading && <FullScreenLoader />}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#1B1B1B]/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#FFA500]">
            Acesso Restrito
          </h1>
          <p className="text-gray-400 text-sm">
            Faça login para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-center text-red-400 text-sm">
            {error}
          </div>
        )}

        {isLocked && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl text-center text-yellow-400 text-sm">
            Muitas tentativas. Tente novamente em {minutesLeft} minutos.
          </div>
        )}

        <div>
          <label className="text-sm text-gray-300">E-mail</label>
          <input
            ref={emailRef}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className="w-full p-4 rounded-xl bg-[#2A2A2A] text-white"
          />
          {touched.email && !form.email.includes("@") && (
            <p className="text-xs text-red-400">Email inválido</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-300">Senha</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className="w-full p-4 rounded-xl bg-[#2A2A2A] text-white"
          />
          {touched.password && form.password.length < 6 && (
            <p className="text-xs text-red-400">
              Mínimo 6 caracteres
            </p>
          )}
        </div>

        <Button type="submit" disabled={disabled} fullWidth>
          {isLocked
            ? "Bloqueado"
            : loading
            ? "Entrando..."
            : "Entrar"}
        </Button>
      </form>
    </div>
  );
}