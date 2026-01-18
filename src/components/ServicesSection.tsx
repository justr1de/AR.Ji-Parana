import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Trash2, AlertTriangle, FileSearch, Phone, Scale } from "lucide-react";

const serviceCategories = [
  {
    id: "saneamento",
    title: "Saneamento Básico",
    description: "Regulação dos serviços de abastecimento de água e esgotamento sanitário",
    icon: Droplets,
    href: "/servicos-regulados",
    color: "bg-blue-600",
  },
  {
    id: "residuos",
    title: "Resíduos Sólidos",
    description: "Fiscalização dos serviços de limpeza urbana e manejo de resíduos",
    icon: Trash2,
    href: "/servicos-regulados",
    color: "bg-primary",
  },
  {
    id: "denuncias",
    title: "Denúncias",
    description: "Registre denúncias sobre irregularidades nos serviços públicos",
    icon: AlertTriangle,
    href: "/atendimento",
    color: "bg-amber-600",
  },
  {
    id: "consultas",
    title: "Consultas Públicas",
    description: "Participe das consultas e audiências públicas da AGERJI",
    icon: FileSearch,
    href: "/agenda",
    color: "bg-purple-600",
  },
  {
    id: "ouvidoria",
    title: "Ouvidoria",
    description: "Canal direto para reclamações, sugestões e elogios",
    icon: Phone,
    href: "/atendimento",
    color: "bg-teal-600",
  },
  {
    id: "tarifas",
    title: "Tarifas e Taxas",
    description: "Informações sobre tarifas dos serviços regulados",
    icon: Scale,
    href: "/transparencia",
    color: "bg-orange-600",
  },
];

export function ServicesSection() {
  return (
    <section className="py-12 bg-secondary/30" aria-labelledby="services-title">
      <div className="container">
        <div className="text-center mb-8">
          <h2 id="services-title" className="text-2xl md:text-3xl font-bold text-foreground">
            Serviços para Você
          </h2>
          <p className="mt-2 text-muted-foreground">
            Acesse os principais serviços e canais de atendimento da AGERJI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((service) => (
            <Link key={service.id} href={service.href}>
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${service.color} text-white flex-shrink-0`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
