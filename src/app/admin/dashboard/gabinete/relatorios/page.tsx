'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  totalProvidencias: number;
  porStatus: Record<string, number>;
  porPrioridade: Record<string, number>;
  porEsfera: Record<string, number>;
  porMes: { mes: string; total: number }[];
  orgaosMaisAtivos: { nome: string; sigla: string; total: number }[];
}

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalProvidencias: 0,
    porStatus: {},
    porPrioridade: {},
    porEsfera: {},
    porMes: [],
    orgaosMaisAtivos: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      // Buscar todas as providências
      const { data: providencias } = await supabase
        .from('agerji_providencias')
        .select(`
          id,
          status,
          prioridade,
          created_at,
          orgao_destino:agerji_orgaos(nome, sigla, esfera)
        `);

      if (!providencias) {
        setLoading(false);
        return;
      }

      // Calcular estatísticas
      const porStatus: Record<string, number> = {};
      const porPrioridade: Record<string, number> = {};
      const porEsfera: Record<string, number> = {};
      const porMesMap: Record<string, number> = {};
      const orgaosCount: Record<string, { nome: string; sigla: string; total: number }> = {};

      providencias.forEach((prov: any) => {
        // Por status
        porStatus[prov.status] = (porStatus[prov.status] || 0) + 1;

        // Por prioridade
        porPrioridade[prov.prioridade] = (porPrioridade[prov.prioridade] || 0) + 1;

        // Por esfera
        if (prov.orgao_destino?.esfera) {
          porEsfera[prov.orgao_destino.esfera] = (porEsfera[prov.orgao_destino.esfera] || 0) + 1;
        }

        // Por mês
        const date = new Date(prov.created_at);
        const mesKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        porMesMap[mesKey] = (porMesMap[mesKey] || 0) + 1;

        // Por órgão
        if (prov.orgao_destino) {
          const key = prov.orgao_destino.nome;
          if (!orgaosCount[key]) {
            orgaosCount[key] = {
              nome: prov.orgao_destino.nome,
              sigla: prov.orgao_destino.sigla || '',
              total: 0,
            };
          }
          orgaosCount[key].total++;
        }
      });

      // Ordenar meses
      const porMes = Object.entries(porMesMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-6)
        .map(([mes, total]) => {
          const [year, month] = mes.split('-');
          const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          return {
            mes: `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`,
            total,
          };
        });

      // Top órgãos
      const orgaosMaisAtivos = Object.values(orgaosCount)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      setStats({
        totalProvidencias: providencias.length,
        porStatus,
        porPrioridade,
        porEsfera,
        porMes,
        orgaosMaisAtivos,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }

  const statusLabels: Record<string, string> = {
    pendente: 'Pendente',
    em_analise: 'Em Análise',
    encaminhado: 'Encaminhado',
    em_andamento: 'Em Andamento',
    concluido: 'Concluído',
    arquivado: 'Arquivado',
  };

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-500',
    em_analise: 'bg-blue-500',
    encaminhado: 'bg-indigo-500',
    em_andamento: 'bg-cyan-500',
    concluido: 'bg-green-500',
    arquivado: 'bg-gray-500',
  };

  const prioridadeLabels: Record<string, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
    urgente: 'Urgente',
  };

  const prioridadeColors: Record<string, string> = {
    baixa: 'bg-green-500',
    media: 'bg-yellow-500',
    alta: 'bg-orange-500',
    urgente: 'bg-red-500',
  };

  const esferaLabels: Record<string, string> = {
    municipal: 'Municipal',
    estadual: 'Estadual',
    federal: 'Federal',
  };

  const esferaColors: Record<string, string> = {
    municipal: 'bg-green-500',
    estadual: 'bg-blue-500',
    federal: 'bg-yellow-500',
  };

  const maxMes = Math.max(...stats.porMes.map(m => m.total), 1);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/admin/dashboard/gabinete"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-sm text-gray-500">
              Estatísticas e análises das providências
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Card Principal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-green-100 rounded-xl">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Providências</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProvidencias}</p>
                </div>
              </div>
            </div>

            {/* Grid de Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Por Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Status</h3>
                <div className="space-y-3">
                  {Object.entries(stats.porStatus).map(([status, count]) => (
                    <div key={status}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">{statusLabels[status] || status}</span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${statusColors[status] || 'bg-gray-500'} rounded-full transition-all`}
                          style={{ width: `${(count / stats.totalProvidencias) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {Object.keys(stats.porStatus).length === 0 && (
                    <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                  )}
                </div>
              </div>

              {/* Por Prioridade */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Prioridade</h3>
                <div className="space-y-3">
                  {Object.entries(stats.porPrioridade).map(([prioridade, count]) => (
                    <div key={prioridade}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">{prioridadeLabels[prioridade] || prioridade}</span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${prioridadeColors[prioridade] || 'bg-gray-500'} rounded-full transition-all`}
                          style={{ width: `${(count / stats.totalProvidencias) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {Object.keys(stats.porPrioridade).length === 0 && (
                    <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                  )}
                </div>
              </div>

              {/* Por Esfera */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Esfera</h3>
                <div className="space-y-3">
                  {Object.entries(stats.porEsfera).map(([esfera, count]) => (
                    <div key={esfera}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">{esferaLabels[esfera] || esfera}</span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${esferaColors[esfera] || 'bg-gray-500'} rounded-full transition-all`}
                          style={{ width: `${(count / stats.totalProvidencias) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {Object.keys(stats.porEsfera).length === 0 && (
                    <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                  )}
                </div>
              </div>

              {/* Órgãos Mais Ativos */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Órgãos Mais Ativos</h3>
                <div className="space-y-3">
                  {stats.orgaosMaisAtivos.map((orgao, index) => (
                    <div key={orgao.nome} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {orgao.sigla ? `${orgao.sigla} - ${orgao.nome}` : orgao.nome}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{orgao.total}</span>
                    </div>
                  ))}
                  {stats.orgaosMaisAtivos.length === 0 && (
                    <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                  )}
                </div>
              </div>
            </div>

            {/* Gráfico de Evolução Mensal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Mensal</h3>
              {stats.porMes.length > 0 ? (
                <div className="flex items-end gap-2 h-40">
                  {stats.porMes.map((item) => (
                    <div key={item.mes} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">{item.total}</span>
                      <div
                        className="w-full bg-green-500 rounded-t-lg transition-all"
                        style={{ height: `${(item.total / maxMes) * 100}%`, minHeight: '4px' }}
                      />
                      <span className="text-xs text-gray-500">{item.mes}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
