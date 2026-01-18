import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ChevronRight, ExternalLink, FileText } from "lucide-react";

export function ContactSection() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-green-400 font-semibold text-sm uppercase tracking-wider">
              Fale Conosco
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Entre em Contato
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              A AGERJI está à disposição para atender você. Utilize nossos canais de 
              atendimento para tirar dúvidas, fazer reclamações, sugestões ou denúncias.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Endereço</h4>
                  <p className="text-gray-400">
                    Rua do Brilhante, 130 - Urupá<br />
                    Ji-Paraná - RO, CEP: 76.900-150
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Telefone</h4>
                  <p className="text-gray-400">(69) 3421-5996</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">E-mail</h4>
                  <a href="mailto:agerji@ji-parana.ro.gov.br" className="text-green-400 hover:underline">
                    agerji@ji-parana.ro.gov.br
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Horário de Atendimento</h4>
                  <p className="text-gray-400">Segunda a Sexta: 07:30 às 13:30</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Canais de Atendimento</h3>
            
            <div className="space-y-4">
              <Link
                href="/atendimento#ouvidoria"
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-primary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400 group-hover:text-white" />
                  <span>Ouvidoria</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
              </Link>
              
              <Link
                href="/atendimento"
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-primary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400 group-hover:text-white" />
                  <span>Fale Conosco</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
              </Link>
              
              <Link
                href="/atendimento#faq"
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-primary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-400 group-hover:text-white" />
                  <span>Perguntas Frequentes</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
              </Link>
              
              <a
                href="https://transparencia.ji-parana.ro.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-primary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-green-400 group-hover:text-white" />
                  <span>Portal da Transparência</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
