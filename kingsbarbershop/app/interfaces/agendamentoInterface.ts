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
  diasDisponiveis?: string[]; // ex: ["2025-10-17", "2025-10-18"]
}

// -------------------- Agendamentos --------------------

export enum StatusAgendamento {
  PENDENTE = "Pendente",
  AGENDADO = "Agendado",
  EM_ANDAMENTO = "Em Andamento",
  CONCLUIDO = "Concluído",
  CANCELADO = "Cancelado",
  NAO_COMPARECEU = "Não Compareceu",
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
  inicio: string;
  fim: string;
  servico: string;
  barbeiro: string;
  status?: StatusAgendamento;
  criadoEm?: string;
  atualizadoEm?: string;

  // Campos extras que vêm do frontend
  servicoId?: string;
  servicoNome?: string;
  servicoPreco?: number;
  profissionalId?: string;
  profissionalNome?: string;
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
  label: string;
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
  barbeiros: Barbeiro[];
  procedimentos?: Procedimento[];
  horarios: HorarioDisponivel[]; 
}


export interface AgendamentosGridProps {
  agendamentos: Agendamento[];
  onStatusChange?: (id: string, status: StatusAgendamento) => void | Promise<void>;
}


export interface AgendamentoHorarioProps {
  horarios: HorarioDisponivel[];
  onToggleDisponivel: (h: HorarioDisponivel) => void;
  onRemoveHorario: (id?: string) => void;
}

export interface AgendamentosListProps {
  agendamentos: Agendamento[];
  onEdit: (a: Agendamento) => Promise<void> | void;
  onConcluir: (a: Agendamento) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  getStatusColor: (status: StatusAgendamento) => string;
  formatarDataParaDisplay: (data: string) => string;
  formatarHora: (hora: string) => string;
}

export interface GerenciarAgendamentosProps {
  agendamentos: Agendamento[];
  horarios: HorarioDisponivel[];
  onConcluir: (a: Agendamento) => Promise<void>;
  onDelete: (id?: string) => Promise<void>;
  getStatusColor: (status: StatusAgendamento) => string;
  formatarDataParaDisplay: (dataISO: string) => string;
  formatarHora?: (hora?: string) => string; 
}

export interface AgendamentoFrontend {
  id?: string;           
  nome: string;
  telefone: string;
  email: string;
  data: string;          
  hora?: string;
  servico: string;
  profissional: string;
  inicio?: string;
  fim?: string;
  status?: StatusAgendamento;
}

export interface Column {
  header: string;
  accessor: string; 
}

export interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
}

// // -------------------- Modal --------------------
// export interface ModalProps {
//   children: React.ReactNode;
//   onClose: () => void;
// }