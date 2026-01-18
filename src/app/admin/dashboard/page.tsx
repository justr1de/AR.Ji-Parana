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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: '/admin/dashboard/documentos',
      color: 'bg-blue-500',
    },
    {
      title: 'Notícias',
      count: stats.news,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      href: '/admin/dashboard/noticias',
      color: 'bg-purple-500',
    },
    {
      title: 'Eventos',
      count: stats.events,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/admin/dashboard/eventos',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao painel administrativo da AGERJI</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : card.count}
                </p>
              </div>
              <div className={`${card.color} text-white p-4 rounded-xl`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Ações rápidas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/documentos/novo"
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">Novo Documento</span>
          </Link>

          <Link
            href="/admin/dashboard/noticias/nova"
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <div className="bg-purple-500 text-white p-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">Nova Notícia</span>
          </Link>

          <Link
            href="/admin/dashboard/eventos/novo"
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <div className="bg-green-500 text-white p-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">Novo Evento</span>
          </Link>
        </div>
      </div>

      {/* Sobre o projeto */}
      <div className="mt-8 bg-gradient-to-r from-green-700 to-green-800 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Sobre o Projeto</h2>
        <p className="text-green-100 mb-4">
          O Portal da AGERJI foi desenvolvido para facilitar a comunicação entre a Agência Reguladora 
          de Ji-Paraná e os cidadãos, oferecendo transparência e acesso às informações institucionais.
        </p>
        <div className="flex items-center gap-4 pt-4 border-t border-green-600">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold">DATA-RO INTELIGÊNCIA TERRITORIAL</p>
            <p className="text-sm text-green-200">Autora exclusiva do projeto</p>
          </div>
        </div>
      </div>
    </div>
  );
}
