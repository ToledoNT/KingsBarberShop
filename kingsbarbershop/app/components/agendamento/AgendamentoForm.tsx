"use client";

import { useAgendamentoForm } from "@/app/hook/useAgendamentoPublicHook";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { formatPhoneNumber, validateEmail } from "@/app/utils/validators";

export default function AgendamentoForm() {
  const { form, handleChange, handleSubmit, barbeiros, horariosDisponiveis, loading } = useAgendamentoForm();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    handleChange({
      target: { name: "telefone", value: formattedPhone },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="w-full flex justify-center mt-6 mb-12">
      <div className="w-full max-w-md p-6 sm:p-8 bg-[#1B1B1B] rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Agende seu horário
        </h2>

        <form
          noValidate
          onSubmit={handleSubmit(form => {
            if (!validateEmail(form.email)) {
              alert("Email inválido!");
              return;
            }
            alert(`Agendamento feito para ${form.nome} com ${form.barbeiro} em ${form.data} às ${form.hora}`);
          })}
          className="flex flex-col gap-3 sm:gap-4"
        >
          {/* Inputs de nome, telefone e email */}
          <Input
            name="nome"
            type="text"
            value={form.nome}
            placeholder="Nome"
            onChange={handleChange}
            required
          />
          <Input
            name="telefone"
            type="tel"
            value={form.telefone}
            placeholder="Telefone"
            onChange={handlePhoneChange} 
            required
          />
          <Input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />

          {/* Select do barbeiro */}
          <Select
            name="barbeiro"
            value={form.barbeiro}
            onChange={handleChange}
            options={barbeiros.map(b => ({ value: b.nome, label: b.nome }))}
            placeholder="Selecione o barbeiro"
            required
          />

          {/* Input de data */}
          <Input
            name="data"
            type="date"
            value={form.data}
            onChange={handleChange}
            required
            disabled={!form.barbeiro}
          />

          {/* Select de horários */}
          <Select
            name="hora"
            value={form.hora}
            onChange={handleChange}
            options={horariosDisponiveis.map(h => ({ value: h, label: h }))}
            placeholder={horariosDisponiveis.length === 0 ? "Nenhum horário disponível" : "Selecione o horário"}
            required
            disabled={!form.barbeiro || !form.data || horariosDisponiveis.length === 0}
          />

          {/* Select de serviços */}
          <Select
            name="servico"
            value={form.servico}
            onChange={handleChange}
            options={[
              { value: "corte", label: "Corte" },
              { value: "barba", label: "Barba" },
              { value: "combo", label: "Combo Corte + Barba" },
            ]}
            placeholder="Selecione o serviço"
            required
          />

          {/* Botão */}
          <Button type="submit" disabled={loading}>
            {loading ? "Agendando..." : "Confirmar Agendamento"}
          </Button>
        </form>
      </div>
    </div>
  );
}