"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { Profissional } from "../interfaces/profissionaisInterface";
import ProfissionalCard from "../components/profissional/ProfissionalCard";
import { ProcedimentosProfissionais } from "../components/profissional/ProcedimentosForm";
import { ProfissionalForm } from "../components/profissional/ProfissionalForm";
import { useProfissionaisAdmin } from "../hook/useProfissionaisAdmin";
import { useProcedimentosAdmin } from "../hook/useProcedimentosAdmin";
import ProcedimentoCard from "../components/profissional/ProcedimentoCard";
import { AuthService } from "../api/authAdmin";
import { useRouter } from "next/navigation";
import { ProcedimentoInput } from "../interfaces/inputInterface";
import { Notification } from "../components/ui/componenteNotificacao";

const authService = new AuthService();

export default function ProfissionaisProcedimentosPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [activeProfissionalTab, setActiveProfissionalTab] = useState<"ver" | "criar">("ver");
  const [activeProcedimentoTab, setActiveProcedimentoTab] = useState<"ver" | "criar">("ver");
  const [novoProcedimento, setNovoProcedimento] = useState<ProcedimentoInput>({
    nome: "",
    valor: 0,
    profissionalId: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado para notificação
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "info" as "info" | "success" | "warning" | "error"
  });

  const { profissionais, addProfissional, updateProfissional, removeProfissional, fetchProfissionais } = useProfissionaisAdmin();
  const { procedimentos, addProcedimento, updateProcedimento, removeProcedimento, fetchProcedimentos } = useProcedimentosAdmin();

  // Funções de notificação
  const showNotification = (message: string, type: "info" | "success" | "warning" | "error" = "info") => {
    setNotification({ isOpen: true, message, type });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  // ------------------- VERIFICAÇÃO DE TOKEN -------------------
  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      try {
        const valid = await authService.verifyToken();
        if (!valid) {
          router.replace("/login");
        } else {
          setIsAuthenticated(true);
          await fetchProfissionais();
          await fetchProcedimentos();
        }
      } catch (err) {
        console.error("Erro na verificação de token:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  // ------------------- FUNÇÕES -------------------
  const handleSaveProfissional = useCallback(async (prof: Partial<Profissional>) => {
    if (!prof.nome?.trim() || !prof.email?.trim() || !prof.telefone?.trim()) {
      showNotification("Nome, email e telefone são obrigatórios.", "warning");
      return;
    }
    try {
      if (prof.id) {
        const atualizado = await updateProfissional(prof.id, { 
          nome: prof.nome.trim(), 
          email: prof.email.trim(), 
          telefone: prof.telefone.trim() 
        });
        if (atualizado) { 
          setSelectedProfissional(atualizado); 
          setActiveProfissionalTab("ver");
          showNotification("Profissional atualizado com sucesso!", "success");
        }
      } else {
        const { id, ...dadosSemId } = prof;
        const novoProfissional = await addProfissional({ 
          ...dadosSemId, 
          procedimentos: prof.procedimentos || [] 
        } as Omit<Profissional, "id">);
        setSelectedProfissional(novoProfissional); 
        setActiveProfissionalTab("ver");
        showNotification("Profissional criado com sucesso!", "success");
      }
    } catch (err) { 
      console.error("Erro ao salvar profissional:", err);
      showNotification("Erro ao salvar profissional. Tente novamente.", "error");
    }
  }, [addProfissional, updateProfissional]);

  const handleSelectProfissional = useCallback((p: Profissional) => {
    setSelectedProfissional(p);
    setActiveProcedimentoTab("ver");
    setNovoProcedimento({ nome: "", valor: 0, profissionalId: p.id });
  }, []);

  const handleSubmitProcedimento = useCallback(async () => {
    if (!novoProcedimento.nome?.trim() || novoProcedimento.valor <= 0 || !selectedProfissional) {
      showNotification("Preencha todos os campos corretamente.", "warning");
      return;
    }
      
    try {
      const resultado = await addProcedimento({
        nome: novoProcedimento.nome.trim(),
        valor: novoProcedimento.valor,
        profissionalId: novoProcedimento.profissionalId
      });
      
      await fetchProcedimentos();
      
      setNovoProcedimento({ nome: "", valor: 0, profissionalId: selectedProfissional.id });
      setActiveProcedimentoTab("ver");
      showNotification("Procedimento criado com sucesso!", "success");
      
    } catch (err: any) { 
      console.error("❌ Erro ao salvar procedimento:", err);
      showNotification(`Erro ao criar procedimento: ${err.message || "Tente novamente."}`, "error");
    }
  }, [novoProcedimento, selectedProfissional, addProcedimento, fetchProcedimentos]);

  const handleAddProcedimento = useCallback(async (dados: ProcedimentoInput) => {    
    try {
      const resultado = await addProcedimento(dados);
      await fetchProcedimentos();
      showNotification("Procedimento adicionado com sucesso!", "success");
      return resultado;
    } catch (err: any) {
      console.error("❌ Erro ao criar procedimento:", err);
      showNotification("Erro ao criar procedimento", "error");
      throw err;
    }
  }, [addProcedimento, fetchProcedimentos]);

  const handleDeleteProcedimento = useCallback(async (id?: string) => { 
    if (id) {
      if (confirm("Tem certeza que deseja excluir este procedimento?")) {
        try {
          await removeProcedimento(id);
          await fetchProcedimentos();
          showNotification("Procedimento excluído com sucesso!", "success");
        } catch (err) {
          console.error("Erro ao excluir procedimento:", err);
          showNotification("Erro ao excluir procedimento.", "error");
        }
      }
    }
  }, [removeProcedimento, fetchProcedimentos]);

  const handleDeleteProfissional = useCallback(async (id?: string) => {
    if (id) {
      const procedimentosDoProfissional = procedimentos.filter(p => p.profissionalId === id);
      
      if (procedimentosDoProfissional.length > 0) {
        showNotification(
          `Não é possível excluir este profissional. Existem ${procedimentosDoProfissional.length} procedimento(s) vinculado(s). Remova os procedimentos primeiro.`,
          "error"
        );
        return;
      }

      if (confirm("Tem certeza que deseja excluir este profissional?")) {
        try {
          await removeProfissional(id);
          if (selectedProfissional?.id === id) {
            setSelectedProfissional(null);
          }
          await fetchProfissionais();
          showNotification("Profissional excluído com sucesso!", "success");
        } catch (err: any) {
          console.error("Erro ao excluir profissional:", err);
          // Se o erro for por vínculos com agendamentos
          if (err.message?.includes('agendamento') || err.message?.includes('vinculado')) {
            showNotification("Não é possível excluir. Existem agendamentos vinculados a este profissional.", "error");
          } else {
            showNotification("Erro ao excluir profissional.", "error");
          }
        }
      }
    }
  }, [removeProfissional, selectedProfissional, fetchProfissionais, procedimentos]);

  const procedimentosFiltrados = procedimentos.filter(
    (p) => p.profissionalId === selectedProfissional?.id
  );

  // ------------------- BLOQUEIO DE RENDER -------------------
  if (loading) return <Loader fullScreen={true} />;
  if (!isAuthenticated) return null;

  // ------------------- JSX -------------------
  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
      <aside className="flex-shrink-0 h-screen lg:sticky top-0 z-20">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Componente de Notificação */}
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
        duration={4000}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex-shrink-0">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1 flex items-center gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl">👥</span>
                    <span className="truncate">Profissionais & Procedimentos</span>
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base truncate">
                    Gerencie profissionais e seus procedimentos de forma simples e organizada
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant={activeProfissionalTab === "ver" ? "primary" : "secondary"}
                    onClick={() => setActiveProfissionalTab("ver")}
                    className="px-4 py-3 min-w-[140px] text-sm font-medium flex-1 sm:flex-none justify-center"
                  >
                    <span>👥</span>
                    <span>Ver Profissionais</span>
                  </Button>
                  <Button
                    variant={activeProfissionalTab === "criar" ? "primary" : "secondary"}
                    onClick={() => { 
                      setActiveProfissionalTab("criar"); 
                      setSelectedProfissional(null); 
                    }}
                    className="px-4 py-3 min-w-[140px] text-sm font-medium flex-1 sm:flex-none justify-center"
                  >
                    <span>➕</span>
                    <span>Criar Profissional</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Container principal */}
          <div className="flex-1 flex flex-col min-h-0 gap-6">
            {/* Seção Profissionais */}
            <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm">
              {activeProfissionalTab === "criar" && (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm w-full">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#FFA500] mb-4 sm:mb-6 flex items-center gap-2">
                    <span>{selectedProfissional ? "✏️" : "➕"}</span>
                    {selectedProfissional ? "Editar Profissional" : "Novo Profissional"}
                  </h3>
                  <ProfissionalForm
                    profissional={selectedProfissional}
                    onSave={handleSaveProfissional}
                    onCancel={() => setActiveProfissionalTab("ver")}
                  />
                </div>
              )}

              {activeProfissionalTab === "ver" && (
                <>
                  {/* Header da lista */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                      <span className="text-[#FFA500]">📋</span>
                      Profissionais
                      <span className="text-xs sm:text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg ml-2">
                        {profissionais.length}
                      </span>
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {profissionais.length} profissional{profissionais.length !== 1 ? 'es' : ''} cadastrado{profissionais.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Lista de Profissionais */}
                  <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar scroll-smooth">
                    {profissionais.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl max-w-md mx-auto w-full bg-gray-900/30 backdrop-blur-sm px-4">
                        <div className="text-6xl mb-4 opacity-60">👥</div>
                        <p className="text-lg font-semibold text-gray-300 mb-3">Nenhum profissional cadastrado</p>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                          Clique em "Criar Profissional" para adicionar o primeiro
                        </p>
                        <Button
                          onClick={() => {
                            setActiveProfissionalTab("criar");
                            setSelectedProfissional(null);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-black rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm"
                        >
                          <span>➕</span>
                          Criar Primeiro Profissional
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-2">
                        {profissionais.map((p) => (
                          <ProfissionalCard
                            key={p.id}
                            profissional={p}
                            onSelect={handleSelectProfissional}
                            onEdit={(prof: Profissional) => { 
                              setSelectedProfissional(prof); 
                              setActiveProfissionalTab("criar"); 
                            }}
                            onDelete={handleDeleteProfissional}
                            isSelected={selectedProfissional?.id === p.id}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Seção Procedimentos (apenas se um profissional estiver selecionado) */}
            {selectedProfissional && (
              <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm">
                {/* Header da seção de procedimentos */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
                      <span className="text-[#FFA500]">📋</span>
                      Procedimentos de <span className="text-[#FFA500] truncate">{selectedProfissional.nome}</span>
                    </h2>
                    <p className="text-gray-400 text-sm truncate">
                      Gerencie os procedimentos deste profissional
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant={activeProcedimentoTab === "ver" ? "primary" : "secondary"}
                      onClick={() => setActiveProcedimentoTab("ver")}
                      className="px-4 py-3 min-w-[140px] text-sm font-medium flex-1 sm:flex-none justify-center"
                    >
                      <span>📋</span>
                      <span>Ver Procedimentos</span>
                    </Button>
                    <Button
                      variant={activeProcedimentoTab === "criar" ? "primary" : "secondary"}
                      onClick={() => {
                        setActiveProcedimentoTab("criar");
                        setNovoProcedimento({ nome: "", valor: 0, profissionalId: selectedProfissional.id });
                      }}
                      className="px-4 py-3 min-w-[140px] text-sm font-medium flex-1 sm:flex-none justify-center"
                    >
                      <span>➕</span>
                      <span>Criar Procedimento</span>
                    </Button>
                  </div>
                </div>

                {/* Conteúdo Procedimentos */}
                <div className="flex-1 flex flex-col min-h-0">
                  {activeProcedimentoTab === "criar" && (
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm w-full">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#FFA500] mb-4 sm:mb-6 flex items-center gap-2">
                        <span>➕</span>
                        Novo Procedimento
                      </h3>
                      <ProcedimentosProfissionais
                        profissionais={[selectedProfissional]}
                        procedimentos={procedimentosFiltrados}
                        novoProcedimento={novoProcedimento}
                        setNovoProcedimento={setNovoProcedimento}
                        addProcedimento={handleAddProcedimento}
                        updateProcedimento={updateProcedimento}
                        removeProcedimento={handleDeleteProcedimento}
                      />
                    </div>
                  )}

                  {activeProcedimentoTab === "ver" && (
                    <>
                      {/* Header da lista de procedimentos */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                          <span className="text-[#FFA500]">📝</span>
                          Procedimentos
                          <span className="text-xs sm:text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg ml-2">
                            {procedimentosFiltrados.length}
                          </span>
                        </h3>
                      </div>

                      {/* Lista de Procedimentos */}
                      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar scroll-smooth">
                        {procedimentosFiltrados.length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl max-w-md mx-auto w-full bg-gray-900/30 backdrop-blur-sm px-4">
                            <div className="text-6xl mb-4 opacity-60">📋</div>
                            <p className="text-lg font-semibold text-gray-300 mb-3">Nenhum procedimento cadastrado</p>
                            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                              Clique em "Criar Procedimento" para adicionar o primeiro
                            </p>
                            <Button
                              onClick={() => {
                                setActiveProcedimentoTab("criar");
                                setNovoProcedimento({ nome: "", valor: 0, profissionalId: selectedProfissional.id });
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-black rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm"
                            >
                              <span>➕</span>
                              Criar Primeiro Procedimento
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-2">
                            {procedimentosFiltrados.map((proc) => (
                              <ProcedimentoCard
                                key={proc.id}
                                procedimento={proc}
                                onEdit={() => {
                                  setNovoProcedimento({ 
                                    nome: proc.nome, 
                                    valor: proc.valor, 
                                    profissionalId: proc.profissionalId 
                                  });
                                  setActiveProcedimentoTab("criar");
                                }}
                                onDelete={() => handleDeleteProcedimento(proc.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}