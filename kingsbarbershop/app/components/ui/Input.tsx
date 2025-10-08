"use client";

import { formatTelefone, trimField } from "@/app/utils/validators";


interface InputProps {
  name: string;
  type?: "text" | "email" | "tel" | "date";
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function Input({
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  required = false,
  disabled = false,
}: InputProps) {
  // função interna para tratar o blur
  const handleBlur = () => {
    if (type === "email") {
      onChange({
        target: { name, value: trimField(value) },
      } as any);
    }
    if (type === "tel") {
      onChange({
        target: { name, value: formatTelefone(value) },
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
      className="p-3 rounded bg-[#0D0D0D] text-[#E5E5E5] border border-[#333] focus:outline-none focus:border-[#FFA500]"
    />
  );
}