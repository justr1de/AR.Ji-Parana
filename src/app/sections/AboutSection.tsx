"use client";

import Link from "next/link";
import { Shield, Target, Award, Lightbulb, ChevronRight } from "lucide-react";
import { AssistenteVirtual } from "@/components/AssistenteVirtual";

export function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Sobre a AGERJI
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Regulação com Transparência e Eficiência
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              A <strong>Agência Reguladora de Serviços Públicos Delegados do Município de Ji-Paraná (AGERJI)</strong> foi 
              criada pela Lei Municipal nº 2.271/2012 com a missão de regular, controlar e fiscalizar os serviços 
              públicos delegados, garantindo qualidade e modicidade tarifária para toda a população.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Nossa atuação abrange os serviços de <strong>saneamento básico</strong>, <strong>resíduos sólidos</strong> e 
              <strong> transporte público</strong>, sempre com foco na proteção dos direitos dos usuários e na 
              promoção da eficiência dos serviços prestados.
            </p>
            
            {/* Valores */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Transparência</h4>
                  <p className="text-sm text-gray-500">Acesso público às informações</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Eficiência</h4>
                  <p className="text-sm text-gray-500">Resultados para a população</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Qualidade</h4>
                  <p className="text-sm text-gray-500">Padrões elevados de serviço</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Inovação</h4>
                  <p className="text-sm text-gray-500">Modernização contínua</p>
                </div>
              </div>
            </div>
            
            <Link
              href="/institucional"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Conheça mais sobre a AGERJI
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Assistente Virtual */}
          <div>
            <div className="mb-4">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Atendimento Online
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                Assistente Virtual
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Tire suas dúvidas sobre nossos serviços de forma rápida e prática
              </p>
            </div>
            <AssistenteVirtual />
          </div>
        </div>
      </div>
    </section>
  );
}
