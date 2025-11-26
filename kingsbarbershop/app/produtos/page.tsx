"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/ui/Sidebar";
import { Notification } from "../components/ui/componenteNotificacao";
import { useProdutos } from "../hook/useProdutosHook";

// ---------- Interfaces ----------
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
}

// ---------- UI helpers ----------
const LoadingSpinner = () => (
  <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFA500]"></div>
      <p className="text-gray-400">Carregando produtos...</p>
    </div>
  </div>
);

const AcessoNegado = ({ collapsed }: { collapsed: boolean }) => (
  <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
    <aside className="flex-shrink-0 h-screen lg:sticky top-0 z-20">
      <Sidebar collapsed={collapsed} setCollapsed={() => {}} />
    </aside>
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-4">
          <div className="text-5xl animate-bounce text-yellow-400">🔒</div>
        </div>
        <h1 className="text-2xl font-bold text-yellow-400 mb-3">Acesso Restrito</h1>
        <p className="text-gray-300">Área exclusiva para administradores</p>
      </div>
    </div>
  </div>
);

const ErroCarregamento = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
    <div className="text-red-400 text-center max-w-md px-4">
      <div className="text-6xl mb-4">🛑</div>
      <p className="text-xl font-semibold mb-2">Erro ao carregar produtos</p>
      <p className="text-sm mb-6 text-gray-300">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-[#FFA500] text-black rounded-lg font-semibold hover:bg-[#FF8C00] transition-colors w-full"
      >
        🔄 Tentar Novamente
      </button>
    </div>
  </div>
);

// ---------- Componente Principal ----------
export default function ProdutosPage() {
  const router = useRouter();
  
  // Usando o hook externo
  const { 
    produtos, 
    loading, 
    error, 
    addProduto, 
    updateProduto, 
    removeProduto, 
    fetchProdutos 
  } = useProdutos();

  // Estados
  const [filtros, setFiltros] = useState({ 
    busca: "", 
    categoria: "todos", 
    ordenacao: "nome" as "nome" | "preco" | "estoque" 
  });
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Temporariamente true para teste
  const [loadingAuth, setLoadingAuth] = useState(false); // Temporariamente false para teste
  const [notification, setNotification] = useState({ 
    isOpen: false, 
    message: "", 
    type: "success" as "info" | "success" | "warning" | "error" 
  });

  // Modal de criar/editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IProduto | null>(null);

  // Notificações
  const showNotification = (message: string, type: "info" | "success" | "warning" | "error" = "success") => {
    setNotification({ isOpen: true, message, type });
  };
  const closeNotification = () => setNotification((p) => ({ ...p, isOpen: false }));

  const atualizarFiltro = (campo: string, valor: any) => setFiltros((p) => ({ ...p, [campo]: valor }));
  const limparFiltros = () => setFiltros({ busca: "", categoria: "todos", ordenacao: "nome" });

  // Produtos filtrados com tipagem correta
  const produtosFiltrados = useMemo(() => {
    const termo = filtros.busca.toLowerCase();
    const cat = filtros.categoria;
    
    const filtrados = produtos.filter((prd: IProduto) => {
      const nomeMatch = prd.nome.toLowerCase().includes(termo);
      const catMatch = cat === "todos" || (prd.categoria ?? "").toLowerCase() === cat.toLowerCase();
      return nomeMatch && catMatch;
    });

    return filtrados.sort((a: IProduto, b: IProduto) => {
      switch (filtros.ordenacao) {
        case "preco":
          return (b.preco || 0) - (a.preco || 0);
        case "estoque":
          return (b.estoque || 0) - (a.estoque || 0);
        case "nome":
        default:
          return (a.nome || "").localeCompare(b.nome || "");
      }
    });
  }, [produtos, filtros]);

  // Totais com tipagem correta
  const totais = useMemo(() => {
    const totalValor = produtos.reduce((acc: number, p: IProduto) => acc + (p.preco || 0), 0);
    const totalItens = produtos.reduce((acc: number, p: IProduto) => acc + (p.estoque || 0), 0);
    return { totalValor, totalItens, quantidade: produtos.length };
  }, [produtos]);

  // Handlers CRUD
  const handleAtualizarLista = async () => {
    try {
      await fetchProdutos();
      showNotification("Lista de produtos atualizada", "success");
    } catch (err) {
      showNotification("Erro ao atualizar lista", "error");
    }
  };

const handleSalvarProduto = async (payload: Partial<IProduto>) => {
  try {
    // Campos básicos que sempre devem existir
    const baseData = {
      nome: payload.nome || "",
      categoria: payload.categoria || "",
      preco: Number(payload.preco) || 0,
      estoque: Number(payload.estoque) || 0,
      descricao: payload.descricao || "",
    };

    // Tentar enviar apenas os campos básicos primeiro
    if (editing) {
      await updateProduto(editing.id, baseData as any);
      showNotification("Produto atualizado com sucesso", "success");
    } else {
      await addProduto(baseData as any);
      showNotification("Produto criado com sucesso", "success");
    }
    setIsModalOpen(false);
    setEditing(null);
  } catch (err: any) {
    showNotification(err?.message || "Erro ao salvar produto", "error");
  }
};

  const handleExcluir = async (id: string) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;
    try {
      await removeProduto(id);
      showNotification("Produto deletado com sucesso", "success");
    } catch (err: any) {
      showNotification(err?.message || "Erro ao deletar produto", "error");
    }
  };

  // Render conditions
  if (loadingAuth || loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <AcessoNegado collapsed={collapsed} />;
  if (error) return <ErroCarregamento error={error} onRetry={handleAtualizarLista} />;

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <aside className="flex-shrink-0 h-screen lg:sticky top-0 z-20">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      <Notification 
        isOpen={notification.isOpen} 
        message={notification.message} 
        type={notification.type} 
        onClose={closeNotification} 
        duration={3000} 
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden">
          {/* Header e Controles */}
          <div className="mb-6 sm:mb-8 flex-shrink-0">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1 flex items-center gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl">📦</span>
                    <span className="truncate">Produtos</span>
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base truncate">Gerencie seu catálogo de produtos</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => { setEditing(null); setIsModalOpen(true); }} 
                    className="px-4 py-3 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-black rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                  >
                    <span>➕</span>
                    <span className="hidden sm:inline">Novo Produto</span>
                  </button>
                  <button 
                    onClick={handleAtualizarLista} 
                    className="px-4 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 ml-2"
                  >
                    🔄 Atualizar
                  </button>
                </div>
              </div>

              {/* Busca Mobile */}
              <div className="sm:hidden mt-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={filtros.busca} 
                    onChange={(e) => atualizarFiltro("busca", e.target.value)} 
                    className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resumo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 flex-shrink-0">
            <ResumoCard 
              emoji="💸" 
              titulo="Valor total" 
              valor={totais.totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} 
              descricao={`${totais.quantidade} produtos`} 
            />
            <ResumoCard 
              emoji="📦" 
              titulo="Itens em estoque" 
              valor={totais.totalItens.toString()} 
              descricao="Soma dos estoques" 
            />
            <ResumoCard 
              emoji="⚙️" 
              titulo="Ações" 
              valor={<small className="text-sm text-gray-300">Crie, edite e delete produtos</small>} 
              descricao={undefined} 
            />
          </div>

          {/* Filtros */}
          <div className="mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl p-4 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-300 mb-2">🔍 Buscar</label>
                  <input 
                    type="text" 
                    placeholder="Nome do produto..." 
                    value={filtros.busca} 
                    onChange={(e) => atualizarFiltro("busca", e.target.value)} 
                    className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white" 
                  />
                </div>
                <div className="w-48">
                  <label className="block text-sm text-gray-300 mb-2">🏷️ Categoria</label>
                  <select 
                    value={filtros.categoria} 
                    onChange={(e) => atualizarFiltro("categoria", e.target.value)} 
                    className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white"
                  >
                    <option value="todos">Todas</option>
                    <option value="eletronicos">Eletrônicos</option>
                    <option value="beleza">Beleza</option>
                    <option value="servicos">Serviços</option>
                  </select>
                </div>
                <div className="w-48">
                  <label className="block text-sm text-gray-300 mb-2">📊 Ordenar</label>
                  <select 
                    value={filtros.ordenacao} 
                    onChange={(e) => atualizarFiltro("ordenacao", e.target.value)} 
                    className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white"
                  >
                    <option value="nome">Nome</option>
                    <option value="preco">Preço</option>
                    <option value="estoque">Estoque</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Produtos */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-2xl p-5 shadow-2xl flex flex-col backdrop-blur-md overflow-hidden">
              {produtosFiltrados.length === 0 ? (
                <NenhumProduto 
                  filtrosAtivos={!!(filtros.busca || filtros.categoria !== "todos")} 
                  onLimparFiltros={limparFiltros} 
                />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      📋 Produtos 
                      <span className="text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg">
                        {produtosFiltrados.length}
                      </span>
                    </h3>
                    <div className="text-sm text-gray-400">
                      Ordenado por: {filtros.ordenacao}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    <div className="grid gap-3 sm:gap-4 pb-2">
                      {produtosFiltrados.map((prd: IProduto) => (
                        <ProdutoItem 
                          key={prd.id} 
                          produto={prd} 
                          onEdit={() => { setEditing(prd); setIsModalOpen(true); }} 
                          onDelete={() => handleExcluir(prd.id)} 
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <ProdutoModal
          initial={editing ?? undefined}
          onClose={() => { setIsModalOpen(false); setEditing(null); }}
          onSave={handleSalvarProduto}
        />
      )}
    </div>
  );
}

// ---------- Componentes auxiliares ----------
const ResumoCard = ({ 
  emoji, 
  titulo, 
  valor, 
  descricao 
}: { 
  emoji: string; 
  titulo: string; 
  valor: any; 
  descricao?: string;
}) => (
  <div className="bg-gradient-to-br from-gray-800/10 to-gray-900/10 border rounded-xl p-4 backdrop-blur-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="text-2xl">{emoji}</div>
      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
      </div>
    </div>
    <p className="text-gray-300 text-xs">{titulo}</p>
    <p className="text-lg sm:text-2xl font-bold text-white truncate">{valor}</p>
    {descricao && <p className="text-xs text-gray-400">{descricao}</p>}
  </div>
);

const NenhumProduto = ({ 
  filtrosAtivos, 
  onLimparFiltros 
}: { 
  filtrosAtivos: boolean; 
  onLimparFiltros: () => void;
}) => (
  <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-700 rounded-xl max-w-md mx-auto w-full bg-gray-900/30">
    <div className="text-6xl mb-4 opacity-60">📦</div>
    <p className="text-lg font-semibold text-gray-300 mb-2">Nenhum produto encontrado</p>
    <p className="text-gray-400 text-sm mb-4">
      {filtrosAtivos ? "Ajuste os filtros para ver mais resultados" : "Adicione seu primeiro produto"}
    </p>
    {filtrosAtivos && (
      <button 
        onClick={onLimparFiltros} 
        className="px-4 py-2 bg-gray-700 text-white rounded-xl"
      >
        🔄 Limpar Filtros
      </button>
    )}
  </div>
);

// Componente de item de produto
const ProdutoItem = ({ 
  produto, 
  onEdit, 
  onDelete 
}: { 
  produto: IProduto; 
  onEdit: () => void; 
  onDelete: () => void;
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-[#1F1F1F] to-[#121212] border border-gray-700 rounded-2xl p-4 sm:p-5 shadow-md">
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
      <span className="text-gray-300 font-medium">{produto.nome}</span>
      <span className="text-white font-bold">
        {produto.preco != null ? 
          produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : 
          "-"
        }
      </span>
      <span className="text-sm text-gray-400">{produto.categoria ?? "—"}</span>
    </div>
    <div className="flex items-center gap-3 mt-2 sm:mt-0">
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700/30">
        {produto.estoque ?? 0} itens
      </span>
      <button 
        onClick={onEdit} 
        className="px-3 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-colors"
      >
        ✏️ Editar
      </button>
      <button 
        onClick={onDelete} 
        className="px-3 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-700 transition-colors"
      >
        🗑️ Excluir
      </button>
    </div>
  </div>
);

// ---------- Modal de produto ----------
function ProdutoModal({ 
  initial, 
  onClose, 
  onSave 
}: { 
  initial?: IProduto; 
  onClose: () => void; 
  onSave: (payload: Partial<IProduto>) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<IProduto>>({
    nome: initial?.nome ?? "",
    categoria: initial?.categoria ?? "",
    preco: initial?.preco ?? 0,
    estoque: initial?.estoque ?? 0,
    descricao: initial?.descricao ?? "",
    quantidade: initial?.quantidade ?? 0,
    ativo: initial?.ativo ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (campo: keyof IProduto, valor: any) => {
    setForm((p) => ({ ...p, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative max-w-xl w-full bg-[#0B0B0B] border border-gray-800 rounded-2xl p-6 z-10">
        <h3 className="text-xl font-semibold text-white mb-4">
          {initial ? "Editar Produto" : "Novo Produto"}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Nome *</label>
            <input 
              required 
              placeholder="Nome do produto" 
              value={form.nome} 
              onChange={(e) => handleChange("nome", e.target.value)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white" 
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">Categoria</label>
            <input 
              placeholder="Categoria" 
              value={form.categoria} 
              onChange={(e) => handleChange("categoria", e.target.value)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white" 
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">Preço *</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              placeholder="Preço" 
              value={form.preco} 
              onChange={(e) => handleChange("preco", parseFloat(e.target.value) || 0)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white" 
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">Estoque *</label>
            <input 
              type="number" 
              min="0"
              placeholder="Estoque" 
              value={form.estoque} 
              onChange={(e) => handleChange("estoque", parseInt(e.target.value) || 0)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white" 
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm text-gray-300 mb-2">Descrição</label>
          <textarea 
            placeholder="Descrição do produto" 
            value={form.descricao} 
            onChange={(e) => handleChange("descricao", e.target.value)} 
            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white" 
            rows={3}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
            disabled={saving}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={saving} 
            className="px-4 py-2 bg-[#FFA500] text-black rounded-xl hover:bg-[#FF8C00] transition-colors disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}