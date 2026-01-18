'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Mail, 
  ClipboardCheck, 
  Users, 
  Stamp,
  Scale,
  Download,
  Eye,
  Edit,
  Copy,
  ArrowLeft,
  X,
  Printer,
  Save
} from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_TEMPLATES } from '@/types/departments';

interface DocumentTemplate {
  id?: string;
  name: string;
  description: string | null;
  category: string;
  content: string;
  variables: string[] | null;
  icon: string | null;
}

const iconMap: Record<string, any> = {
  Mail: Mail,
  FileText: FileText,
  ClipboardCheck: ClipboardCheck,
  Users: Users,
  Stamp: Stamp,
  Scale: Scale
};

const categoryLabels: Record<string, string> = {
  oficio: 'Ofício',
  memorando: 'Memorando',
  parecer: 'Parecer Técnico',
  relatorio: 'Relatório',
  ata: 'Ata de Reunião',
  portaria: 'Portaria',
  resolucao: 'Resolução',
  outros: 'Outros'
};

export default function ModelosPage() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      // Se não houver templates do banco, usar os padrão
      setTemplates(data.length > 0 ? data : DEFAULT_TEMPLATES);
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      setTemplates(DEFAULT_TEMPLATES as DocumentTemplate[]);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    // Inicializar formData com valores vazios para cada variável
    const initialData: Record<string, string> = {};
    template.variables?.forEach(v => {
      if (v === 'data') {
        initialData[v] = new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      } else if (v === 'ano') {
        initialData[v] = new Date().getFullYear().toString();
      } else {
        initialData[v] = '';
      }
    });
    setFormData(initialData);
    setShowEditor(true);
  };

  const handlePreview = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const generateDocument = () => {
    if (!selectedTemplate) return;
    
    let content = selectedTemplate.content;
    Object.entries(formData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
    });
    setGeneratedContent(content);
  };

  const handlePrint = () => {
    generateDocument();
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (printWindow && printRef.current) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${selectedTemplate?.name || 'Documento'}</title>
              <style>
                body { font-family: 'Times New Roman', serif; margin: 2cm; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>${generatedContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }, 100);
  };

  const handleDownload = () => {
    generateDocument();
    setTimeout(() => {
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>${selectedTemplate?.name || 'Documento'}</title>
            <style>
              body { font-family: 'Times New Roman', serif; margin: 2cm; }
            </style>
          </head>
          <body>${generatedContent}</body>
        </html>
      `], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate?.name?.toLowerCase().replace(/\s+/g, '-') || 'documento'}-${new Date().toISOString().split('T')[0]}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }, 100);
  };

  const getIconComponent = (iconName: string | null) => {
    return iconMap[iconName || 'FileText'] || FileText;
  };

  const getVariableLabel = (variable: string): string => {
    const labels: Record<string, string> = {
      numero: 'Número do Documento',
      data: 'Data',
      ano: 'Ano',
      destinatario: 'Destinatário',
      cargo_destinatario: 'Cargo do Destinatário',
      assunto: 'Assunto',
      corpo: 'Corpo do Documento',
      remetente: 'Remetente',
      cargo_remetente: 'Cargo do Remetente',
      de: 'De',
      para: 'Para',
      processo: 'Número do Processo',
      interessado: 'Interessado',
      relato: 'Relatório',
      fundamentacao: 'Fundamentação',
      conclusao: 'Conclusão',
      tecnico: 'Nome do Técnico',
      cargo: 'Cargo',
      hora_inicio: 'Hora de Início',
      hora_fim: 'Hora de Término',
      local: 'Local',
      participantes: 'Participantes',
      pauta: 'Pauta',
      deliberacoes: 'Deliberações',
      secretario: 'Secretário(a)',
      ementa: 'Ementa',
      considerandos: 'Considerandos',
      resolve: 'Resolve',
      diretor: 'Nome do Diretor'
    };
    return labels[variable] || variable.charAt(0).toUpperCase() + variable.slice(1).replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link 
          href="/admin/dashboard" 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modelos de Documentos</h1>
          <p className="text-gray-600 text-sm">Utilize modelos prontos para criar documentos oficiais</p>
        </div>
      </div>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => {
          const IconComponent = getIconComponent(template.icon);
          return (
            <div 
              key={template.id || index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <IconComponent className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className="text-xs text-green-600 font-medium">
                    {categoryLabels[template.category] || template.category}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {template.description}
              </p>

              {template.variables && template.variables.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Campos editáveis:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 4).map((v) => (
                      <span 
                        key={v}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {getVariableLabel(v)}
                      </span>
                    ))}
                    {template.variables.length > 4 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        +{template.variables.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handlePreview(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </button>
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Usar Modelo
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Preview */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Visualização: {selectedTemplate.name}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div 
                className="bg-white p-8 shadow-lg mx-auto max-w-[21cm]"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
              />
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleUseTemplate(selectedTemplate);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Usar Este Modelo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editor */}
      {showEditor && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Editar: {selectedTemplate.name}
              </h3>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setFormData({});
                  setGeneratedContent('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex">
              {/* Formulário */}
              <div className="w-1/3 border-r overflow-auto p-4">
                <h4 className="font-medium text-gray-900 mb-4">Preencha os campos:</h4>
                <div className="space-y-4">
                  {selectedTemplate.variables?.map((variable) => (
                    <div key={variable}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {getVariableLabel(variable)}
                      </label>
                      {['corpo', 'relato', 'fundamentacao', 'conclusao', 'considerandos', 'resolve', 'deliberacoes', 'pauta', 'participantes'].includes(variable) ? (
                        <textarea
                          value={formData[variable] || ''}
                          onChange={(e) => setFormData({ ...formData, [variable]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                          rows={4}
                          placeholder={`Digite ${getVariableLabel(variable).toLowerCase()}...`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData[variable] || ''}
                          onChange={(e) => setFormData({ ...formData, [variable]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                          placeholder={`Digite ${getVariableLabel(variable).toLowerCase()}...`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={generateDocument}
                  className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Gerar Prévia
                </button>
              </div>

              {/* Prévia */}
              <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <div 
                  ref={printRef}
                  className="bg-white p-8 shadow-lg mx-auto max-w-[21cm] min-h-[29.7cm]"
                  dangerouslySetInnerHTML={{ 
                    __html: generatedContent || selectedTemplate.content 
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => {
                  setShowEditor(false);
                  setFormData({});
                  setGeneratedContent('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar HTML
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
