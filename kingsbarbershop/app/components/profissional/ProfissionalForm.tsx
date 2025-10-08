"use client";
import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { ProfissionalFormProps } from "@/app/interfaces/profissionaisInterface";

const ProfissionalForm: React.FC<ProfissionalFormProps> = ({ profissional, onSave, onCancel }) => {
  const [nome, setNome] = useState(profissional?.nome || "");
  const [email, setEmail] = useState(profissional?.email || "");
  const [telefone, setTelefone] = useState(profissional?.telefone || "");

  const handleSubmit = () => {
    if (!nome) return;
    onSave({ id: profissional?.id, nome, email, telefone, procedimentos: profissional?.procedimentos || [] });
    setNome("");
    setEmail("");
    setTelefone("");
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

export default ProfissionalForm;