// /interfaces/profissionalInterface.ts

// --- Profissional ---
export interface Profissional {
  id?: string;
  nome: string;
  email?: string;
  telefone?: string;
  procedimentos: Procedimento[];
}

// --- Props para componente que lista Profissionais ---
export interface ProfissionaisProps {
  profissionais: Profissional[];
  novoProfissional: Omit<Profissional, "id" | "procedimentos">;
  setNovoProfissional: (p: Omit<Profissional, "id" | "procedimentos">) => void;
  addProfissional: (p: Omit<Profissional, "id" | "procedimentos">) => void;
  updateProfissional: (id: string, p: Omit<Profissional, "id" | "procedimentos">) => void;
  removeProfissional: (id: string) => void;
}

// --- Procedimento ---
export interface Procedimento {
  id?: string;
  nome: string;
  valor: number;
}

// --- Props para componente que lista Procedimentos ---
export interface ProcedimentosProps {
  procedimentos: Procedimento[];
  novoProcedimento: Omit<Procedimento, "id">;
  setNovoProcedimento: React.Dispatch<React.SetStateAction<Omit<Procedimento, "id">>>;
  addProcedimento: (novo: Omit<Procedimento, "id">) => void;
  updateProcedimento: (id: string, atualizado: Omit<Procedimento, "id">) => void;
  removeProcedimento: (id: string) => void;
}

// --- Profissional Form ---
export interface ProfissionalFormProps {
  profissional?: Profissional | null;
  onSave: (prof: Partial<Profissional>) => void;
  onCancel?: () => void;
}

// --- Procedimento Form ---
export interface ProcedimentoFormProps {
  procedimento?: Procedimento | null;
  onSave: (proc: Partial<Procedimento>) => void;
  onCancel?: () => void;
}

export interface ProcedimentoCardProps {
  procedimento: Procedimento;
  onEdit: (p: Procedimento) => void;
  onDelete: (id?: string) => void;
}

export interface ProfissionalCardProps {
  profissional: Profissional;
  onSelect: (p: Profissional) => void;
  onEdit: (p: Profissional) => void;
  onDelete: (id?: string) => void;
}

export interface Props extends ProfissionaisProps {
  selectedProfissional: Profissional | null;
  setSelectedProfissional: (p: Profissional | null) => void;
  activeTab: "ver" | "criar";
  setActiveTab: (tab: "ver" | "criar") => void;
}