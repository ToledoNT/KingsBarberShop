"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { Profissional, Props } from "@/app/interfaces/profissionaisInterface";
import ProfissionalCard from "./ProfissionalCard";
import { ProfissionalForm } from "./ProfissionalForm";  

const ProfissionaisSection: React.FC<Props> = ({
  profissionais,
  addProfissional,
  updateProfissional,
  removeProfissional,
  selectedProfissional,
  setSelectedProfissional,
  activeTab,
  setActiveTab
}) => {

  const handleSave = (prof: Partial<Profissional>) => {
    if (!prof.nome) return;

    if (selectedProfissional?.id) {
      updateProfissional(selectedProfissional.id, prof as Omit<Profissional, "id">);
    } else {
      addProfissional(prof as Omit<Profissional, "id">);
    }
  };

  const handleDelete = (id: string) => {
    removeProfissional(id);
    if (selectedProfissional?.id === id) setSelectedProfissional(null);
  };

  return (
    <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 flex flex-col gap-4">
      {/* --- Tabs --- */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeTab === "criar" ? "primary" : "secondary"}
          onClick={() => { setActiveTab("criar"); setSelectedProfissional(null); }}
          fullWidth={false}
        >
          Criar Profissional
        </Button>
        <Button
          variant={activeTab === "ver" ? "primary" : "secondary"}
          onClick={() => setActiveTab("ver")}
          fullWidth={false}
        >
          Ver Profissionais
        </Button>
      </div>

      {/* --- Formulário Profissional --- */}
      {activeTab === "criar" && (
        <ProfissionalForm
          profissional={selectedProfissional}
          onSave={handleSave}
          onCancel={() => setActiveTab("ver")}
        />
      )}

      {/* --- Lista de Profissionais --- */}
      {activeTab === "ver" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {profissionais.length === 0 && <p className="text-gray-400">Nenhum profissional cadastrado.</p>}
          {profissionais.map(p => (
            <ProfissionalCard
              key={p.id}
              profissional={p}
              onSelect={setSelectedProfissional}
              onEdit={(prof) => { setSelectedProfissional(prof); setActiveTab("criar"); }}
              onDelete={(id) => id && handleDelete(id)} // Garante compatibilidade com optional
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProfissionaisSection;