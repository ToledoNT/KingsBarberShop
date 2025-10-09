import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Table from "../ui/Table";
import { Procedimento, ProcedimentosProfissionaisProps, Profissional } from "@/app/interfaces/profissionaisInterface";
import { useProcedimentosAdmin } from "@/app/hook/useProcedimentosAdmin";

const ProcedimentosProfissionais: React.FC<ProcedimentosProfissionaisProps> = ({ 
  profissionais, 
  procedimentos, 
  novoProcedimento, 
  setNovoProcedimento,
  addProcedimento,
  updateProcedimento,
  removeProcedimento
}) => {
  const [editando, setEditando] = useState<string | null>(null);
  
  const { 
    procedimentos: procedimentosDaAPI, 
    addProcedimento: addProcedimentoAPI, 
    updateProcedimento: updateProcedimentoAPI, 
    removeProcedimento: removeProcedimentoAPI, 
    loading, 
    error 
  } = useProcedimentosAdmin();

  const handleAddOrSave = async () => {
    if (!novoProcedimento.nome || novoProcedimento.valor <= 0) {
      alert("Nome e valor do procedimento são obrigatórios.");
      return;
    }

    try {
      if (editando) {
        // Usando a função do hook para atualizar na API
        await updateProcedimentoAPI(editando, novoProcedimento);
        setEditando(null);
      } else {
        // Usando a função do hook para adicionar na API
        await addProcedimentoAPI(novoProcedimento);
      }

      setNovoProcedimento({ nome: "", valor: 0 });
    } catch (error) {
      console.error("Erro ao salvar procedimento:", error);
      alert("Ocorreu um erro ao salvar o procedimento.");
    }
  };

  const handleEdit = (p: Procedimento) => {
    if (p.id) {
      setEditando(p.id);
      setNovoProcedimento({ nome: p.nome, valor: p.valor });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      // Usando a função do hook para remover da API
      await removeProcedimentoAPI(id);
    } catch (error) {
      console.error("Erro ao remover procedimento:", error);
      alert("Ocorreu um erro ao remover o procedimento.");
    }
  };

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Valor", accessor: "valor" },
    { header: "Ações", accessor: "acoes" },
  ];

  // Usando os procedimentos da API em vez dos passados por props
  const data = procedimentosDaAPI
    .filter(p => p.id)
    .map(p => ({
      ...p,
      acoes: (
        <div className="flex gap-1">
          <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-blue-600 rounded text-xs">
            Editar
          </button>
          <button onClick={() => handleRemove(p.id!)} className="px-3 py-1 bg-red-600 rounded text-xs">
            Remover
          </button>
        </div>
      ),
    }));

  return (
    <section className="bg-[#1B1B1B] p-3 rounded-xl shadow flex flex-col gap-4">
      <h2 className="text-base font-semibold text-[#FFA500]">Procedimentos</h2>

      {/* Formulário de Procedimento */}
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
          value={novoProcedimento.valor || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setNovoProcedimento({
              ...novoProcedimento,
              valor: value === "" ? 0 : parseFloat(value),
            });
          }}
        />
      </div>

      {/* Botão de adicionar ou salvar */}
      <Button onClick={handleAddOrSave} variant="primary" disabled={loading}>
        {loading ? "Carregando..." : editando ? "Salvar Alterações" : "Adicionar Procedimento"}
      </Button>
     
      {/* Tabela de Procedimentos */}
      <Table columns={columns} data={data} />
    </section>
  );
};

export { ProcedimentosProfissionais };