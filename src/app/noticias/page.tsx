import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const metadata = {
  title: "Notícias - AGERJI",
  description: "Últimas notícias e publicações da AGERJI",
};

// Dados de exemplo - serão substituídos por dados do Supabase
const mockNews = [
  {
    id: 1,
    title: "AGERJI realiza fiscalização nos serviços de saneamento",
    summary: "Equipe técnica da agência reguladora realizou vistorias nas instalações da concessionária de saneamento básico do município.",
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop",
    slug: "agerji-realiza-fiscalizacao",
    category: "noticia",
    published_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Consulta pública sobre tarifas de água está aberta",
    summary: "Cidadãos podem participar da consulta pública sobre a revisão tarifária dos serviços de água e esgoto.",
    image_url: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=250&fit=crop",
    slug: "consulta-publica-tarifas",
    category: "publicacao",
    published_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Nova resolução estabelece padrões de qualidade",
    summary: "A AGERJI publicou nova resolução que define os padrões mínimos de qualidade para os serviços regulados.",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
    slug: "nova-resolucao-padroes",
    category: "resolucao",
    published_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    title: "AGERJI participa de encontro regional de agências reguladoras",
    summary: "Representantes da agência participaram do encontro promovido pela ABAR em Brasília.",
    image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop",
    slug: "encontro-regional-agencias",
    category: "noticia",
    published_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 5,
    title: "Relatório anual de atividades está disponível",
    summary: "O relatório anual de atividades da AGERJI referente ao exercício anterior já está disponível para consulta.",
    image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    slug: "relatorio-anual-atividades",
    category: "publicacao",
    published_at: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 6,
    title: "Comunicado sobre atendimento ao público",
    summary: "Informamos que o atendimento presencial funcionará em horário especial durante o período de festas.",
    image_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop",
    slug: "comunicado-atendimento",
    category: "comunicado",
    published_at: new Date(Date.now() - 432000000).toISOString(),
  },
];

const categoryLabels: Record<string, string> = {
  noticia: "Notícia",
  publicacao: "Publicação",
  resolucao: "Resolução",
  comunicado: "Comunicado",
};

const categoryColors: Record<string, string> = {
  noticia: "bg-primary",
  publicacao: "bg-blue-500",
  resolucao: "bg-purple-500",
  comunicado: "bg-orange-500",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function NoticiasPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Notícias e Publicações
          </h1>
          <p className="text-lg text-muted-foreground">
            Acompanhe as últimas novidades da AGERJI
          </p>
        </div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNews.map((item) => (
            <Link key={item.id} href={`/noticias/${item.slug}`}>
              <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group">
                {item.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white rounded ${
                        categoryColors[item.category] || "bg-primary"
                      }`}
                    >
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </div>
                )}
                <CardContent className="p-4">
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  {item.summary && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {item.summary}
                    </p>
                  )}
                  {item.published_at && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
