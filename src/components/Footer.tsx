import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ExternalLink, Facebook, Instagram } from "lucide-react";

const footerLinks = {
  institucional: [
    { label: "Sobre a AGERJI", href: "/institucional" },
    { label: "Estrutura Organizacional", href: "/institucional#estrutura" },
    { label: "Conselho Diretor", href: "/orgaos-colegiados/conselho-diretor" },
  ],
  servicos: [
    { label: "Saneamento Básico", href: "/servicos-regulados/saneamento" },
    { label: "Transporte Público", href: "/servicos-regulados/transporte" },
    { label: "Resíduos Sólidos", href: "/servicos-regulados/residuos" },
  ],
  acesso: [
    { label: "Notícias", href: "/noticias" },
    { label: "Agenda", href: "/agenda" },
    { label: "Transparência", href: "/transparencia" },
    { label: "Ouvidoria", href: "/atendimento#ouvidoria" },
  ],
  utilidades: [
    { label: "Mapa do Site", href: "/mapa-do-site" },
    { label: "Acessibilidade", href: "/acessibilidade" },
    { label: "Política de Privacidade", href: "/privacidade" },
  ],
};

const quickAccessLinks = [
  { icon: "⚖️", label: "Legislação", href: "/leis-atos/legislacao" },
  { icon: "📋", label: "Resoluções", href: "/leis-atos/resolucoes" },
  { icon: "👥", label: "Audiências Públicas", href: "/participacao-social/audiencias" },
  { icon: "📞", label: "Ouvidoria", href: "/atendimento#ouvidoria" },
  { icon: "🔍", label: "Transparência", href: "/transparencia" },
  { icon: "🏛️", label: "Prefeitura", href: "https://ji-parana.ro.gov.br", external: true },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1a5c38] via-[#1e6b40] to-[#0d3d24] text-primary-foreground">
      {/* Quick Access Bar */}
      <div className="bg-[#145230] py-6">
        <div className="container">
          <h3 className="text-center text-lg font-semibold mb-4">Acesso Rápido</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {quickAccessLinks.map((link) => (
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors min-w-[100px]"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="text-xs font-medium">{link.label}</span>
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center gap-2 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors min-w-[100px]"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="text-xs font-medium">{link.label}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Coluna 1: Bandeira + Endereço + ABAR */}
          <div className="lg:col-span-2">
            {/* Bandeira de Ji-Paraná - Alinhada à esquerda com moldura */}
            <div className="mb-6 flex flex-col items-start">
              <div className="p-3 bg-white/10 rounded-xl border-2 border-white/30 shadow-lg">
                <Image
                  src="/bandeira-ji-parana.png"
                  alt="Bandeira de Ji-Paraná"
                  width={160}
                  height={107}
                  className="h-24 w-auto rounded-lg"
                />
              </div>
              <p className="text-sm text-primary-foreground/70 mt-2 font-medium">Ji-Paraná - RO</p>
            </div>
            
            {/* Endereço e contato */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Rua do Brilhante, 130 - Urupá<br />Ji-Paraná - RO, CEP: 76.900-150</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(69) 3421-5996</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:agerji@ji-parana.ro.gov.br" className="hover:underline">
                  agerji@ji-parana.ro.gov.br
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Segunda a Sexta: 07:30 às 13:30</span>
              </div>
            </div>
            
            {/* ABAR Badge - Logo Colorida - Abaixo do endereço */}
            <div className="mt-6 pt-6 border-t border-primary-foreground/20">
              <p className="text-sm font-medium text-primary-foreground/90 mb-3">Membro da:</p>
              <a
                href="https://abar.org.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white rounded-lg p-3 hover:shadow-lg transition-all"
                title="ABAR - Associação Brasileira de Agências Reguladoras"
              >
                <Image
                  src="/logo-abar.png"
                  alt="ABAR - Associação Brasileira de Agências Reguladoras"
                  width={160}
                  height={96}
                  className="h-14 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-semibold mb-4">Institucional</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.institucional.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-semibold mb-4">Serviços Regulados</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.servicos.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Acesso Rápido */}
          <div>
            <h3 className="font-semibold mb-4">Acesso Rápido</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.acesso.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Social Media */}
            <div className="mt-6 pt-4 border-t border-primary-foreground/20">
              <p className="text-sm font-medium mb-3">Redes Sociais</p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com/agerji"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Facebook da AGERJI"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/agerji"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Instagram da AGERJI"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/20 bg-gradient-to-r from-[#0d3d24] via-[#145230] to-[#0d3d24]">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-primary-foreground/80">
              © {new Date().getFullYear()} AGERJI - Agência Reguladora de Ji-Paraná. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.utilidades.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:underline text-primary-foreground/80 hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/60">
            <p>
              Desenvolvido por{" "}
              <a
                href="https://data-ro.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1"
              >
                DATA-RO INTELIGÊNCIA TERRITORIAL
                <ExternalLink className="h-3 w-3" />
              </a>
              . TODOS OS DIREITOS RESERVADOS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
