import { Dispatch, SetStateAction } from "react";

// -------------------- Profissionais e Procedimentos --------------------
export interface Procedimento {
  id: string;
  nome: string;
  valor: number;
  duracaoMinutos?: number;
  label?: string; 
}

export interface Profissional {
  id: string;
  nome: string;
}

export interface Barbeiro {
  id: string;
  nome: string;
  horarios: string[];
  procedimentos?: Procedimento[];
}

// -------------------- Agendamentos --------------------
export enum StatusAgendamento {
  PENDENTE = "Pendente",
  CONCLUIDO = "Concluído",
  CANCELADO = "Cancelado",
}

export interface AgendamentoFormData {
  nome: string;
  telefone: string;
  email: string;
  data: string;
  hora: string;
  servico: string;
  barbeiro: string;
}

export interface Agendamento {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  data: string;
  hora: string;
  servico: string;
  barbeiro: string;
  inicio: string; 
  fim: string;    
  criadoEm?: string;
  atualizadoEm?: string;
  status?: StatusAgendamento;
}

export interface AgendamentoForm {
  nome: string;
  telefone: string;
  email: string;
  barbeiro: string;
  data: Date | null;
  hora: string;
  servico: string;
  status: StatusAgendamento;
}

// -------------------- Horários --------------------
export interface HorarioDisponivel {
  id?: string;
  profissional: Barbeiro; 
  data: string;
  inicio: string;
  fim: string;
  disponivel: boolean;
}

export type HorarioParaGerar = {
  barbeiro: string;
  data: string;
}

export interface HorariosProps {
  horarios: HorarioDisponivel[];
  novoHorario: Omit<HorarioDisponivel, "id">;
  setNovoHorario: Dispatch<SetStateAction<Omit<HorarioDisponivel, "id">>>;
  addHorario: (novo: HorarioDisponivel) => void;
  updateHorario: (id: string, atualizado: Partial<HorarioDisponivel>) => void;
  removeHorario: (id: string) => void;
}

// -------------------- Formulários --------------------
export interface AgendamentoPrivadoFormProps {
  agendamento?: Agendamento | null;
  onSave: (a: Agendamento) => Promise<void> | void;
  onCancel: () => void;
  horarios: HorarioDisponivel[];
  barbeiros: Barbeiro[];
  procedimentos?: Procedimento[];
}

export interface AgendamentoHorarioProps {
  horarios: HorarioDisponivel[];
  onToggleDisponivel: (h: HorarioDisponivel) => void;
  onRemoveHorario: (id?: string) => void;
}