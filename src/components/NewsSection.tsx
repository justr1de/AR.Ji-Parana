import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  summary: string | null;
  image_url: string | null;
  slug: string;
  category: string;
  published_at: string | null;
}

interface NewsSectionProps {
  news?: NewsItem[];
}

const defaultNews: NewsItem[] = [
  {
    id: 1,
    title: "AGERJI realiza fiscalização nos serviços de saneamento",
    summary: "Equipe técnica da agência reguladora realizou vistorias nas instalações da concessionária.",
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop",
    slug: "agerji-realiza-fiscalizacao",
    category: "noticia",
    published_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Consulta pública sobre tarifas de água está aberta",
    summary: "Cidadãos podem participar da consulta pública sobre a revisão tarifária dos serviços.",
    image_url: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=250&fit=crop",
    slug: "consulta-publica-tarifas",
    category: "publicacao",
    published_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Nova resolução estabelece padrões de qualidade",
    summary: "A AGERJI publicou nova resolução que define os padrões mínimos de qualidade.",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
    slug: "nova-resolucao-padroes",
    category: "resolucao",
    published_at: new Date(Date.now() - 172800000).toISOString(),
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

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function NewsSection({ news = defaultNews }: NewsSectionProps) {
  const displayNews = news.length > 0 ? news : defaultNews;

  return (
    <section className="py-12" aria-labelledby="news-title">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 id="news-title" className="text-2xl md:text-3xl font-bold text-foreground">
              Últimas Notícias
            </h2>
            <p className="mt-1 text-muted-foreground">
              Acompanhe as novidades da AGERJI
            </p>
          </div>
          <Link href="/noticias">
            <Button variant="outline" className="hidden md:flex items-center gap-2">
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayNews.map((item) => (
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
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
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

        <div className="mt-6 text-center md:hidden">
          <Link href="/noticias">
            <Button variant="outline" className="w-full">
              Ver todas as notícias
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
