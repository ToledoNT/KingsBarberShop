"use client";

import React, { useState } from "react";
import { useAuth } from "../hook/useAuthLoginAdmin";
import Button from "../components/ui/Button";
import { LoginData } from "../interfaces/loginInterface";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState<LoginData>({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form enviado:", form); // Garantir que os valores estão corretos
    await login(form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D] text-[#E5E5E5] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1B1B1B] p-6 sm:p-8 rounded-3xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col gap-6"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFA500] text-center">
          Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm sm:text-base text-center">{error}</p>
        )}

        <input
          type="text"
          name="username"
          placeholder="Usuário"
          value={form.username}
          onChange={handleChange}
          className="p-3 sm:p-4 rounded-xl bg-[#2A2A2A] border border-gray-700 text-base sm:text-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          className="p-3 sm:p-4 rounded-xl bg-[#2A2A2A] border border-gray-700 text-base sm:text-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
          required
        />

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}