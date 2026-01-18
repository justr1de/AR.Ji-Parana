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
  ChevronDown,
  X,
  Plus,
  ArrowLeft,
  FolderOpen,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  FileCheck,
  FolderTree
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

interface FolderType {
  id: string;
  department_id: string;
  parent_folder_id: string | null;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  created_at: string;
}

interface DepartmentDocument {
  id: string;
  department_id: string;
  folder_id: string | null;
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

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Building2: Building2,
  FileText: FileText,
  Briefcase: Briefcase,
  MessageSquare: MessageSquare,
  Folder: Folder
};

export default function DepartamentosPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [documents, setDocuments] = useState<DepartmentDocument[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewDeptModal, setShowNewDeptModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDescription, setNewDeptDescription] = useState('');
  const [newDeptColor, setNewDeptColor] = useState('#6b7280');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#6B7280');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalFolders: 0,
    recentDocuments: 0,
    documentsByDept: [] as { name: string; count: number; color: string }[]
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchFolders(selectedDepartment.id);
      fetchDocuments(selectedDepartment.id, selectedFolder?.id);
    } else {
      setFolders([]);
      fetchDocuments();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDepartment) {
      fetchDocuments(selectedDepartment.id, selectedFolder?.id);
    }
  }, [selectedFolder, searchTerm]);

  useEffect(() => {
    calculateStats();
  }, [documents, folders, departments]);

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

  const fetchFolders = async (departmentId: string, parentFolderId?: string | null) => {
    try {
      let url = `/api/folders?department_id=${departmentId}`;
      if (parentFolderId !== undefined) {
        url += `&parent_folder_id=${parentFolderId || 'null'}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error('Erro ao buscar pastas:', error);
    }
  };

  const fetchDocuments = async (departmentId?: string, folderId?: string | null) => {
    try {
      let url = '/api/department-documents';
      const params = new URLSearchParams();
      if (departmentId) params.append('department_id', departmentId);
      if (folderId) params.append('folder_id', folderId);
      if (searchTerm) params.append('search', searchTerm);
      if (params.toString()) url += '?' + params.toString();

      const response = await fetch(url);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  const calculateStats = () => {
    const totalDocuments = documents.length;
    const totalFolders = folders.length;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentDocuments = documents.filter(d => new Date(d.created_at) > oneWeekAgo).length;

    const deptCounts: Record<string, { count: number; color: string }> = {};
    documents.forEach(doc => {
      const deptName = doc.departments?.name || 'Sem departamento';
      const deptColor = doc.departments?.color || '#6B7280';
      if (!deptCounts[deptName]) {
        deptCounts[deptName] = { count: 0, color: deptColor };
      }
      deptCounts[deptName].count++;
    });

    const documentsByDept = Object.entries(deptCounts).map(([name, data]) => ({
      name,
      count: data.count,
      color: data.color
    }));

    setStats({ totalDocuments, totalFolders, recentDocuments, documentsByDept });
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

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !selectedDepartment) return;

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department_id: selectedDepartment.id,
          parent_folder_id: selectedFolder?.id || null,
          name: newFolderName,
          description: newFolderDescription,
          color: newFolderColor
        })
      });

      if (response.ok) {
        await fetchFolders(selectedDepartment.id);
        setShowNewFolderModal(false);
        setNewFolderName('');
        setNewFolderDescription('');
        setNewFolderColor('#6B7280');
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao criar pasta');
      }
    } catch (error) {
      console.error('Erro ao criar pasta:', error);
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

  const handleDeleteFolder = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pasta?')) return;

    try {
      const response = await fetch(`/api/folders?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (selectedDepartment) {
          await fetchFolders(selectedDepartment.id);
        }
        if (selectedFolder?.id === id) {
          setSelectedFolder(null);
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao excluir pasta');
      }
    } catch (error) {
      console.error('Erro ao excluir pasta:', error);
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
      if (selectedFolder) {
        formData.append('folder_id', selectedFolder.id);
      }

      const response = await fetch('/api/department-documents', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        await fetchDocuments(selectedDepartment.id, selectedFolder?.id);
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
        await fetchDocuments(selectedDepartment?.id, selectedFolder?.id);
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

  const toggleFolderExpand = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (parentId: string | null = null, level: number = 0) => {
    const childFolders = folders.filter(f => f.parent_folder_id === parentId);
    
    return childFolders.map(folder => (
      <div key={folder.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            selectedFolder?.id === folder.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <button
            onClick={() => toggleFolderExpand(folder.id)}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {expandedFolders.has(folder.id) ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setSelectedFolder(folder)}
            className="flex-1 flex items-center gap-2 text-left"
          >
            <FolderOpen className="w-4 h-4" style={{ color: folder.color || '#6B7280' }} />
            <span className="text-sm truncate">{folder.name}</span>
          </button>
          <button
            onClick={() => handleDeleteFolder(folder.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        {expandedFolders.has(folder.id) && renderFolderTree(folder.id, level + 1)}
      </div>
    ));
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
        {/* Lista de Departamentos e Pastas */}
        <div className="lg:col-span-1 space-y-4">
          {/* Departamentos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-green-600" />
              Departamentos
            </h2>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedDepartment(null);
                  setSelectedFolder(null);
                }}
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
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setSelectedFolder(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        selectedDepartment?.id === dept.id ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div style={{ color: dept.color || '#6B7280' }}><IconComponent className="w-4 h-4" /></div>
                      <span className="flex-1 truncate">{dept.name}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1">
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

          {/* Pastas do Departamento Selecionado */}
          {selectedDepartment && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-blue-600" />
                  Pastas
                </h2>
                <button
                  onClick={() => setShowNewFolderModal(true)}
                  className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"
                  title="Nova Pasta"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    !selectedFolder ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  <span className="text-sm">Raiz do Departamento</span>
                </button>
                {renderFolderTree(null)}
              </div>
            </div>
          )}
        </div>

        {/* Área de Documentos */}
        <div className="lg:col-span-3 space-y-6">
          {/* Barra de Ações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-gray-900">
                  Documentos - {selectedFolder?.name || selectedDepartment?.name || 'Todos'}
                </h2>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                {selectedDepartment && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Lista de Documentos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {documents.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Nenhum documento neste departamento</p>
                {selectedDepartment && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Fazer upload do primeiro documento
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                        {doc.description && (
                          <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>{formatDate(doc.created_at)}</span>
                          {doc.departments && (
                            <span 
                              className="px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: doc.departments.color }}
                            >
                              {doc.departments.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a
                          href={doc.file_url}
                          download={doc.file_name}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dashboards Gerenciais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
              <p className="text-sm text-gray-500 mt-1">Documentos Cadastrados</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FolderOpen className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">Organização</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFolders}</p>
              <p className="text-sm text-gray-500 mt-1">Pastas Criadas</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs text-gray-500">Últimos 7 dias</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.recentDocuments}</p>
              <p className="text-sm text-gray-500 mt-1">Novos Documentos</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs text-gray-500">Setores</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
              <p className="text-sm text-gray-500 mt-1">Departamentos Ativos</p>
            </div>
          </div>

          {/* Gráfico de Documentos por Departamento */}
          {stats.documentsByDept.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Documentos por Departamento</h3>
              </div>
              <div className="space-y-4">
                {stats.documentsByDept.map((dept, index) => {
                  const maxCount = Math.max(...stats.documentsByDept.map(d => d.count));
                  const percentage = maxCount > 0 ? (dept.count / maxCount) * 100 : 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{dept.name}</span>
                        <span className="font-medium text-gray-900">{dept.count} docs</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: dept.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Atividades Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Atividades Recentes</h3>
            </div>
            {documents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma atividade recente</p>
            ) : (
              <div className="space-y-4">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{doc.title}</p>
                      <p className="text-xs text-gray-500">
                        Adicionado em {formatDate(doc.created_at)}
                        {doc.departments && ` • ${doc.departments.name}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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

      {/* Modal Nova Pasta */}
      {showNewFolderModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Nova Pasta</h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Pasta *
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Relatórios 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Descrição da pasta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="color"
                  value={newFolderColor}
                  onChange={(e) => setNewFolderColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <p className="text-xs text-gray-500">
                Departamento: <span className="font-medium">{selectedDepartment.name}</span>
                {selectedFolder && (
                  <> • Pasta pai: <span className="font-medium">{selectedFolder.name}</span></>
                )}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFolder}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Pasta
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
                {selectedFolder && (
                  <> • Pasta: <span className="font-medium">{selectedFolder.name}</span></>
                )}
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
