"use client";

import { ButtonProps } from "@/app/interfaces/buttonInterface";
import React from "react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  fullWidth = false,
  className = "",
  loading = false,
}: ButtonProps) {
  const base =
    "rounded-lg font-medium h-12 px-6 text-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#FFA500]";

  const styles =
    variant === "primary"
      ? "bg-[#FFA500] text-black hover:bg-[#E59400] active:scale-[0.97]"
      : "border border-[#A3A3A3] text-[#E5E5E5] hover:bg-[#1A1A1A] active:scale-[0.97]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${styles} ${fullWidth ? "w-full" : ""} ${className} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}