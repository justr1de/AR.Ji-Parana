'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface GabineteStats {
  totalProvidencias: number;
  pendentes: number;
  emAnalise: number;
  encaminhadas: number;
  emAndamento: number;
  concluidas: number;
  arquivadas: number;
  urgentes: number;
  totalCidadaos: number;
  totalOrgaos: number;
  esteMes: number;
}

export default function GabinetePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<GabineteStats>({
    totalProvidencias: 0,
    pendentes: 0,
    emAnalise: 0,
    encaminhadas: 0,
    emAndamento: 0,
    concluidas: 0,
    arquivadas: 0,
    urgentes: 0,
    totalCidadaos: 0,
    totalOrgaos: 0,
    esteMes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentProvidencias, setRecentProvidencias] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Buscar estatísticas de providências
        const { data: providencias, error: provError } = await supabase
          .from('agerji_providencias')
          .select('id, status, prioridade, created_at');

        if (provError) throw provError;

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const stats: GabineteStats = {
          totalProvidencias: providencias?.length || 0,
          pendentes: providencias?.filter(p => p.status === 'pendente').length || 0,
          emAnalise: providencias?.filter(p => p.status === 'em_analise').length || 0,
          encaminhadas: providencias?.filter(p => p.status === 'encaminhado').length || 0,
          emAndamento: providencias?.filter(p => p.status === 'em_andamento').length || 0,
          concluidas: providencias?.filter(p => p.status === 'concluido').length || 0,
          arquivadas: providencias?.filter(p => p.status === 'arquivado').length || 0,
          urgentes: providencias?.filter(p => p.prioridade === 'urgente').length || 0,
          esteMes: providencias?.filter(p => new Date(p.created_at) >= firstDayOfMonth).length || 0,
          totalCidadaos: 0,
          totalOrgaos: 0,
        };

        // Buscar contagem de cidadãos
        const { count: cidadaosCount } = await supabase
          .from('agerji_cidadaos')
          .select('id', { count: 'exact', head: true });
        stats.totalCidadaos = cidadaosCount || 0;

        // Buscar contagem de órgãos
        const { count: orgaosCount } = await supabase
          .from('agerji_orgaos')
          .select('id', { count: 'exact', head: true });
        stats.totalOrgaos = orgaosCount || 0;

        setStats(stats);

        // Buscar providências recentes
        const { data: recent } = await supabase
          .from('agerji_providencias')
          .select(`
            id,
            numero_protocolo,
            titulo,
            status,
            prioridade,
            created_at,
            cidadao:agerji_cidadaos(nome),
            orgao_destino:agerji_orgaos(nome, sigla)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentProvidencias(recent || []);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-100 text-yellow-800',
    em_analise: 'bg-blue-100 text-blue-800',
    encaminhado: 'bg-indigo-100 text-indigo-800',
    em_andamento: 'bg-cyan-100 text-cyan-800',
    concluido: 'bg-green-100 text-green-800',
    arquivado: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    pendente: 'Pendente',
    em_analise: 'Em Análise',
    encaminhado: 'Encaminhado',
    em_andamento: 'Em Andamento',
    concluido: 'Concluído',
    arquivado: 'Arquivado',
  };

  const prioridadeColors: Record<string, string> = {
    baixa: 'bg-green-100 text-green-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-orange-100 text-orange-800',
    urgente: 'bg-red-100 text-red-800',
  };

  const statsCards = [
    {
      title: 'Total de Providências',
      value: stats.totalProvidencias,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pendentes',
      value: stats.pendentes,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Em Andamento',
      value: stats.emAndamento,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Concluídas',
      value: stats.concluidas,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Urgentes',
      value: stats.urgentes,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Este Mês',
      value: stats.esteMes,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const quickActions = [
    {
      title: 'Nova Providência',
      href: '/admin/dashboard/gabinete/providencias/nova',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Novo Cidadão',
      href: '/admin/dashboard/gabinete/cidadaos/novo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Novo Órgão',
      href: '/admin/dashboard/gabinete/orgaos/novo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-amber-600 hover:bg-amber-700',
    },
  ];

  const navigationCards = [
    {
      title: 'Providências',
      description: 'Gerencie todas as providências e demandas',
      href: '/admin/dashboard/gabinete/providencias',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      count: stats.totalProvidencias,
      color: 'border-blue-500',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Cidadãos',
      description: 'Cadastro de cidadãos atendidos',
      href: '/admin/dashboard/gabinete/cidadaos',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      count: stats.totalCidadaos,
      color: 'border-green-500',
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      title: 'Órgãos',
      description: 'Órgãos municipais, estaduais e federais',
      href: '/admin/dashboard/gabinete/orgaos',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      count: stats.totalOrgaos,
      color: 'border-amber-500',
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'Categorias',
      description: 'Categorias de providências',
      href: '/admin/dashboard/gabinete/categorias',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'border-purple-500',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Relatórios',
      description: 'Relatórios e estatísticas',
      href: '/admin/dashboard/gabinete/relatorios',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'border-indigo-500',
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gabinete AGERJI
              </h1>
              <p className="text-sm text-gray-500">
                Agência Reguladora de Ji-Paraná
              </p>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Sistema de gestão de providências e atendimento ao cidadão
          </p>
        </div>

        {/* Ações Rápidas */}
        <div className="flex flex-wrap gap-3 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${action.color}`}
            >
              {action.icon}
              {action.title}
            </Link>
          ))}
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statsCards.map((card) => (
            <div
              key={card.title}
              className={`${card.bgColor} rounded-xl p-4 border border-gray-100`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${card.color} text-white p-2 rounded-lg`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" />
                ) : (
                  card.value
                )}
              </p>
              <p className="text-xs text-gray-600 mt-1">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {navigationCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`bg-white rounded-xl p-6 border-l-4 ${card.color} shadow-sm hover:shadow-md transition-all group`}
            >
              <div className="flex items-start justify-between">
                <div className={`${card.iconBg} p-3 rounded-xl group-hover:scale-105 transition-transform`}>
                  {card.icon}
                </div>
                {card.count !== undefined && (
                  <span className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      card.count
                    )}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {card.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Providências Recentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Providências Recentes
              </h2>
              <Link
                href="/admin/dashboard/gabinete/providencias"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Ver todas →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : recentProvidencias.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Nenhuma providência cadastrada</p>
                <Link
                  href="/admin/dashboard/gabinete/providencias/nova"
                  className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Criar primeira providência
                </Link>
              </div>
            ) : (
              recentProvidencias.map((prov) => (
                <Link
                  key={prov.id}
                  href={`/admin/dashboard/gabinete/providencias/${prov.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500">
                        #{prov.numero_protocolo}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[prov.status]}`}>
                        {statusLabels[prov.status]}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prioridadeColors[prov.prioridade]}`}>
                        {prov.prioridade.charAt(0).toUpperCase() + prov.prioridade.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {prov.titulo}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      {prov.cidadao?.nome && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {prov.cidadao.nome}
                        </span>
                      )}
                      {prov.orgao_destino?.sigla && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                          </svg>
                          {prov.orgao_destino.sigla}
                        </span>
                      )}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
