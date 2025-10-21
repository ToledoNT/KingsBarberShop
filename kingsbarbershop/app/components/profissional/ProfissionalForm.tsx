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
    if (!profissional) {
      setNome(""); 
      setEmail(""); 
      setTelefone("");
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setTelefone(formattedPhone);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Campos do formulário */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Nome Completo
          </label>
          <Input
            name="nome"
            placeholder="Digite o nome completo"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <Input
            name="email"
            placeholder="Digite o email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Telefone
          </label>
          <Input
            name="telefone"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={handleTelefoneChange}
            className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-700">
        <Button 
          onClick={handleSubmit} 
          variant="primary"
          className="px-6 py-3 text-sm sm:text-base font-medium flex-1 sm:flex-none justify-center"
          disabled={!nome || !email || !telefone}
        >
          <span className="mr-2">{profissional ? "💾" : "➕"}</span>
          {profissional ? "Salvar Alterações" : "Adicionar Profissional"}
        </Button>

        {onCancel && (
          <Button 
            onClick={onCancel} 
            variant="secondary"
            className="px-6 py-3 text-sm sm:text-base font-medium flex-1 sm:flex-none justify-center"
          >
            <span className="mr-2">↩️</span>
            Cancelar
          </Button>
        )}
      </div>

      {/* Mensagem de validação */}
      {(!nome || !email || !telefone) && (
        <div className="text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg border border-gray-700">
          ⚠️ Preencha todos os campos para salvar
        </div>
      )}
    </div>
  );
};

export { ProfissionalForm };