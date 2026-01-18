import Link from "next/link";
import { Scale, FileText, Building2, Users, ChevronRight } from "lucide-react";

const documents = [
  {
    title: "Lei de Criação",
    description: "Lei Municipal nº 2.271/2012 que institui a AGERJI",
    icon: Scale,
    href: "/leis-atos",
  },
  {
    title: "Resoluções",
    description: "Normas e regulamentos aprovados pelo Conselho Diretor",
    icon: FileText,
    href: "/leis-atos/resolucoes",
  },
  {
    title: "Relatórios Anuais",
    description: "Prestação de contas e atividades realizadas",
    icon: Building2,
    href: "/transparencia",
  },
  {
    title: "Audiências Públicas",
    description: "Participação social nas decisões da agência",
    icon: Users,
    href: "/participacao-social/audiencias",
  },
];

export function DocumentsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Documentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Acesso à Informação
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Consulte os principais documentos e normas da AGERJI
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc, index) => (
            <Link
              key={index}
              href={doc.href}
              className="group bg-gray-50 rounded-xl p-6 hover:bg-primary transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-14 h-14 bg-primary/10 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <doc.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white mb-2 transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors">
                {doc.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-primary group-hover:text-white text-sm font-medium transition-colors">
                Acessar
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
