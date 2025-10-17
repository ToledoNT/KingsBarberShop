"use client";

import Footer from "./components/ui/Footer";
import Image from "next/image";
import AgendamentoPrivadoForm from "./components/agendamento/AgendamentoPrivadoForm";
import { useAgendamentosAdmin } from "./hook/useAgendamentoAdmin";

export default function Home() {
  const { barbeiros, horarios, procedimentosBarbeiro } = useAgendamentosAdmin();

  const handleSave = async (data: any) => {
    console.log("Salvando agendamento:", data);
    // Chamada de API ou lógica de salvar
  };

  const handleCancel = () => {
    console.log("Cancelado");
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#0D0D0D] text-[#E5E5E5]">

      <main className="flex flex-col items-center w-full flex-1 px-6 sm:px-12 gap-8 sm:gap-12">

        <section className="w-full max-w-3xl flex flex-col items-center gap-3 text-center">
          <Image src="/logo1.png" alt="Logo da Barbearia" width={200} height={42} />
          <h1 className="text-3xl sm:text-4xl font-bold">Bem-vindo!</h1>
          <p className="text-[#A3A3A3] text-base sm:text-lg max-w-xl">
            Agende seu horário online de forma rápida e prática.
          </p>
        </section>

        <section className="w-full max-w-md">
          {/* Passa os dados do hook como props necessárias */}
          <AgendamentoPrivadoForm
            agendamento={null} // novo agendamento
            onSave={handleSave}
            onCancel={handleCancel}
            barbeiros={barbeiros}          // agora satisfaz o tipo
            horarios={horarios}
            // procedimentosBarbeiro={procedimentosBarbeiro}
          />
        </section>

      </main>

      <footer className="w-full px-6 sm:px-12 py-4 mt-auto">
        <Footer />
      </footer>
    </div>
  );
}