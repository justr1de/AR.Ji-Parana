'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  FolderPlus, 
  FileText, 
  Upload, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Eye,
  Building2,
  Briefcase,
  MessageSquare,
  ChevronRight,
  X,
  Plus,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface Department {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  parent_id: string | null;
  order_index: number;
  created_at: string;
}

interface DepartmentDocument {
  id: string;
  department_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  tags: string[] | null;
  created_at: string;
  departments?: {
    id: string;
    name: string;
    color: string;
  };
}

const iconMap: Record<string, any> = {
  Building2: Building2,
  FileText: FileText,
  Briefcase: Briefcase,
  MessageSquare: MessageSquare,
  Folder: Folder
};

export default function DepartamentosPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [documents, setDocuments] = useState<DepartmentDocument[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewDeptModal, setShowNewDeptModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDescription, setNewDeptDescription] = useState('');
  const [newDeptColor, setNewDeptColor] = useState('#6b7280');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchDocuments(selectedDepartment.id);
    } else {
      fetchDocuments();
    }
  }, [selectedDepartment, searchTerm]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (departmentId?: string) => {
    try {
      let url = '/api/department-documents';
      const params = new URLSearchParams();
      if (departmentId) params.append('department_id', departmentId);
      if (searchTerm) params.append('search', searchTerm);
      if (params.toString()) url += '?' + params.toString();

      const response = await fetch(url);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDeptName.trim()) return;

    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDeptName,
          description: newDeptDescription,
          color: newDeptColor,
          icon: 'Folder'
        })
      });

      if (response.ok) {
        await fetchDepartments();
        setShowNewDeptModal(false);
        setNewDeptName('');
        setNewDeptDescription('');
        setNewDeptColor('#6b7280');
      }
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDept || !newDeptName.trim()) return;

    try {
      const response = await fetch('/api/departments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDept.id,
          name: newDeptName,
          description: newDeptDescription,
          color: newDeptColor
        })
      });

      if (response.ok) {
        await fetchDepartments();
        setShowEditModal(false);
        setEditingDept(null);
        setNewDeptName('');
        setNewDeptDescription('');
        setNewDeptColor('#6b7280');
      }
    } catch (error) {
      console.error('Erro ao atualizar departamento:', error);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este departamento?')) return;

    try {
      const response = await fetch(`/api/departments?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchDepartments();
        if (selectedDepartment?.id === id) {
          setSelectedDepartment(null);
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao excluir departamento');
      }
    } catch (error) {
      console.error('Erro ao excluir departamento:', error);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadFile || !uploadTitle.trim() || !selectedDepartment) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('department_id', selectedDepartment.id);
      formData.append('title', uploadTitle);
      formData.append('description', uploadDescription);

      const response = await fetch('/api/department-documents', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        await fetchDocuments(selectedDepartment.id);
        setShowUploadModal(false);
        setUploadTitle('');
        setUploadDescription('');
        setUploadFile(null);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      const response = await fetch(`/api/department-documents?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchDocuments(selectedDepartment?.id);
      }
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '-';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getIconComponent = (iconName: string | null) => {
    const IconComponent = iconMap[iconName || 'Folder'] || Folder;
    return IconComponent;
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setNewDeptName(dept.name);
    setNewDeptDescription(dept.description || '');
    setNewDeptColor(dept.color || '#6b7280');
    setShowEditModal(true);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/dashboard" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departamentos</h1>
            <p className="text-gray-600 text-sm">Gerencie os departamentos e documentos da AGERJI</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewDeptModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FolderPlus className="w-5 h-5" />
          Novo Departamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de Departamentos */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 text-green-600" />
            Departamentos
          </h2>
          
          <div className="space-y-2">
            <button
              onClick={() => setSelectedDepartment(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                !selectedDepartment ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Todos os Documentos</span>
            </button>

            {departments.map((dept) => {
              const IconComponent = getIconComponent(dept.icon);
              return (
                <div key={dept.id} className="group relative">
                  <button
                    onClick={() => setSelectedDepartment(dept)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedDepartment?.id === dept.id 
                        ? 'bg-green-50 text-green-700' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <IconComponent 
                      className="w-4 h-4" 
                      style={{ color: dept.color || '#6b7280' }} 
                    />
                    <span className="truncate flex-1">{dept.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                  
                  {/* Menu de ações */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(dept);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Edit className="w-3 h-3 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDepartment(dept.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista de Documentos */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              {selectedDepartment ? `Documentos - ${selectedDepartment.name}` : 'Todos os Documentos'}
            </h2>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              {selectedDepartment && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              )}
            </div>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {selectedDepartment 
                  ? 'Nenhum documento neste departamento' 
                  : 'Selecione um departamento para ver os documentos'}
              </p>
              {selectedDepartment && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium"
                >
                  Fazer upload do primeiro documento
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Documento</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 hidden sm:table-cell">Departamento</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 hidden md:table-cell">Tamanho</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 hidden lg:table-cell">Data</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{doc.title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{doc.file_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${doc.departments?.color}20`,
                            color: doc.departments?.color 
                          }}
                        >
                          {doc.departments?.name || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">
                        {formatFileSize(doc.file_size)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 hidden lg:table-cell">
                        {formatDate(doc.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </a>
                          <a
                            href={doc.file_url}
                            download={doc.file_name}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4 text-gray-600" />
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Departamento */}
      {showNewDeptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Novo Departamento</h3>
              <button
                onClick={() => setShowNewDeptModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Departamento *
                </label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Diretoria Financeira"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newDeptDescription}
                  onChange={(e) => setNewDeptDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  placeholder="Descrição do departamento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="color"
                  value={newDeptColor}
                  onChange={(e) => setNewDeptColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewDeptModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateDepartment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Criar Departamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Departamento */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Editar Departamento</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingDept(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Departamento *
                </label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newDeptDescription}
                  onChange={(e) => setNewDeptDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="color"
                  value={newDeptColor}
                  onChange={(e) => setNewDeptColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingDept(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateDepartment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Upload */}
      {showUploadModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upload de Documento</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Documento *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Relatório Mensal Janeiro 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={2}
                  placeholder="Descrição do documento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arquivo *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  {uploadFile ? (
                    <span className="text-sm text-green-600 font-medium">{uploadFile.name}</span>
                  ) : (
                    <span className="text-sm text-gray-500">Clique para selecionar um arquivo</span>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Departamento: <span className="font-medium">{selectedDepartment.name}</span>
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={uploading}
              >
                Cancelar
              </button>
              <button
                onClick={handleUploadDocument}
                disabled={!uploadFile || !uploadTitle.trim() || uploading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Fazer Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
