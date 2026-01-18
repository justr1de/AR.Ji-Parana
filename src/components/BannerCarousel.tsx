"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  link_text: string | null;
}

interface BannerCarouselProps {
  banners?: Banner[];
}

const defaultBanners: Banner[] = [
  {
    id: 1,
    title: "AGERJI - Regulação com Transparência",
    subtitle: "Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=600&fit=crop",
    link_url: "/institucional",
    link_text: "Conheça a AGERJI",
  },
  {
    id: 2,
    title: "Saneamento Básico",
    subtitle: "Fiscalização e regulação dos serviços de água e esgoto em Ji-Paraná",
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=600&fit=crop",
    link_url: "/servicos-regulados",
    link_text: "Saiba mais",
  },
  {
    id: 3,
    title: "Participação Social",
    subtitle: "Audiências públicas, consultas e canais de atendimento ao cidadão",
    image_url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1920&h=600&fit=crop",
    link_url: "/atendimento",
    link_text: "Participe",
  },
  {
    id: 4,
    title: "Portal da Transparência",
    subtitle: "Acesse informações sobre contratos, licitações e prestação de contas",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&h=600&fit=crop",
    link_url: "/transparencia",
    link_text: "Acesse",
  },
];

export function BannerCarousel({ banners = defaultBanners }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const displayBanners = banners.length > 0 ? banners : defaultBanners;

  return (
    <section className="relative" aria-label="Banner principal">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {displayBanners.map((banner) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0 relative">
              <div
                className="relative h-[400px] md:h-[500px] bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image_url})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                
                {/* Content */}
                <div className="container relative h-full flex items-center">
                  <div className="max-w-xl text-white">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-lg md:text-xl text-white/90 mb-6">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link_url && (
                      <Link href={banner.link_url}>
                        <Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                          {banner.link_text || "Saiba mais"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
        onClick={scrollPrev}
        aria-label="Banner anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
        onClick={scrollNext}
        aria-label="Próximo banner"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === selectedIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Ir para banner ${index + 1}`}
            aria-current={index === selectedIndex ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
}
