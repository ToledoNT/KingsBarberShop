"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/ui/Sidebar";
import Button from "../components/ui/Button";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { AgendamentoHorario } from "../components/agendamento/AgendamentoHorario";
import { useAgendamentosAdmin } from "../hook/useAgendamentoAdmin";
import { Agendamento, StatusAgendamento, HorarioDisponivel } from "../interfaces/agendamentoInterface";
import AgendamentoPrivadoForm from "../components/agendamento/AgendamentoPrivadoForm";

export default function CriarAgendamentoPage() {
  const {
    agendamentos,
    addAgendamento,
    updateAgendamento,
    removeAgendamento,
    horarios,
    addHorario,
    removeHorario,
    toggleHorarioDisponivel, // ✅ agora usamos direto
    fetchBarbeiros,
    barbeiros,
    procedimentosBarbeiro,
    form,
    setForm,
  } = useAgendamentosAdmin();

  const [collapsed, setCollapsed] = useState(false);
  const [activeAgendamentoTab, setActiveAgendamentoTab] = useState<"exibir" | "criar">("exibir");
  const [activeHorarioTab, setActiveHorarioTab] = useState<"exibir" | "criar">("exibir");
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);

  // ---------------------------
  // Funções utilitárias
  // ---------------------------
  const aplicarMascaraData = (v: string) => {
    v = v.replace(/\D/g, "");
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);
    return v.slice(0, 10);
  };

  const converteDataParaISO = (data: string) => {
    const [dia, mes, ano] = data.split("/");
    if (!dia || !mes || !ano) return data;
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  const formatarDataParaDisplay = (dataISO: string) => {
    if (!dataISO) return "";
    const d = new Date(dataISO);
    if (isNaN(d.getTime())) return dataISO;
    const dia = String(d.getUTCDate()).padStart(2, "0");
    const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
    const ano = d.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatarHora = (hora?: string) => hora?.slice(0, 5) || "";

  const getStatusColor = (status: string) => {
    switch (status) {
      case StatusAgendamento.CONCLUIDO: return "bg-green-600 text-white";
      case StatusAgendamento.PENDENTE: return "bg-yellow-600 text-white";
      case StatusAgendamento.CANCELADO: return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  // ---------------------------
  // Horários
  // ---------------------------
  const handleGenerateHorarios = async () => {
    if (!form.barbeiro || !form.data) return alert("Preencha barbeiro e data.");

    const regexData = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regexData.test(form.data)) return alert("Data inválida.");

    const barbeiroSelecionado = barbeiros.find(b => b.id === form.barbeiro);
    if (!barbeiroSelecionado) return alert("Barbeiro não encontrado.");

    try {
      await addHorario({
        profissional: { id: barbeiroSelecionado.id, nome: barbeiroSelecionado.nome },
        data: converteDataParaISO(form.data),
      } as any);

      setActiveHorarioTab("exibir");
    } catch (err) {
      console.error("Erro ao gerar horários:", err);
      alert("Erro ao gerar horários. Veja o console.");
    }
  };

  const handleRemoveHorario = async (id?: string) => {
    if (id) await removeHorario(id);
  };

  // ---------------------------
  // Agendamentos
  // ---------------------------
  const handleSaveAgendamento = async (a: Agendamento) => {
    const payload: Agendamento = { ...a, inicio: a.inicio || a.hora, fim: a.fim || a.hora };
    if (payload.id) await updateAgendamento(payload.id, payload);
    else await addAgendamento(payload);
    setSelectedAgendamento(null);
    setActiveAgendamentoTab("exibir");
  };

  const handleEditAgendamento = (a: Agendamento) => {
    setSelectedAgendamento(a);
    setActiveAgendamentoTab("criar");
  };

  const handleDeleteAgendamento = async (id?: string) => {
    if (id) await removeAgendamento(id);
  };

  const handleConcluirAgendamento = async (a: Agendamento) => {
    if (a.id) await updateAgendamento(a.id, { ...a, status: StatusAgendamento.CONCLUIDO });
  };

  useEffect(() => {
    fetchBarbeiros();
  }, []);

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`flex-1 h-screen overflow-y-auto p-4 md:p-6 transition-all ${collapsed ? "md:ml-12" : "md:ml-24"}`}>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6">Painel Admin</h1>

        <div className="flex flex-col gap-8">

          {/* Horários */}
          <section className="bg-[#1F1F1F] rounded-3xl shadow-lg p-6 flex flex-col gap-5">
            <div className="flex gap-3 flex-wrap">
              <Button variant={activeHorarioTab === "exibir" ? "primary" : "secondary"} onClick={() => setActiveHorarioTab("exibir")}>Exibir</Button>
              <Button variant={activeHorarioTab === "criar" ? "primary" : "secondary"} onClick={() => setActiveHorarioTab("criar")}>Criar</Button>
            </div>

            {activeHorarioTab === "criar" && (
              <div className="flex gap-3 mt-3 flex-wrap items-center">
                <select
                  value={form.barbeiro || ""}
                  onChange={e => setForm(prev => ({ ...prev, barbeiro: e.target.value }))}
                  className="p-2 rounded-lg bg-[#2F2F2F] border border-gray-600 hover:border-orange-400 transition"
                >
                  <option value="">Selecione</option>
                  {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={form.data || ""}
                  onChange={e => setForm(prev => ({ ...prev, data: aplicarMascaraData(e.target.value) }))}
                  className="p-2 rounded-lg bg-[#2F2F2F] border border-gray-600 hover:border-orange-400 transition"
                />
                <Button onClick={handleGenerateHorarios} variant="primary">Gerar</Button>
              </div>
            )}

            {activeHorarioTab === "exibir" && (
              <AgendamentoHorario
                horarios={horarios}
                onToggleDisponivel={toggleHorarioDisponivel} // ✅ chama a rota de update direto
                onRemoveHorario={handleRemoveHorario}
              />
            )}
          </section>

          {/* Agendamentos */}
          <section className="bg-[#1F1F1F] rounded-3xl shadow-lg p-6 flex flex-col gap-5">
            <div className="flex gap-3 flex-wrap">
              <Button variant={activeAgendamentoTab === "exibir" ? "primary" : "secondary"} onClick={() => { setActiveAgendamentoTab("exibir"); setSelectedAgendamento(null); }}>Exibir</Button>
              <Button variant={activeAgendamentoTab === "criar" ? "primary" : "secondary"} onClick={() => { setActiveAgendamentoTab("criar"); setSelectedAgendamento(null); }}>Criar</Button>
            </div>

            {activeAgendamentoTab === "criar" && (
              <AgendamentoPrivadoForm
                agendamento={selectedAgendamento || undefined}
                onSave={handleSaveAgendamento}
                onCancel={() => { setActiveAgendamentoTab("exibir"); setSelectedAgendamento(null); }}
                horarios={horarios.filter(h => h.disponivel && h.profissional.id === form.barbeiro)}
                barbeiros={barbeiros}
                procedimentos={procedimentosBarbeiro}
              />
            )}

            {activeAgendamentoTab === "exibir" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                {agendamentos.length === 0 ? (
                  <p className="text-gray-400">Nenhum agendamento disponível.</p>
                ) : agendamentos.map(a => (
                  <div key={a.id} className="bg-[#2A2A2A] rounded-2xl shadow-md p-5 flex flex-col gap-2 hover:shadow-xl transition">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">{a.nome}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(a.status || StatusAgendamento.PENDENTE)}`}>
                        {a.status || StatusAgendamento.PENDENTE}
                      </div>
                    </div>
                    <p className="text-sm">{formatarDataParaDisplay(a.data)}</p>
                    <p className="text-sm">{formatarHora(a.hora)}</p>
                    <p className="text-sm text-gray-300">{a.servico}</p>
                    <div className="flex gap-2 mt-3">
                      <Button onClick={() => handleEditAgendamento(a)} variant="primary" className="text-xs flex items-center gap-1"><FaEdit /> Editar</Button>
                      {a.status !== StatusAgendamento.CONCLUIDO && <Button onClick={() => handleConcluirAgendamento(a)} variant="primary" className="text-xs flex items-center gap-1"><FaCheck /> Concluir</Button>}
                      <Button onClick={() => handleDeleteAgendamento(a.id)} variant="secondary" className="text-xs flex items-center gap-1"><FaTrash /> Excluir</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
