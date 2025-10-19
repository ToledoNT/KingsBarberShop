"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Button from "../components/ui/Button";
import { Profissional, Procedimento } from "../interfaces/profissionaisInterface";
import ProfissionalCard from "../components/profissional/ProfissionalCard";
import { ProcedimentosProfissionais } from "../components/profissional/ProcedimentosForm";
import { ProfissionalForm } from "../components/profissional/ProfissionalForm";
import { useProfissionaisAdmin } from "../hook/useProfissionaisAdmin";
import { useProcedimentosAdmin } from "../hook/useProcedimentosAdmin";
import ProcedimentoCard from "../components/profissional/ProcedimentoCard";

interface ProcedimentoInput {
  nome: string;
  valor: number;
  profissionalId: string;
}

export default function ProfissionaisProcedimentosPage() {
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

  const {
    profissionais,
    addProfissional,
    updateProfissional, 
    removeProfissional,
    fetchProfissionais
  } = useProfissionaisAdmin();

  const { procedimentos, addProcedimento, updateProcedimento, removeProcedimento } = useProcedimentosAdmin();

  useEffect(() => {
    fetchProfissionais();
  }, [fetchProfissionais]);

  // -------------------- Profissional --------------------
  const handleSaveProfissional = async (prof: Partial<Profissional>) => {
    if (!prof.nome || !prof.email || !prof.telefone) {
      alert("Nome, email e telefone são obrigatórios.");
      return;
    }

    try {
      if (prof.id) {
        const atualizado = await updateProfissional(prof.id, {
          nome: prof.nome,
          email: prof.email,
          telefone: prof.telefone,
        });

        if (atualizado) {
          setSelectedProfissional(atualizado);
          setActiveProfissionalTab("ver");
        }
      } else {
        const { id, ...dadosSemId } = prof;
        const novoProfissional = await addProfissional({
          ...dadosSemId,
          procedimentos: prof.procedimentos || [],
        } as Omit<Profissional, "id">);

        setSelectedProfissional(novoProfissional);
        setActiveProfissionalTab("ver");
      }
    } catch (err) {
      console.error("Erro ao salvar profissional:", err);
    }
  };

  const handleSelectProfissional = (p: Profissional) => {
    setSelectedProfissional(p);
    setActiveProcedimentoTab("ver");
    setNovoProcedimento({ nome: "", valor: 0, profissionalId: p.id });
    setEditandoProcedimentoId(null);
  };

  // -------------------- Procedimento --------------------
  const handleSubmitProcedimento = async () => {
    if (!novoProcedimento.nome || novoProcedimento.valor <= 0 || !selectedProfissional) return;

    try {
      if (editandoProcedimentoId) {
        await updateProcedimento(editandoProcedimentoId, novoProcedimento);
      } else {
        await addProcedimento(novoProcedimento);
      }

      setNovoProcedimento({ nome: "", valor: 0, profissionalId: selectedProfissional.id });
      setEditandoProcedimentoId(null);
      setActiveProcedimentoTab("ver");
    } catch (err) {
      console.error("Erro ao salvar procedimento:", err);
    }
  };

  const handleEditProcedimento = (proc: Procedimento) => {
    setNovoProcedimento({ nome: proc.nome, valor: proc.valor, profissionalId: proc.profissionalId });
    setEditandoProcedimentoId(proc.id);
    setActiveProcedimentoTab("criar");
  };

  const handleDeleteProcedimento = async (id?: string) => {
    if (!id) return;
    await removeProcedimento(id);
  };

  const procedimentosFiltrados = procedimentos.filter(
    (p) => selectedProfissional?.procedimentos?.some((proc) => proc.id === p.id)
  );

  // -------------------- Render --------------------
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] text-[#E5E5E5] overflow-x-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`flex-1 min-h-screen overflow-y-auto p-4 md:p-8 transition-all duration-300 ${
          collapsed ? "md:ml-12" : "md:ml-24"
        } max-w-[1600px] mx-auto`}
      >
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFA500] to-[#FFD700] bg-clip-text text-transparent mb-2">
            Profissionais e Procedimentos
          </h1>
          <p className="text-gray-400 text-lg">
            Gerencie profissionais e seus procedimentos de forma simples e organizada
          </p>
        </div>

        {/* Container Principal */}
        <div className="space-y-8">
          {/* -------------------- Seção Profissionais -------------------- */}
          <section className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] rounded-2xl shadow-2xl border border-[#333333] p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Profissionais</h2>
                <p className="text-gray-400">Cadastre e gerencie os profissionais do sistema</p>
              </div>
              
              <div className="flex gap-3 mt-4 lg:mt-0">
                <Button
                  variant={activeProfissionalTab === "ver" ? "primary" : "secondary"}
                  onClick={() => setActiveProfissionalTab("ver")}
                  className="min-w-[140px]"
                >
                  👥 Ver Profissionais
                </Button>
                <Button
                  variant={activeProfissionalTab === "criar" ? "primary" : "secondary"}
                  onClick={() => {
                    setActiveProfissionalTab("criar");
                    setSelectedProfissional(null);
                  }}
                  className="min-w-[140px]"
                >
                  ➕ Criar Profissional
                </Button>
              </div>
            </div>

            {/* Conteúdo da Aba */}
            <div className="mt-6">
              {activeProfissionalTab === "criar" && (
                <div className="bg-[#252525] rounded-xl p-6 border border-[#333333]">
                  <h3 className="text-xl font-semibold text-[#FFA500] mb-4">
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Total: {profissionais.length} profissional{profissionais.length !== 1 ? 'es' : ''}
                    </h3>
                  </div>
                  
                  {profissionais.length === 0 ? (
                    <div className="text-center py-12 bg-[#252525] rounded-xl border-2 border-dashed border-[#333333]">
                      <div className="text-6xl mb-4">👥</div>
                      <p className="text-gray-400 text-lg mb-2">Nenhum profissional cadastrado</p>
                      <p className="text-gray-500">Clique em "Criar Profissional" para adicionar o primeiro</p>
                    </div>
                  ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {profissionais.map((p) => (
    <ProfissionalCard
      key={p.id}
      profissional={p}
      onSelect={handleSelectProfissional}
      onEdit={(prof: Profissional) => {
        setSelectedProfissional(prof);
        setActiveProfissionalTab("criar");
      }}
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

          {/* -------------------- Seção Procedimentos -------------------- */}
          {selectedProfissional && (
            <section className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] rounded-2xl shadow-2xl border border-[#333333] p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Procedimentos de <span className="text-[#FFA500]">{selectedProfissional.nome}</span>
                  </h2>
                  <p className="text-gray-400">
                    Gerencie os procedimentos associados a este profissional
                  </p>
                </div>
                
                <div className="flex gap-3 mt-4 lg:mt-0">
                  <Button
                    variant={activeProcedimentoTab === "ver" ? "primary" : "secondary"}
                    onClick={() => setActiveProcedimentoTab("ver")}
                    className="min-w-[140px]"
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
                    className="min-w-[140px]"
                  >
                    ➕ Criar Procedimento
                  </Button>
                </div>
              </div>

              {/* Conteúdo da Aba */}
              <div className="mt-6">
                {activeProcedimentoTab === "criar" && (
                  <div className="bg-[#252525] rounded-xl p-6 border border-[#333333] max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-[#FFA500] mb-4">
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
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Total: {procedimentosFiltrados.length} procedimento{procedimentosFiltrados.length !== 1 ? 's' : ''}
                      </h3>
                    </div>
                    
                    {procedimentosFiltrados.length === 0 ? (
                      <div className="text-center py-12 bg-[#252525] rounded-xl border-2 border-dashed border-[#333333]">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-gray-400 text-lg mb-2">Nenhum procedimento cadastrado</p>
                        <p className="text-gray-500">Clique em "Criar Procedimento" para adicionar o primeiro</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

        {/* Espaço no final para mobile */}
        <div className="h-8 md:h-4"></div>
      </main>
    </div>
  );
}