import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, FileText, AlertTriangle } from "lucide-react";

const serviceCategories = [
  {
    id: "infraestrutura",
    title: "Infraestrutura",
    description: "Serviços de saneamento, transporte e resíduos sólidos",
    icon: Building2,
    href: "/servicos-regulados",
    color: "bg-primary",
  },
  {
    id: "guias",
    title: "Guias e Multas",
    description: "Consulte guias de pagamento e multas aplicadas",
    icon: FileText,
    href: "/servicos/guias",
    color: "bg-blue-600",
  },
  {
    id: "denuncias",
    title: "Denúncias",
    description: "Registre denúncias sobre irregularidades nos serviços",
    icon: AlertTriangle,
    href: "/atendimento/ouvidoria",
    color: "bg-amber-600",
  },
];

export function ServicesSection() {
  return (
    <section className="py-12 bg-secondary/30" aria-labelledby="services-title">
      <div className="container">
        <div className="text-center mb-8">
          <h2 id="services-title" className="text-2xl md:text-3xl font-bold text-foreground">
            Serviços para Você!
          </h2>
          <p className="mt-2 text-muted-foreground">
            Acesse os principais serviços da AGERJI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
