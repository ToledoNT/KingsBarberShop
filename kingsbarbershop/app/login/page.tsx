"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hook/useAuthLoginAdmin";
import Button from "../components/ui/Button";
import { LoginData } from "../interfaces/loginInterface";

const FullScreenLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-16 h-16 border-4 border-t-[#FFA500] border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin" />
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const isValidForm = () => {
    return (
      form.email.includes("@") &&
      form.email.includes(".") &&
      form.email.length > 5 &&
      form.password.length >= 6
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValidForm()) {
      setError("Preencha corretamente email e senha.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await login({
        email: form.email.trim(),
        password: form.password.trim(),
      });

      const role = (localStorage.getItem("role") || "").toUpperCase();

      if (role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/agendamentos");
      }
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 401) {
        setError("Usuário ou senha inválidos.");
      } else if (status === 429) {
        setError("Muitas tentativas. Aguarde alguns minutos.");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D0D0D] via-[#1A1A2E] to-[#16213E] p-4 relative">
      {(loading || isSubmitting) && <FullScreenLoader />}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md bg-[#1B1B1B]/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 z-10"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFA500] to-[#FF6B35] bg-clip-text text-transparent">
            Acesso Restrito
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Faça login para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="text-sm text-gray-300">E-mail</label>
          <input
            ref={emailRef}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            disabled={loading || isSubmitting}
            className="w-full mt-2 p-4 rounded-2xl bg-[#2A2A2A] border border-gray-700 text-white focus:ring-2 focus:ring-[#FFA500]/50 outline-none"
          />
          {touched.email && !form.email.includes("@") && (
            <p className="text-xs text-red-400 mt-1">Email inválido</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-300">Senha</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="current-password"
            disabled={loading || isSubmitting}
            className="w-full mt-2 p-4 rounded-2xl bg-[#2A2A2A] border border-gray-700 text-white focus:ring-2 focus:ring-[#FFA500]/50 outline-none"
          />
          {touched.password && form.password.length < 6 && (
            <p className="text-xs text-red-400 mt-1">
              Mínimo de 6 caracteres
            </p>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          variant="primary"
          disabled={loading || isSubmitting}
        >
          {isSubmitting ? "Verificando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
