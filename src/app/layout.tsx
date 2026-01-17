import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "AGERJI - Agência Reguladora de Ji-Paraná",
  description: "Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná, Rondônia. Regulação e fiscalização dos serviços de saneamento, transporte e resíduos sólidos.",
  keywords: ["AGERJI", "Ji-Paraná", "Rondônia", "agência reguladora", "saneamento", "transporte", "serviços públicos"],
  authors: [{ name: "DATA-RO Inteligência Territorial" }],
  openGraph: {
    title: "AGERJI - Agência Reguladora de Ji-Paraná",
    description: "Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
