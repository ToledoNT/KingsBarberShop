"use client";

import React from "react";
import { formatTelefone, trimField } from "@/app/utils/validators";
import { InputProps } from "@/app/interfaces/inputInterface";

export default function Input({
  name = "",
  type = "text",
  value,
  placeholder,
  onChange,
  required = false,
  disabled = false,
  min,
  step,
  className = "",
}: InputProps) {
  const handleBlur = () => {
    if (type === "email") {
      onChange({
        target: { name, value: trimField(String(value)) },
      } as any);
    }

    if (type === "tel") {
      onChange({
        target: { name, value: formatTelefone(String(value)) },
      } as any);
    }
  };

  return (
    <input
      name={name}
      type={type}
      value={value}
      placeholder={placeholder || name}
      onChange={onChange}
      onBlur={handleBlur}
      required={required}
      disabled={disabled}
      min={min}
      step={step}
      className={`p-3 rounded bg-[#0D0D0D] text-[#E5E5E5] border border-[#333] focus:outline-none focus:border-[#FFA500] 
        appearance-HorariosPropsnone ${className}`}
    />
  );
}