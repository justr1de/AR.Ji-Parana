"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    label: "Institucional",
    href: "/institucional",
    submenu: [
      { label: "Sobre a AGERJI", href: "/institucional" },
      { label: "Missão e Valores", href: "/institucional#missao" },
      { label: "Estrutura Organizacional", href: "/institucional#estrutura" },
    ],
  },
  {
    label: "Órgãos Colegiados",
    href: "/orgaos-colegiados",
    submenu: [
      { label: "Conselho Diretor", href: "/orgaos-colegiados/conselho-diretor" },
      { label: "Câmaras Técnicas", href: "/orgaos-colegiados/camaras-tecnicas" },
    ],
  },
  { label: "Diretorias", href: "/diretorias" },
  {
    label: "Serviços Regulados",
    href: "/servicos-regulados",
    submenu: [
      { label: "Saneamento Básico", href: "/servicos-regulados/saneamento" },
      { label: "Transporte Público", href: "/servicos-regulados/transporte" },
      { label: "Resíduos Sólidos", href: "/servicos-regulados/residuos" },
    ],
  },
  {
    label: "Leis e Atos",
    href: "/leis-atos",
    submenu: [
      { label: "Legislação", href: "/leis-atos/legislacao" },
      { label: "Resoluções", href: "/leis-atos/resolucoes" },
      { label: "Portarias", href: "/leis-atos/portarias" },
    ],
  },
  {
    label: "Participação Social",
    href: "/participacao-social",
    submenu: [
      { label: "Audiências Públicas", href: "/participacao-social/audiencias" },
      { label: "Consultas Públicas", href: "/participacao-social/consultas" },
    ],
  },
  {
    label: "Atendimento",
    href: "/atendimento",
    submenu: [
      { label: "Fale Conosco", href: "/atendimento" },
      { label: "Ouvidoria", href: "/atendimento#ouvidoria" },
    ],
  },
  { label: "Transparência", href: "/transparencia" },
];

interface HeaderProps {
  onToggleContrast?: () => void;
  highContrast?: boolean;
}

// Componente SVG para linhas tecnológicas
function TechLines({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const transforms = {
    "top-left": "",
    "top-right": "scale(-1, 1)",
    "bottom-left": "scale(1, -1)",
    "bottom-right": "scale(-1, -1)",
  };

  return (
    <svg
      className={`absolute w-24 h-24 opacity-[0.15] ${
        position === "top-left" ? "top-0 left-0" :
        position === "top-right" ? "top-0 right-0" :
        position === "bottom-left" ? "bottom-0 left-0" :
        "bottom-0 right-0"
      }`}
      viewBox="0 0 100 100"
      fill="none"
      style={{ transform: transforms[position] }}
    >
      {/* Linhas horizontais */}
      <line x1="0" y1="10" x2="60" y2="10" stroke="#1a5c38" strokeWidth="0.5" />
      <line x1="0" y1="20" x2="40" y2="20" stroke="#1a5c38" strokeWidth="0.5" />
      <line x1="0" y1="30" x2="25" y2="30" stroke="#1a5c38" strokeWidth="0.5" />
      
      {/* Linhas verticais */}
      <line x1="10" y1="0" x2="10" y2="60" stroke="#1a5c38" strokeWidth="0.5" />
      <line x1="20" y1="0" x2="20" y2="40" stroke="#1a5c38" strokeWidth="0.5" />
      <line x1="30" y1="0" x2="30" y2="25" stroke="#1a5c38" strokeWidth="0.5" />
      
      {/* Pontos de conexão */}
      <circle cx="10" cy="10" r="2" fill="#1a5c38" />
      <circle cx="20" cy="20" r="1.5" fill="#1a5c38" />
      <circle cx="30" cy="10" r="1" fill="#1a5c38" />
      <circle cx="10" cy="30" r="1" fill="#1a5c38" />
      
      {/* Linha diagonal */}
      <line x1="5" y1="5" x2="45" y2="45" stroke="#1a5c38" strokeWidth="0.3" strokeDasharray="2 4" />
    </svg>
  );
}

export function Header({ onToggleContrast, highContrast }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior verde */}
      <div className="bg-primary text-white text-sm">
        <div className="container flex items-center justify-between py-2">
          <nav className="hidden md:flex items-center gap-4" aria-label="Links de acessibilidade">
            <a href="#main-content" className="hover:underline focus:underline">
              Ir para o conteúdo [1]
            </a>
            <a href="#navigation" className="hover:underline focus:underline">
              Ir para a navegação [2]
            </a>
            <a href="#search" className="hover:underline focus:underline">
              Ir para a busca [3]
            </a>
          </nav>
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={onToggleContrast}
              className="flex items-center gap-1 hover:underline focus:underline"
              aria-pressed={highContrast}
            >
              <Eye className="h-4 w-4" />
              <span>Contraste</span>
            </button>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline font-medium">PREFEITURA DE JI-PARANÁ</span>
          </div>
        </div>
      </div>

      {/* Header principal branco com linhas tecnológicas */}
      <div className="relative bg-white border-b border-gray-100 shadow-sm overflow-hidden">
        {/* Linhas tecnológicas nos cantos */}
        <TechLines position="top-left" />
        <TechLines position="top-right" />
        <TechLines position="bottom-left" />
        <TechLines position="bottom-right" />

        <div className="container relative z-10">
          <div className="flex items-center justify-between py-4">
            {/* Logo AGERJI */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-agerji.png"
                alt="AGERJI - Agência Reguladora de Ji-Paraná"
                width={240}
                height={100}
                className="h-16 md:h-24 w-auto"
                priority
              />
            </Link>

            {/* Desktop navigation */}
            <nav id="navigation" className="hidden lg:flex items-center gap-1" aria-label="Menu principal">
              {menuItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.submenu ? (
                    <>
                      <button
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                        onMouseEnter={() => setOpenSubmenu(item.label)}
                        onMouseLeave={() => setOpenSubmenu(null)}
                      >
                        {item.label}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div
                        className={`absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-lg py-2 min-w-[200px] transition-all ${
                          openSubmenu === item.label ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                        onMouseEnter={() => setOpenSubmenu(item.label)}
                        onMouseLeave={() => setOpenSubmenu(null)}
                      >
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-primary transition-colors"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Logo ABAR */}
            <a
              href="https://abar.org.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
              title="ABAR - Associação Brasileira de Agências Reguladoras"
            >
              <Image
                src="/images/logo-abar.png"
                alt="ABAR - Associação Brasileira de Agências Reguladoras"
                width={100}
                height={60}
                className="h-10 w-auto"
              />
            </a>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-200 shadow-lg" aria-label="Menu mobile">
          <div className="container py-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <details className="group">
                    <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer list-none">
                      {item.label}
                      <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="pl-4 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* ABAR link in mobile */}
            <div className="pt-4 border-t border-gray-200">
              <a
                href="https://abar.org.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2"
              >
                <Image
                  src="/images/logo-abar.png"
                  alt="ABAR"
                  width={80}
                  height={48}
                  className="h-8 w-auto"
                />
                <span className="text-sm text-gray-600">Membro da ABAR</span>
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
