export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset"; 
  disabled?: boolean;
  fullWidth?: boolean; 
}