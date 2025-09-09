import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desafio Técnico – Vaga Front-End",
  description: "Desenvolver uma aplicação Next.js com funcionalidades de CRUD de produtos e um gráfico de métricas, seguindo a stack e boas práticas definidas pela equipe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
