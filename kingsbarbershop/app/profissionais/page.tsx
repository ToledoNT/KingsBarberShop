"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Button from "../components/ui/Button";
import { Profissional, Procedimento } from "../interfaces/profissionaisInterface";
import ProfissionalCard from "../components/profissional/ProfissionalCard";
import { ProcedimentosProfissionais } from "../components/profissional/ProcedimentosForm";
import { ProfissionalForm } from "../components/profissional/ProfissionalForm";
import { useProfissionaisAdmin } from "../hook/useProfissionaisAdmin";

export default function ProfissionaisProcedimentosPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [activeProfissionalTab, setActiveProfissionalTab] = useState<"ver" | "criar">("ver");
  const [activeProcedimentoTab, setActiveProcedimentoTab] = useState<"ver" | "criar">("ver");

  const [novoProcedimento, setNovoProcedimento] = useState<Omit<Procedimento, "id">>({
    nome: "",
    valor: 0,
  });

  const [editandoProcedimentoId, setEditandoProcedimentoId] = useState<string | null>(null);

  const {
    profissionais,
    addProfissional,
    removeProfissional,
    updateProfissional,
    fetchProfissionais,
    loading,
    error
  } = useProfissionaisAdmin();

  useEffect(() => {
    fetchProfissionais();
  }, []);

  const handleSaveProfissional = async (prof: Partial<Profissional>) => {
    if (!prof.nome || !prof.email || !prof.telefone) {
      alert("Nome, email e telefone são obrigatórios.");
      return;
    }

    const newProfissional: Profissional = {
      id: String(Date.now()),
      nome: prof.nome as string,
      email: prof.email as string,
      telefone: prof.telefone as string,
      procedimentos: prof.procedimentos || [],
    };

    try {
      await addProfissional(newProfissional);
      setSelectedProfissional(newProfissional);
      setActiveProfissionalTab("ver");
    } catch (error) {
      console.error("Erro ao criar profissional:", error);
    }
  };

  const handleDeleteProfissional = (id?: string) => {
    if (!id) return;
    removeProfissional(id);
    if (selectedProfissional?.id === id) {
      setSelectedProfissional(null);
    }
  };

  const handleSelectProfissional = (p: Profissional) => {
    setSelectedProfissional(p);
    setActiveProcedimentoTab("ver");
    setNovoProcedimento({ nome: "", valor: 0 });
    setEditandoProcedimentoId(null);
  };

  // CORREÇÃO: Função separada para adicionar procedimento
  const handleAddProcedimento = (proc: Omit<Procedimento, "id">) => {
    if (!selectedProfissional) return;

    const procedimentoComId: Procedimento = {
      ...proc,
      id: String(Date.now())
    };

    const updatedProfissionais = profissionais.map(p => {
      if (p.id === selectedProfissional.id) {
        return { 
          ...p, 
          procedimentos: [...p.procedimentos, procedimentoComId] 
        };
      }
      return p;
    });

    setSelectedProfissional({
      ...selectedProfissional,
      procedimentos: [...selectedProfissional.procedimentos, procedimentoComId],
    });

    setNovoProcedimento({ nome: "", valor: 0 });
  };

  // CORREÇÃO: Função separada para atualizar procedimento
  const handleUpdateProcedimento = (id: string, proc: Omit<Procedimento, "id">) => {
    if (!selectedProfissional) return;

    const procedimentoComId: Procedimento = {
      ...proc,
      id: id
    };

    const updatedProfissionais = profissionais.map(p => {
      if (p.id === selectedProfissional.id) {
        const procedimentosAtualizados = p.procedimentos.map(pr => 
          pr.id === id ? procedimentoComId : pr
        );
        return { ...p, procedimentos: procedimentosAtualizados };
      }
      return p;
    });

    setSelectedProfissional({
      ...selectedProfissional,
      procedimentos: selectedProfissional.procedimentos.map(pr => 
        pr.id === id ? procedimentoComId : pr
      ),
    });

    setNovoProcedimento({ nome: "", valor: 0 });
    setEditandoProcedimentoId(null);
  };

  const handleEditProcedimento = (proc: Procedimento) => {
    const { id, ...dadosProcedimento } = proc;
    setNovoProcedimento(dadosProcedimento);
    setEditandoProcedimentoId(proc.id || null);
    setActiveProcedimentoTab("criar");
  };

  const handleDeleteProcedimento = (id?: string) => {
    if (!id || !selectedProfissional) return;

    const updatedProfissionais = profissionais.map(p => {
      if (p.id === selectedProfissional.id) {
        const procedimentosAtualizados = p.procedimentos.filter(pr => pr.id !== id);
        return { ...p, procedimentos: procedimentosAtualizados };
      }
      return p;
    });

    removeProfissional(id);
    setNovoProcedimento({ nome: "", valor: 0 });
    setEditandoProcedimentoId(null);
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`flex-1 h-screen overflow-y-auto p-4 md:p-6 transition-all ${collapsed ? "md:ml-12" : "md:ml-24"}`}>
        <h1 className="text-3xl font-bold text-[#FFA500] mb-6">Profissionais e Procedimentos</h1>

        {/* Box Profissionais */}
        <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 flex flex-col gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeProfissionalTab === "criar" ? "primary" : "secondary"}
              onClick={() => { setActiveProfissionalTab("criar"); setSelectedProfissional(null); }}
            >
              Criar Profissional
            </Button>
            <Button
              variant={activeProfissionalTab === "ver" ? "primary" : "secondary"}
              onClick={() => setActiveProfissionalTab("ver")}
            >
              Ver Profissionais
            </Button>
          </div>

          {activeProfissionalTab === "criar" && (
            <ProfissionalForm
              profissional={selectedProfissional}
              onSave={handleSaveProfissional}
              onCancel={() => setActiveProfissionalTab("ver")}
            />
          )}

          {activeProfissionalTab === "ver" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
  {profissionais.length === 0 && (
    <p className="text-gray-400">Nenhum profissional cadastrado.</p>
  )}
  {profissionais.map((p: Profissional) => (
    <ProfissionalCard
      key={p.id}
      profissional={p}
      onSelect={handleSelectProfissional}
      onEdit={(prof: Profissional) => {
        setSelectedProfissional(prof);
        setActiveProfissionalTab("criar");
      }}
      onDelete={handleDeleteProfissional}
    />
  

              ))}
            </div>
          )}
        </section>

        {/* Box Procedimentos */}
        {selectedProfissional && (
          <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#FFA500]">Procedimentos de {selectedProfissional.nome}</h2>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeProcedimentoTab === "criar" ? "primary" : "secondary"}
                onClick={() => { 
                  setActiveProcedimentoTab("criar"); 
                  setNovoProcedimento({ nome: "", valor: 0 }); 
                  setEditandoProcedimentoId(null); 
                }}
              >
                Criar Procedimento
              </Button>
              <Button
                variant={activeProcedimentoTab === "ver" ? "primary" : "secondary"}
                onClick={() => setActiveProcedimentoTab("ver")}
              >
                Ver Procedimentos
              </Button>
            </div>

            {activeProcedimentoTab === "criar" && (
              <ProcedimentosProfissionais
                profissionais={[selectedProfissional]}
                procedimentos={selectedProfissional?.procedimentos || []}
                novoProcedimento={novoProcedimento}
                setNovoProcedimento={setNovoProcedimento}
                addProcedimento={handleAddProcedimento}
                updateProcedimento={handleUpdateProcedimento}
                removeProcedimento={handleDeleteProcedimento}
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
}