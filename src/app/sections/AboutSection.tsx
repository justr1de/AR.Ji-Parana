"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, Target, Award, Lightbulb, ChevronRight, Users, Scale, FileCheck } from "lucide-react";

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
          
          {/* Área de Atuação - substituindo o Assistente Virtual */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Áreas de Atuação
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Saneamento Básico</h4>
                  <p className="text-sm text-gray-600">Regulação dos serviços de abastecimento de água, esgotamento sanitário e drenagem urbana.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Resíduos Sólidos</h4>
                  <p className="text-sm text-gray-600">Fiscalização da coleta, tratamento e destinação final de resíduos sólidos urbanos.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Transporte Público</h4>
                  <p className="text-sm text-gray-600">Controle e fiscalização dos serviços de transporte coletivo municipal.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users className="w-5 h-5 text-primary" />
                <span>Atendendo mais de <strong>150 mil cidadãos</strong> em Ji-Paraná</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
