import { BannerCarousel } from "@/components/BannerCarousel";
import { ServicesSection } from "@/components/ServicesSection";
import { NewsSection } from "@/components/NewsSection";
import { AgendaSection } from "@/components/AgendaSection";
import { QuickLinks } from "@/components/QuickLinks";

export default function Home() {
  return (
    <>
      <BannerCarousel />
      <ServicesSection />
      <NewsSection />
      <AgendaSection />
      <QuickLinks />
    </>
  );
}
