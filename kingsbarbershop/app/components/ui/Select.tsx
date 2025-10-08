"use client";

import React from "react";

export default function Select({
  name,
  value,
  onChange,
  options,
  placeholder = "Selecione",
  required = false,
  disabled = false,
}: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full p-3 pr-10 rounded-lg appearance-none bg-[#0D0D0D]
          text-[#E5E5E5] border border-[#333] 
          focus:outline-none focus:border-[#FFA500]
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Ícone da seta customizada */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-[#FFA500]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}