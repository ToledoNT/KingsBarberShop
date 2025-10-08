"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Table from "../ui/Table";
import { Procedimento, Profissional } from "@/app/interfaces/profissionaisInterface";

// --- Profissional Form ---
interface ProfissionalFormProps {
  profissional?: Profissional | null;
  onSave: (prof: Partial<Profissional>) => void;
  onCancel?: () => void;
}

const ProfissionalForm: React.FC<ProfissionalFormProps> = ({ profissional, onSave, onCancel }) => {
  const [nome, setNome] = useState(profissional?.nome || "");
  const [email, setEmail] = useState(profissional?.email || "");
  const [telefone, setTelefone] = useState(profissional?.telefone || "");

  const handleSubmit = () => {
    if (!nome) return;
    onSave({ id: profissional?.id, nome, email, telefone, procedimentos: profissional?.procedimentos || [] });
    setNome(""); setEmail(""); setTelefone("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 flex-wrap mt-4">
      <Input
        name="nome"
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
      />
      <Input
        name="email"
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Input
        name="telefone"
        placeholder="Telefone"
        value={telefone}
        onChange={e => setTelefone(e.target.value)}
      />

      <Button onClick={handleSubmit} variant="primary">
        {profissional ? "Salvar Alterações" : "Adicionar Profissional"}
      </Button>

      {onCancel && <Button onClick={onCancel} variant="secondary">Cancelar</Button>}
    </div>
  );
};

// --- Procedimentos Profissionais Component ---
interface ProcedimentosProfissionaisProps {
  profissionais: Profissional[];
  procedimentos: Procedimento[];
  novoProcedimento: Procedimento;
  setNovoProcedimento: (p: Procedimento) => void;
  addProcedimento: (p: Procedimento) => void;
  updateProcedimento: (id: string, p: Procedimento) => void;
  removeProcedimento: (id: string) => void;
}

const ProcedimentosProfissionais: React.FC<ProcedimentosProfissionaisProps> = ({
  profissionais,
  procedimentos,
  novoProcedimento,
  setNovoProcedimento,
  addProcedimento,
  updateProcedimento,
  removeProcedimento,
}) => {
  const [editando, setEditando] = useState<string | null>(null);
  const [procedimentosProfissional, setProcedimentosProfissional] = useState<Record<string, string[]>>({});

  const handleAddOrSave = () => {
    if (!novoProcedimento.nome || novoProcedimento.valor === undefined) return;

    if (editando) {
      updateProcedimento(editando, novoProcedimento);
      setEditando(null);
    } else {
      addProcedimento(novoProcedimento);
    }

    setNovoProcedimento({ nome: "", valor: 0 });
  };

  const handleEdit = (p: Procedimento) => {
    if (!p.id) return;
    setEditando(p.id);
    setNovoProcedimento({ nome: p.nome, valor: p.valor });
  };

  const toggleProcedimentoProfissional = (profId: string, procId: string) => {
    setProcedimentosProfissional(prev => {
      const current = prev[profId] || [];
      const updated = current.includes(procId)
        ? current.filter(id => id !== procId)
        : [...current, procId];
      return { ...prev, [profId]: updated };
    });
  };

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Valor", accessor: "valor" },
    { header: "Ações", accessor: "acoes" },
  ];

  const data = procedimentos
    .filter(p => p.id)
    .map(p => ({
      ...p,
      acoes: (
        <div className="flex gap-1">
          <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-blue-600 rounded text-xs">Editar</button>
          <button onClick={() => removeProcedimento(p.id!)} className="px-3 py-1 bg-red-600 rounded text-xs">Remover</button>
        </div>
      ),
    }));

  return (
    <section className="bg-[#1B1B1B] p-3 rounded-xl shadow flex flex-col gap-4">
      <h2 className="text-base font-semibold text-[#FFA500]">Procedimentos</h2>

      {/* Form de Procedimento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        <Input
          name="nomeProcedimento"
          placeholder="Nome do Procedimento"
          value={novoProcedimento.nome}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNovoProcedimento({ ...novoProcedimento, nome: e.target.value })
          }
        />

        <Input
          name="valorProcedimento"
          type="number"
          placeholder="Valor"
          value={novoProcedimento.valor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNovoProcedimento({ ...novoProcedimento, valor: Number(e.target.value) })
          }
        />
      </div>

      <Button onClick={handleAddOrSave} variant="primary">
        {editando ? "Salvar Alterações" : "Adicionar Procedimento"}
      </Button>

      {/* Checkbox de Procedimentos por Profissional */}
      {profissionais.filter(p => p.id).map(prof => (
        <div key={prof.id} className="bg-[#2A2A2A] p-3 rounded flex flex-col gap-2">
          <h3 className="font-semibold">{prof.nome}</h3>
          <div className="flex flex-wrap gap-2">
            {procedimentos.filter(proc => proc.id).map(proc => (
              <label
                key={proc.id}
                className="flex items-center gap-1 bg-[#1B1B1B] px-2 py-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={procedimentosProfissional[prof.id!]?.includes(proc.id!) || false}
                  onChange={() => toggleProcedimentoProfissional(prof.id!, proc.id!)}
                  className="accent-[#FFA500]"
                />
                <span>{proc.nome}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Tabela de Procedimentos */}
      <Table columns={columns} data={data} />
    </section>
  );
};

export { ProfissionalForm, ProcedimentosProfissionais };