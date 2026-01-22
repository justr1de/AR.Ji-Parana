'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { Categoria } from '@/types/gabinete';

const coresPredefinidas = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#78716c', '#71717a',
];

export default function CategoriasPage() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#22c55e',
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agerji_categorias')
        .select('*')
        .order('nome');

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(categoria?: Categoria) {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nome: categoria.nome,
        descricao: categoria.descricao || '',
        cor: categoria.cor,
      });
    } else {
      setEditingCategoria(null);
      setFormData({
        nome: '',
        descricao: '',
        cor: '#22c55e',
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.nome) {
      alert('O nome é obrigatório');
      return;
    }

    try {
      if (editingCategoria) {
        const { error } = await supabase
          .from('agerji_categorias')
          .update({
            nome: formData.nome,
            descricao: formData.descricao || null,
            cor: formData.cor,
          })
          .eq('id', editingCategoria.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('agerji_categorias')
          .insert({
            nome: formData.nome,
            descricao: formData.descricao || null,
            cor: formData.cor,
            ativo: true,
          });

        if (error) throw error;
      }

      setShowModal(false);
      fetchCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria. Tente novamente.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('agerji_categorias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria. Verifique se não há providências vinculadas.');
    }
  }

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
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
                <p className="text-sm text-gray-500">
                  Categorias para classificar providências
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Categoria
          </button>
        </div>

        {/* Contagem */}
        <p className="text-sm text-gray-500 mb-4">
          {categorias.length} categoria{categorias.length !== 1 ? 's' : ''} cadastrada{categorias.length !== 1 ? 's' : ''}
        </p>

        {/* Lista */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : categorias.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma categoria cadastrada
              </h3>
              <p className="text-gray-500 mb-4">
                Crie categorias para organizar as providências
              </p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar primeira categoria
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                  style={{ borderLeftWidth: '4px', borderLeftColor: categoria.cor }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${categoria.cor}20` }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: categoria.cor }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{categoria.nome}</h3>
                        {categoria.descricao && (
                          <p className="text-sm text-gray-500 mt-1">{categoria.descricao}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal(categoria)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(categoria.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome da categoria"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição opcional"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <div className="flex flex-wrap gap-2">
                  {coresPredefinidas.map((cor) => (
                    <button
                      key={cor}
                      type="button"
                      onClick={() => setFormData({ ...formData, cor })}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        formData.cor === cor ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                      }`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
