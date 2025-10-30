import "./globals.css";

export const metadata = {
  title: "Kings Barber - A Melhor Barbearia de Não-Me-Toque",
  description: "Kings Barber oferece cortes de cabelo e barba personalizados...",
  keywords: ["barbearia", "corte de cabelo", "barba", "estilo", "Não-Me-Toque", "Kings Barber"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}