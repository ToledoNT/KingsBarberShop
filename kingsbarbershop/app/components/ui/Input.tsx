import { InputProps } from "@/app/interfaces/inputInterface";

export default function Input({
  name = "",
  type = "text",
  value,
  placeholder,
  onChange,
  onValidate,
  required = false,
  disabled = false,
  min,
  step,
  className = "",
  onBlur, 
}: InputProps & { onValidate?: (val: string) => void; onBlur?: () => void }) {
  return (
    <input
      name={name}
      type={type}
      value={value ?? ""}
      placeholder={placeholder || name}
      onChange={onChange}
      onBlur={onBlur} 
      required={required}
      disabled={disabled}
      min={min}
      step={step}
      className={`p-3 rounded bg-[#0D0D0D] text-[#E5E5E5] border border-[#333] focus:outline-none focus:border-[#FFA500] ${className}`}
    />
  );
}