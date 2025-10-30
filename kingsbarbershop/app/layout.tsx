import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/Geist.woff2",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMono.woff2",
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Kings Barber - A Melhor Barbearia de Não-Me-Toque",
  description: "Kings Barber oferece cortes de cabelo e barba personalizados...",
  keywords: ["barbearia", "corte de cabelo", "barba", "estilo", "Não-Me-Toque", "Kings Barber"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}