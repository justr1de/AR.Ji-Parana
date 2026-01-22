'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const tiposOrgao = [
  { value: 'prefeitura', label: 'Prefeitura Municipal', esfera: 'municipal' },
  { value: 'camara_municipal', label: 'Câmara Municipal', esfera: 'municipal' },
  { value: 'secretaria_municipal', label: 'Secretaria Municipal', esfera: 'municipal' },
  { value: 'autarquia_municipal', label: 'Autarquia Municipal', esfera: 'municipal' },
  { value: 'secretaria_estadual', label: 'Secretaria Estadual', esfera: 'estadual' },
  { value: 'autarquia_estadual', label: 'Autarquia Estadual', esfera: 'estadual' },
  { value: 'mp_estadual', label: 'Ministério Público Estadual', esfera: 'estadual' },
  { value: 'tribunal_justica', label: 'Tribunal de Justiça', esfera: 'estadual' },
  { value: 'tribunal_contas_estadual', label: 'Tribunal de Contas Estadual', esfera: 'estadual' },
  { value: 'defensoria', label: 'Defensoria Pública', esfera: 'estadual' },
  { value: 'autarquia_federal', label: 'Autarquia Federal', esfera: 'federal' },
  { value: 'mp_federal', label: 'Ministério Público Federal', esfera: 'federal' },
  { value: 'tribunal_contas_federal', label: 'Tribunal de Contas da União', esfera: 'federal' },
  { value: 'policia_federal', label: 'Polícia Federal', esfera: 'federal' },
  { value: 'outros', label: 'Outros', esfera: 'municipal' },
];

export default function EditarOrgaoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    tipo: '',
    esfera: 'municipal' as 'municipal' | 'estadual' | 'federal',
    email: '',
    telefone: '',
    endereco: '',
    responsavel: '',
    ativo: true,
  });

  useEffect(() => {
    fetchOrgao();
  }, [id]);

  async function fetchOrgao() {
    try {
      const { data, error } = await supabase
        .from('agerji_orgaos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setFormData({
        nome: data.nome || '',
        sigla: data.sigla || '',
        tipo: data.tipo || '',
        esfera: data.esfera || 'municipal',
        email: data.email || '',
        telefone: data.telefone || '',
        endereco: data.endereco || '',
        responsavel: data.responsavel || '',
        ativo: data.ativo ?? true,
      });
    } catch (error) {
      console.error('Erro ao buscar órgão:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleTipoChange = (tipo: string) => {
    const tipoInfo = tiposOrgao.find(t => t.value === tipo);
    setFormData({
      ...formData,
      tipo,
      esfera: (tipoInfo?.esfera as 'municipal' | 'estadual' | 'federal') || formData.esfera,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.tipo) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('agerji_orgaos')
        .update({
          nome: formData.nome,
          sigla: formData.sigla || null,
          tipo: formData.tipo,
          esfera: formData.esfera,
          email: formData.email || null,
          telefone: formData.telefone || null,
          endereco: formData.endereco || null,
          responsavel: formData.responsavel || null,
          ativo: formData.ativo,
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/dashboard/gabinete/orgaos');
    } catch (error) {
      console.error('Erro ao atualizar órgão:', error);
      alert('Erro ao atualizar órgão. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/admin/dashboard/gabinete/orgaos"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Órgão</h1>
            <p className="text-sm text-gray-500">
              Atualize as informações do órgão
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-6">
            {/* Nome e Sigla */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Órgão *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Secretaria Municipal de Saúde"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sigla
                </label>
                <input
                  type="text"
                  value={formData.sigla}
                  onChange={(e) => setFormData({ ...formData, sigla: e.target.value.toUpperCase() })}
                  placeholder="Ex: SEMUSA"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Órgão *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => handleTipoChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Selecione o tipo</option>
                <optgroup label="Municipal">
                  {tiposOrgao.filter(t => t.esfera === 'municipal').map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Estadual">
                  {tiposOrgao.filter(t => t.esfera === 'estadual').map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Federal">
                  {tiposOrgao.filter(t => t.esfera === 'federal').map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Esfera */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Esfera
              </label>
              <div className="flex gap-4">
                {['municipal', 'estadual', 'federal'].map((esfera) => (
                  <label
                    key={esfera}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                      formData.esfera === esfera
                        ? esfera === 'municipal'
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : esfera === 'estadual'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-yellow-50 border-yellow-500 text-yellow-700'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="esfera"
                      value={esfera}
                      checked={formData.esfera === esfera}
                      onChange={(e) => setFormData({ ...formData, esfera: e.target.value as 'municipal' | 'estadual' | 'federal' })}
                      className="sr-only"
                    />
                    <span className="capitalize font-medium">{esfera}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@orgao.gov.br"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(69) 3000-0000"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, número, bairro"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Responsável */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável
              </label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                placeholder="Nome do responsável ou secretário"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Ativo */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Órgão ativo</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-8">
                Órgãos inativos não aparecem nas opções de seleção
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Link
              href="/admin/dashboard/gabinete/orgaos"
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
