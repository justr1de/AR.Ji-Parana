'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Stats {
  documents: number;
  news: number;
  events: number;
  departments: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ documents: 0, news: 0, events: 0, departments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [docsResult, newsResult, eventsResult, deptsResult] = await Promise.all([
          supabase.from('documents').select('id', { count: 'exact', head: true }),
          supabase.from('news').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('departments').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          documents: docsResult.count || 0,
          news: newsResult.count || 0,
          events: eventsResult.count || 0,
          departments: deptsResult.count || 0,
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
    {
      title: 'Departamentos',
      count: stats.departments,
      description: 'Setores e pastas organizacionais',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      href: '/admin/dashboard/departamentos',
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
    },
  ];

  const quickActions = [
    {
      title: 'Novo Documento',
      href: '/admin/dashboard/documentos/novo',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-100',
      bgColor: 'bg-blue-50',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'Nova Notícia',
      href: '/admin/dashboard/noticias/nova',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-100',
      bgColor: 'bg-purple-50',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'Novo Evento',
      href: '/admin/dashboard/eventos/novo',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-100',
      bgColor: 'bg-green-50',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  const adminTools = [
    {
      title: 'Departamentos',
      description: 'Gerencie setores e organize documentos por departamento',
      href: '/admin/dashboard/departamentos',
      color: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-100',
      bgColor: 'bg-amber-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Relatórios',
      description: 'Gere relatórios de atividades, documentos e auditoria',
      href: '/admin/dashboard/relatorios',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-100',
      bgColor: 'bg-indigo-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Modelos de Documentos',
      description: 'Acesse templates de ofícios, memorandos e pareceres',
      href: '/admin/dashboard/modelos',
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-100',
      bgColor: 'bg-teal-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

        {/* Ferramentas Administrativas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Ferramentas Administrativas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {adminTools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className={`flex flex-col gap-3 p-6 ${tool.bgColor} ${tool.hoverColor} rounded-xl transition-all duration-200 hover:shadow-md group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${tool.color} text-white p-3 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                    {tool.icon}
                  </div>
                  <span className="font-bold text-gray-800 text-lg">
                    {tool.title}
                  </span>
                </div>
                <p className="text-sm text-gray-600 pl-1">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
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
                  {action.icon}
                </div>
                <span className="font-semibold text-gray-700">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
