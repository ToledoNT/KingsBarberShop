export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  variant?: "primary" | "secondary" | "success";
  type?: "button" | "submit" | "reset"; 
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  loading?: boolean;
}