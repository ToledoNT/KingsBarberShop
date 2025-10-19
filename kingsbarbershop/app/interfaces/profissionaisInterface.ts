import { HorarioDisponivel } from "./agendamentoInterface";

export interface Profissional {
  id: string;                 
  nome: string;              
  email: string;              
  telefone: string;           
  procedimentos: Procedimento[]; 
  horarios: string[];         
}

export interface ProfissionaisProps {
  profissionais: Profissional[];
  novoProfissional: Omit<Profissional, "id" | "procedimentos">;
  setNovoProfissional: (p: Omit<Profissional, "id" | "procedimentos">) => void;
  addProfissional: (p: Omit<Profissional, "id" | "procedimentos">) => void;
  updateProfissional: (id: string, p: Omit<Profissional, "id" | "procedimentos">) => void;
  removeProfissional: (id: string) => void;
}

export interface Procedimento {
  id: string;
  nome: string;
  valor: number;
  profissionalId: string; 
}

export interface ProfissionalFormProps {
  profissional?: Profissional | null;
  onSave: (prof: Partial<Profissional>) => void;
  onCancel?: () => void;
}
// No seu arquivo ProfissionalCard.tsx, adicione a propriedade isSelected
interface ProfissionalCardProps {
  profissional: Profissional;
  onSelect: (profissional: Profissional) => void;
  onEdit: (profissional: Profissional) => void;
  onDelete: (id: string | undefined) => void;
  isSelected?: boolean; // Adicione esta linha
}

export interface Props extends ProfissionaisProps {
  selectedProfissional: Profissional | null;
  setSelectedProfissional: (p: Profissional | null) => void;
  activeTab: "ver" | "criar";
  setActiveTab: (tab: "ver" | "criar") => void;
}

export interface ProfissionaisPageProps extends ProfissionaisProps {
  selectedProfissional: Profissional | null;
  setSelectedProfissional: (p: Profissional | null) => void;
  activeTab: "ver" | "criar";
  setActiveTab: (tab: "ver" | "criar") => void;
}

export interface ProcedimentosProfissionaisProps {
  profissionais: Profissional[];
  procedimentos: Procedimento[];
  novoProcedimento: Omit<Procedimento, "id">; 
  setNovoProcedimento: React.Dispatch<React.SetStateAction<Omit<Procedimento, "id">>>;
  addProcedimento: (proc: Omit<Procedimento, "id">) => void;
  updateProcedimento: (id: string, proc: Omit<Procedimento, "id">) => void;
  removeProcedimento: (id?: string) => void;
}

export interface ProcedimentoCardProps {
  procedimento: Procedimento;
  onEdit: (p: Procedimento) => void;
  onDelete: (id?: string) => void;
}

export interface HorarioInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface ProcedimentoInput {
  nome: string;
  valor: number;
  profissionalId: string;
}

// Interface para o retorno do fetchHorariosByProfissional
export interface BarbeiroDadosResponse {
  barbeiroId: string;
  horarios: HorarioDisponivel[];
  procedimentos: Procedimento[];
}