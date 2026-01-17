import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  DollarSign,
  Building2,
  Scale,
  ExternalLink,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Transparência - AGERJI",
  description: "Portal de Transparência da AGERJI - Agência Reguladora de Ji-Paraná",
};

const transparencyItems = [
  {
    id: "receitas-despesas",
    title: "Receitas e Despesas",
    description: "Consulte a execução orçamentária e financeira da agência",
    icon: DollarSign,
    href: "https://transparencia.ji-parana.ro.gov.br",
    external: true,
  },
  {
    id: "licitacoes",
    title: "Licitações e Contratos",
    description: "Processos licitatórios e contratos firmados",
    icon: FileText,
    href: "https://transparencia.ji-parana.ro.gov.br",
    external: true,
  },
  {
    id: "servidores",
    title: "Servidores",
    description: "Quadro de pessoal e remuneração",
    icon: Users,
    href: "https://transparencia.ji-parana.ro.gov.br",
    external: true,
  },
  {
    id: "estrutura",
    title: "Estrutura Organizacional",
    description: "Organograma e competências",
    icon: Building2,
    href: "/institucional/estrutura",
    external: false,
  },
  {
    id: "legislacao",
    title: "Legislação",
    description: "Leis, decretos e normas regulatórias",
    icon: Scale,
    href: "/leis-atos",
    external: false,
  },
];

const documents = [
  {
    id: 1,
    title: "Relatório de Gestão 2024",
    type: "PDF",
    size: "2.5 MB",
  },
  {
    id: 2,
    title: "Prestação de Contas Anual",
    type: "PDF",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Plano de Trabalho 2025",
    type: "PDF",
    size: "890 KB",
  },
  {
    id: 4,
    title: "Regimento Interno",
    type: "PDF",
    size: "450 KB",
  },
];

export default function TransparenciaPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Portal de Transparência
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Em cumprimento à Lei de Acesso à Informação (Lei nº 12.527/2011), a AGERJI
            disponibiliza informações sobre sua gestão, atividades e prestação de contas.
          </p>
        </div>

        {/* Quick access cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transparencyItems.map((item) => {
              const content = (
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                          {item.title}
                          {item.external && <ExternalLink className="h-4 w-4" />}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );

              if (item.external) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={item.id} href={item.href}>
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Documents */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Documentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-red-100 text-red-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{doc.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* LAI */}
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">
                Lei de Acesso à Informação (LAI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                A Lei nº 12.527/2011 regulamenta o direito constitucional de acesso às
                informações públicas. Qualquer cidadão pode solicitar informações aos
                órgãos públicos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/atendimento">
                  <Button>Solicitar Informação</Button>
                </Link>
                <a
                  href="https://www.gov.br/acessoainformacao"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="flex items-center gap-2">
                    Saiba mais sobre a LAI
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
