"use client";

import React, { useState, useMemo, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/ui/Sidebar";
import { Notification } from "../components/ui/componenteNotificacao";
import { ConfirmDialog } from "../components/ui/componenteConfirmação";
import { useProdutos } from "../hook/useProdutosHook";
import { IProduto } from "../interfaces/produtosInterface";

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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Estados para notificações e confirmações
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: "info" | "success" | "warning" | "error";
  }>({ isOpen: false, message: "", type: "info" });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "warning" | "error";
    onConfirm: (() => void) | null;
    onCancel?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  // Modal de criar/editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IProduto | null>(null);

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    produto: IProduto | null;
    novoStatus: IProduto["status"];
    usuarioPendente: string;
  }>({
    isOpen: false,
    produto: null,
    novoStatus: "disponivel",
    usuarioPendente: ""
  });

  // ------------------- FUNÇÕES DE NOTIFICAÇÃO -------------------
  const notify = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    setNotification({ isOpen: true, message: msg, type });
  };

  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: "info" | "warning" | "error" = "info",
    onCancel?: () => void
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      onCancel: onCancel || (() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))),
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const handleConfirm = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    closeConfirmDialog();
  };

  const atualizarFiltro = (campo: string, valor: any) => setFiltros((p) => ({ ...p, [campo]: valor }));
  const limparFiltros = () => setFiltros({ busca: "", categoria: "todos", ordenacao: "nome" });

  // Extrair categorias únicas dos produtos
const categoriasDisponiveis = useMemo(() => {
  const categorias = produtos
    .map((p: IProduto) => p.categoria)
    .filter((categoria): categoria is string =>
      typeof categoria === "string" && categoria.trim() !== ""
    );

  return Array.from(new Set(categorias)).sort();
}, [produtos]);

  const produtosFiltrados = useMemo(() => {
    const termo = filtros.busca.toLowerCase();
    const cat = filtros.categoria;

    const filtrados = produtos.filter((prd: IProduto) => {
      const nome = prd.nome ?? "";
      const categoria = prd.categoria ?? "";

      const nomeMatch = nome.toLowerCase().includes(termo);
      const catMatch = cat === "todos" || categoria.toLowerCase() === cat.toLowerCase();

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
      notify("Lista de produtos atualizada", "success");
    } catch (err) {
      notify("Erro ao atualizar lista", "error");
    }
  };

  const handleSalvarProduto = async (payload: Partial<IProduto>) => {
    try {
      const baseData = {
        nome: payload.nome || "",
        categoria: payload.categoria || "",
        preco: payload.preco
          ? Number(String(payload.preco).replace(",", "."))
          : 0,
        estoque: Number(payload.estoque) || 0,
        descricao: payload.descricao || "",
        status: payload.status || "disponivel",
        usuarioPendente: payload.usuarioPendente || ""
      };

      if (editing) {
        await updateProduto(editing.id, baseData as any);
        notify("Produto atualizado com sucesso", "success");
      } else {
        await addProduto(baseData as any);
        notify("Produto criado com sucesso", "success");
      }
      setIsModalOpen(false);
      setEditing(null);
    } catch (err: any) {
      notify(err?.message || "Erro ao salvar produto", "error");
    }
  };

  const handleExcluir = async (id: string) => {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    confirm(
      "Excluir Produto",
      `Tem certeza que deseja excluir o produto "${produto.nome}"? Esta ação não pode ser desfeita.`,
      async () => {
        try {
          await removeProduto(id);
          notify("Produto deletado com sucesso", "success");
        } catch (err: any) {
          notify(err?.message || "Erro ao deletar produto", "error");
        }
      },
      "error"
    );
  };

  // Função para abrir modal de confirmação de status
  const handleAbrirModalStatus = (produto: IProduto, novoStatus: IProduto["status"]) => {
    setStatusModal({
      isOpen: true,
      produto,
      novoStatus,
      usuarioPendente: produto.usuarioPendente || ""
    });
  };

  // Função para confirmar a alteração de status
  const handleConfirmarStatus = async () => {
    const { produto, novoStatus, usuarioPendente } = statusModal;
    
    if (!produto) return;

    try {
      const dadosAtualizacao = {
        ...produto,
        status: novoStatus,
        usuarioPendente: novoStatus === "pendente" ? usuarioPendente : ""
      };

      await updateProduto(produto.id, dadosAtualizacao);
      notify(`Status atualizado para ${novoStatus}`, "success");
      
      setStatusModal({ isOpen: false, produto: null, novoStatus: "disponivel", usuarioPendente: "" });
    } catch (err: any) {
      notify("Erro ao atualizar status", "error");
    }
  };

  // Função auxiliar para obter cor do status
  const getStatusColor = (status: string | undefined) => {
    const statusValue = status || "disponivel";
    switch (statusValue) {
      case "disponivel": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "vendido": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "consumido": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "pendente": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Render conditions
  if (loadingAuth || loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <AcessoNegado collapsed={collapsed} />;
  if (error) return <ErroCarregamento error={error} onRetry={handleAtualizarLista} />;

  return (
    <>
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={handleConfirm}
        onCancel={closeConfirmDialog}
      />

      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
        <aside className="flex-shrink-0 h-screen lg:sticky top-0 z-20">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex-shrink-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1 flex items-center gap-2 sm:gap-3">
                      <span className="text-3xl sm:text-4xl">📦</span>
                      <span className="truncate">Produtos</span>
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base truncate">
                      Gerencie seu catálogo de produtos
                    </p>
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
                      className="px-4 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
                    >
                      <span>🔄</span>
                      <span className="hidden sm:inline">Atualizar</span>
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
                      className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Container principal */}
            <div className="flex-1 flex flex-col min-h-0 gap-6">
              {/* ---------------- CARDS DE RESUMO ---------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                  valor={<small className="text-sm text-gray-300">Crie, edite e atualize status</small>} 
                  descricao={undefined} 
                />
              </div>

              {/* ---------------- FILTROS ---------------- */}
              <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h4 className="text-base font-semibold text-white flex items-center gap-2">
                    <span className="text-[#FFA500]">🎯</span>
                    Filtros
                  </h4>
                  <button 
                    onClick={limparFiltros}
                    className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
                  >
                    <span>🔄</span>
                    Limpar Filtros
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      🔍 Buscar
                    </label>
                    <input 
                      type="text" 
                      placeholder="Nome do produto..." 
                      value={filtros.busca} 
                      onChange={(e) => atualizarFiltro("busca", e.target.value)} 
                      className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      🏷️ Categoria
                    </label>
                    <select 
                      value={filtros.categoria} 
                      onChange={(e) => atualizarFiltro("categoria", e.target.value)} 
                      className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
                    >
                      <option value="todos">Todas as categorias</option>
                      {categoriasDisponiveis.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                    {categoriasDisponiveis.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        Nenhuma categoria cadastrada ainda
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      📊 Ordenar
                    </label>
                    <select 
                      value={filtros.ordenacao} 
                      onChange={(e) => atualizarFiltro("ordenacao", e.target.value)} 
                      className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
                    >
                      <option value="nome">Nome</option>
                      <option value="preco">Preço</option>
                      <option value="estoque">Estoque</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      📋 Resultados
                    </label>
                    <div className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/30 border border-gray-700 text-white text-sm sm:text-base">
                      {produtosFiltrados.length} produtos
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------- LISTA DE PRODUTOS ---------------- */}
              <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm flex-1 min-h-0">
                <div className="flex justify-between items-center mb-4 sm:mb-6 flex-shrink-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-[#FFA500]">📋</span>
                    Produtos 
                    <span className="text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg ml-2">
                      {produtosFiltrados.length}
                    </span>
                  </h3>
                  <div className="text-sm text-gray-400 hidden sm:block">
                    Ordenado por: {filtros.ordenacao}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {produtosFiltrados.length === 0 ? (
                    <NenhumProduto 
                      filtrosAtivos={!!(filtros.busca || filtros.categoria !== "todos")} 
                      onLimparFiltros={limparFiltros} 
                    />
                  ) : (
                    <div className="grid gap-3 sm:gap-4 pb-2">
                      {produtosFiltrados.map((prd: IProduto) => (
                        <ProdutoItem 
                          key={prd.id} 
                          produto={prd} 
                          onEdit={() => { setEditing(prd); setIsModalOpen(true); }} 
                          onDelete={() => handleExcluir(prd.id)}
                          onUpdateStatus={handleAbrirModalStatus}
                          getStatusColor={getStatusColor}
                        />
                      ))}
                    </div>
                  )}
                </div>
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
            categoriasSugeridas={categoriasDisponiveis}
          />
        )}

        {/* Modal de Confirmação de Status */}
        {statusModal.isOpen && (
          <ModalConfirmacaoStatus
            produto={statusModal.produto}
            novoStatus={statusModal.novoStatus}
            usuarioPendente={statusModal.usuarioPendente}
            onUsuarioPendenteChange={(usuario) => setStatusModal(prev => ({ ...prev, usuarioPendente: usuario }))}
            onConfirm={handleConfirmarStatus}
            onCancel={() => setStatusModal({ isOpen: false, produto: null, novoStatus: "disponivel", usuarioPendente: "" })}
          />
        )}
      </div>
    </>
  );
}

// ---------- Componentes auxiliares ----------
const ResumoCard = ({
  emoji,
  titulo,
  valor,
  descricao,
}: {
  emoji: string;
  titulo: string;
  valor: ReactNode;
  descricao?: string;
}) => (
  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-gray-600">
    <div className="flex items-center justify-between mb-4">
      <span className="text-3xl">{emoji}</span>
      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
        <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
      </div>
    </div>

    <p className="text-gray-400 text-sm font-medium mb-1">{titulo}</p>

    <div className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
      {valor}
    </div>

    {descricao && (
      <p className="text-xs text-gray-500 leading-snug">{descricao}</p>
    )}
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
    <p className="text-gray-400 text-sm mb-6">
      {filtrosAtivos ? "Ajuste os filtros para ver mais resultados" : "Adicione seu primeiro produto"}
    </p>
    {filtrosAtivos && (
      <button 
        onClick={onLimparFiltros} 
        className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2 mx-auto"
      >
        <span>🔄</span>
        Limpar Filtros
      </button>
    )}
  </div>
);

// Componente de item de produto
const ProdutoItem = ({ 
  produto, 
  onEdit, 
  onDelete,
  onUpdateStatus,
  getStatusColor
}: { 
  produto: IProduto; 
  onEdit: () => void; 
  onDelete: () => void;
  onUpdateStatus: (produto: IProduto, status: IProduto["status"]) => void;
  getStatusColor: (status: string | undefined) => string;
}) => {
  const [mostrarOpcoesStatus, setMostrarOpcoesStatus] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:border-gray-600">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FFA500] to-[#FF8C00] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">📦</span>
          </div>
          <div>
            <span className="text-white font-medium block">{produto.nome}</span>
            <span className="text-gray-400 text-sm">{produto.categoria ?? "—"}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
          <span className="text-[#FFA500] font-bold text-lg">
            {produto.preco != null ? 
              produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : 
              "-"
            }
          </span>
          
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700/50 text-gray-300">
            {produto.estoque ?? 0} itens
          </span>

          {/* Seletor de Status */}
          <div className="relative">
            <button 
              onClick={() => setMostrarOpcoesStatus(!mostrarOpcoesStatus)}
              className={`px-3 py-2 rounded-full text-xs font-semibold border ${getStatusColor(produto.status)} flex items-center gap-2 transition-all duration-300 hover:scale-105`}
            >
              <span className="capitalize">{produto.status || "disponivel"}</span>
              {produto.usuarioPendente && produto.status === "pendente" && (
                <span className="text-xs">({produto.usuarioPendente})</span>
              )}
              <span className="text-xs">▼</span>
            </button>
            
            {mostrarOpcoesStatus && (
              <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-40 backdrop-blur-sm">
                {(["disponivel", "vendido", "consumido", "pendente"] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      onUpdateStatus(produto, status);
                      setMostrarOpcoesStatus(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm capitalize hover:bg-gray-700 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${getStatusColor(status)}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
        <button 
          onClick={onEdit} 
          className="px-4 py-2 bg-gray-700 rounded-xl text-sm hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2 flex-1 sm:flex-none justify-center"
        >
          <span>✏️</span>
          <span className="hidden sm:inline">Editar</span>
        </button>
        <button 
          onClick={onDelete} 
          className="px-4 py-2 bg-red-600 rounded-xl text-sm hover:bg-red-700 transition-colors duration-300 flex items-center gap-2 flex-1 sm:flex-none justify-center"
        >
          <span>🗑️</span>
          <span className="hidden sm:inline">Excluir</span>
        </button>
      </div>
    </div>
  );
};

// ---------- Modal de produto atualizado ----------
function ProdutoModal({ 
  initial, 
  onClose, 
  onSave,
  categoriasSugeridas = []
}: { 
  initial?: IProduto; 
  onClose: () => void; 
  onSave: (payload: Partial<IProduto>) => Promise<void>;
  categoriasSugeridas?: string[];
}) {
  const [form, setForm] = useState<Partial<IProduto>>({
    nome: initial?.nome ?? "",
    categoria: initial?.categoria ?? "",
    preco: initial?.preco ?? 0,
    estoque: initial?.estoque ?? 0,
    descricao: initial?.descricao ?? "",
    quantidade: initial?.quantidade ?? 0,
    ativo: initial?.ativo ?? true,
    status: initial?.status ?? "disponivel",
    usuarioPendente: initial?.usuarioPendente ?? ""
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
      <form onSubmit={handleSubmit} className="relative max-w-2xl w-full bg-[#0B0B0B] border border-gray-800 rounded-2xl p-6 z-10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-[#FFA500]">{initial ? "✏️" : "🆕"}</span>
          {initial ? "Editar Produto" : "Novo Produto"}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome *</label>
            <input 
              required 
              placeholder="Nome do produto" 
              value={form.nome} 
              onChange={(e) => handleChange("nome", e.target.value)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
            <input 
              placeholder="Categoria" 
              value={form.categoria} 
              onChange={(e) => handleChange("categoria", e.target.value)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300" 
              list="categorias-sugeridas"
            />
            <datalist id="categorias-sugeridas">
              {categoriasSugeridas.map((categoria) => (
                <option key={categoria} value={categoria} />
              ))}
            </datalist>
            {categoriasSugeridas.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Sugestões: {categoriasSugeridas.slice(0, 3).join(', ')}
                {categoriasSugeridas.length > 3 && '...'}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Preço *</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              placeholder="Preço" 
              value={form.preco} 
              onChange={(e) => handleChange("preco", parseFloat(e.target.value) || 0)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estoque *</label>
            <input 
              type="number" 
              min="0"
              placeholder="Estoque" 
              value={form.estoque} 
              onChange={(e) => handleChange("estoque", parseInt(e.target.value) || 0)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300" 
            />
          </div>

          {/* Campo de Status */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select 
              value={form.status} 
              onChange={(e) => handleChange("status", e.target.value)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300"
            >
              <option value="disponivel">Disponivel</option>
              <option value="vendido">Vendido</option>
              <option value="consumido">Consumido</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>

          {/* Campo para usuário quando status é pendente */}
          {form.status === "pendente" && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                👤 Usuário Pendente *
              </label>
              <input 
                required
                placeholder="Nome do usuário que está devendo"
                value={form.usuarioPendente} 
                onChange={(e) => handleChange("usuarioPendente", e.target.value)} 
                className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300" 
              />
              <p className="text-xs text-gray-400 mt-2">
                Este nome ficará registrado para identificar quem está devendo por este produto
              </p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
          <textarea 
            placeholder="Descrição do produto" 
            value={form.descricao} 
            onChange={(e) => handleChange("descricao", e.target.value)} 
            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300" 
            rows={3}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors duration-300 font-medium"
            disabled={saving}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={saving} 
            className="px-6 py-3 bg-[#FFA500] text-black rounded-xl hover:bg-[#FF8C00] transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------- Modal de Confirmação de Status ----------
function ModalConfirmacaoStatus({
  produto,
  novoStatus,
  usuarioPendente,
  onUsuarioPendenteChange,
  onConfirm,
  onCancel
}: {
  produto: IProduto | null;
  novoStatus: IProduto["status"];
  usuarioPendente: string;
  onUsuarioPendenteChange: (usuario: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!produto) return null;

  const isPendente = novoStatus === "pendente";

  const getTitulo = () => {
    return `Alterar Status para ${novoStatus}`;
  };

  const getMensagem = () => {
    return `Tem certeza que deseja alterar o status do produto "${produto.nome}" para "${novoStatus}"?`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative max-w-md w-full bg-[#0B0B0B] border border-gray-800 rounded-2xl p-6 z-10">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-[#FFA500]">🔄</span>
          {getTitulo()}
        </h3>
        
        <p className="text-gray-300 mb-6">
          {getMensagem()}
        </p>

        {/* Campo para usuário quando status é pendente */}
        {isPendente && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              👤 Usuário Pendente *
            </label>
            <input 
              required
              placeholder="Digite o nome do usuário que está devendo"
              value={usuarioPendente} 
              onChange={(e) => onUsuarioPendenteChange(e.target.value)} 
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300" 
            />
            <p className="text-xs text-gray-400 mt-2">
              Este nome ficará registrado para identificar quem está devendo por este produto
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors duration-300 font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isPendente && !usuarioPendente.trim()}
            className="px-6 py-3 bg-[#FFA500] text-black rounded-xl hover:bg-[#FF8C00] transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>✅</span>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}