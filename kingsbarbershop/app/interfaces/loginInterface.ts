export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface UseAuthReturn extends AuthState {
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

export interface LoadingProps {
  size?: number;
  text?: string; 
} 