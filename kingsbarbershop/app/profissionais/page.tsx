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
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] overflow-x-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`flex-1 min-h-screen overflow-y-auto p-4 md:p-6 transition-all ${
          collapsed ? "md:ml-12" : "md:ml-24"
        } max-w-[1600px] mx-auto`}
      >
        <h1 className="text-3xl font-bold text-[#FFA500] mb-6 text-center md:text-left">
          Profissionais e Procedimentos
        </h1>

        {/* -------------------- Box Profissionais -------------------- */}
        <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 flex flex-col gap-4 mb-6">
          <div className="flex gap-2 flex-wrap justify-center md:justify-start">
            <Button
              variant={activeProfissionalTab === "criar" ? "primary" : "secondary"}
              onClick={() => {
                setActiveProfissionalTab("criar");
                setSelectedProfissional(null);
              }}
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
              {profissionais.length === 0 ? (
                <p className="text-gray-400 text-center">Nenhum profissional cadastrado.</p>
              ) : (
                profissionais.map((p) => (
                  <ProfissionalCard
                    key={p.id}
                    profissional={p}
                    onSelect={handleSelectProfissional}
                    onEdit={(prof) => {
                      setSelectedProfissional(prof);
                      setActiveProfissionalTab("criar");
                    }}
                    onDelete={(id) => removeProfissional(id ?? "")}
                  />
                ))
              )}
            </div>
          )}
        </section>

        {/* -------------------- Box Procedimentos -------------------- */}
        {selectedProfissional && (
          <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 flex flex-col gap-4 mb-20">
            <h2 className="text-lg font-semibold text-[#FFA500] text-center md:text-left">
              Procedimentos de {selectedProfissional.nome}
            </h2>

            <div className="flex gap-2 flex-wrap justify-center md:justify-start mb-4">
              <Button
                variant={activeProcedimentoTab === "criar" ? "primary" : "secondary"}
                onClick={() => {
                  setActiveProcedimentoTab("criar");
                  setNovoProcedimento({ nome: "", valor: 0, profissionalId: selectedProfissional.id });
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
              <div className="w-full flex justify-center">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {procedimentosFiltrados.length === 0 ? (
                  <p className="text-gray-400 text-center">Nenhum procedimento cadastrado.</p>
                ) : (
                  procedimentosFiltrados.map((proc) => (
                    <ProcedimentoCard
                      key={proc.id}
                      procedimento={proc}
                      onEdit={handleEditProcedimento}
                      onDelete={() => handleDeleteProcedimento(proc.id)}
                    />
                  ))
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}