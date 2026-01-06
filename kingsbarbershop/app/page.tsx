"use client";

import React, { useState, ReactNode } from "react";
import Footer from "./components/ui/Footer";
import Image from "next/image";
import AgendamentoPrivadoForm from "./components/agendamento/AgendamentoPrivadoForm";
import { useAgendamentosAdmin } from "./hook/useAgendamentoAdmin";
import { Agendamento } from "./interfaces/agendamentoInterface";
import { Notification } from "./components/ui/componenteNotificacao";
import { ConfirmDialog } from "./components/ui/componenteConfirmação";

const formatarDataBrasileira = (dataString: string) => {
  const data = new Date(dataString);
  const dataAjustada = new Date(data.getTime() + (3 * 60 * 60 * 1000)); 

  return dataAjustada.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function Home() {
  const { barbeiros, horarios, procedimentosBarbeiro, addAgendamento } = useAgendamentosAdmin();
  
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: "info" | "success" | "warning" | "error";
  }>({ isOpen: false, message: "", type: "info" });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: ReactNode;
    type: "info" | "warning" | "error";
    onConfirm: (() => void) | null;
  }>({ isOpen: false, title: "", message: "", type: "info", onConfirm: null });

  const [formKey, setFormKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const whatsappNumber = "+555499229241";
  const whatsappMessage = "Olá! Gostaria de mais informações sobre os serviços da barbearia.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const notify = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    setNotification({ isOpen: true, message: msg, type });
  };

  const confirm = (title: string, message: ReactNode, onConfirm: () => void, type: "info" | "warning" | "error" = "info") => {
    setConfirmDialog({ isOpen: true, title, message, type, onConfirm });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const handleConfirm = () => {
    confirmDialog.onConfirm?.();
    closeConfirmDialog();
  };

  // Função para mostrar o formulário
  const handleShowForm = () => {
    setShowForm(true);
  };

  // Função para esconder o formulário
  const handleHideForm = () => {
    setShowForm(false);
    notify("ℹ️ Agendamento cancelado. Clique em 'Agendar Agora' quando quiser marcar seu horário.", "info");
  };

  // Função de confirmação de agendamento
  const confirmarAgendamento = (agendamento: Agendamento): Promise<boolean> => {
    return new Promise((resolve) => {

      const barbeiroSelecionado = barbeiros.find(b => b.id === agendamento.barbeiro);
      const barbeiroNome = barbeiroSelecionado?.nome || "Barbeiro não encontrado";

      // Recuperando o serviço do localStorage (parseando o objeto JSON)
      let procedimentoNome = "Serviço não selecionado";
      const savedServico = localStorage.getItem('selectedServico');
      if (savedServico) {
        const parsedServico = JSON.parse(savedServico);
        procedimentoNome = parsedServico.label || "Serviço não encontrado";
      }

      // Recuperando dados do horário
      const horarioSelecionado = horarios.find(h => h.id === agendamento.hora);
      const horarioLabel = horarioSelecionado?.label || `${horarioSelecionado?.inicio} - ${horarioSelecionado?.fim}` || "Horário não encontrado";

      // Formatando a data
      const dataFormatada = formatarDataBrasileira(agendamento.data);

      // Confirmação com os detalhes do agendamento
      const mensagemConfirmacao = (
        <div className="space-y-4">
          {/* Cabeçalho */}
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFA500] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-base">📋</span>
            </div>
            <h3 className="text-white font-bold text-base mb-1">Confirmar Agendamento</h3>
            <p className="text-gray-300 text-xs">Revise os detalhes abaixo</p>
          </div>

          {/* Detalhes do agendamento */}
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] border border-[#FFA500]/20 rounded-lg p-3 max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFA500] scrollbar-track-gray-700">
            <div className="space-y-2">
              {/* Barbeiro */}
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-md">
                <div className="w-7 h-7 bg-[#FFA500]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFA500] text-xs">💈</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Barbeiro</p>
                  <p className="font-semibold text-white text-sm truncate">{barbeiroNome}</p>
                </div>
              </div>

              {/* Data e Horário */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-md">
                  <div className="w-6 h-6 bg-[#FFA500]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FFA500] text-xs">📅</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium">Data</p>
                    <p className="font-semibold text-white text-xs">{dataFormatada}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-md">
                  <div className="w-6 h-6 bg-[#FFA500]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FFA500] text-xs">⏰</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium">Horário</p>
                    <p className="font-semibold text-white text-xs truncate">{horarioLabel}</p>
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-md">
                <div className="w-7 h-7 bg-[#FFA500]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFA500] text-xs">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Cliente</p>
                  <p className="font-semibold text-white text-sm truncate">{agendamento.nome}</p>
                </div>
              </div>

              {/* Serviço */}
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-md">
                <div className="w-7 h-7 bg-[#FFA500]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFA500] text-xs">✂️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Serviço</p>
                  <p className="font-semibold text-white text-sm truncate">{procedimentoNome}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mensagem de confirmação */}
          <div className="text-center pt-2">
            <p className="text-[#FFA500] font-semibold text-sm">Confirmar este agendamento?</p>
          </div>
        </div>
      );

      confirm("", mensagemConfirmacao, () => resolve(true), "info");
    });
  };

  const handleSaveAgendamento = async (agendamento: Agendamento) => {
    try {
      
      const confirmado = await confirmarAgendamento(agendamento);
      
      if (!confirmado) {
        notify("❌ Agendamento cancelado", "warning");
        return;
      }

      const payload: Agendamento = { 
        ...agendamento, 
        inicio: agendamento.inicio || agendamento.hora, 
        fim: agendamento.fim || agendamento.hora,
        status: agendamento.status || "Agendado" as any
      };

      await addAgendamento(payload);
      notify("✅ Agendamento realizado com sucesso! Te esperamos na barbearia! 🎉", "success");
      setFormKey(prev => prev + 1);
      setShowForm(false); 

    } catch (err) {
      console.error("Erro ao salvar agendamento:", err);
      notify("❌ Ops! Algo deu errado. Tente novamente.", "error");
    }
  };

  const handleCancel = () => {
    handleHideForm(); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#151515] to-[#1A1A1A] text-white flex flex-col">
      {/* Notificações */}
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={handleConfirm}
        onCancel={closeConfirmDialog}
      />

      {/* Botão do WhatsApp Flutuante */}
      {!confirmDialog.isOpen && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-40 w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce"
          title="Fale conosco no WhatsApp"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.248-6.189-3.515-8.452"/>
          </svg>
        </a>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 container mx-auto px-3 sm:px-6 lg:px-8 py-4">
        {/* Header compacto */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Image 
              src="/kingsbarber2.png" 
              alt="Logo da Barbearia" 
              width={120}
              height={25}
              className="mb-2 drop-shadow-lg"
              priority
            />
          </div>
          
          <div className="mb-3">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] via-[#FF8C00] to-[#FF6B00] mb-2 tracking-tight">
              BEM-VINDO
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-px w-6 lg:w-10 bg-gradient-to-r from-transparent to-[#FFA500]"></div>
              <span className="text-[#FFA500] text-sm lg:text-base font-semibold">À NOSSA BARBEARIA</span>
              <div className="h-px w-6 lg:w-10 bg-gradient-to-l from-transparent to-[#FFA500]"></div>
            </div>
          </div>

          <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light">
            Onde cada corte conta uma história
            <span className="block text-[#FFA500] font-medium mt-1 lg:mt-2 text-xs md:text-sm">
              Estilo • Confiança • Tradição
            </span>
          </p>

          <div className="flex justify-center gap-4 lg:gap-8 mt-4 lg:mt-6 text-[#FFA500]">
            <div className="flex flex-col items-center">
              <span className="text-lg lg:text-xl mb-1">✂️</span>
              <span className="text-[9px] lg:text-[10px] font-medium">CORTE PRECISO</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg lg:text-xl mb-1">💈</span>
              <span className="text-[9px] lg:text-[10px] font-medium">ESTILO ÚNICO</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg lg:text-xl mb-1">⭐</span>
              <span className="text-[9px] lg:text-[10px] font-medium">QUALIDADE</span>
            </div>
          </div>

          {/* Botão para mostrar formulário */}
          {!showForm && (
            <div className="mt-6 lg:mt-8">
              <button
                onClick={handleShowForm}
                className="group relative bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FF6B00] text-white font-bold py-4 px-10 rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-3xl text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center justify-center gap-3">
                  <span className="text-xl transition-transform duration-300 group-hover:scale-110">📅</span>
                  <span className="transition-all duration-300 group-hover:tracking-wider">Agendar Agora</span>
                </div>
                
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFA500] to-[#FF8C00] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                <div className="absolute inset-[2px] rounded-xl bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] -z-10"></div>
              </button>
              
              <p className="text-gray-400 text-xs mt-3 animate-pulse">
                Clique para fazer seu agendamento
              </p>
            </div>
          )}
        </div>

        {/* Formulário - Só aparece quando showForm é true */}
        {showForm && (
          <section className="w-full max-w-md lg:max-w-lg mx-auto">
            <div className="mb-4 flex justify-between items-center">
              
            </div>
            <AgendamentoPrivadoForm
              key={formKey}
              agendamento={null}
              onSave={handleSaveAgendamento}
              onCancel={handleCancel}
              barbeiros={barbeiros}
              horarios={horarios}
              procedimentos={procedimentosBarbeiro}
            />
          </section>
        )}

        {/* Diferenciais compactos */}
        {!showForm && (
          <section className="w-full max-w-4xl lg:max-w-6xl mx-auto mt-10 lg:mt-12">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-3">
                Nossa Experiência
              </h2>
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-[#FFA500] to-[#FF6B00] mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-gray-700 rounded-lg p-3 lg:p-4 text-center hover:border-[#FFA500] transition-all duration-300 hover:transform hover:scale-105 group">
                <div className="text-xl lg:text-2xl mb-2 text-[#FFA500] group-hover:scale-110 transition-transform duration-300">⏰</div>
                <h3 className="font-bold text-white mb-1 text-sm lg:text-base">Agendamento Simples</h3>
                <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                  Agende em menos de 2 minutos.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-gray-700 rounded-lg p-3 lg:p-4 text-center hover:border-[#FFA500] transition-all duration-300 hover:transform hover:scale-105 group">
                <div className="text-xl lg:text-2xl mb-2 text-[#FFA500] group-hover:scale-110 transition-transform duration-300">👨‍💼</div>
                <h3 className="font-bold text-white mb-1 text-sm lg:text-base">Mestres da Tesoura</h3>
                <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                  Profissionais especializados.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2A2A2A] border border-gray-700 rounded-lg p-3 lg:p-4 text-center hover:border-[#FFA500] transition-all duration-300 hover:transform hover:scale-105 group">
                <div className="text-xl lg:text-2xl mb-2 text-[#FFA500] group-hover:scale-110 transition-transform duration-300">💫</div>
                <h3 className="font-bold text-white mb-1 text-sm lg:text-base">Ambiente Exclusivo</h3>
                <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                  Ambiente climatizado e aconchegante.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer compacto */}
      <footer className="bg-[#0D0D0D] mt-auto">
        <div className="container mx-auto px-3 py-3">
          <Footer />
        </div>
      </footer>
    </div>
  );
}