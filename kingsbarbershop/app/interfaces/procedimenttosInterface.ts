export interface Procedimento {
  id?: string;
  nome: string;
  valor: number;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface ProcedimentosProps {
  procedimentos: Procedimento[];
  novoProcedimento: Omit<Procedimento, "id">;
  setNovoProcedimento: React.Dispatch<React.SetStateAction<Omit<Procedimento, "id">>>;
  addProcedimento: (novo: Omit<Procedimento, "id">) => void;
  updateProcedimento: (id: string, atualizado: Omit<Procedimento, "id">) => void;
  removeProcedimento: (id: string) => void;
}