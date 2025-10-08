export default function Footer() {
  return (
    <footer className="w-full bg-[#0D0D0D] text-[#A3A3A3] py-6 border-t border-gray-700 flex flex-col items-center px-6">
      {/* Endereço da barbearia */}
      <p className="text-sm sm:text-base text-center text-[#8A8A8A]">
        Avenida Alto Jacuí, 123 - Centro, Não-Me-Toque, Rio Grande do Sul
      </p>
      
      {/* Crédito de desenvolvimento */}
      <p className="text-sm sm:text-base text-center mt-3">
        © {new Date().getFullYear()} Software Toledo. Todos os direitos reservados.
      </p>
    </footer>
  );
}