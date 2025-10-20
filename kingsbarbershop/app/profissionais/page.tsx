"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Button from "../components/ui/Button";
import Loader from "@/app/components/ui/Loader"; // Import do Loader
import { Profissional, Procedimento } from "../interfaces/profissionaisInterface";
import ProfissionalCard from "../components/profissional/ProfissionalCard";
import { ProcedimentosProfissionais } from "../components/profissional/ProcedimentosForm";
import { ProfissionalForm } from "../components/profissional/ProfissionalForm";
import { useProfissionaisAdmin } from "../hook/useProfissionaisAdmin";
import { useProcedimentosAdmin } from "../hook/useProcedimentosAdmin";
import ProcedimentoCard from "../components/profissional/ProcedimentoCard";
import { AuthService } from "../api/authAdmin";
import { useRouter } from "next/navigation";

interface ProcedimentoInput {
  nome: string;
  valor: number;
  profissionalId: string;
}

export default function ProfissionaisProcedimentosPage() {
  const router = useRouter();
  const authService = new AuthService();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [activeProfissionalTab, setActiveProfissionalTab] = useState<"ver" | "criar">("ver");
  const [activeProcedimentoTab, setActiveProcedimentoTab] = useState<"ver" | "criar">("ver");
  const [novoProcedimento, setNovoProcedimento] = useState<ProcedimentoInput>({
    nome: "",
    valor: 0,
    profissionalId: "",
  });
  const [editandoProcedimentoId, setEditandoProcedimentoId] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const { profissionais, addProfissional, updateProfissional, removeProfissional, fetchProfissionais } = useProfissionaisAdmin();
  const { procedimentos, addProcedimento, updateProcedimento, removeProcedimento } = useProcedimentosAdmin();

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
          fetchProfissionais();
        }
      } catch (err) {
        console.error("Erro na verificação de token:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router, fetchProfissionais]);

  // ------------------- FUNÇÕES -------------------
  const handleSaveProfissional = async (prof: Partial<Profissional>) => {
    if (!prof.nome || !prof.email || !prof.telefone) {
      alert("Nome, email e telefone são obrigatórios.");
      return;
    }
    try {
      if (prof.id) {
        const atualizado = await updateProfissional(prof.id, { nome: prof.nome, email: prof.email, telefone: prof.telefone });
        if (atualizado) { setSelectedProfissional(atualizado); setActiveProfissionalTab("ver"); }
      } else {
        const { id, ...dadosSemId } = prof;
        const novoProfissional = await addProfissional({ ...dadosSemId, procedimentos: prof.procedimentos || [] } as Omit<Profissional, "id">);
        setSelectedProfissional(novoProfissional); setActiveProfissionalTab("ver");
      }
    } catch (err) { console.error("Erro ao salvar profissional:", err); }
  };

  const handleSelectProfissional = (p: Profissional) => {
    setSelectedProfissional(p);
    setActiveProcedimentoTab("ver");
    setNovoProcedimento({ nome: "", valor: 0, profissionalId: p.id });
    setEditandoProcedimentoId(null);
  };

  const handleSubmitProcedimento = async () => {
    if (!novoProcedimento.nome || novoProcedimento.valor <= 0 || !selectedProfissional) return;
    try {
      if (editandoProcedimentoId) await updateProcedimento(editandoProcedimentoId, novoProcedimento);
      else await addProcedimento(novoProcedimento);
      setNovoProcedimento({ nome: "", valor: 0, profissionalId: selectedProfissional.id });
      setEditandoProcedimentoId(null); setActiveProcedimentoTab("ver");
    } catch (err) { console.error("Erro ao salvar procedimento:", err); }
  };

  const handleEditProcedimento = (proc: Procedimento) => {
    setNovoProcedimento({ nome: proc.nome, valor: proc.valor, profissionalId: proc.profissionalId });
    setEditandoProcedimentoId(proc.id);
    setActiveProcedimentoTab("criar");
  };

  const handleDeleteProcedimento = async (id?: string) => { if (id) await removeProcedimento(id); };

  const procedimentosFiltrados = procedimentos.filter(
    (p) => selectedProfissional?.procedimentos?.some((proc) => proc.id === p.id)
  );

  // ------------------- BLOQUEIO DE RENDER -------------------
  if (loading) return <Loader fullScreen={true} />;
  if (!isAuthenticated) return null;

  // ------------------- JSX -------------------
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] text-[#E5E5E5] overflow-x-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`flex-1 min-h-screen overflow-y-auto p-4 sm:p-6 md:p-8 transition-all duration-300 ${collapsed ? "md:ml-12" : "md:ml-24"} max-w-full sm:max-w-4xl lg:max-w-6xl mx-auto`}>
        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFA500] to-[#FFD700] bg-clip-text text-transparent mb-2">
            Profissionais e Procedimentos
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            Gerencie profissionais e seus procedimentos de forma simples e organizada
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Profissionais */}
          <section className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] rounded-2xl shadow-2xl border border-[#333333] p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Profissionais</h2>
                <p className="text-gray-400 text-sm sm:text-base">Cadastre e gerencie os profissionais do sistema</p>
              </div>
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0 flex-wrap">
                <Button
                  variant={activeProfissionalTab === "ver" ? "primary" : "secondary"}
                  onClick={() => setActiveProfissionalTab("ver")}
                  className="px-3 py-2 sm:px-4 sm:py-2 min-w-[120px] text-sm sm:text-base"
                >
                  👥 Ver Profissionais
                </Button>
                <Button
                  variant={activeProfissionalTab === "criar" ? "primary" : "secondary"}
                  onClick={() => { setActiveProfissionalTab("criar"); setSelectedProfissional(null); }}
                  className="px-3 py-2 sm:px-4 sm:py-2 min-w-[120px] text-sm sm:text-base"
                >
                  ➕ Criar Profissional
                </Button>
              </div>
            </div>

            {/* Conteúdo Profissionais */}
            <div className="mt-4 sm:mt-6">
              {activeProfissionalTab === "criar" && (
                <div className="bg-[#252525] rounded-xl p-4 sm:p-6 md:p-8 border border-[#333333] max-w-full sm:max-w-2xl mx-auto">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#FFA500] mb-3 sm:mb-4">
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
                <div>
                  {profissionais.length === 0 ? (
                    <div className="text-center py-10 sm:py-12 bg-[#252525] rounded-xl border-2 border-dashed border-[#333333]">
                      <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">👥</div>
                      <p className="text-gray-400 text-base sm:text-lg mb-1">Nenhum profissional cadastrado</p>
                      <p className="text-gray-500 text-sm sm:text-base">Clique em "Criar Profissional" para adicionar o primeiro</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {profissionais.map((p) => (
                        <ProfissionalCard
                          key={p.id}
                          profissional={p}
                          onSelect={handleSelectProfissional}
                          onEdit={(prof: Profissional) => { setSelectedProfissional(prof); setActiveProfissionalTab("criar"); }}
                          onDelete={(id: string | undefined) => removeProfissional(id ?? "")}
                          isSelected={selectedProfissional?.id === p.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Procedimentos */}
          {selectedProfissional && (
            <section className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] rounded-2xl shadow-2xl border border-[#333333] p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    Procedimentos de <span className="text-[#FFA500]">{selectedProfissional.nome}</span>
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">Gerencie os procedimentos associados a este profissional</p>
                </div>

                <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0 flex-wrap">
                  <Button
                    variant={activeProcedimentoTab === "ver" ? "primary" : "secondary"}
                    onClick={() => setActiveProcedimentoTab("ver")}
                    className="px-3 py-2 sm:px-4 sm:py-2 min-w-[120px] text-sm sm:text-base"
                  >
                    📋 Ver Procedimentos
                  </Button>
                  <Button
                    variant={activeProcedimentoTab === "criar" ? "primary" : "secondary"}
                    onClick={() => {
                      setActiveProcedimentoTab("criar");
                      setNovoProcedimento({ nome: "", valor: 0, profissionalId: selectedProfissional.id });
                      setEditandoProcedimentoId(null);
                    }}
                    className="px-3 py-2 sm:px-4 sm:py-2 min-w-[120px] text-sm sm:text-base"
                  >
                    ➕ Criar Procedimento
                  </Button>
                </div>
              </div>

              {/* Conteúdo Procedimentos */}
              <div className="mt-4 sm:mt-6">
                {activeProcedimentoTab === "criar" && (
                  <div className="bg-[#252525] rounded-xl p-4 sm:p-6 md:p-8 border border-[#333333] max-w-full sm:max-w-2xl mx-auto">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#FFA500] mb-3 sm:mb-4">
                      {editandoProcedimentoId ? "Editar Procedimento" : "Novo Procedimento"}
                    </h3>
                    <ProcedimentosProfissionais
                      profissionais={[selectedProfissional]}
                      procedimentos={procedimentosFiltrados}
                      novoProcedimento={novoProcedimento}
                      setNovoProcedimento={setNovoProcedimento}
                      addProcedimento={handleSubmitProcedimento}
                      updateProcedimento={handleSubmitProcedimento}
                      removeProcedimento={handleDeleteProcedimento}
                    />
                  </div>
                )}

                {activeProcedimentoTab === "ver" && (
                  <div>
                    {procedimentosFiltrados.length === 0 ? (
                      <div className="text-center py-10 sm:py-12 bg-[#252525] rounded-xl border-2 border-dashed border-[#333333]">
                        <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📋</div>
                        <p className="text-gray-400 text-base sm:text-lg mb-1">Nenhum procedimento cadastrado</p>
                        <p className="text-gray-500 text-sm sm:text-base">Clique em "Criar Procedimento" para adicionar o primeiro</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {procedimentosFiltrados.map((proc) => (
                          <ProcedimentoCard
                            key={proc.id}
                            procedimento={proc}
                            onEdit={handleEditProcedimento}
                            onDelete={() => handleDeleteProcedimento(proc.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="h-8 md:h-4"></div>
      </main>
    </div>
  );
}