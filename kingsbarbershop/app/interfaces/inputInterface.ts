export interface InputProps {
  name: string; 
  type?: "text" | "email" | "tel" | "date" | "time" | "number" | "password";
  value: string | number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  pattern?: string; 
  className?: string;
}