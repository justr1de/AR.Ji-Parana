export function StatsSection() {
  const stats = [
    { number: "12+", label: "Anos de Atuação", description: "Desde 2012" },
    { number: "3", label: "Serviços Regulados", description: "Saneamento, Resíduos, Transporte" },
    { number: "150k+", label: "Cidadãos Atendidos", description: "População de Ji-Paraná" },
    { number: "100%", label: "Transparência", description: "Acesso à informação" },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-primary to-primary/90 text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.number}</div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-white/70">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
