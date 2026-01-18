"use client";

export function SidebarImages() {
  return (
    <div className="fixed left-0 top-0 h-screen w-16 md:w-20 lg:w-24 z-10 pointer-events-none hidden lg:block">
      {/* Imagem da AGERJI (em cima) */}
      <div 
        className="h-1/2 w-full bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('/agerji-lateral.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Imagem de Ji-Paraná (embaixo) */}
      <div 
        className="h-1/2 w-full bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('/jiparana-lateral.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
