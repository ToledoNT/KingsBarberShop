export interface IProduto {
  id: string;
  nome: string;
  categoria?: string;
  preco?: number;
  estoque?: number;
  descricao?: string;
  criadoEm?: string;
  atualizadoEm?: string;
  quantidade?: number;
  ativo?: boolean;
  status?: "disponivel" | "vendido" | "consumido" | "pendente";
  usuarioPendente?: string; // Novo campo
}