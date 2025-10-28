import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Button from "../ui/Button";
import {
  Agendamento,
  AgendamentoForm,
  StatusAgendamento,
  Procedimento,
  AgendamentoPrivadoFormProps,
} from "../../interfaces/agendamentoInterface";
import { useAgendamentosAdmin } from "../../hook/useAgendamentoAdmin";

registerLocale("pt-BR", ptBR);

const AgendamentoPrivadoForm: React.FC<AgendamentoPrivadoFormProps> = ({
  agendamento,
  onSave,
  onCancel,
}) => {
  const {
    barbeiros,
    form,
    setForm,
    fetchBarbeiroDados,
    horarios,
    procedimentosBarbeiro,
  } = useAgendamentosAdmin();

  const [localForm, setLocalForm] = useState<AgendamentoForm>({
    nome: "",
    telefone: "",
    email: "",
    barbeiro: "",
    data: null,
    hora: "",
    servico: localStorage.getItem("selectedServicoId") || "", // Recupera o ID do serviço armazenado
    status: StatusAgendamento.PENDENTE,
  });

  const [procedimentoNome, setProcedimentoNome] = useState<string>("");

  useEffect(() => {
    const loadAgendamento = async () => {
      if (!agendamento) return;

      setForm({
        barbeiro: agendamento.barbeiro ?? "",
        data: agendamento.data ? new Date(agendamento.data) : null,
      });

      if (agendamento.barbeiro) {
        await fetchBarbeiroDados(agendamento.barbeiro);
      }

      setLocalForm({
        nome: agendamento.nome,
        telefone: agendamento.telefone,
        email: agendamento.email,
        barbeiro: agendamento.barbeiro,
        data: agendamento.data ? new Date(agendamento.data) : null,
        hora: agendamento.hora,
        servico: agendamento.servico,
        status: agendamento.status ?? StatusAgendamento.PENDENTE,
      });
    };

    loadAgendamento();
  }, [agendamento, fetchBarbeiroDados, setForm]);

  const handleBarbeiroChange = async (barbeiroId: string) => {
    setLocalForm((prev) => ({ ...prev, barbeiro: barbeiroId, hora: "", servico: "" }));
    setForm((prev) => ({ ...prev, barbeiro: barbeiroId }));
    if (barbeiroId) await fetchBarbeiroDados(barbeiroId);
  };

  const handleDataChange = (data: Date | null) => {
    setLocalForm((prev) => ({ ...prev, data, hora: "", servico: "" }));
    setForm((prev) => ({ ...prev, data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const erros: string[] = [];
    if (!localForm.nome.trim()) erros.push("Nome");
    if (!localForm.telefone.trim()) erros.push("Telefone");
    if (!localForm.email.trim()) erros.push("Email");
    if (!localForm.barbeiro) erros.push("Barbeiro");
    if (!localForm.data) erros.push("Data");
    if (!localForm.hora) erros.push("Horário");
    if (!localForm.servico) erros.push("Serviço");

    if (erros.length > 0) {
      alert(`Preencha todos os campos obrigatórios: ${erros.join(", ")}`);
      return;
    }

    const dataString = localForm.data!.toISOString().split("T")[0];
    const horarioSelecionado = horarios.find((h) => h.id === localForm.hora);

    const payload: Agendamento = {
      id: agendamento?.id,
      nome: localForm.nome.trim(),
      telefone: localForm.telefone.trim(),
      email: localForm.email.trim(),
      barbeiro: localForm.barbeiro,
      data: dataString,
      hora: localForm.hora,
      servico: localForm.servico,
      status: localForm.status,
      inicio: horarioSelecionado?.inicio ?? "",
      fim: horarioSelecionado?.fim ?? "",
    };

    await onSave(payload);
  };

const handleServicoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedId = e.target.value;

  const selectedServico = procedimentosBarbeiro.find((p) => p.id === selectedId);

  setLocalForm({ ...localForm, servico: selectedId });

  if (selectedServico) {
    setProcedimentoNome(`${selectedServico.label} - R$ ${selectedServico.valor}`);

    localStorage.setItem(
      "selectedServico",
      JSON.stringify({ label: selectedServico.label, valor: selectedServico.valor })
    );

  } else {
    setProcedimentoNome('');
    localStorage.removeItem("selectedServico");
  }
};


  return (
    <div className="w-full flex justify-center mt-6 mb-12 px-2 sm:px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 md:p-8 bg-[#1B1B1B] rounded-2xl shadow-xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6">
          {agendamento ? "Editar Agendamento" : "Agende seu Horário"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4" noValidate>
          <Input
            name="nome"
            value={localForm.nome}
            placeholder="Nome"
            onChange={(e) => setLocalForm({ ...localForm, nome: e.target.value })}
            required
          />

          <Input
            name="telefone"
            value={localForm.telefone}
            placeholder="Telefone"
            onChange={(e) =>
              setLocalForm({ ...localForm, telefone: e.target.value.replace(/\D/g, "") })
            }
            required
          />

          <Input
            name="email"
            value={localForm.email}
            placeholder="Email"
            onChange={(e) => setLocalForm({ ...localForm, email: e.target.value })}
            required
          />

          <Select
            name="barbeiro"
            value={localForm.barbeiro}
            onChange={(e) => handleBarbeiroChange(e.target.value)}
            options={barbeiros.map((b) => ({ value: b.id, label: b.nome }))}
            placeholder="Selecione o barbeiro"
            required
          />

          <div className="w-full">
            <DatePicker
              selected={localForm.data}
              onChange={handleDataChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione a data"
              className="w-full p-2 rounded-md bg-[#2B2B2B] text-white border-none"
              locale="pt-BR"
            />
          </div>

          <Select
            name="hora"
            value={localForm.hora || ""}
            onChange={(e) => setLocalForm({ ...localForm, hora: e.target.value })}
            options={(() => {
              if (!localForm.data) return [];
              const dataString = localForm.data.toISOString().split("T")[0];
              const horariosFiltrados = horarios.filter(
                (h) => h.disponivel && h.data === dataString
              );

              const mapHorarios = new Map<string, { value: string; label: string }>();
              horariosFiltrados.forEach((h) => {
                if (h.id)
                  mapHorarios.set(h.id, {
                    value: h.id,
                    label: h.label ?? `${h.inicio} - ${h.fim}`,
                  });
              });

              return Array.from(mapHorarios.values());
            })()}
            placeholder="Selecione o horário"
            required
          />

          <Select
            name="servico"
            value={localForm.servico}
            onChange={handleServicoChange}
            options={procedimentosBarbeiro
              .filter((p): p is Procedimento & { id: string } => !!p.id)
              .map((p) => ({ value: p.id, label: p.label! }))}
            placeholder="Selecione o serviço"
            required
          />

          {procedimentoNome && (
            <p className="mt-2 text-sm text-gray-400">Serviço Selecionado: {procedimentoNome}</p>
          )}

          {agendamento && (
            <Select
              name="status"
              value={localForm.status}
              onChange={(e) =>
                setLocalForm({ ...localForm, status: e.target.value as StatusAgendamento })
              }
              options={Object.values(StatusAgendamento).map((s) => ({
                value: s,
                label: s,
              }))}
            />
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
            <Button variant="secondary" type="button" onClick={onCancel} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendamentoPrivadoForm;