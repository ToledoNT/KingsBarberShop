export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  categoria?: string;
  ativo: boolean;
  criadoEm: string;   // ou Date, se preferir
  atualizadoEm: string; // ou Date
}