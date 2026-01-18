import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

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

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and contact */}
          <div className="lg:col-span-2">
            {/* Bandeira de Ji-Paraná */}
            <div className="mb-6">
              <Image
                src="/images/bandeira-ji-parana.png"
                alt="Bandeira de Ji-Paraná"
                width={120}
                height={80}
                className="h-16 w-auto rounded-lg"
              />
            </div>
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
                <span>agerji@ji-parana.ro.gov.br</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Segunda a Sexta: 07:30 às 13:30</span>
              </div>
            </div>
            
            {/* ABAR Badge */}
            <div className="mt-6 pt-6 border-t border-primary-foreground/20">
              <p className="text-xs text-primary-foreground/70 mb-3">Membro da:</p>
              <a
                href="https://abar.org.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
                title="ABAR - Associação Brasileira de Agências Reguladoras"
              >
                <Image
                  src="/images/logo-abar.png"
                  alt="ABAR - Associação Brasileira de Agências Reguladoras"
                  width={100}
                  height={60}
                  className="h-10 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
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
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/20">
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
