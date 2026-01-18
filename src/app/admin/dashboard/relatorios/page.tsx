'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  BarChart3, 
  Calendar, 
  Download, 
  RefreshCw,
  ArrowLeft,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
  Clock,
  Filter,
  Printer
} from 'lucide-react';
import Link from 'next/link';

interface Statistics {
  totals: {
    documents: number;
    news: number;
    events: number;
    departments: number;
  };
  documentsByDepartment: Record<string, number>;
  generatedAt: string;
}

interface ActivityReport {
  period: { start: string; end: string };
  news: any[];
  events: any[];
  documents: any[];
  summary: {
    totalNews: number;
    totalEvents: number;
    totalDocuments: number;
  };
  generatedAt: string;
}

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<'estatisticas' | 'atividades' | 'documentos' | 'auditoria'>('estatisticas');
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [activityReport, setActivityReport] = useState<ActivityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (activeTab === 'estatisticas') {
      fetchStatistics();
    } else if (activeTab === 'atividades') {
      fetchActivityReport();
    }
  }, [activeTab]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports?type=statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?type=activities&start_date=${startDate}&end_date=${endDate}`);
      const data = await response.json();
      setActivityReport(data);
    } catch (error) {
      console.error('Erro ao buscar relatório de atividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Exportar dados como JSON
    const data = activeTab === 'estatisticas' ? statistics : activityReport;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${activeTab}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'estatisticas', label: 'Estatísticas Gerais', icon: PieChart },
    { id: 'atividades', label: 'Relatório de Atividades', icon: TrendingUp },
    { id: 'documentos', label: 'Relatório de Documentos', icon: FileSpreadsheet },
    { id: 'auditoria', label: 'Auditoria', icon: Clock }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/dashboard" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 text-sm">Gere e visualize relatórios do sistema</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Estatísticas Gerais */}
          {activeTab === 'estatisticas' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Visão Geral do Sistema</h2>
                <button
                  onClick={fetchStatistics}
                  disabled={loading}
                  className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : statistics ? (
                <>
                  {/* Cards de Totais */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <span className="text-3xl font-bold text-blue-900">{statistics.totals.documents}</span>
                      </div>
                      <p className="text-blue-700 text-sm">Documentos</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <FileSpreadsheet className="w-8 h-8 text-green-600" />
                        <span className="text-3xl font-bold text-green-900">{statistics.totals.news}</span>
                      </div>
                      <p className="text-green-700 text-sm">Notícias</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-8 h-8 text-purple-600" />
                        <span className="text-3xl font-bold text-purple-900">{statistics.totals.events}</span>
                      </div>
                      <p className="text-purple-700 text-sm">Eventos</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="w-8 h-8 text-orange-600" />
                        <span className="text-3xl font-bold text-orange-900">{statistics.totals.departments}</span>
                      </div>
                      <p className="text-orange-700 text-sm">Departamentos</p>
                    </div>
                  </div>

                  {/* Documentos por Departamento */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Documentos por Departamento</h3>
                    {Object.keys(statistics.documentsByDepartment).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(statistics.documentsByDepartment).map(([dept, count]) => (
                          <div key={dept} className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 w-40 truncate">{dept}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                              <div 
                                className="bg-green-500 h-4 rounded-full transition-all"
                                style={{ 
                                  width: `${Math.min((count / Math.max(...Object.values(statistics.documentsByDepartment))) * 100, 100)}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-10 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Nenhum documento cadastrado nos departamentos</p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Gerado em: {formatDate(statistics.generatedAt)}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 text-center py-12">Erro ao carregar estatísticas</p>
              )}
            </div>
          )}

          {/* Relatório de Atividades */}
          {activeTab === 'atividades' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Atividades do Período</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">De:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Até:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <button
                    onClick={fetchActivityReport}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    Filtrar
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : activityReport ? (
                <>
                  {/* Resumo */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-blue-900">{activityReport.summary.totalNews}</span>
                      <p className="text-blue-700 text-sm">Notícias</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-purple-900">{activityReport.summary.totalEvents}</span>
                      <p className="text-purple-700 text-sm">Eventos</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-green-900">{activityReport.summary.totalDocuments}</span>
                      <p className="text-green-700 text-sm">Documentos</p>
                    </div>
                  </div>

                  {/* Listas */}
                  <div className="space-y-6">
                    {activityReport.news.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Notícias Publicadas</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-left py-2 px-4">Título</th>
                                <th className="text-left py-2 px-4">Categoria</th>
                                <th className="text-left py-2 px-4">Data</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activityReport.news.map((item: any) => (
                                <tr key={item.id} className="border-t border-gray-200">
                                  <td className="py-2 px-4">{item.title}</td>
                                  <td className="py-2 px-4">{item.category}</td>
                                  <td className="py-2 px-4">{formatDate(item.created_at)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activityReport.events.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Eventos Realizados</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-left py-2 px-4">Título</th>
                                <th className="text-left py-2 px-4">Tipo</th>
                                <th className="text-left py-2 px-4">Data</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activityReport.events.map((item: any) => (
                                <tr key={item.id} className="border-t border-gray-200">
                                  <td className="py-2 px-4">{item.title}</td>
                                  <td className="py-2 px-4">{item.event_type}</td>
                                  <td className="py-2 px-4">{formatDate(item.start_date)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activityReport.documents.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Documentos Publicados</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-left py-2 px-4">Título</th>
                                <th className="text-left py-2 px-4">Categoria</th>
                                <th className="text-left py-2 px-4">Data</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activityReport.documents.map((item: any) => (
                                <tr key={item.id} className="border-t border-gray-200">
                                  <td className="py-2 px-4">{item.title}</td>
                                  <td className="py-2 px-4">{item.category}</td>
                                  <td className="py-2 px-4">{formatDate(item.created_at)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activityReport.news.length === 0 && activityReport.events.length === 0 && activityReport.documents.length === 0 && (
                      <p className="text-gray-500 text-center py-8">Nenhuma atividade encontrada no período selecionado</p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Gerado em: {formatDate(activityReport.generatedAt)}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 text-center py-12">Selecione um período e clique em Filtrar</p>
              )}
            </div>
          )}

          {/* Relatório de Documentos */}
          {activeTab === 'documentos' && (
            <div className="text-center py-12">
              <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Relatório de Documentos</h3>
              <p className="text-gray-500 mb-4">
                Gere relatórios detalhados sobre os documentos armazenados no sistema
              </p>
              <Link
                href="/admin/dashboard/departamentos"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FileText className="w-4 h-4" />
                Ir para Departamentos
              </Link>
            </div>
          )}

          {/* Auditoria */}
          {activeTab === 'auditoria' && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios de Auditoria</h3>
              <p className="text-gray-500 mb-4">
                Os relatórios de auditoria estão em desenvolvimento e serão disponibilizados em breve.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-yellow-800 text-sm">
                  <strong>Em preparação:</strong> Registro de acessos, alterações em documentos e conformidade LGPD.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
