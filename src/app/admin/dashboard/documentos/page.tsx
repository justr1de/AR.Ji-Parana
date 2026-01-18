'use client';

import { useEffect, useState } from 'react';
import { supabase, Document } from '@/lib/supabase';
import Link from 'next/link';

const categoryLabels: Record<string, string> = {
  lei: 'Lei',
  resolucao: 'Resolução',
  relatorio: 'Relatório',
  audiencia: 'Audiência',
  outros: 'Outros',
};

const categoryColors: Record<string, string> = {
  lei: 'bg-blue-100 text-blue-800',
  resolucao: 'bg-purple-100 text-purple-800',
  relatorio: 'bg-green-100 text-green-800',
  audiencia: 'bg-yellow-100 text-yellow-800',
  outros: 'bg-gray-100 text-gray-800',
};

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  async function fetchDocuments() {
    setLoading(true);
    try {
      let query = supabase.from('documents').select('*').order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      alert('Erro ao excluir documento');
    }
  }

  async function togglePublished(id: string, published: boolean) {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ published: !published })
        .eq('id', id);
      
      if (error) throw error;
      setDocuments(documents.map((doc) => 
        doc.id === id ? { ...doc, published: !published } : doc
      ));
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Documentos</h1>
          <p className="text-gray-600 mt-2">Gerencie os documentos da AGERJI</p>
        </div>
        <Link
          href="/admin/dashboard/documentos/novo"
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Documento
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando documentos...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">Nenhum documento encontrado</p>
            <Link
              href="/admin/dashboard/documentos/novo"
              className="inline-block mt-4 text-green-700 hover:text-green-800 font-medium"
            >
              Adicionar primeiro documento
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Título</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Categoria</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Data</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{doc.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{doc.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[doc.category]}`}>
                      {categoryLabels[doc.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublished(doc.id, doc.published)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {doc.published ? 'Publicado' : 'Rascunho'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                      <Link
                        href={`/admin/dashboard/documentos/${doc.id}`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
