"use client";

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Select({
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
}: SelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="p-3 rounded bg-[#0D0D0D] text-[#E5E5E5] border border-[#333] focus:outline-none focus:border-[#FFA500]"
    >
      <option value="">{placeholder || "Selecione"}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}