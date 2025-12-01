"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/ui/Sidebar";
import { Notification } from "../components/ui/componenteNotificacao";
import { ConfirmDialog } from "../components/ui/componenteConfirmação";
import { useProdutos } from "../hook/useProdutosHook";
import { IProduto } from "../interfaces/produtosInterface";
import { Header } from "../components/produtos/headerProdutos";
import { ResumoCards } from "../components/produtos/resumoCards";
import { FiltrosSection } from "../components/produtos/filtrosSection";
import { ListaProdutos } from "../components/produtos/listaProdutos";
import { ProdutoModal } from "../components/produtos/produtoModal";
import { ModalConfirmacaoStatus } from "../components/produtos/modalConfirmaçãoStatus";
import { Loader } from "lucide-react";

// ---------- Interfaces ----------
interface FiltrosState {
  busca: string;
  categoria: string;
  ordenacao: "nome" | "preco" | "estoque";
}

// ---------- Hook personalizado para gerenciar produtos ----------
const useProdutosState = () => {
  const { 
    produtos, 
    loading, 
    error, 
    addProduto, 
    updateProduto, 
    removeProduto, 
    fetchProdutos 
  } = useProdutos();

  const [filtros, setFiltros] = useState<FiltrosState>({
    busca: "",
    categoria: "todos",
    ordenacao: "nome",
  });

  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);

  return {
    produtos,
    loading,
    error,
    addProduto,
    updateProduto,
    removeProduto,
    fetchProdutos,
    filtros,
    setFiltros,
    collapsed,
    setCollapsed,
    isAuthenticated,
    setIsAuthenticated,
    loadingAuth,
    setLoadingAuth
  };
};

// ---------- Hook de notificações e confirmações ----------
const useNotificationSystem = () => {
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

  const closeNotification = () => setNotification(prev => ({ ...prev, isOpen: false }));
  const closeConfirmDialog = () => setConfirmDialog(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  const handleConfirm = () => {
    if (confirmDialog.onConfirm) confirmDialog.onConfirm();
    closeConfirmDialog();
  };

  return { notification, confirmDialog, notify, confirm, closeNotification, closeConfirmDialog, handleConfirm };
};

// ---------- Hook de modais ----------
const useModalSystem = () => {
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

  const openProdutoModal = (produto?: IProduto) => {
    setEditing(produto || null);
    setIsModalOpen(true);
  };
  const closeProdutoModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const openStatusModal = (produto: IProduto, novoStatus?: IProduto["status"]) => {
    setStatusModal({
      isOpen: true,
      produto,
      novoStatus: novoStatus || produto.status,
      usuarioPendente: produto.usuarioPendente || ""
    });
  };
  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, produto: null, novoStatus: "disponivel", usuarioPendente: "" });
  };

  return { isModalOpen, editing, statusModal, openProdutoModal, closeProdutoModal, openStatusModal, closeStatusModal, setStatusModal };
};

// ---------- Componente Principal ----------
export default function ProdutosPage() {
  const router = useRouter();

  const produtosState = useProdutosState();
  const notificationSystem = useNotificationSystem();
  const modalSystem = useModalSystem();

  const {
    produtos, loading, error, addProduto, updateProduto, removeProduto, fetchProdutos,
    filtros, setFiltros, collapsed, setCollapsed, isAuthenticated, loadingAuth
  } = produtosState;

  const {
    notification, confirmDialog, notify, confirm, closeNotification, closeConfirmDialog, handleConfirm
  } = notificationSystem;

  const {
    isModalOpen, editing, statusModal, openProdutoModal, closeProdutoModal, openStatusModal, closeStatusModal, setStatusModal
  } = modalSystem;

  // ---------- Funções de filtro ----------
  const atualizarFiltro = (campo: keyof FiltrosState, valor: string) =>
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  const limparFiltros = () => setFiltros({ busca: "", categoria: "todos", ordenacao: "nome" });

  // ---------- Categorias disponíveis ----------
  const categoriasDisponiveis = useMemo(() => {
    const categorias = produtos.map(p => p.categoria).filter((c): c is string => !!c && c.trim() !== "");
    return Array.from(new Set(categorias)).sort();
  }, [produtos]);

  // ---------- Produtos filtrados ----------
  const produtosFiltrados = useMemo(() => {
    const termo = filtros.busca.toLowerCase();
    const cat = filtros.categoria;

    const filtrados = produtos.filter(p => {
      const nome = p.nome ?? "";
      const categoria = p.categoria ?? "";
      const nomeMatch = nome.toLowerCase().includes(termo);
      const catMatch = cat === "todos" || categoria.toLowerCase() === cat.toLowerCase();
      return nomeMatch && catMatch;
    });

    return filtrados.sort((a, b) => {
      switch (filtros.ordenacao) {
        case "preco": return (b.preco || 0) - (a.preco || 0);
        case "estoque": return (b.estoque || 0) - (a.estoque || 0);
        case "nome": default: return (a.nome || "").localeCompare(b.nome || "");
      }
    });
  }, [produtos, filtros]);

  // ---------- Totais ----------
  const totais = useMemo(() => {
    const totalValor = produtos.reduce((acc, p) => acc + (p.preco || 0), 0);
    const totalItens = produtos.reduce((acc, p) => acc + (p.estoque || 0), 0);
    return { totalValor, totalItens, quantidade: produtos.length };
  }, [produtos]);

  // ---------- Handlers ----------
  const handleAtualizarLista = async () => {
    try { await fetchProdutos(); notify("Lista de produtos atualizada", "success"); }
    catch { notify("Erro ao atualizar lista", "error"); }
  };

  const handleSalvarProduto = async (payload: Partial<IProduto>) => {
    try {
      const preco = payload.preco ? Number(String(payload.preco).replace(",", ".")) : 0;
      const estoque = Number(payload.estoque) || 0;

      if (preco <= 0) throw new Error("O preço deve ser maior que zero");
      if (estoque <= 0) throw new Error("O estoque deve ser maior que zero");

      const dadosParaEnvio: Partial<IProduto> = {
        nome: payload.nome?.trim() || "",
        categoria: payload.categoria?.trim() || "",
        preco,
        estoque,
        descricao: payload.descricao?.trim() || "",
        status: payload.status ?? (editing ? editing.status : "disponivel"),
        usuarioPendente: payload.status === "pendente"
          ? payload.usuarioPendente?.trim() || ""
          : ""
      };

      if (editing) {
        await updateProduto(editing.id, dadosParaEnvio);
        notify("Produto atualizado com sucesso", "success");
      } else {
        await addProduto(dadosParaEnvio as any);
        notify("Produto criado com sucesso", "success");
      }

      setTimeout(() => fetchProdutos(), 500);
      closeProdutoModal();

    } catch (err: any) {
      notify(err?.message || "Erro ao salvar produto", "error");
    }
  };

const handleExcluir = async (id: string) => {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  // 🔥 NOVO — bloqueia exclusão se estiver pendente
  if (produto.status === "pendente") {
    notify("Só é possível excluir quando o produto estiver pago.", "warning");
    return;
  }

  confirm(
    "Excluir Produto",
    `Tem certeza que deseja excluir o produto "${produto.nome}"?`,
    async () => {
      try {
        await removeProduto(id);
        notify("Produto deletado", "success");
        setTimeout(() => fetchProdutos(), 500);
      } catch {
        notify("Erro ao deletar produto", "error");
      }
    },
    "error"
  );
};


  const handleConfirmarStatus = async () => {
    const { produto, novoStatus, usuarioPendente } = statusModal;
    if (!produto) return;

    try {
      const dadosAtualizacao = {
        ...produto,
        status: novoStatus,
        usuarioPendente: novoStatus === "pendente" ? usuarioPendente?.trim() || "" : ""
      };

      await updateProduto(produto.id, dadosAtualizacao);
      notify(`Status atualizado para ${novoStatus}`, "success");
      setTimeout(() => fetchProdutos(), 500);
      closeStatusModal();

    } catch { notify("Erro ao atualizar status", "error"); }
  };

  const handleUsuarioPendenteChange = (usuario: string) => {
    setStatusModal(prev => ({ ...prev, usuarioPendente: usuario }));
  };

  const getStatusColor = (status: string | undefined) => {
    const s = status || "disponivel";
    switch (s) {
      case "disponivel": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "vendido": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "consumido": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "pendente": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loadingAuth || loading) return <Loader />;

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
            <Header
              produtosCount={produtos.length}
              buscaValue={filtros.busca}
              onBuscaChange={(valor) => atualizarFiltro("busca", valor)}
              onNovoProduto={() => openProdutoModal()}
              onAtualizarLista={handleAtualizarLista}
            />

            <div className="flex-1 flex flex-col min-h-0 gap-6">

              {/* FIX AQUI — ResumoCards NÃO recebe props */}
              <ResumoCards /> {/* <-- FIX */}

              <FiltrosSection
                filtros={filtros}
                categoriasDisponiveis={categoriasDisponiveis}
                produtosFiltradosCount={produtosFiltrados.length}
                produtosTotalCount={produtos.length}
                onFiltroChange={atualizarFiltro}
                onLimparFiltros={limparFiltros}
              />

              <ListaProdutos
                produtos={produtosFiltrados}
                produtosTotal={produtos.length}
                ordenacao={filtros.ordenacao}
                onEdit={openProdutoModal}
                onDelete={handleExcluir}
                onUpdateStatus={(produto, novoStatus) => openStatusModal(produto, novoStatus)}
                getStatusColor={getStatusColor}
                onLimparFiltros={limparFiltros}
                filtrosAtivos={!!(filtros.busca || filtros.categoria !== "todos")}
              />

            </div>
          </main>
        </div>

        {isModalOpen && (
          <ProdutoModal
            key={editing ? `edit-${editing.id}` : 'create'}
            initial={editing ?? undefined}
            onClose={closeProdutoModal}
            onSave={handleSalvarProduto}
            categoriasSugeridas={categoriasDisponiveis}
          />
        )}

        {statusModal.isOpen && (
          <ModalConfirmacaoStatus
            produto={statusModal.produto}
            novoStatus={statusModal.novoStatus}
            usuarioPendente={statusModal.usuarioPendente}
            onUsuarioPendenteChange={handleUsuarioPendenteChange}
            onConfirm={handleConfirmarStatus}
            onCancel={closeStatusModal}
          />
        )}
      </div>
    </>
  );
}