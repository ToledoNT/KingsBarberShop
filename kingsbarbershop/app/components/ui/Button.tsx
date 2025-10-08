interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset"; 
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const base = "rounded-full font-medium h-12 px-6 transition-colors text-lg";

  const styles =
    variant === "primary"
      ? "bg-[#FFA500] text-black hover:bg-[#E59400] disabled:opacity-50 disabled:cursor-not-allowed"
      : "border border-[#A3A3A3] text-[#E5E5E5] hover:bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button type={type} className={`${base} ${styles}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}