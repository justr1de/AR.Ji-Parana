'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SobrePage() {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8 sm:px-8 lg:px-10">
        
        {/* Botão Voltar */}
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Voltar ao Dashboard</span>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Sobre o Projeto
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Informações sobre o desenvolvimento do Portal AGERJI
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header do card com gradiente */}
          <div className="bg-gradient-to-br from-green-700 via-green-700 to-green-800 p-8 text-white">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Portal AGERJI</h2>
                <p className="text-green-200 mt-1">Sistema de Gestão da Agência Reguladora</p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-8 space-y-8">
            
            {/* Descrição do projeto */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre o Sistema</h3>
              <p className="text-gray-600 leading-relaxed">
                O Portal da AGERJI foi desenvolvido para facilitar a comunicação entre a Agência Reguladora 
                de Ji-Paraná e os cidadãos, oferecendo transparência e acesso às informações institucionais.
                O sistema permite a gestão completa de documentos, notícias, eventos e usuários, garantindo
                eficiência na administração pública.
              </p>
            </div>

            {/* Funcionalidades */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Principais Funcionalidades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gestão de Documentos</p>
                    <p className="text-sm text-gray-500">Leis, resoluções e portarias</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Publicação de Notícias</p>
                    <p className="text-sm text-gray-500">Comunicados e informes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Agenda de Eventos</p>
                    <p className="text-sm text-gray-500">Audiências e reuniões</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Controle de Usuários</p>
                    <p className="text-sm text-gray-500">Gestão de acessos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div className="border-t border-gray-200"></div>

            {/* Autoria */}
            <div className="flex items-center gap-5 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="w-14 h-14 bg-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Desenvolvido por</p>
                <a
                  href="https://www.dataro-it.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-bold text-gray-900 hover:text-primary transition-colors"
                >
                  DATA-RO INTELIGÊNCIA TERRITORIAL
                </a>
                <p className="text-sm text-gray-500 mt-1">Autora exclusiva do projeto</p>
              </div>
            </div>

            {/* Versão e informações técnicas */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Versão 1.0.0</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Janeiro 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Ji-Paraná, RO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Voltar no final */}
        <div className="mt-8 text-center">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
