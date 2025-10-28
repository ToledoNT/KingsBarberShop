export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface UseAuthReturn extends AuthState {
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  verify: () => Promise<void>;
}

export interface LoadingProps {
  size?: number;
  text?: string;
}

export interface LoginResponseData {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface LoginResult {
  id: string;    
  email: string; 
  name: string;  
  role: string;  
}

export interface LoginResult {
  id: string;    
  email: string; 
  name: string; 
}

export interface VerifyTokenResponse {
  status: boolean;
}

export interface ProcedimentoInput {
  nome: string;
  valor: number;
  profissionalId: string;
}