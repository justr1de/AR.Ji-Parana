import { BannerCarousel } from "@/components/BannerCarousel";
import { ServicesSection } from "@/components/ServicesSection";
import { NewsSection } from "@/components/NewsSection";
import { AgendaSection } from "@/components/AgendaSection";
import { QuickLinks } from "@/components/QuickLinks";
import { StatsSection } from "./sections/StatsSection";
import { AboutSection } from "./sections/AboutSection";
import { DocumentsSection } from "./sections/DocumentsSection";
import { ContactSection } from "./sections/ContactSection";

export default function Home() {
  return (
    <>
      <BannerCarousel />
      <ServicesSection />
      <StatsSection />
      <AboutSection />
      <DocumentsSection />
      <NewsSection />
      <AgendaSection />
      <ContactSection />
      <QuickLinks />
    </>
  );
}
