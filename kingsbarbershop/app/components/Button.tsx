  interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({ children, onClick, variant = "primary" }: ButtonProps) {
  const base = "rounded-full font-medium h-12 px-6 transition-colors text-lg";

  const styles =
    variant === "primary"
      ? "bg-[#FFA500] text-black hover:bg-[#E59400]"
      : "border border-[#A3A3A3] text-[#E5E5E5] hover:bg-[#1A1A1A]";

  return (
    <button className={`${base} ${styles}`} onClick={onClick}>
      {children}
    </button>
  );
}
