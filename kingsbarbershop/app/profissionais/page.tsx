"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Procedimento, Profissional, ProfissionalFormProps } from "../interfaces/profissionaisInterface";

// --- Formulário Profissional ---
const ProfissionalForm: React.FC<ProfissionalFormProps> = ({ profissional, onSave, onCancel }) => {
  const [nome, setNome] = useState(profissional?.nome || "");
  const [email, setEmail] = useState(profissional?.email || "");
  const [telefone, setTelefone] = useState(profissional?.telefone || "");

  const handleSubmit = () => {
    if (!nome) return;
    onSave({ id: profissional?.id, nome, email, telefone });
    setNome("");
    setEmail("");
    setTelefone("");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-2 flex-wrap mt-4">
      <Input className="flex-1" name="nome" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <Input className="flex-1" name="email" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input className="flex-1" name="telefone" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
      <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
        <Button onClick={handleSubmit} variant="primary" className="w-full sm:w-auto">
          {profissional ? "Salvar Alterações" : "Adicionar Profissional"}
        </Button>
        {onCancel && <Button onClick={onCancel} variant="secondary" className="w-full sm:w-auto">Cancelar</Button>}
      </div>
    </div>
  );
};

// --- Formulário Procedimento ---
interface ProcedimentoFormProps {
  procedimento?: Procedimento | null;
  onSave: (proc: Partial<Procedimento>) => void;
  onCancel?: () => void;
}

const ProcedimentoForm: React.FC<ProcedimentoFormProps> = ({ procedimento, onSave, onCancel }) => {
  const [nome, setNome] = useState(procedimento?.nome || "");
  const [valor, setValor] = useState(procedimento?.valor || 0);

  const handleSubmit = () => {
    if (!nome || valor <= 0) return;
    onSave({ id: procedimento?.id, nome, valor });
    setNome("");
    setValor(0);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-2 flex-wrap mt-4">
      <Input className="flex-1" name="nomeProcedimento" placeholder="Nome do Procedimento" value={nome} onChange={e => setNome(e.target.value)} />
      <Input className="flex-1" name="valorProcedimento" placeholder="Valor" type="number" value={valor} onChange={e => setValor(Number(e.target.value))} />
      <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
        <Button onClick={handleSubmit} variant="primary" className="w-full sm:w-auto">
          {procedimento ? "Salvar Alterações" : "Adicionar Procedimento"}
        </Button>
        {onCancel && <Button onClick={onCancel} variant="secondary" className="w-full sm:w-auto">Cancelar</Button>}
      </div>
    </div>
  );
};

// --- Card Profissional ---
interface ProfissionalCardProps {
  profissional: Profissional;
  onSelect: (p: Profissional) => void;
  onEdit: (p: Profissional) => void;
  onDelete: (id?: string) => void;
}

const ProfissionalCard: React.FC<ProfissionalCardProps> = ({ profissional, onSelect, onEdit, onDelete }) => (
  <div className="bg-[#2A2A2A] rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer break-words max-w-full" onClick={() => onSelect(profissional)}>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div className="flex-1">
        <p className="font-semibold text-sm sm:text-base">{profissional.nome}</p>
        <p className="text-gray-400 text-xs sm:text-sm">{profissional.email}</p>
        <p className="text-gray-400 text-xs sm:text-sm">{profissional.telefone}</p>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">{profissional.procedimentos.length} procedimento(s)</p>
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap">
        <Button onClick={(e) => { e.stopPropagation(); onEdit(profissional); }} variant="primary" className="text-xs sm:text-sm w-full sm:w-auto">Editar</Button>
        <Button onClick={(e) => { e.stopPropagation(); onDelete(profissional.id); }} variant="secondary" className="text-xs sm:text-sm w-full sm:w-auto">Remover</Button>
      </div>
    </div>
  </div>
);

// --- Card Procedimento ---
interface ProcedimentoCardProps {
  procedimento: Procedimento;
  onEdit: (p: Procedimento) => void;
  onDelete: (id?: string) => void;
}

const ProcedimentoCard: React.FC<ProcedimentoCardProps> = ({ procedimento, onEdit, onDelete }) => (
  <div className="bg-[#2A2A2A] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow hover:shadow-lg transition break-words max-w-full">
    <div className="flex-1">
      <p className="font-semibold text-sm sm:text-base">{procedimento.nome}</p>
      <p className="text-gray-400 text-xs sm:text-sm">R$ {procedimento.valor.toFixed(2)}</p>
    </div>
    <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap">
      <Button onClick={() => onEdit(procedimento)} variant="primary" className="text-xs sm:text-sm w-full sm:w-auto">Editar</Button>
      <Button onClick={() => onDelete(procedimento.id)} variant="secondary" className="text-xs sm:text-sm w-full sm:w-auto">Remover</Button>
    </div>
  </div>
);

// --- Página Principal ---
export default function ProfissionaisProcedimentosPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [activeProfissionalTab, setActiveProfissionalTab] = useState<"ver" | "criar">("ver");
  const [activeProcedimentoTab, setActiveProcedimentoTab] = useState<"ver" | "criar">("ver");
  const [selectedProcedimento, setSelectedProcedimento] = useState<Procedimento | null>(null);

  // --- Funções Profissionais ---
  const handleSaveProfissional = (prof: Partial<Profissional>) => {
    if (!prof.nome) return;

    if (prof.id) {
      setProfissionais(prev => prev.map(p => p.id === prof.id ? { ...p, ...prof } : p));
      if (selectedProfissional?.id === prof.id) setSelectedProfissional(prev => prev ? { ...prev, ...prof } : null);
    } else {
      const novoProf = { ...prof, id: String(Date.now()), procedimentos: [] } as Profissional;
      setProfissionais(prev => [...prev, novoProf]);
    }

    setActiveProfissionalTab("ver");
  };

  const handleDeleteProfissional = (id?: string) => {
    if (!id) return;
    setProfissionais(prev => prev.filter(p => p.id !== id));
    if (selectedProfissional?.id === id) setSelectedProfissional(null);
  };

  const handleSelectProfissional = (p: Profissional) => {
    setSelectedProfissional(p);
    setActiveProcedimentoTab("ver");
    setSelectedProcedimento(null);
  };

  // --- Funções Procedimentos ---
  const handleSaveProcedimento = (proc: Partial<Procedimento>) => {
    if (!proc.nome || !selectedProfissional) return;

    setProfissionais(prev =>
      prev.map(p => {
        if (p.id === selectedProfissional.id) {
          const procedimentosAtualizados = proc.id
            ? p.procedimentos.map(pr => pr.id === proc.id ? { ...pr, ...proc } : pr)
            : [...p.procedimentos, { ...proc, id: String(Date.now()) } as Procedimento];

          const atualizado = { ...p, procedimentos: procedimentosAtualizados };
          setSelectedProfissional(atualizado);
          return atualizado;
        }
        return p;
      })
    );

    setSelectedProcedimento(null);
    setActiveProcedimentoTab("ver");
  };

  const handleDeleteProcedimento = (id?: string) => {
    if (!id || !selectedProfissional) return;

    setProfissionais(prev =>
      prev.map(p => p.id === selectedProfissional.id
        ? { ...p, procedimentos: p.procedimentos.filter(pr => pr.id !== id) }
        : p
      )
    );
    setSelectedProcedimento(null);
  };

  const handleEditProcedimento = (proc: Procedimento) => {
    setSelectedProcedimento(proc);
    setActiveProcedimentoTab("criar");
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`flex-1 h-screen overflow-y-auto p-4 md:p-6 transition-all ${collapsed ? "md:ml-12" : "md:ml-24"}`}>
        <h1 className="text-3xl font-bold text-[#FFA500] mb-6">Profissionais e Procedimentos</h1>

        {/* Box Profissionais */}
        <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 flex flex-col gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Button variant={activeProfissionalTab === "criar" ? "primary" : "secondary"} onClick={() => { setActiveProfissionalTab("criar"); setSelectedProfissional(null); }}>Criar Profissional</Button>
            <Button variant={activeProfissionalTab === "ver" ? "primary" : "secondary"} onClick={() => setActiveProfissionalTab("ver")}>Ver Profissionais</Button>
          </div>

          {activeProfissionalTab === "criar" && (
            <ProfissionalForm profissional={selectedProfissional} onSave={handleSaveProfissional} onCancel={() => setActiveProfissionalTab("ver")} />
          )}

          {activeProfissionalTab === "ver" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {profissionais.length === 0 && <p className="text-gray-400">Nenhum profissional cadastrado.</p>}
              {profissionais.map(p => (
                <ProfissionalCard key={p.id} profissional={p} onSelect={handleSelectProfissional} onEdit={(prof) => { setSelectedProfissional(prof); setActiveProfissionalTab("criar"); }} onDelete={handleDeleteProfissional} />
              ))}
            </div>
          )}
        </section>

        {/* Box Procedimentos */}
        {selectedProfissional && (
          <section className="bg-[#1B1B1B] rounded-2xl shadow p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#FFA500]">Procedimentos de {selectedProfissional.nome}</h2>

            <div className="flex gap-2 flex-wrap">
              <Button variant={activeProcedimentoTab === "criar" ? "primary" : "secondary"} onClick={() => { setActiveProcedimentoTab("criar"); setSelectedProcedimento(null); }}>Criar Procedimento</Button>
              <Button variant={activeProcedimentoTab === "ver" ? "primary" : "secondary"} onClick={() => setActiveProcedimentoTab("ver")}>Ver Procedimentos</Button>
            </div>

            {activeProcedimentoTab === "criar" && (
              <ProcedimentoForm procedimento={selectedProcedimento} onSave={handleSaveProcedimento} onCancel={() => setActiveProcedimentoTab("ver")} />
            )}

            {activeProcedimentoTab === "ver" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {selectedProfissional.procedimentos.length === 0 && <p className="text-gray-400">Nenhum procedimento cadastrado.</p>}
                {selectedProfissional.procedimentos.map(proc => (
                  <ProcedimentoCard key={proc.id} procedimento={proc} onEdit={handleEditProcedimento} onDelete={handleDeleteProcedimento} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}