export interface Profissional {
  id: string;                 // Um identificador único do profissional (geralmente gerado pelo backend ou timestamp)
  nome: string;               // O nome do profissional
  email: string;              // O e-mail de contato do profissional
  telefone: string;           // O telefone de contato do profissional
  procedimentos: Procedimento[]; // Um array com os procedimentos que o profissional realiza
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
  profissionalId: string; // <-- corrigido
}

export interface ProfissionalFormProps {
  profissional?: Profissional | null;
  onSave: (prof: Partial<Profissional>) => void;
  onCancel?: () => void;
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

export interface ProfissionaisPageProps extends ProfissionaisProps {
  selectedProfissional: Profissional | null;
  setSelectedProfissional: (p: Profissional | null) => void;
  activeTab: "ver" | "criar";
  setActiveTab: (tab: "ver" | "criar") => void;
}

export interface ProcedimentosProfissionaisProps {
  profissionais: Profissional[];
  procedimentos: Procedimento[];
  novoProcedimento: Omit<Procedimento, "id">; // agora Omit<Procedimento, "id"> já inclui profissionalId
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
export interface Procedimento {
  id: string;
  nome: string;
  valor: number;
  profissionalId: string; // ⚠ corrigido
}

// export interface ProcedimentosProps {
//   procedimentos: Procedimento[];
//   novoProcedimento: Omit<Procedimento, "id">;
//   setNovoProcedimento: React.Dispatch<React.SetStateAction<Omit<Procedimento, "id">>>;
//   addProcedimento: (novo: Omit<Procedimento, "id">) => void;
//   updateProcedimento: (id: string, atualizado: Omit<Procedimento, "id">) => void;
//   removeProcedimento: (id: string) => void;
// }

// export interface ProcedimentoFormProps {
//   procedimento?: Procedimento | null;
//   onSave: (proc: Partial<Procedimento>) => void;
//   onCancel?: () => void;
// }