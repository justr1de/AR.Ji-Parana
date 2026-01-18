"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Eye, LogIn } from "lucide-react";
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

// Componente SVG para linhas tecnológicas - Versão ampliada e mais visível
function TechLines({ position }: { position: "left" | "right" }) {
  const isLeft = position === "left";
  
  return (
    <svg
      className={`absolute ${isLeft ? "left-0" : "right-0"} top-0 w-64 h-32 pointer-events-none`}
      viewBox="0 0 256 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: isLeft ? "none" : "scaleX(-1)" }}
    >
      {/* Linhas principais de conexão */}
      <path
        d="M0 20 L60 20 L80 40 L140 40"
        stroke="#1a5c38"
        strokeWidth="2"
        opacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M0 50 L40 50 L60 70 L120 70 L140 50"
        stroke="#1a5c38"
        strokeWidth="2"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M0 80 L30 80 L50 100 L100 100"
        stroke="#1a5c38"
        strokeWidth="1.5"
        opacity="0.35"
        strokeLinecap="round"
      />
      
      {/* Linhas diagonais */}
      <path
        d="M20 0 L60 40 L60 80"
        stroke="#1a5c38"
        strokeWidth="1.5"
        opacity="0.3"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <path
        d="M80 0 L100 20 L100 60"
        stroke="#1a5c38"
        strokeWidth="1.5"
        opacity="0.25"
        strokeLinecap="round"
      />
      
      {/* Pontos de conexão (nós) */}
      <circle cx="60" cy="20" r="4" fill="#1a5c38" opacity="0.6" />
      <circle cx="80" cy="40" r="3" fill="#1a5c38" opacity="0.5" />
      <circle cx="140" cy="40" r="3" fill="#1a5c38" opacity="0.4" />
      <circle cx="40" cy="50" r="3" fill="#1a5c38" opacity="0.5" />
      <circle cx="60" cy="70" r="4" fill="#1a5c38" opacity="0.6" />
      <circle cx="120" cy="70" r="3" fill="#1a5c38" opacity="0.4" />
      <circle cx="50" cy="100" r="3" fill="#1a5c38" opacity="0.5" />
      <circle cx="100" cy="100" r="3" fill="#1a5c38" opacity="0.4" />
      
      {/* Quadrados decorativos */}
      <rect x="130" y="35" width="6" height="6" fill="#1a5c38" opacity="0.3" transform="rotate(45 133 38)" />
      <rect x="90" y="95" width="5" height="5" fill="#1a5c38" opacity="0.25" transform="rotate(45 92 98)" />
      
      {/* Linhas horizontais finas */}
      <path
        d="M0 110 L80 110"
        stroke="#1a5c38"
        strokeWidth="1"
        opacity="0.2"
        strokeLinecap="round"
        strokeDasharray="2 6"
      />
      <path
        d="M0 35 L25 35"
        stroke="#1a5c38"
        strokeWidth="1"
        opacity="0.25"
        strokeLinecap="round"
      />
      
      {/* Círculos adicionais para efeito de rede */}
      <circle cx="25" cy="35" r="2" fill="#1a5c38" opacity="0.4" />
      <circle cx="0" cy="20" r="2" fill="#1a5c38" opacity="0.5" />
      <circle cx="0" cy="50" r="2" fill="#1a5c38" opacity="0.5" />
      <circle cx="0" cy="80" r="2" fill="#1a5c38" opacity="0.4" />
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
        <TechLines position="left" />
        <TechLines position="right" />

        <div className="container relative z-10">
          <div className="flex items-center justify-between py-4">
            {/* Logo AGERJI */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-agerji.png"
                alt="AGERJI - Agência Reguladora de Ji-Paraná"
                width={450}
                height={180}
                className="h-24 md:h-28 w-auto"
                priority
              />
            </Link>

            {/* Desktop navigation */}
            <nav id="navigation" className="hidden lg:flex items-center gap-1 ml-auto mr-4" aria-label="Menu principal">
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

            {/* Logo da Prefeitura de Ji-Paraná */}
            <a
              href="https://ji-parana.ro.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center ml-2 hover:opacity-80 transition-opacity"
              title="Prefeitura de Ji-Paraná"
            >
              <Image
                src="/prefeitura-ji-parana.png"
                alt="Prefeitura de Ji-Paraná"
                width={140}
                height={56}
                className="h-10 md:h-12 w-auto"
              />
            </a>

            {/* Botão de Login para Gestores */}
            <Link
              href="/admin/login"
              className="hidden md:flex items-center gap-2 ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <LogIn className="h-4 w-4" />
              <span>Área do Gestor</span>
            </Link>

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
            
            {/* Prefeitura link in mobile */}
            <div className="pt-4 border-t border-gray-200">
              <a
                href="https://ji-parana.ro.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2"
              >
                <Image
                  src="/prefeitura-ji-parana.png"
                  alt="Prefeitura de Ji-Paraná"
                  width={100}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
            </div>

            {/* Botão de Login para Gestores - Mobile */}
            <div className="pt-2">
              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 mx-3 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                <span>Área do Gestor</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
