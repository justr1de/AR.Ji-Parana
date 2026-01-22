'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Cidadao {
  id: string;
  nome: string;
}

interface Orgao {
  id: string;
  nome: string;
  sigla: string;
  esfera: string;
}

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

export default function NovaProvidenciaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cidadaos, setCidadaos] = useState<Cidadao[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    cidadao_id: '',
    orgao_destino_id: '',
    categoria_id: '',
    prioridade: 'media',
    localizacao_descricao: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [cidadaosRes, orgaosRes, categoriasRes] = await Promise.all([
        supabase.from('agerji_cidadaos').select('id, nome').order('nome'),
        supabase.from('agerji_orgaos').select('id, nome, sigla, esfera').eq('ativo', true).order('esfera').order('nome'),
        supabase.from('agerji_categorias').select('id, nome, cor').eq('ativo', true).order('nome'),
      ]);

      setCidadaos(cidadaosRes.data || []);
      setOrgaos(orgaosRes.data || []);
      setCategorias(categoriasRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  function generateProtocol() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `AGERJI-${year}${month}${day}-${random}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('agerji_providencias')
        .insert({
          numero_protocolo: generateProtocol(),
          titulo: formData.titulo,
          descricao: formData.descricao,
          cidadao_id: formData.cidadao_id || null,
          orgao_destino_id: formData.orgao_destino_id || null,
          categoria_id: formData.categoria_id || null,
          prioridade: formData.prioridade,
          status: 'pendente',
          localizacao_descricao: formData.localizacao_descricao || null,
        });

      if (error) throw error;

      router.push('/admin/dashboard/gabinete/providencias');
    } catch (error) {
      console.error('Erro ao criar providência:', error);
      alert('Erro ao criar providência. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Agrupar órgãos por esfera
  const orgaosPorEsfera = {
    municipal: orgaos.filter(o => o.esfera === 'municipal'),
    estadual: orgaos.filter(o => o.esfera === 'estadual'),
    federal: orgaos.filter(o => o.esfera === 'federal'),
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/admin/dashboard/gabinete/providencias"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Providência</h1>
            <p className="text-sm text-gray-500">
              Registre uma nova demanda ou solicitação
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da Providência *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Descreva brevemente a demanda"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Detalhada *
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva detalhadamente a solicitação, incluindo todas as informações relevantes"
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Cidadão e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidadão Solicitante
                </label>
                <select
                  value={formData.cidadao_id}
                  onChange={(e) => setFormData({ ...formData, cidadao_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione (opcional)</option>
                  {cidadaos.map((cidadao) => (
                    <option key={cidadao.id} value={cidadao.id}>
                      {cidadao.nome}
                    </option>
                  ))}
                </select>
                <Link
                  href="/admin/dashboard/gabinete/cidadaos/novo"
                  className="text-xs text-green-600 hover:text-green-700 mt-1 inline-block"
                >
                  + Cadastrar novo cidadão
                </Link>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione (opcional)</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Órgão Destino */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Órgão Destino
              </label>
              <select
                value={formData.orgao_destino_id}
                onChange={(e) => setFormData({ ...formData, orgao_destino_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecione (opcional)</option>
                {orgaosPorEsfera.municipal.length > 0 && (
                  <optgroup label="Municipal">
                    {orgaosPorEsfera.municipal.map((orgao) => (
                      <option key={orgao.id} value={orgao.id}>
                        {orgao.sigla ? `${orgao.sigla} - ${orgao.nome}` : orgao.nome}
                      </option>
                    ))}
                  </optgroup>
                )}
                {orgaosPorEsfera.estadual.length > 0 && (
                  <optgroup label="Estadual">
                    {orgaosPorEsfera.estadual.map((orgao) => (
                      <option key={orgao.id} value={orgao.id}>
                        {orgao.sigla ? `${orgao.sigla} - ${orgao.nome}` : orgao.nome}
                      </option>
                    ))}
                  </optgroup>
                )}
                {orgaosPorEsfera.federal.length > 0 && (
                  <optgroup label="Federal">
                    {orgaosPorEsfera.federal.map((orgao) => (
                      <option key={orgao.id} value={orgao.id}>
                        {orgao.sigla ? `${orgao.sigla} - ${orgao.nome}` : orgao.nome}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <Link
                href="/admin/dashboard/gabinete/orgaos/novo"
                className="text-xs text-green-600 hover:text-green-700 mt-1 inline-block"
              >
                + Cadastrar novo órgão
              </Link>
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'baixa', label: 'Baixa', color: 'bg-green-100 text-green-800 border-green-200' },
                  { value: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                  { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800 border-red-200' },
                ].map((prioridade) => (
                  <label
                    key={prioridade.value}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                      formData.prioridade === prioridade.value
                        ? prioridade.color + ' ring-2 ring-offset-1'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="prioridade"
                      value={prioridade.value}
                      checked={formData.prioridade === prioridade.value}
                      onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                      className="sr-only"
                    />
                    <span className="font-medium">{prioridade.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização / Endereço
              </label>
              <input
                type="text"
                value={formData.localizacao_descricao}
                onChange={(e) => setFormData({ ...formData, localizacao_descricao: e.target.value })}
                placeholder="Bairro, rua ou local específico (opcional)"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Link
              href="/admin/dashboard/gabinete/providencias"
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Criar Providência
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
