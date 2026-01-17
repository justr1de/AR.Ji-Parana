import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Scale,
  Users,
  Phone,
  Search,
  Building2,
  ExternalLink,
} from "lucide-react";

const quickLinks = [
  {
    id: "legislacao",
    title: "Legislação",
    icon: Scale,
    href: "/leis-atos/legislacao",
    external: false,
  },
  {
    id: "resolucoes",
    title: "Resoluções",
    icon: FileText,
    href: "/leis-atos/resolucoes",
    external: false,
  },
  {
    id: "audiencias",
    title: "Audiências Públicas",
    icon: Users,
    href: "/participacao-social/audiencias",
    external: false,
  },
  {
    id: "ouvidoria",
    title: "Ouvidoria",
    icon: Phone,
    href: "/atendimento/ouvidoria",
    external: false,
  },
  {
    id: "transparencia",
    title: "Transparência",
    icon: Search,
    href: "/transparencia",
    external: false,
  },
  {
    id: "prefeitura",
    title: "Prefeitura",
    icon: Building2,
    href: "https://ji-parana.ro.gov.br",
    external: true,
  },
];

export function QuickLinks() {
  return (
    <section className="py-12" aria-labelledby="quick-links-title">
      <div className="container">
        <h2 id="quick-links-title" className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link) => {
            const content = (
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <link.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                    {link.title}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </h3>
                </CardContent>
              </Card>
            );

            if (link.external) {
              return (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={link.id} href={link.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
