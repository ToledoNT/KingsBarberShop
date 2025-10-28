import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kings Barber - A Melhor Barbearia de Não-Me-Toque",
  description: "Kings Barber oferece cortes de cabelo e barba personalizados, com atendimento de qualidade. Localizada em Não-Me-Toque, RS.",
  keywords: ["barbearia", "corte de cabelo", "barba", "estilo", "Não-Me-Toque", "Kings Barber"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}