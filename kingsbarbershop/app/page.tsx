import Footer from "./components/Footer";
import Header from "./components/Header";
import AgendamentoForm from "./components/AgendamentoForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#0D0D0D] text-[#E5E5E5]">

      {/* Header / Logo */}
      <header className="w-full px-6 sm:px-12 py-3 flex justify-center">
        <Header />
      </header>

      {/* Área principal */}
      <main className="flex flex-col items-center w-full flex-1 px-6 sm:px-12 gap-8 sm:gap-12">

        {/* Logo + Título */}
        <section className="w-full max-w-3xl flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo1.png"
            alt="Logo da Barbearia"
            width={200}
            height={42}
          />
          <h1 className="text-3xl sm:text-4xl font-bold">
            Bem-vindo!
          </h1>
          <p className="text-[#A3A3A3] text-base sm:text-lg max-w-xl">
            Agende seu horário online de forma rápida e prática.
          </p>
        </section>

        {/* Formulário */}
        <section className="w-full max-w-md">
          <AgendamentoForm />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full px-6 sm:px-12 py-4 mt-auto">
        <Footer />
      </footer>
    </div>
  );
}
