'use client';

import { useEffect, useState } from 'react';
import { supabase, News } from '@/lib/supabase';
import Link from 'next/link';

const categoryLabels: Record<string, string> = {
  noticia: 'Notícia',
  publicacao: 'Publicação',
  resolucao: 'Resolução',
  aviso: 'Aviso',
};

const categoryColors: Record<string, string> = {
  noticia: 'bg-blue-100 text-blue-800',
  publicacao: 'bg-purple-100 text-purple-800',
  resolucao: 'bg-green-100 text-green-800',
  aviso: 'bg-yellow-100 text-yellow-800',
};

export default function NoticiasPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchNews();
  }, [filter]);

  async function fetchNews() {
    setLoading(true);
    try {
      let query = supabase.from('news').select('*').order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;

    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      setNews(news.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
      alert('Erro ao excluir notícia');
    }
  }

  async function togglePublished(id: string, published: boolean) {
    try {
      const updateData: any = { published: !published };
      if (!published) {
        updateData.published_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      setNews(news.map((item) => 
        item.id === id ? { ...item, published: !published, published_at: !published ? new Date().toISOString() : item.published_at } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar notícia:', error);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notícias</h1>
          <p className="text-gray-600 mt-2">Gerencie as notícias e publicações da AGERJI</p>
        </div>
        <Link
          href="/admin/dashboard/noticias/nova"
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Notícia
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
            Todas
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

      {/* Lista de notícias */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando notícias...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-gray-500">Nenhuma notícia encontrada</p>
            <Link
              href="/admin/dashboard/noticias/nova"
              className="inline-block mt-4 text-green-700 hover:text-green-800 font-medium"
            >
              Criar primeira notícia
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {news.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]}`}>
                        {categoryLabels[item.category]}
                      </span>
                      <button
                        onClick={() => togglePublished(item.id, item.published)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.published ? 'Publicado' : 'Rascunho'}
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                    {item.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">{item.excerpt}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      Criado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      {item.published_at && ` • Publicado em ${new Date(item.published_at).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/dashboard/noticias/${item.id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
