export default function Footer() {
  return (
    <footer className="w-full bg-[#0D0D0D] py-3 border-t border-gray-800">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-400 text-xs tracking-tight">
          Av. Alto Jacuí, 572 • Sala 17 • Centro • Não-Me-Toque/RS
        </p>
        <p className="text-gray-500 text-xs tracking-tight mt-1">
          Desenvolvido por Toledo Software• © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}