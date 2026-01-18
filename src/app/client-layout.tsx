"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { AssistenteVirtualFixo } from "@/components/AssistenteVirtualFixo";
import { SidebarImages } from "@/components/SidebarImages";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [highContrast, setHighContrast] = useState(false);

  const toggleContrast = () => {
    setHighContrast(!highContrast);
  };

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? "high-contrast" : ""}`}>
      <a href="#main-content" className="skip-link">
        Ir para o conteúdo principal
      </a>
      <SidebarImages />
      <Header onToggleContrast={toggleContrast} highContrast={highContrast} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      <AssistenteVirtualFixo />
    </div>
  );
}
