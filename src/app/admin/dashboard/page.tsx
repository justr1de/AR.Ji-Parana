'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Stats {
  documents: number;
  news: number;
  events: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ documents: 0, news: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [docsResult, newsResult, eventsResult] = await Promise.all([
          supabase.from('documents').select('id', { count: 'exact', head: true }),
          supabase.from('news').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          documents: docsResult.count || 0,
          news: newsResult.count || 0,
          events: eventsResult.count || 0,
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Documentos',
      count: stats.documents,
      description: 'Leis, resoluções e portarias',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: '/admin/dashboard/documentos',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
    },
    {
      title: 'Notícias',
      count: stats.news,
      description: 'Publicações e comunicados',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      href: '/admin/dashboard/noticias',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
    },
    {
      title: 'Eventos',
      count: stats.events,
      description: 'Audiências e reuniões',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/admin/dashboard/eventos',
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
    },
  ];

  const quickActions = [
    {
      title: 'Novo Documento',
      href: '/admin/dashboard/documentos/novo',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-100',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Nova Notícia',
      href: '/admin/dashboard/noticias/nova',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-100',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Novo Evento',
      href: '/admin/dashboard/eventos/novo',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-100',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      {/* Container principal com padding adequado */}
      <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-10">
        
        {/* Cabeçalho da página */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Bem-vindo ao painel administrativo da AGERJI
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {card.title}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {loading ? (
                      <span className="inline-block w-12 h-10 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      card.count
                    )}
                  </p>
                  <p className="text-sm text-gray-400">
                    {card.description}
                  </p>
                </div>
                <div className={`${card.color} text-white p-4 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  {card.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Ações rápidas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`flex items-center gap-4 p-5 ${action.bgColor} ${action.hoverColor} rounded-xl transition-colors duration-200`}
              >
                <div className={`${action.color} text-white p-3 rounded-lg shadow-sm`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Sobre o projeto */}
        <div className="bg-gradient-to-br from-green-700 via-green-700 to-green-800 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-xl font-bold mb-4">
            Sobre o Projeto
          </h2>
          <p className="text-green-100 leading-relaxed mb-6">
            O Portal da AGERJI foi desenvolvido para facilitar a comunicação entre a Agência Reguladora 
            de Ji-Paraná e os cidadãos, oferecendo transparência e acesso às informações institucionais.
          </p>
          <div className="flex items-center gap-5 pt-6 border-t border-green-600/50">
            <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg">DATA-RO INTELIGÊNCIA TERRITORIAL</p>
              <p className="text-sm text-green-200 mt-1">Autora exclusiva do projeto</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
