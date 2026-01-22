'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { statusLabels, statusColors, prioridadeLabels, prioridadeColors } from '@/types/gabinete';

interface Providencia {
  id: string;
  numero_protocolo: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  localizacao_descricao: string | null;
  observacoes_internas: string | null;
  data_limite: string | null;
  data_conclusao: string | null;
  created_at: string;
  updated_at: string;
  cidadao?: { id: string; nome: string; telefone: string; celular: string; email: string };
  orgao_destino?: { id: string; nome: string; sigla: string; esfera: string };
  categoria?: { id: string; nome: string; cor: string };
}

interface Historico {
  id: string;
  status_anterior: string | null;
  status_novo: string | null;
  descricao: string | null;
  created_at: string;
}

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

export default function ProvidenciaDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [providencia, setProvidencia] = useState<Providencia | null>(null);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [cidadaos, setCidadaos] = useState<Cidadao[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    status: '',
    prioridade: '',
    cidadao_id: '',
    orgao_destino_id: '',
    categoria_id: '',
    localizacao_descricao: '',
    observacoes_internas: '',
    data_limite: '',
  });

  useEffect(() => {
    fetchProvidencia();
    fetchHistorico();
    fetchSelectData();
  }, [id]);

  async function fetchProvidencia() {
    try {
      const { data, error } = await supabase
        .from('agerji_providencias')
        .select(`
          *,
          cidadao:agerji_cidadaos(id, nome, telefone, celular, email),
          orgao_destino:agerji_orgaos(id, nome, sigla, esfera),
          categoria:agerji_categorias(id, nome, cor)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProvidencia(data);
      setFormData({
        titulo: data.titulo || '',
        descricao: data.descricao || '',
        status: data.status || '',
        prioridade: data.prioridade || '',
        cidadao_id: data.cidadao?.id || '',
        orgao_destino_id: data.orgao_destino?.id || '',
        categoria_id: data.categoria?.id || '',
        localizacao_descricao: data.localizacao_descricao || '',
        observacoes_internas: data.observacoes_internas || '',
        data_limite: data.data_limite || '',
      });
    } catch (error) {
      console.error('Erro ao buscar providência:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistorico() {
    try {
      const { data, error } = await supabase
        .from('agerji_providencias_historico')
        .select('*')
        .eq('providencia_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistorico(data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  }

  async function fetchSelectData() {
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

  async function handleSave() {
    setSaving(true);
    try {
      const statusAnterior = providencia?.status;
      const statusNovo = formData.status;

      const { error } = await supabase
        .from('agerji_providencias')
        .update({
          titulo: formData.titulo,
          descricao: formData.descricao,
          status: formData.status,
          prioridade: formData.prioridade,
          cidadao_id: formData.cidadao_id || null,
          orgao_destino_id: formData.orgao_destino_id || null,
          categoria_id: formData.categoria_id || null,
          localizacao_descricao: formData.localizacao_descricao || null,
          observacoes_internas: formData.observacoes_internas || null,
          data_limite: formData.data_limite || null,
          data_conclusao: formData.status === 'concluido' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;

      // Registrar no histórico se o status mudou
      if (statusAnterior !== statusNovo) {
        await supabase.from('agerji_providencias_historico').insert({
          providencia_id: id,
          status_anterior: statusAnterior,
          status_novo: statusNovo,
          descricao: `Status alterado de "${statusLabels[statusAnterior || ''] || statusAnterior}" para "${statusLabels[statusNovo] || statusNovo}"`,
        });
      }

      setEditMode(false);
      fetchProvidencia();
      fetchHistorico();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar providência. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir esta providência? Esta ação não pode ser desfeita.')) return;

    try {
      const { error } = await supabase
        .from('agerji_providencias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      router.push('/admin/dashboard/gabinete/providencias');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir providência.');
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Agrupar órgãos por esfera
  const orgaosPorEsfera = {
    municipal: orgaos.filter(o => o.esfera === 'municipal'),
    estadual: orgaos.filter(o => o.esfera === 'estadual'),
    federal: orgaos.filter(o => o.esfera === 'federal'),
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!providencia) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Providência não encontrada</h2>
          <Link href="/admin/dashboard/gabinete/providencias" className="text-green-600 hover:underline">
            Voltar para lista
          </Link>
        </div>
      </div>
    );
  }

  const statusStyle = statusColors[providencia.status] || { bg: '#f3f4f6', text: '#374151' };
  const prioridadeStyle = prioridadeColors[providencia.prioridade] || { bg: '#f3f4f6', text: '#374151' };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard/gabinete/providencias"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500">#{providencia.numero_protocolo}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                >
                  {statusLabels[providencia.status] || providencia.status}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: prioridadeStyle.bg, color: prioridadeStyle.text }}
                >
                  {prioridadeLabels[providencia.prioridade] || providencia.prioridade}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{providencia.titulo}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Descrição
              </h3>
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
                    placeholder="Título"
                  />
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Descrição detalhada"
                  />
                </>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{providencia.descricao}</p>
              )}
            </div>

            {/* Observações Internas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Observações Internas
              </h3>
              {editMode ? (
                <textarea
                  value={formData.observacoes_internas}
                  onChange={(e) => setFormData({ ...formData, observacoes_internas: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Notas internas (não visíveis ao cidadão)"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {providencia.observacoes_internas || 'Nenhuma observação registrada.'}
                </p>
              )}
            </div>

            {/* Histórico */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Histórico
              </h3>
              {historico.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma alteração registrada.</p>
              ) : (
                <div className="space-y-4">
                  {historico.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-700">{item.descricao}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(item.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Status e Prioridade */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Status
              </h3>
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_analise">Em Análise</option>
                      <option value="encaminhado">Encaminhado</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                      <option value="arquivado">Arquivado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Prioridade</label>
                    <select
                      value={formData.prioridade}
                      onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Data Limite</label>
                    <input
                      type="date"
                      value={formData.data_limite}
                      onChange={(e) => setFormData({ ...formData, data_limite: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Status</span>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {statusLabels[providencia.status] || providencia.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Prioridade</span>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: prioridadeStyle.bg, color: prioridadeStyle.text }}
                    >
                      {prioridadeLabels[providencia.prioridade] || providencia.prioridade}
                    </span>
                  </div>
                  {providencia.data_limite && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Data Limite</span>
                      <span className="text-sm text-gray-900">
                        {new Date(providencia.data_limite).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Órgão Destino */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Órgão Destino
              </h3>
              {editMode ? (
                <select
                  value={formData.orgao_destino_id}
                  onChange={(e) => setFormData({ ...formData, orgao_destino_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="">Selecione</option>
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
              ) : providencia.orgao_destino ? (
                <div>
                  <p className="font-medium text-gray-900">
                    {providencia.orgao_destino.sigla && `${providencia.orgao_destino.sigla} - `}
                    {providencia.orgao_destino.nome}
                  </p>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {providencia.orgao_destino.esfera}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Não definido</p>
              )}
            </div>

            {/* Cidadão */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Cidadão
              </h3>
              {editMode ? (
                <select
                  value={formData.cidadao_id}
                  onChange={(e) => setFormData({ ...formData, cidadao_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="">Selecione</option>
                  {cidadaos.map((cidadao) => (
                    <option key={cidadao.id} value={cidadao.id}>
                      {cidadao.nome}
                    </option>
                  ))}
                </select>
              ) : providencia.cidadao ? (
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{providencia.cidadao.nome}</p>
                  {(providencia.cidadao.celular || providencia.cidadao.telefone) && (
                    <p className="text-sm text-gray-500">
                      {providencia.cidadao.celular || providencia.cidadao.telefone}
                    </p>
                  )}
                  {providencia.cidadao.email && (
                    <p className="text-sm text-gray-500">{providencia.cidadao.email}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Não identificado</p>
              )}
            </div>

            {/* Categoria */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Categoria
              </h3>
              {editMode ? (
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="">Selecione</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              ) : providencia.categoria ? (
                <span
                  className="inline-flex px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${providencia.categoria.cor}20`,
                    color: providencia.categoria.cor,
                  }}
                >
                  {providencia.categoria.nome}
                </span>
              ) : (
                <p className="text-gray-500 text-sm">Não categorizada</p>
              )}
            </div>

            {/* Datas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Informações
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Criado em</span>
                  <span className="text-gray-900">{formatDate(providencia.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Atualizado em</span>
                  <span className="text-gray-900">{formatDate(providencia.updated_at)}</span>
                </div>
                {providencia.data_conclusao && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Concluído em</span>
                    <span className="text-gray-900">{formatDate(providencia.data_conclusao)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
