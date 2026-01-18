"use client";

import Link from "next/link";

export function SidebarImages() {
  return (
    <div className="fixed left-0 top-[120px] h-[calc(100vh-120px)] w-48 md:w-60 lg:w-72 z-0 hidden lg:flex flex-col">
      {/* Imagem da AGERJI (em cima) - Link para o site oficial */}
      <Link 
        href="https://agerji.ji-parana.ro.gov.br"
        target="_blank"
        rel="noopener noreferrer"
        className="h-1/2 w-full block transition-all duration-300 opacity-60 hover:opacity-90"
        title="Acesse o site oficial da AGERJI"
      >
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: "url('/agerji-lateral.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Link>
      {/* Imagem de Ji-Paraná (embaixo) - Link para página de turismo */}
      <Link 
        href="https://ji-parana.ro.gov.br/turismo"
        target="_blank"
        rel="noopener noreferrer"
        className="h-1/2 w-full block transition-all duration-300 opacity-60 hover:opacity-90 -mt-px"
        title="Conheça o turismo de Ji-Paraná"
      >
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: "url('/jiparana-lateral.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Link>
    </div>
  );
}
