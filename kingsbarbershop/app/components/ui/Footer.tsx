export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="w-full bg-[#0D0D0D] py-4 md:py-6 border-t border-gray-800"
      role="contentinfo"
      aria-label="Rodapé"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-2 md:space-y-3">
          <address className="text-gray-300 text-xs md:text-sm leading-relaxed not-italic px-2">
            Av. Alto Jacuí, 572 • Sala 17 • Centro • Não-Me-Toque/RS
          </address>
          
          <div className="text-gray-500 text-xs">
            <div className="px-2 leading-5 flex flex-col sm:flex-row items-center justify-center gap-1 md:gap-2">
              {/* Primeira linha - Desenvolvido por Toledo Software */}
              <span className="flex items-center justify-center gap-1 flex-wrap">
                <span>Desenvolvido por</span>
                <span className="text-gray-400 font-medium whitespace-nowrap">Toledo Software</span>
              </span>
              
              {/* Separador */}
              <span className="hidden sm:inline text-gray-600">•</span>
              
              {/* Segunda linha - Copyright */}
              <span className="flex items-center justify-center gap-1 flex-wrap">
                <span className="text-gray-400">©</span>
                <span>{currentYear}</span>
                <span className="text-gray-600">-</span>
                <span>Todos os direitos reservados</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}