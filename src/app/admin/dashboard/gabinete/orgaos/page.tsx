'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { Orgao } from '@/types/gabinete';
import { tipoOrgaoLabels, esferaLabels, esferaColors } from '@/types/gabinete';

export default function OrgaosPage() {
  const { user } = useAuth();
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [esferaFilter, setEsferaFilter] = useState('');

  useEffect(() => {
    fetchOrgaos();
  }, [search, esferaFilter]);

  async function fetchOrgaos() {
    setLoading(true);
    try {
      let query = supabase
        .from('agerji_orgaos')
        .select('*')
        .order('esfera')
        .order('nome');

      if (search) {
        query = query.or(`nome.ilike.%${search}%,sigla.ilike.%${search}%`);
      }

      if (esferaFilter) {
        query = query.eq('esfera', esferaFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrgaos(data || []);
    } catch (error) {
      console.error('Erro ao buscar órgãos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este órgão?')) return;

    try {
      const { error } = await supabase
        .from('agerji_orgaos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchOrgaos();
    } catch (error) {
      console.error('Erro ao excluir órgão:', error);
      alert('Erro ao excluir órgão. Verifique se não há providências vinculadas.');
    }
  }

  // Agrupar órgãos por esfera
  const orgaosPorEsfera = {
    municipal: orgaos.filter(o => o.esfera === 'municipal'),
    estadual: orgaos.filter(o => o.esfera === 'estadual'),
    federal: orgaos.filter(o => o.esfera === 'federal'),
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
              <div className="p-2 bg-amber-100 rounded-lg">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Órgãos</h1>
                <p className="text-sm text-gray-500">
                  Órgãos destinatários das providências
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/admin/dashboard/gabinete/orgaos/novo"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Órgão
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
                placeholder="Buscar por nome ou sigla..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={esferaFilter}
              onChange={(e) => setEsferaFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todas as esferas</option>
              <option value="municipal">Municipal</option>
              <option value="estadual">Estadual</option>
              <option value="federal">Federal</option>
            </select>
          </div>
        </div>

        {/* Contagem */}
        <p className="text-sm text-gray-500 mb-4">
          {orgaos.length} órgão{orgaos.length !== 1 ? 's' : ''} cadastrado{orgaos.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : orgaos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum órgão cadastrado
            </h3>
            <p className="text-gray-500 mb-4">
              Cadastre os órgãos para encaminhar providências
            </p>
            <Link
              href="/admin/dashboard/gabinete/orgaos/novo"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Cadastrar primeiro órgão
            </Link>
          </div>
        ) : esferaFilter ? (
          // Lista simples quando há filtro
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {orgaos.map((orgao) => (
                <OrgaoCard key={orgao.id} orgao={orgao} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        ) : (
          // Lista agrupada por esfera
          <div className="space-y-6">
            {/* Municipais */}
            {orgaosPorEsfera.municipal.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Municipal
                  </span>
                  <span className="text-sm text-gray-500">
                    {orgaosPorEsfera.municipal.length} órgão{orgaosPorEsfera.municipal.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {orgaosPorEsfera.municipal.map((orgao) => (
                      <OrgaoCard key={orgao.id} orgao={orgao} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Estaduais */}
            {orgaosPorEsfera.estadual.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Estadual
                  </span>
                  <span className="text-sm text-gray-500">
                    {orgaosPorEsfera.estadual.length} órgão{orgaosPorEsfera.estadual.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {orgaosPorEsfera.estadual.map((orgao) => (
                      <OrgaoCard key={orgao.id} orgao={orgao} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Federais */}
            {orgaosPorEsfera.federal.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Federal
                  </span>
                  <span className="text-sm text-gray-500">
                    {orgaosPorEsfera.federal.length} órgão{orgaosPorEsfera.federal.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {orgaosPorEsfera.federal.map((orgao) => (
                      <OrgaoCard key={orgao.id} orgao={orgao} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OrgaoCard({ orgao, onDelete }: { orgao: Orgao; onDelete: (id: string) => void }) {
  const esferaColor = esferaColors[orgao.esfera] || { bg: '#f3f4f6', text: '#374151' };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900">{orgao.nome}</h3>
            {orgao.sigla && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                {orgao.sigla}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">
            {tipoOrgaoLabels[orgao.tipo] || orgao.tipo}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {orgao.email && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {orgao.email}
              </span>
            )}
            {orgao.telefone && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {orgao.telefone}
              </span>
            )}
            {orgao.responsavel && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {orgao.responsavel}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/dashboard/gabinete/orgaos/${orgao.id}`}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Link>
          <button
            onClick={() => onDelete(orgao.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
