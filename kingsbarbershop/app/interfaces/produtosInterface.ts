export interface IProduto {
  id: string;
  nome: string;
  categoria?: string;
  preco?: number;
  estoque?: number;         
  quantidade?: number;      
  descricao?: string;
  criadoEm?: string;
  atualizadoEm?: string;
  ativo?: boolean;          
  status?: "disponivel" | "vendido" | "consumido" | "pendente";
  usuarioPendente?: string; 
  vendidos?: number;         
  consumidos?: number;      
  pendentes?: number;       
}