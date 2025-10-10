"use client";

import React, { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { ProfissionalFormProps } from "@/app/interfaces/profissionaisInterface";
import { formatPhoneNumber } from "@/app/utils/validators";

const ProfissionalForm: React.FC<ProfissionalFormProps> = ({ profissional, onSave, onCancel }) => {
  const [nome, setNome] = useState(profissional?.nome || "");
  const [email, setEmail] = useState(profissional?.email || "");
  const [telefone, setTelefone] = useState(profissional?.telefone || "");

  useEffect(() => {
    if (profissional) {
      setNome(profissional.nome);
      setEmail(profissional.email);
      setTelefone(profissional.telefone);
    }
  }, [profissional]);

  const handleSubmit = () => {
    if (!nome || !email || !telefone) return;
    onSave({ id: profissional?.id, nome, email, telefone, procedimentos: profissional?.procedimentos || [] });
    setNome(""); setEmail(""); setTelefone(""); 
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setTelefone(formattedPhone);
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
        onChange={handleTelefoneChange} 
      />

      <Button onClick={handleSubmit} variant="primary">
        {profissional ? "Salvar Alterações" : "Adicionar Profissional"}
      </Button>

      {onCancel && <Button onClick={onCancel} variant="secondary">Cancelar</Button>}
    </div>
  );
};

export { ProfissionalForm };