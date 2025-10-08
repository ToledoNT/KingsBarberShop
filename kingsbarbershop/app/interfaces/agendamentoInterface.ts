import { LucideIcon } from "lucide-react";
import { ReactNode, Dispatch, SetStateAction } from "react";

export interface AgendamentoFormData {
  nome: string;
  telefone: string;
  email: string;
  data: string;
  hora: string;
  servico: string;
  barbeiro: string;
}

export interface Barbeiro {
  nome: string;
  horarios: string[];
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
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface HorarioDisponivel {
  id: string;
  barbeiro: string;
  data: string;
  inicio: string;
  fim: string;
}

export interface AgendamentoModalProps {
  agendamento: Agendamento;
  onClose: () => void;
  onSave: (updated: Agendamento) => void;
  horariosDisponiveis?: HorarioDisponivel[];
}


export interface HorariosProps {
  horarios: HorarioDisponivel[];
  novoHorario: Omit<HorarioDisponivel, "id">;
  setNovoHorario: Dispatch<SetStateAction<Omit<HorarioDisponivel, "id">>>;
  addHorario: (novo: Omit<HorarioDisponivel, "id">) => void;
  updateHorario: (id: string, atualizado: Omit<HorarioDisponivel, "id">) => void;
  removeHorario: (id: string) => void;
}

export interface AgendamentosSectionProps {
  agendamentos: Agendamento[];
}

export interface AgendamentoActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

export interface Column {
  header: string;
  accessor: string;
}

export interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
}