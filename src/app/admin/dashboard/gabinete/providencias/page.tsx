'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { statusLabels, statusColors, prioridadeLabels, prioridadeColors } from '@/types/gabinete';

interface Providencia {
  id: string;
  numero_protocolo: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  created_at: string;
  cidadao?: { nome: string } | null;
  orgao_destino?: { nome: string; sigla: string } | null;
  categoria?: { nome: string; cor: string } | null;
}

const ITEMS_PER_PAGE = 10;

// Helper function para normalizar relações do Supabase (retorna primeiro item de array ou objeto)
function getFirst<T>(data: T | T[] | null | undefined): T | null {
  if (!data) return null;
  if (Array.isArray(data)) return data[0] || null;
  return data;
}

export default function ProvidenciasPage() {
  const { user } = useAuth();
  const [providencias, setProvidencias] = useState<Providencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [prioridadeFilter, setPrioridadeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProvidencias = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('agerji_providencias')
        .select(`
          id,
          numero_protocolo,
          titulo,
          descricao,
          status,
          prioridade,
          created_at,
          cidadao:agerji_cidadaos(nome),
          orgao_destino:agerji_orgaos(nome, sigla),
          categoria:agerji_categorias(nome, cor)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`titulo.ilike.%${search}%,numero_protocolo.ilike.%${search}%,descricao.ilike.%${search}%`);
      }

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      if (prioridadeFilter) {
        query = query.eq('prioridade', prioridadeFilter);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;
      
      // Normalizar os dados - usando any para evitar conflitos de tipo com Supabase
      const normalizedData: Providencia[] = (data || []).map((item) => ({
        id: item.id,
        numero_protocolo: item.numero_protocolo,
        titulo: item.titulo,
        descricao: item.descricao,
        status: item.status,
        prioridade: item.prioridade,
        created_at: item.created_at,
        cidadao: getFirst(item.cidadao),
        orgao_destino: getFirst(item.orgao_destino),
        categoria: getFirst(item.categoria),
      }));
      
      setProvidencias(normalizedData);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Erro ao buscar providências:', error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, prioridadeFilter, currentPage]);

  useEffect(() => {
    fetchProvidencias();
  }, [fetchProvidencias]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin/dashboard/gabinete"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Providências</h1>
                <p className="text-sm text-gray-500">
                  Gerencie todas as providências do gabinete
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/admin/dashboard/gabinete/providencias/nova"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Providência
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por título, protocolo ou descrição..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="em_analise">Em Análise</option>
              <option value="encaminhado">Encaminhado</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="arquivado">Arquivado</option>
            </select>
            <select
              value={prioridadeFilter}
              onChange={(e) => {
                setPrioridadeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todas as prioridades</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>

        {/* Contagem */}
        <p className="text-sm text-gray-500 mb-4">
          {totalCount} providência{totalCount !== 1 ? 's' : ''} encontrada{totalCount !== 1 ? 's' : ''}
        </p>

        {/* Lista */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : providencias.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma providência encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                {search || statusFilter || prioridadeFilter
                  ? 'Tente ajustar os filtros de busca'
                  : 'Cadastre a primeira providência do gabinete'}
              </p>
              {!search && !statusFilter && !prioridadeFilter && (
                <Link
                  href="/admin/dashboard/gabinete/providencias/nova"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Criar primeira providência
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {providencias.map((prov) => {
                const statusStyle = statusColors[prov.status] || { bg: '#f3f4f6', text: '#374151' };
                const prioridadeStyle = prioridadeColors[prov.prioridade] || { bg: '#f3f4f6', text: '#374151' };

                return (
                  <Link
                    key={prov.id}
                    href={`/admin/dashboard/gabinete/providencias/${prov.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium text-gray-500">
                          #{prov.numero_protocolo}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          {statusLabels[prov.status] || prov.status}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: prioridadeStyle.bg, color: prioridadeStyle.text }}
                        >
                          {prioridadeLabels[prov.prioridade] || prov.prioridade}
                        </span>
                        {prov.categoria && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${prov.categoria.cor}20`,
                              color: prov.categoria.cor,
                            }}
                          >
                            {prov.categoria.nome}
                          </span>
                        )}
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
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(prov.created_at)}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
